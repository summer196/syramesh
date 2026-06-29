// Player controller - movement, physics, flying, crouching
'use strict';

class Player {
  constructor(world) {
    this.world = world;

    // Position (eye height = 1.62 above feet)
    this.x = 0; this.y = SEA_LEVEL + 10; this.z = 0;
    this.velX = 0; this.velY = 0; this.velZ = 0;

    // Look
    this.yaw = 0;    // horizontal rotation (radians)
    this.pitch = 0;  // vertical rotation (radians)

    // State
    this.onGround = false;
    this.flying = false;
    this.crouching = false;
    this.sprinting = false;
    this.lastSpaceTime = 0;

    // Constants
    this.HEIGHT = 1.8;
    this.EYE_HEIGHT = 1.62;
    this.WIDTH = 0.6;
    this.WALK_SPEED = 4.3;
    this.SPRINT_SPEED = 5.6;
    this.FLY_SPEED = 10;
    this.FLY_FAST_SPEED = 20;
    this.CROUCH_SPEED = 1.3;
    this.JUMP_VEL = 8;
    this.GRAVITY = -28;
    this.TERMINAL_VEL = -50;

    // Keys
    this.keys = {};
    this.mouseButtons = {};

    // Input handlers
    this._initInput();
  }

  _initInput() {
    document.addEventListener('keydown', e => {
      const k = e.code;
      const wasDown = this.keys[k];
      this.keys[k] = true;

      // Double-space to toggle fly
      if (k === 'Space' && !wasDown) {
        const now = performance.now();
        if (now - this.lastSpaceTime < 300) {
          this.flying = !this.flying;
          this.velY = 0;
        }
        this.lastSpaceTime = now;
      }
      // Escape - release pointer lock
      if (k === 'Escape') {
        // handled in main
      }
    });
    document.addEventListener('keyup', e => {
      this.keys[e.code] = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.crouching = false;
      if (e.code === 'ControlLeft') this.sprinting = false;
    });
  }

  get eyeX() { return this.x; }
  get eyeY() { return this.y + this.EYE_HEIGHT; }
  get eyeZ() { return this.z; }

  getDirection() {
    // Match Three.js YXZ camera: rotation.y=-yaw, rotation.x=pitch
    // Camera default looks -Z. After rotation: forward = (sin(yaw)*cos(pitch), -sin(pitch), cos(yaw)*cos(pitch)) ... 
    // Simplified: forward X = sin(yaw), Z = cos(yaw) at pitch=0
    const cosP = Math.cos(this.pitch);
    return {
      x:  Math.sin(this.yaw) * cosP,
      y: -Math.sin(this.pitch),
      z:  Math.cos(this.yaw) * cosP,
    };
  }

  getHorizontalDir() {
    return { x: Math.sin(this.yaw), y: 0, z: Math.cos(this.yaw) };
  }

  update(dt) {
    const k = this.keys;
    const world = this.world;

    // Sprinting: ControlLeft + W
    if (k['ControlLeft'] && k['KeyW']) this.sprinting = true;
    if (!k['KeyW']) this.sprinting = false;

    // Crouching
    this.crouching = !this.flying && (k['ShiftLeft'] || k['ShiftRight']);

    // Movement direction from keys
    let fwd = 0, right = 0, up = 0;
    if (k['KeyW']) fwd = 1;
    if (k['KeyS']) fwd = -1;
    if (k['KeyA']) right = 1;
    if (k['KeyD']) right = -1;

    // Horizontal speed
    let speed;
    if (this.flying) {
      speed = (k['ControlLeft'] || k['ShiftLeft']) ? this.FLY_FAST_SPEED : this.FLY_SPEED;
    } else if (this.crouching) {
      speed = this.CROUCH_SPEED;
    } else if (this.sprinting) {
      speed = this.SPRINT_SPEED;
    } else {
      speed = this.WALK_SPEED;
    }

    // Calc velocity from yaw
    const sy = Math.sin(this.yaw), cy = Math.cos(this.yaw);
    let mvX = (sy * fwd + cy * right) * speed;
    let mvZ = (cy * fwd - sy * right) * speed;

    if (this.flying) {
      // Vertical fly control
      if (k['Space']) up = 1;
      if (k['ShiftLeft'] || k['ShiftRight']) up = -1;
      this.velX = mvX;
      this.velY = up * speed;
      this.velZ = mvZ;

      this.x += this.velX * dt;
      this.y += this.velY * dt;
      this.z += this.velZ * dt;
    } else {
      // Ground movement with gravity
      this.velX = mvX;
      this.velZ = mvZ;

      // Gravity
      this.velY += this.GRAVITY * dt;
      if (this.velY < this.TERMINAL_VEL) this.velY = this.TERMINAL_VEL;

      // Jump
      if ((k['Space']) && this.onGround) {
        this.velY = this.JUMP_VEL;
        this.onGround = false;
      }

      // Move & collide
      this._moveWithCollision(dt);
    }

    // Clamp pitch
    this.pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this.pitch));
    // Clamp Y to not fall below world
    if (this.y < 0) { this.y = 0; this.velY = 0; }
    if (this.y > WORLD_HEIGHT - 2) { this.y = WORLD_HEIGHT - 2; this.velY = 0; }
  }

  _moveWithCollision(dt) {
    const w = this.WIDTH / 2;
    const h = this.HEIGHT;

    // Step X
    const newX = this.x + this.velX * dt;
    if (!this._collides(newX, this.y, this.z, w, h)) {
      this.x = newX;
    } else {
      this.velX = 0;
    }

    // Step Y
    const newY = this.y + this.velY * dt;
    if (!this._collides(this.x, newY, this.z, w, h)) {
      this.y = newY;
      this.onGround = false;
    } else {
      if (this.velY < 0) {
        this.onGround = true;
        // Snap feet to top of block below
        if (this.velY < 0) {
          this.y = Math.ceil(this.y + this.velY * dt) ;
          // more reliable: snap to integer y
          this.y = Math.round(this.y);
        }
      }
      this.velY = 0;
    }

    // Step Z
    const newZ = this.z + this.velZ * dt;
    if (!this._collides(this.x, this.y, newZ, w, h)) {
      this.z = newZ;
    } else {
      this.velZ = 0;
    }
  }

  _collides(px, py, pz, w, h) {
    const world = this.world;
    const minX = Math.floor(px - w), maxX = Math.floor(px + w);
    const minY = Math.floor(py),     maxY = Math.floor(py + h - 0.01);
    const minZ = Math.floor(pz - w), maxZ = Math.floor(pz + w);

    for (let x = minX; x <= maxX; x++)
    for (let y = minY; y <= maxY; y++)
    for (let z = minZ; z <= maxZ; z++) {
      const id = world.getBlock(x, y, z);
      if (id !== 0 && BLOCKS[id] && BLOCKS[id].solid) return true;
    }
    return false;
  }

  // Spawn at surface
  spawnAtSurface() {
    const sy = this.world.getSurfaceY(0, 0);
    this.x = 0; this.y = sy + 1; this.z = 0;
  }
}
