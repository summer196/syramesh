// Renderer - builds Three.js geometry from chunk data
'use strict';

class MinecraftRenderer {
  constructor(world) {
    this.world = world;
    this.textureCache = {};       // texName -> THREE.Texture
    this.chunkMeshes = new Map(); // "cx,cz" -> {opaque, transparent}
    this.scene = null;
    this.renderDistance = 5;      // chunks
  }

  init(scene) {
    this.scene = scene;
  }

  // Load texture from TEXTURES global (textures.js)
  loadTex(name, repeat = false) {
    if (this.textureCache[name]) return this.textureCache[name];
    const data = (TEXTURES.blocks[name] || TEXTURES.blocks['stone']);
    const img = new Image();
    img.src = data;
    const tex = new THREE.Texture(img);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.wrapS = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    tex.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    img.onload = () => { tex.needsUpdate = true; };
    this.textureCache[name] = tex;
    return tex;
  }

  // Build material for a texture
  matFor(texName, transparent = false) {
    const tex = this.loadTex(texName);
    return new THREE.MeshLambertMaterial({
      map: tex,
      transparent: transparent,
      alphaTest: transparent ? 0.1 : 0,
      side: transparent ? THREE.DoubleSide : THREE.FrontSide,
    });
  }

  // Faces: +X, -X, +Y, -Y, +Z, -Z
  // Vertices for each face (CCW winding from outside)
  static FACE_DATA = [
    // +X (right)
    { dir: [1, 0, 0],  verts: [[1,0,0],[1,1,0],[1,1,1],[1,0,1]], uv: [[0,0],[0,1],[1,1],[1,0]], faceDir:'sides' },
    // -X (left)
    { dir: [-1,0, 0],  verts: [[0,0,1],[0,1,1],[0,1,0],[0,0,0]], uv: [[0,0],[0,1],[1,1],[1,0]], faceDir:'sides' },
    // +Y (top)
    { dir: [0, 1, 0],  verts: [[0,1,1],[1,1,1],[1,1,0],[0,1,0]], uv: [[0,0],[1,0],[1,1],[0,1]], faceDir:'top' },
    // -Y (bottom)
    { dir: [0,-1, 0],  verts: [[0,0,0],[1,0,0],[1,0,1],[0,0,1]], uv: [[0,0],[1,0],[1,1],[0,1]], faceDir:'bottom' },
    // +Z (front)
    { dir: [0, 0, 1],  verts: [[1,0,1],[1,1,1],[0,1,1],[0,0,1]], uv: [[0,0],[0,1],[1,1],[1,0]], faceDir:'sides' },
    // -Z (back)
    { dir: [0, 0,-1],  verts: [[0,0,0],[0,1,0],[1,1,0],[1,0,0]], uv: [[0,0],[0,1],[1,1],[1,0]], faceDir:'sides' },
  ];

