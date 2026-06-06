// World generation and block data
'use strict';

// ── BLOCK DEFINITIONS ──────────────────────────────────────────────────────
const BLOCK_AIR = 0;
const BLOCKS = {
  0:  { name:'Air',           solid:false, transparent:true  },
  1:  { name:'Grass',         solid:true,  transparent:false, top:'grass_top', bottom:'dirt', sides:'grass_side' },
  2:  { name:'Dirt',          solid:true,  transparent:false, all:'dirt' },
  3:  { name:'Stone',         solid:true,  transparent:false, all:'stone' },
  4:  { name:'Cobblestone',   solid:true,  transparent:false, all:'cobblestone' },
  5:  { name:'Oak Planks',    solid:true,  transparent:false, all:'planks_oak' },
  6:  { name:'Oak Log',       solid:true,  transparent:false, top:'log_oak_top', bottom:'log_oak_top', sides:'log_oak' },
  7:  { name:'Oak Leaves',    solid:true,  transparent:true,  all:'leaves_oak' },
  8:  { name:'Sand',          solid:true,  transparent:false, all:'sand' },
  9:  { name:'Gravel',        solid:true,  transparent:false, all:'gravel' },
  10: { name:'Bedrock',       solid:true,  transparent:false, all:'bedrock' },
  11: { name:'Glass',         solid:true,  transparent:true,  all:'glass' },
  12: { name:'Brick',         solid:true,  transparent:false, all:'brick' },
  13: { name:'Bookshelf',     solid:true,  transparent:false, top:'planks_oak', bottom:'planks_oak', sides:'bookshelf' },
  14: { name:'Coal Ore',      solid:true,  transparent:false, all:'coal_ore' },
  15: { name:'Iron Ore',      solid:true,  transparent:false, all:'iron_ore' },
  16: { name:'Gold Ore',      solid:true,  transparent:false, all:'gold_ore' },
  17: { name:'Diamond Ore',   solid:true,  transparent:false, all:'diamond_ore' },
  18: { name:'Emerald Ore',   solid:true,  transparent:false, all:'emerald_ore' },
  19: { name:'Redstone Ore',  solid:true,  transparent:false, all:'redstone_ore' },
  20: { name:'Lapis Ore',     solid:true,  transparent:false, all:'lapis_ore' },
  21: { name:'Coal Block',    solid:true,  transparent:false, all:'coal_block' },
  22: { name:'Iron Block',    solid:true,  transparent:false, all:'iron_block' },
  23: { name:'Gold Block',    solid:true,  transparent:false, all:'gold_block' },
  24: { name:'Diamond Block', solid:true,  transparent:false, all:'diamond_block' },
  25: { name:'Obsidian',      solid:true,  transparent:false, all:'obsidian' },
  26: { name:'Glowstone',     solid:true,  transparent:false, all:'glowstone', emissive:true },
  27: { name:'Netherrack',    solid:true,  transparent:false, all:'netherrack' },
  28: { name:'Ice',           solid:true,  transparent:true,  all:'ice' },
  29: { name:'Snow',          solid:true,  transparent:false, all:'snow' },
  30: { name:'Crafting Table',solid:true,  transparent:false, top:'crafting_table_top', bottom:'planks_oak', sides:'crafting_table_front', side2:'crafting_table_side' },
  31: { name:'Furnace',       solid:true,  transparent:false, top:'furnace_top', bottom:'furnace_top', sides:'furnace_side', side_front:'furnace_front_off' },
  32: { name:'White Wool',    solid:true,  transparent:false, all:'wool_colored_white' },
  33: { name:'Red Wool',      solid:true,  transparent:false, all:'wool_colored_red' },
  34: { name:'Blue Wool',     solid:true,  transparent:false, all:'wool_colored_blue' },
  35: { name:'Green Wool',    solid:true,  transparent:false, all:'wool_colored_green' },
  36: { name:'Yellow Wool',   solid:true,  transparent:false, all:'wool_colored_yellow' },
  37: { name:'Spruce Log',    solid:true,  transparent:false, top:'log_spruce_top', bottom:'log_spruce_top', sides:'log_spruce' },
  38: { name:'Birch Log',     solid:true,  transparent:false, top:'log_birch_top', bottom:'log_birch_top', sides:'log_birch' },
  39: { name:'Spruce Planks', solid:true,  transparent:false, all:'planks_spruce' },
  40: { name:'Birch Planks',  solid:true,  transparent:false, all:'planks_birch' },
  41: { name:'Spruce Leaves', solid:true,  transparent:true,  all:'leaves_spruce' },
  42: { name:'Birch Leaves',  solid:true,  transparent:true,  all:'leaves_birch' },
  43: { name:'End Stone',     solid:true,  transparent:false, all:'end_stone' },
  44: { name:'Stone Bricks',  solid:true,  transparent:false, all:'stonebrick' },
  45: { name:'TNT',           solid:true,  transparent:false, top:'tnt_top', bottom:'tnt_bottom', sides:'tnt_side' },
  46: { name:'Sandstone',     solid:true,  transparent:false, top:'sandstone_top', bottom:'sandstone_bottom', sides:'sandstone_normal' },
  47: { name:'Melon',         solid:true,  transparent:false, top:'melon_top', bottom:'melon_top', sides:'melon_side' },
  48: { name:'Pumpkin',       solid:true,  transparent:false, top:'pumpkin_top', bottom:'pumpkin_top', sides:'pumpkin_side', side_front:'pumpkin_face_off' },
  49: { name:'Hardened Clay', solid:true,  transparent:false, all:'hardened_clay' },
  50: { name:'Lava',          solid:false, transparent:false, all:'lava_still', fluid:true },
  51: { name:'Water',         solid:false, transparent:true,  all:'water_still', fluid:true },
  52: { name:'Quartz Block',  solid:true,  transparent:false, top:'quartz_block_top', bottom:'quartz_block_bottom', sides:'quartz_block_side' },
  53: { name:'Soul Sand',     solid:true,  transparent:false, all:'soul_sand' },
  54: { name:'Nether Brick',  solid:true,  transparent:false, all:'nether_brick' },
  55: { name:'Emerald Block', solid:true,  transparent:false, all:'emerald_block' },
  56: { name:'Lapis Block',   solid:true,  transparent:false, all:'lapis_block' },
  57: { name:'Redstone Block',solid:true,  transparent:false, all:'redstone_block' },
  58: { name:'Jungle Log',    solid:true,  transparent:false, top:'log_jungle_top', bottom:'log_jungle_top', sides:'log_jungle' },
  59: { name:'Birch Planks2', solid:true,  transparent:false, all:'planks_birch' },
  60: { name:'Coarse Dirt',   solid:true,  transparent:false, all:'coarse_dirt' },
  61: { name:'Clay Block',    solid:true,  transparent:false, all:'clay' },
};

