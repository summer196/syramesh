# MineWeb 🎮

Game Minecraft berbasis web yang berjalan di browser dengan Three.js.

## Cara Menjalankan

### Opsi 1: Python (Paling mudah)
```bash
cd minecraft-web
python3 server.py
```
Buka browser: **http://localhost:8080**

### Opsi 2: Node.js
```bash
cd minecraft-web
npx serve .
```

### Opsi 3: PHP
```bash
cd minecraft-web
php -S localhost:8080
```

### Opsi 4: Nginx / Apache
Cukup letakkan folder `minecraft-web/` di web root server kamu (misal `/var/www/html/`).

---

## Kontrol

| Tombol | Aksi |
|--------|------|
| **WASD** | Bergerak |
| **Space** | Lompat |
| **Shift (kiri)** | Jongkok (crouch) |
| **Ctrl (kiri)** | Sprint/Berlari |
| **Left Click** | Hancurkan block |
| **Right Click** | Taruh block |
| **E** | Buka/tutup Inventori |
| **1-9** | Pilih slot hotbar |
| **Scroll** | Ganti slot hotbar |
| **F3** | Toggle debug info |
| **Esc** | Pause |

---

## Fitur

- ✅ First-person view
- ✅ World infinite (chunk-based, delete after render)
- ✅ Frustum culling (hanya render yang terlihat)
- ✅ 9 hotbar blocks: Grass, Dirt, Stone, Cobble, Wood Log, Planks, Leaves, Sand, Gravel
- ✅ Taruh dan hancurkan block
- ✅ Sistem inventori
- ✅ Berjalan, berlari, melompat, jongkok
- ✅ Sistem pencahayaan (ambient + directional sun)
- ✅ Siklus siang dan malam (10 menit per hari)
- ✅ Procedural terrain generation dengan pohon
- ✅ Tekstur pixel-art procedural
- ✅ Fog distance-based
- ✅ Collision detection AABB
- ✅ Health & hunger bar
- ✅ Debug overlay (F3)

---

## Blok Tersedia (9 hotbar + lebih di inventori)

1. Grass (Rumput)
2. Dirt (Tanah)
3. Stone (Batu)
4. Cobblestone
5. Wood Log (Kayu)
6. Planks (Papan)
7. Leaves (Daun)
8. Sand (Pasir)
9. Gravel (Kerikil)
10. Glass (Kaca)
11. Snow (Salju)

---

## Struktur File

```
minecraft-web/
├── index.html      ← Game utama (semua dalam 1 file)
├── server.py       ← Python web server
├── README.md       ← Dokumentasi ini
└── textures/       ← Tekstur dari resource pack (opsional)
```

> Semua tekstur di-generate secara procedural (canvas pixel art), 
> jadi game bisa jalan tanpa file tekstur eksternal.
