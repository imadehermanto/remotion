# STANDAR OPERASIONAL PROSEDUR (SOP) PRODUKSI VIDEO EXPLAINER 3D
**Remotion AI Reels Production Studio V2**
*Versi: 2.0.0 — Standar Produksi Multi-Gaya & Berkualitas Sinematik*

---

## 1. Filosofi Produksi: Visual-First & Berbasis Sains Akurat

Studio V2 tidak lagi beroperasi dengan pola cepat `PROMPT → KODING → RENDER`.
Setiap video wajib melalui tahapan berurutan dan terverifikasi:

```
RISET ILMIAH & FAKTA
       ↓
NARRATIVE STRUCTURE & SCRIPT
       ↓
AUDIO VOICE-OVER & WORD TIMING
       ↓
STORYBOARD & SHOT DESIGN
       ↓
ART DIRECTION & STYLEFRAMES
       ↓
PRODUKSI TATA KAMERA & 3D (R3F)
       ↓
AUTOMATED QUALITY ASSURANCE (QA)
       ↓
REVISI SCENE (BILA DIBUTUHKAN)
       ↓
RENDER FINAL 1080x1920 @ 30 FPS
```

---

## 2. Struktur Narasi Fleksibel (Bukan Monolitik 6 Babak)

Pilihlah struktur narasi yang paling sesuai dengan topik edukasi yang dibahas:

1. **Step-by-Step Mechanism** (Sangat cocok untuk layar sentuh, semikonduktor, transistor, sensor).
2. **Inside-the-Machine** (Menembus casing fisik masuk ke ruang mesin / mikro visual).
3. **Problem → Mechanism → Solution** (Sangat cocok untuk kasus kegagalan mekanis seperti rem blong atau jalan rusak).
4. **Mystery → Investigation → Reveal** (Fenomena paradoks yang membingungkan penonton).
5. **Myth → Reality → Demonstration** (Patahkan mitos umum dengan pembuktian visual).
6. **Continuous Journey Through a System** (Kamera meluncur kontinu menyusuri sirkuit atau pipa).

> **PENTING**: Dilarang memaksakan kartu debat komentar (`<CommentTriggerCard />`) atau easter egg objek lucu bila tidak relevan dengan topik ilmiah. Edukasi berkualitas tinggi dihargai karena kejelasan dan keindahannya, bukan gimmik murahan.

---

## 3. Sistem Gaya Visual (Visual Styles)

Pilihlah salah satu dari 4 gaya visual resmi Studio V2:

1. **Cinematic Technical Explainer** *(Default)*:
   - Palet warna: Slate gelap (`#090d16`), aksen electric cyan (`#38bdf8`) dan amber (`#f59e0b`).
   - Material: Brushed metal, kaca optik dielektrik transparan, medan muatan listrik menyala.
   - Tipografi: Bersih, modern, drop shadow elegan, tanpa coretan kartun tebal.

2. **Minimalist Product Visualization**:
   - Palet warna: Studio abu-abu netral, softbox halus, bayangan difus.
   - Material: Anodized aluminium, sapphire glass, silikon halus.

3. **Educational Cutaway**:
   - Penampang irisan fisik untuk melihat komponen tersembunyi.
   - Material berjenjang: Casing transparan dengan mesin dalam penuh warna.

4. **Macro Mechanical**:
   - Sorotan mikro ekstrem: Suhu tinggi, partikel mendidih, gesekan material.

---

## 4. Standar Safe Zone & Tata Letak Instagram Reels / Shorts (1080 x 1920)

Elemen visual wajib mematuhi batas aman agar tidak tertutup tombol aplikasi:

- **Batas Atas**: Minimal 220px dari tepi atas (judul utama ditempatkan di `Y = 230px`).
- **Batas Bawah**: Minimal 420px dari tepi bawah (subtitle ditempatkan di `Y = 1480px`).
- **Batas Kanan**: Margin 140px (menghindari tombol Like, Komentar, Share).
- **Batas Kiri**: Margin 60px.
- **Zona Objek 3D (Hero Zone)**: `Y = 540px s/d 1300px`. Objek 3D utama harus berada di area ini tanpa tertabrak oleh teks.

---

## 5. Standar Audio & Sinkronisasi

1. **Voice-Over Alami**: Gunakan Edge TTS bahasa Indonesia dengan kecepatan normal (`0%`).
   - Pria: `id-ID-ArdiNeural`
   - Wanita: `id-ID-GadisNeural`
2. **Word-Level Subtitles**: Subtitle harus otomatis dipicu dari file JSON word-level alignment hasil TTS, bukan dikira-kira manual.
3. **Sound Effects (SFX)**:
   - Efek suara harus terikat pada peristiwa nyata di layar (misal: saat jari menyentuh layar, saat kamera cutaway membedah layer).
   - Jangan menyetel bunyi *whoosh* dan *ding* di interval waktu acak.

---

## 6. Standar Teknis Koding Remotion + Three.js

1. **100% Deterministik**:
   - Semua animasi Three.js digerakkan oleh `useCurrentFrame()`, `interpolate()`, dan `spring()`.
   - Dilarang memakai `useFrame()` dari R3F yang tidak terikat pada timeline Remotion.
2. **Pencahayaan & Kamera Reusable**:
   - Gunakan rig dari `src/studio/lighting/` (`StudioSoftboxLighting`, `MacroTechnicalLighting`, dll).
   - Gunakan `CinematicCameraDirector` dari `src/studio/cameras/CinematicCamera.tsx`.
3. **Verifikasi Kualitas**:
   - Wajib lolos `npm run lint` (0 error).
   - Wajib menjalankan `npm run qa -- -c <NamaComposition>` untuk menghasilkan contact sheet dan memastikan tidak ada frame gelap/rusak.