// Face texture helper
function getFaceTex(blockId, faceDir) {
  const b = BLOCKS[blockId];
  if (!b) return 'stone';
  if (b.all) return b.all;
  if (faceDir === 'top') return b.top || b.sides || 'stone';
  if (faceDir === 'bottom') return b.bottom || b.sides || 'stone';
  // Side faces: front face gets different texture for some blocks
  return b.sides || b.top || 'stone';
}

// ── NOISE / WORLD GEN ──────────────────────────────────────────────────────
class SimplexNoise {
  constructor(seed = 42) {
    this.p = new Uint8Array(512);
    const perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;
    let n = seed | 0;
    for (let i = 255; i > 0; i--) {
      n = (n * 1664525 + 1013904223) & 0xffffffff;
      const j = Math.abs(n) % (i + 1);
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255];
  }
  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(a, b, t) { return a + t * (b - a); }
  grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }
  noise2d(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = this.fade(x), v = this.fade(y);
    const A = this.p[X] + Y, B = this.p[X + 1] + Y;
    return this.lerp(
      this.lerp(this.grad(this.p[A], x, y), this.grad(this.p[B], x - 1, y), u),
      this.lerp(this.grad(this.p[A + 1], x, y - 1), this.grad(this.p[B + 1], x - 1, y - 1), u), v
    );
  }
  fbm(x, y, octaves = 4) {
    let v = 0, a = 0.5, f = 1;
    for (let i = 0; i < octaves; i++) {
      v += a * this.noise2d(x * f, y * f);
      a *= 0.5; f *= 2;
    }
    return v;
  }
}

// ── CHUNK ──────────────────────────────────────────────────────────────────
const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 64;
const SEA_LEVEL = 32;

class Chunk {
  constructor(cx, cz) {
    this.cx = cx; this.cz = cz;
    this.data = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT * CHUNK_SIZE);
    this.dirty = true;
    this.mesh = null;
  }
  idx(lx, y, lz) { return lx + CHUNK_SIZE * (y + WORLD_HEIGHT * lz); }
  get(lx, y, lz) {
    if (lx < 0 || lx >= CHUNK_SIZE || y < 0 || y >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) return 0;
    return this.data[this.idx(lx, y, lz)];
  }
  set(lx, y, lz, v) {
    if (lx < 0 || lx >= CHUNK_SIZE || y < 0 || y >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) return;
    this.data[this.idx(lx, y, lz)] = v;
    this.dirty = true;
  }
}

// ── WORLD ──────────────────────────────────────────────────────────────────
class World {
  constructor(seed = 42) {
    this.seed = seed;
    this.noise = new SimplexNoise(seed);
    this.chunks = new Map();
  }
  chunkKey(cx, cz) { return `${cx},${cz}`; }

  getChunk(cx, cz) {
    const k = this.chunkKey(cx, cz);
    if (!this.chunks.has(k)) {
      const c = new Chunk(cx, cz);
      this.generateChunk(c);
      this.chunks.set(k, c);
    }
    return this.chunks.get(k);
  }