  buildChunkMesh(chunk) {
    const { cx, cz } = chunk;
    const world = this.world;

    // We'll group faces by texture to minimize draw calls
    const groups = {}; // texName -> { positions[], normals[], uvs[], indices[] }
    const transGroups = {};

    const addFace = (store, texName, wx, wy, wz, fd) => {
      if (!store[texName]) store[texName] = { pos:[], nor:[], uv:[], idx:[] };
      const g = store[texName];
      const base = g.pos.length / 3;
      const [dx, dy, dz] = fd.dir;
      fd.verts.forEach(([vx,vy,vz], i) => {
        g.pos.push(wx + vx, wy + vy, wz + vz);
        g.nor.push(dx, dy, dz);
        g.uv.push(fd.uv[i][0], fd.uv[i][1]);
      });
      g.idx.push(base, base+1, base+2, base, base+2, base+3);
    };

    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const blockId = chunk.get(lx, y, lz);
          if (blockId === 0) continue;
          const bDef = BLOCKS[blockId];
          if (!bDef) continue;

          const wx = cx * CHUNK_SIZE + lx;
          const wy = y;
          const wz = cz * CHUNK_SIZE + lz;
          const isTransparent = bDef.transparent;
          const store = isTransparent ? transGroups : groups;

          for (const fd of MinecraftRenderer.FACE_DATA) {
            const [ndx, ndy, ndz] = fd.dir;
            const nx = wx + ndx, ny = wy + ndy, nz = wz + ndz;
            const neighborId = world.getBlock(nx, ny, nz);
            const nDef = BLOCKS[neighborId];
            // Show face if neighbor is air or transparent (and not same block)
            const showFace = neighborId === 0 || (nDef && nDef.transparent && (!isTransparent || neighborId !== blockId));
            if (!showFace) continue;

            const texName = getFaceTex(blockId, fd.faceDir);
            addFace(store, texName, wx, wy, wz, fd);
          }
        }
      }
    }

    // Build Three.js meshes from groups
    const makeMesh = (grps, transparent) => {
      const objs = [];
      for (const [texName, g] of Object.entries(grps)) {
        if (g.pos.length === 0) continue;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(g.pos, 3));
        geo.setAttribute('normal',   new THREE.Float32BufferAttribute(g.nor, 3));
        geo.setAttribute('uv',       new THREE.Float32BufferAttribute(g.uv, 2));
        geo.setIndex(g.idx);
        const mat = this.matFor(texName, transparent);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.receiveShadow = !transparent;
        objs.push(mesh);
      }
      return objs;
    };

    // Remove old mesh
    this.removeChunkMesh(cx, cz);

    const opaqueMeshes = makeMesh(groups, false);
    const transMeshes  = makeMesh(transGroups, true);
    const all = [...opaqueMeshes, ...transMeshes];
    all.forEach(m => this.scene.add(m));
    this.chunkMeshes.set(`${cx},${cz}`, all);
    chunk.dirty = false;
  }

  removeChunkMesh(cx, cz) {
    const key = `${cx},${cz}`;
    const meshes = this.chunkMeshes.get(key);
    if (meshes) {
      meshes.forEach(m => {
        this.scene.remove(m);
        m.geometry.dispose();
      });
      this.chunkMeshes.delete(key);
    }
  }

  update(playerX, playerZ) {
    const pcx = Math.floor(playerX / CHUNK_SIZE);
    const pcz = Math.floor(playerZ / CHUNK_SIZE);
    const rd = this.renderDistance;

    // Load/rebuild nearby chunks
    for (let dx = -rd; dx <= rd; dx++) {
      for (let dz = -rd; dz <= rd; dz++) {
        if (dx * dx + dz * dz > rd * rd) continue;
        const cx = pcx + dx, cz = pcz + dz;
        const chunk = this.world.getChunk(cx, cz);
        if (chunk.dirty) {
          this.buildChunkMesh(chunk);
        }
      }
    }

    // Unload far chunks
    for (const [key, meshes] of this.chunkMeshes.entries()) {
      const [cx, cz] = key.split(',').map(Number);
      const dist2 = (cx - pcx) ** 2 + (cz - pcz) ** 2;
      if (dist2 > (rd + 2) ** 2) {
        this.removeChunkMesh(cx, cz);
      }
    }
  }
}

// Raycast for block selection
function raycastBlock(world, origin, direction, maxDist = 6) {
  // DDA ray marching
  let x = Math.floor(origin.x), y = Math.floor(origin.y), z = Math.floor(origin.z);
  const dx = direction.x, dy = direction.y, dz = direction.z;
  const sx = dx > 0 ? 1 : -1, sy = dy > 0 ? 1 : -1, sz = dz > 0 ? 1 : -1;
  const tDx = Math.abs(1 / dx) || 1e30;
  const tDy = Math.abs(1 / dy) || 1e30;
  const tDz = Math.abs(1 / dz) || 1e30;

  let tMaxX = dx !== 0 ? (dx > 0 ? (Math.floor(origin.x) + 1 - origin.x) : (origin.x - Math.floor(origin.x))) * tDx : 1e30;
  let tMaxY = dy !== 0 ? (dy > 0 ? (Math.floor(origin.y) + 1 - origin.y) : (origin.y - Math.floor(origin.y))) * tDy : 1e30;
  let tMaxZ = dz !== 0 ? (dz > 0 ? (Math.floor(origin.z) + 1 - origin.z) : (origin.z - Math.floor(origin.z))) * tDz : 1e30;

  let dist = 0;
  let lastX = x, lastY = y, lastZ = z;

  while (dist < maxDist) {
    const blockId = world.getBlock(x, y, z);
    if (blockId !== 0 && BLOCKS[blockId] && BLOCKS[blockId].solid) {
      return { hit: true, x, y, z, px: lastX, py: lastY, pz: lastZ };
    }
    lastX = x; lastY = y; lastZ = z;
    if (tMaxX < tMaxY && tMaxX < tMaxZ) {
      x += sx; dist = tMaxX; tMaxX += tDx;
    } else if (tMaxY < tMaxZ) {
      y += sy; dist = tMaxY; tMaxY += tDy;
    } else {
      z += sz; dist = tMaxZ; tMaxZ += tDz;
    }
  }
  return { hit: false };
}
