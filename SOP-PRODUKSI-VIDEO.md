# SOP & Standar Produksi Video 3D Explainer (Gaya *How Come?* & *Wait, Really!?*)

Dokumen ini adalah **Standar Operasional Prosedur (SOP)** resmi proyek Remotion ini agar setiap video yang dibuat memiliki **kualitas visual, tempo cerita, ciri khas *brand*, dan pemicu *engagement* (Like, Komen, Follow)** yang konsisten.

---

## 1. Formula Naskah 6 Babak (Wajib untuk Semua Video)
Setiap naskah voice-over berdurasi **45–60 detik (1350–1800 frame @ 30 FPS)** wajib mengikuti struktur 6 babak ini:

1. **Babak 1 — Hook Fenomena Sehari-hari (0 – 6 detik)**
   - Buka dengan pertanyaan yang dekat dengan kehidupan sehari-hari penonton Indonesia.
   - *Contoh*: *"Pernah sadar nggak, kenapa bodi luar kulkas rasanya hangat?"* atau *"Pernah kesel nggak, kenapa habis musim hujan jalan aspal tiba-tiba penuh lubang?"*
2. **Babak 2 — Plot Twist / Patahkan Mitos (6 – 15 detik)**
   - Patahkan asumsi umum penonton (*Myth-Busting*) untuk memicu efek *"Wah, baru tahu!"* (pemicu **Like**).
   - *Contoh*: *"Ternyata, kulkas itu nggak menciptakan dingin, tapi mencuri panas!"*
3. **Babak 3 — Tahap 1 Mekanisme Sains/Mesin (15 – 27 detik)**
   - Bedah penampang dalam (*3D Cutaway / Cross-Section*) dan jelaskan langkah pertama secara visual.
4. **Babak 4 — Tahap 2 + Fakta Pertama *"Nah, itulah alasan kenapa..."* (27 – 40 detik)**
   - Jelaskan langkah kedua, lalu langsung hubungkan dengan fakta sehari-hari menggunakan kalimat ikonik:
     > **"Nah, itulah alasan kenapa [fakta sehari-hari 1]!"**
5. **Babak 5 — Tahap 3 Klimaks Visual (40 – 47 detik)**
   - Tunjukkan puncak mekanisme (misal: suhu anjlok jadi es, atau aspal patah dan ambrol).
6. **Babak 6 — Fakta Praktis Kedua *"Dan itulah alasan kenapa..."* + Pemicu Komen (47 – 55 detik)**
   - Tutup dengan tips praktis sehari-hari (pemicu **Save/Share**):
     > **"Dan itulah alasan kenapa kita pantang/harus [tips praktis sehari-hari]!"**
   - Tampilkan komponen `<CommentTriggerCard />` di 4 detik terakhir untuk memancing komentar dua kubu atau pengalaman daerah masing-masing.

---

## 2. Standar Tempo & Audio (*Pacing Rules*)
1. **Kecepatan Voice-Over Normal (`0%` Speed-up)**:
   - Jangan mempercepat suara (`-r +18%` dilarang). Gunakan kecepatan bicara normal `id-ID-ArdiNeural`:
     ```bash
     npm run voice -- -v ardi -o <nama-file> -t "<naskah>"
     ```
2. **Durasi Per Adegan (5–8 Detik)**:
   - Berikan waktu bernapas pada setiap potongan kamera (*camera cut*) minimal 5–8 detik agar mata penonton nyaman mengamati mekanisme 3D.
3. **Kecepatan Animasi 3D Tenang & Terbaca**:
   - Gerakan partikel fluida/air, pompa piston, dan panah 3D harus lembut (gunakan multiplier `frame * 0.003` s/d `0.02`, jangan terlalu cepat).

---

## 3. Kewajiban Menggunakan Pustaka Aset Terpusat (`src/assets/`)
Dilarang membuat ulang UI atau model dari nol jika sudah ada di [`src/assets/`](file:///Users/imadehermanto/remotion/src/assets/index.ts). Setiap video baru wajib mengimpor dari `"../assets"` / `"./assets"`:

- **Katalog Model 3D & Tema**: `MODELS`, `BRAND_THEME`, `SFX` dari [`src/assets/catalog.ts`](file:///Users/imadehermanto/remotion/src/assets/catalog.ts).
- **Loader Model 3D `.glb`/`.gltf`**: `<Asset3D model={MODELS...} targetSize={...} />` dari [`src/assets/three/Asset3D.tsx`](file:///Users/imadehermanto/remotion/src/assets/three/Asset3D.tsx).
- **Gizmo & Panggung Ciri Khas 3D**:
  - `<ChunkyArrow3D />`, `<Thermometer3D />`, `<WoodenFloorStage3D />` dari [`src/assets/three/Gizmos3D.tsx`](file:///Users/imadehermanto/remotion/src/assets/three/Gizmos3D.tsx).
  - `<IndonesianAlleyStage3D />`, `<ConcreteMixer3D />`, `<WaterStream3D />`, `<RainParticles3D />` dari [`src/assets/three/EnvironmentStage3D.tsx`](file:///Users/imadehermanto/remotion/src/assets/three/EnvironmentStage3D.tsx).
  - `<CharacterWorker3D />` (Karakter bertopi caping berartikulasi) dari [`src/assets/three/CharacterWorker3D.tsx`](file:///Users/imadehermanto/remotion/src/assets/three/CharacterWorker3D.tsx).
  - `<MicroscopeCrossSection3D />` dari [`src/assets/three/MicroscopeCutaway3D.tsx`](file:///Users/imadehermanto/remotion/src/assets/three/MicroscopeCutaway3D.tsx).
- **UI Overlay & Audio Ciri Khas Shorts**:
  - `<ViralShortsOverlayContainer />`, `<ViralHeadlineBanner />`, `<FloatingBadgePills />`, `<RedFocusRings />`, `<ViralWordSubtitles />`, `<CommentTriggerCard />`, `<SceneSFXLayer />` dari [`src/assets/ui/ViralShortsUI.tsx`](file:///Users/imadehermanto/remotion/src/assets/ui/ViralShortsUI.tsx).
- **Visual Easter Egg**:
  - Selipkan minimal 1 objek kecil/lucu di latar belakang 3D (seperti `MODELS.characters.dog` atau `MODELS.characters.bunny`) untuk memancing penonton berkomentar *"Salfok sama..."*.

---

## 4. Aturan Teknis Koding Remotion + Three.js
1. **100% Deterministik**: Semua animasi wajib digerakkan oleh `useCurrentFrame()`, `interpolate()`, dan `spring()` dari `remotion`. Dilarang keras memakai `useFrame()` dari `@react-three/fiber` atau CSS `transition`/`animation`.
2. **Pemeriksaan Kualitas**: Sebelum selesai, wajib menjalankan `npm run lint` (`eslint src && tsc`) hingga **0 error dan 0 warning**, serta merender minimal 2–3 frame pratinjau (`npx remotion still`) untuk memastikan tidak ada teks atau objek 3D yang bertumpukan.