  generateChunk(chunk) {
    const { cx, cz } = chunk;
    const n = this.noise;

    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        const wx = cx * CHUNK_SIZE + lx;
        const wz = cz * CHUNK_SIZE + lz;

        // Height map
        const h1 = n.fbm(wx / 80, wz / 80, 4);
        const h2 = n.fbm(wx / 30 + 100, wz / 30 + 100, 2);
        const heightF = SEA_LEVEL + Math.floor((h1 * 0.7 + h2 * 0.3) * 18);
        const surfaceY = Math.max(1, Math.min(WORLD_HEIGHT - 2, heightF));

        // Biome (simple)
        const temp = n.noise2d(wx / 200, wz / 200);
        const humid = n.noise2d(wx / 200 + 500, wz / 200 + 500);
        const isDesert = temp > 0.3 && humid < -0.1;
        const isSnowy  = temp < -0.3;

        // Bedrock (y=0)
        chunk.set(lx, 0, lz, 10);

        // Stone (y=1 to surfaceY-4)
        const stoneTop = Math.max(1, surfaceY - 4);
        for (let y = 1; y <= stoneTop; y++) {
          // Ore generation
          const oreSeed = n.noise2d((wx + y * 3) / 5, (wz + y * 7) / 5);
          let block = 3; // stone
          if (y < 5 && oreSeed > 0.35) block = 17;           // diamond
          else if (y < 12 && oreSeed > 0.3) block = 20;      // lapis
          else if (y < 15 && oreSeed > 0.25) block = 16;     // gold
          else if (y < 30 && oreSeed > 0.2) block = 19;      // redstone
          else if (y < 40 && oreSeed > 0.2) block = 15;      // iron
          else if (oreSeed > 0.22) block = 14;               // coal
          chunk.set(lx, y, lz, block);
        }

        // Dirt/sand layer
        for (let y = stoneTop + 1; y < surfaceY; y++) {
          chunk.set(lx, y, lz, isDesert ? 8 : 2);
        }

        // Surface
        if (surfaceY >= SEA_LEVEL) {
          if (isDesert) {
            chunk.set(lx, surfaceY, lz, 8); // sand
          } else if (isSnowy) {
            chunk.set(lx, surfaceY, lz, 29); // snow
          } else {
            chunk.set(lx, surfaceY, lz, 1); // grass
          }
        } else {
          // Underwater - fill with water
          for (let y = surfaceY; y <= SEA_LEVEL; y++) {
            chunk.set(lx, y, lz, y <= surfaceY ? 2 : 51); // dirt then water
          }
        }

        // Trees (non-desert, non-snowy, above sea level)
        if (!isDesert && !isSnowy && surfaceY > SEA_LEVEL) {
          const treeSeed = n.noise2d(wx / 3 + 200, wz / 3 + 200);
          if (treeSeed > 0.45) {
            this.placeTree(chunk, lx, surfaceY + 1, lz, cx, cz);
          }
        }
      }
    }
  }

  placeTree(chunk, lx, baseY, lz, cx, cz) {
    if (lx < 2 || lx > CHUNK_SIZE - 3 || lz < 2 || lz > CHUNK_SIZE - 3) return;
    if (baseY + 6 >= WORLD_HEIGHT) return;
    const height = 4 + Math.floor(Math.random() * 3);
    // Trunk
    for (let y = 0; y < height; y++) chunk.set(lx, baseY + y, lz, 6);
    // Leaves
    for (let dy = -2; dy <= 1; dy++) {
      const r = dy >= 0 ? 1 : 2;
      for (let dx = -r; dx <= r; dx++)
        for (let dz = -r; dz <= r; dz++)
          if (Math.abs(dx) + Math.abs(dz) <= r + 1)
            if (chunk.get(lx + dx, baseY + height + dy, lz + dz) === 0)
              chunk.set(lx + dx, baseY + height + dy, lz + dz, 7);
    }
  }

  getBlock(wx, wy, wz) {
    if (wy < 0 || wy >= WORLD_HEIGHT) return 0;
    const cx = Math.floor(wx / CHUNK_SIZE);
    const cz = Math.floor(wz / CHUNK_SIZE);
    const lx = ((wx % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((wz % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    return this.getChunk(cx, cz).get(lx, wy, lz);
  }

  setBlock(wx, wy, wz, blockId) {
    if (wy < 0 || wy >= WORLD_HEIGHT) return;
    const cx = Math.floor(wx / CHUNK_SIZE);
    const cz = Math.floor(wz / CHUNK_SIZE);
    const lx = ((wx % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((wz % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const chunk = this.getChunk(cx, cz);
    chunk.set(lx, wy, lz, blockId);
    // Mark adjacent chunks dirty too (border case)
    if (lx === 0) this.getChunk(cx - 1, cz).dirty = true;
    if (lx === CHUNK_SIZE - 1) this.getChunk(cx + 1, cz).dirty = true;
    if (lz === 0) this.getChunk(cx, cz - 1).dirty = true;
    if (lz === CHUNK_SIZE - 1) this.getChunk(cx, cz + 1).dirty = true;
  }

  getSurfaceY(wx, wz) {
    for (let y = WORLD_HEIGHT - 1; y >= 0; y--) {
      if (this.getBlock(wx, y, wz) !== 0) return y;
    }
    return SEA_LEVEL;
  }
}
