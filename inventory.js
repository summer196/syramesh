// Inventory system - hotbar, inventory screen, item management
'use strict';

// Default inventory items (block IDs that match BLOCKS)
const DEFAULT_HOTBAR = [1, 3, 4, 5, 6, 7, 8, 12, 14];

const INVENTORY_BLOCKS = [
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
  21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,
  39,40,41,42,43,44,45,46,47,48,49,52,53,54,55,56,57,58,60,61
];

class Inventory {
  constructor() {
    this.hotbar = [...DEFAULT_HOTBAR];    // 9 slots
    this.inventory = new Array(27).fill(0); // 27 main slots
    this.selectedSlot = 0;
    this.open = false;

    // Populate inventory with all blocks
    INVENTORY_BLOCKS.forEach((id, i) => {
      if (i < 27) this.inventory[i] = id;
    });

    this._buildUI();
    this._bindKeys();
  }

  get selectedBlock() { return this.hotbar[this.selectedSlot] || 0; }

  _bindKeys() {
    document.addEventListener('keydown', e => {
      // 1-9 hotbar select
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        this.selectedSlot = num - 1;
        this._updateHotbarUI();
      }
      // E = toggle inventory
      if (e.code === 'KeyE') {
        this.toggleInventory();
      }
    });

    document.addEventListener('wheel', e => {
      if (this.open) return;
      const delta = e.deltaY > 0 ? 1 : -1;
      this.selectedSlot = (this.selectedSlot + delta + 9) % 9;
      this._updateHotbarUI();
    });
  }

  toggleInventory() {
    this.open = !this.open;
    const inv = document.getElementById('inventory-screen');
    if (inv) inv.style.display = this.open ? 'flex' : 'none';
    // Pointer lock management
    if (this.open) {
      document.exitPointerLock && document.exitPointerLock();
    } else {
      const canvas = document.getElementById('gameCanvas');
      if (canvas) canvas.requestPointerLock();
    }
  }

  _buildUI() {
    // ── HOTBAR ──────────────────────────────────────────────────
    const hotbarEl = document.getElementById('hotbar');
    if (!hotbarEl) return;
    hotbarEl.innerHTML = '';
    this.hotbar.forEach((blockId, i) => {
      const slot = document.createElement('div');
      slot.className = 'hotbar-slot' + (i === this.selectedSlot ? ' selected' : '');
      slot.dataset.index = i;
      slot.innerHTML = `<canvas class="item-icon" width="32" height="32"></canvas>`;
      slot.addEventListener('click', () => { this.selectedSlot = i; this._updateHotbarUI(); });
      hotbarEl.appendChild(slot);
      this._drawBlockIcon(slot.querySelector('canvas'), blockId);
    });

    // ── INVENTORY SCREEN ────────────────────────────────────────
    const invScreen = document.getElementById('inventory-screen');
    if (!invScreen) return;

    // Build main inventory grid
    const mainGrid = document.getElementById('inv-main-grid');
    if (mainGrid) {
      mainGrid.innerHTML = '';
      INVENTORY_BLOCKS.forEach((blockId, i) => {
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        slot.dataset.blockId = blockId;
        slot.title = BLOCKS[blockId]?.name || '';
        const c = document.createElement('canvas');
        c.width = 32; c.height = 32; c.className = 'item-icon';
        slot.appendChild(c);
        this._drawBlockIcon(c, blockId);

        slot.addEventListener('click', () => {
          // Add to selected hotbar slot
          this.hotbar[this.selectedSlot] = blockId;
          this._updateHotbarUI();
        });
        slot.addEventListener('contextmenu', e => {
          e.preventDefault();
          // Right click: add to first empty hotbar slot
          const empty = this.hotbar.indexOf(0);
          const idx = empty === -1 ? 0 : empty;
          this.hotbar[idx] = blockId;
          this._updateHotbarUI();
        });
        mainGrid.appendChild(slot);
      });
    }

    // Hotbar slots at bottom of inventory
    const invHotbar = document.getElementById('inv-hotbar-grid');
    if (invHotbar) {
      invHotbar.innerHTML = '';
      this.hotbar.forEach((blockId, i) => {
        const slot = document.createElement('div');
        slot.className = 'inv-slot' + (i === this.selectedSlot ? ' selected' : '');
        slot.dataset.index = i;
        const c = document.createElement('canvas');
        c.width = 32; c.height = 32; c.className = 'item-icon';
        slot.appendChild(c);
        this._drawBlockIcon(c, blockId);
        slot.addEventListener('click', () => {
          this.selectedSlot = i;
          this._updateHotbarUI();
        });
        invHotbar.appendChild(slot);
      });
    }

    this._updateHotbarUI();
  }

  _updateHotbarUI() {
    // Update hotbar slots
    const hotbarEl = document.getElementById('hotbar');
    if (hotbarEl) {
      Array.from(hotbarEl.children).forEach((slot, i) => {
        slot.classList.toggle('selected', i === this.selectedSlot);
        const c = slot.querySelector('canvas');
        if (c) this._drawBlockIcon(c, this.hotbar[i]);
      });
    }
    // Update inventory hotbar row
    const invHotbar = document.getElementById('inv-hotbar-grid');
    if (invHotbar) {
      Array.from(invHotbar.children).forEach((slot, i) => {
        slot.classList.toggle('selected', i === this.selectedSlot);
        const c = slot.querySelector('canvas');
        if (c) this._drawBlockIcon(c, this.hotbar[i]);
      });
    }
    // Update selected block name label
    const lbl = document.getElementById('selected-block-name');
    if (lbl) {
      const id = this.hotbar[this.selectedSlot];
      lbl.textContent = id ? (BLOCKS[id]?.name || '') : '';
    }
  }

  _drawBlockIcon(canvas, blockId) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 32, 32);
    if (!blockId || blockId === 0) return;
    const b = BLOCKS[blockId];
    if (!b) return;

    const texName = b.all || b.top || b.sides || 'stone';
    const dataUrl = TEXTURES.blocks[texName];
    if (!dataUrl) {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, 32, 32);
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, 32, 32);
      ctx.save();
      // Top face (bright)
      ctx.drawImage(img, 2, 0, 28, 14);
      // Left face (medium)
      ctx.globalAlpha = 0.85;
      ctx.drawImage(img, 0, 14, 16, 18);
      // Right face (darker)
      ctx.globalAlpha = 0.6;
      ctx.drawImage(img, 16, 14, 16, 18);
      ctx.restore();
    };
    img.src = dataUrl;
  }
}
