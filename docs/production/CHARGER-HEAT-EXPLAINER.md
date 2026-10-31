# Production Documentation: Charger Heat Explainer

## 1. Project Overview

- **Project ID**: `charger-heat-explainer`
- **Composition ID**: `ChargerHeatExplainer`
- **Topic**: *Kenapa charger HP bisa panas saat digunakan?* (Why smartphone chargers heat up during use)
- **Target Audience**: Pengguna smartphone umum (edukatif, visual, teknis namun mudah dipahami)
- **Format**: Instagram Reels (9:16 vertical, 1080 × 1920, 30 FPS)
- **Target Duration**: 60.0 detik (1800 frames)
- **Language**: Bahasa Indonesia (`id-ID-ArdiNeural`, Edge TTS)
- **Visual Style**: `CinematicTechnicalExplainer` (Studio V2)
- **Narrative Structure**: `StepByStepMechanism`

---

## 2. Scientific Principles & Editorial Grounding

Video ini menjelaskan fisika konversi energi dan termodinamika secara akurat tanpa pseudosains:

1. **Konversi Tegangan AC ke DC (Step-Down Transformation)**:
   - Sumber listrik stopkontak dinding Indonesia adalah **220V AC (Arus Bolak-Balik)** pada frekuensi 50 Hz.
   - Baterai smartphone (Lithium-ion / Polymer) memerlukan **tegangan searah (DC)** berkisar 5V hingga 9V/12V (Fast Charging USB PD / QC).
   - Penurunan tegangan masif (~25 hingga 44 kali lipat) dilakukan di dalam adaptor berukuran sangat ringkas.

2. **Topologi SMPS (Switch Mode Power Supply)**:
   - Berbeda dari adaptor linear kuno yang menggunakan trafo besi besar yang berat dan boros kalor, charger modern menggunakan prinsip **SMPS**.
   - Transistor switching (MOSFET silikon atau **GaN - Gallium Nitride**) memutus-nyambung arus listrik dengan frekuensi tinggi (**puluhan ribu hingga ratusan ribu kali per detik** / >100 kHz).
   - Frekuensi tinggi memungkinkan ukuran inti transformator ferit menjadi sangat kecil (mikro-trafo).

3. **Efisiensi Energi & Hukum Joule ($I^2R$ Heat Loss)**:
   - Sesuai **Hukum Pertama dan Kedua Termodinamika**, tidak ada sistem konversi energi mekanik/listrik dengan efisiensi 100%.
   - Charger berkualitas memiliki efisiensi berkisar **85% hingga 90%** (atau hingga 93% pada teknologi GaN).
   - Sisa **10% hingga 15% energi terbuang (dissipated)** dalam bentuk energi termal (panas) akibat resistansi kawat tembaga trafo, resistansi internal konduksi semikonduktor ($R_{DS(on)}$), dan rugi switching (*switching losses*).

4. **Termal & Batas Keamanan Operasional**:
   - Panas pada bodi luar membuktikan sistem penyerap panas internal (*heat spreader* / potting compound) bekerja efektif membuang kalor dari chip sirkuit terpadu ke udara luar agar chip tidak mengalami *thermal runaway* atau meleleh.
   - **Suhu 40°C – 55°C**: Kisaran operasional normal dan aman saat melakukan pengisian daya cepat (*fast charging*).
   - **Suhu > 65°C atau Tercium Bau Gosong**: Indikasi malfungsi komponen internal atau korsleting, adaptor harus segera dilepas dari stopkontak.

---

## 3. Storyboard Breakdown (Single Source of Truth)

| Shot ID | Frame Range | Durasi | Kamera & Shot | Inti Adegan Visual | Narasi Audio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Shot 1: Hero Intro** | 0 – 335 | 11.2s | `OrbitReveal`, Medium Close Up | Adaptor charger melayang di studio gelap, pendaran kalor lembut | *"Pernah merasa cemas saat memegang kepala charger HP yang terasa hangat atau bahkan cukup panas saat dipakai? Tenang, ini bukan berarti chargermu rusak, melainkan hukum fisika yang sedang bekerja!"* |
| **Shot 2: Voltage Drop** | 335 – 666 | 11.0s | `MacroPushIn`, Macro Technical | Zoom ke pin steker adaptor, gelombang sinus 220V AC biru merambat masuk | *"Listrik dari stopkontak dinding memiliki tegangan tinggi 220 volt arus bolak-balik. Sementara baterai smartphone kita hanya membutuhkan tegangan searah sekitar 5 hingga 9 volt."* |
| **Shot 3: Exploded SMPS** | 666 – 953 | 9.6s | `ExplodedViewReveal`, Technical Exploded | Casing luar membelah mengungkap PCB, trafo mikro tembaga & chip GaN | *"Di dalam adaptor sekecil ini, terdapat transformator mikro dan transistor sakelar super cepat yang memutus arus ratusan ribu kali per detik untuk memangkas voltase secara efisien."* |
| **Shot 4: Joule Heating** | 953 – 1349 | 13.2s | `MacroPushIn`, Extreme Macro Thermal | Komponen berpendar oranye membara, partikel kalor termal memancar ke bodi | *"Namun, tidak ada konversi energi di dunia yang efisiensinya seratus persen. Sekitar 10 hingga 15 persen energi niscaya terbuang menjadi panas akibat hambatan listrik alami pada komponen tembaga dan semikonduktor."* |
| **Shot 5: Safety Outro** | 1349 – 1800 | 15.0s | `DollyOut`, Full Overview Outro | Casing menyatu kembali, gauge termometer 3D menampilkan zona aman 40-55°C vs peringatan 65°C | *"Panas di bodi luar justru membuktikan adaptor berhasil membuang kalor agar chip internal tidak meleleh. Suhu 40 hingga 55 derajat Celsius adalah normal saat fast charging, tapi jika tercium bau gosong dan tembus 65 derajat, segera cabut!"* |

---

## 4. Visual & Audio Engineering Implementation

1. **3D Components (`src/ChargerHeatExplainer/ChargerMechanisms3D.tsx`)**:
   - `ChargerOuterShell3D`: Bodi polikarbonat matte black dengan pin steker nikel krom, port USB-C dengan *gold pin connector*, dan mekanisme pemisahan exploded view aksial.
   - `SMPSInternalCircuit3D`: Papan sirkuit FR4 hijau gelap, kumparan kawat tembaga trafo ferit mikro bergradasi warna suhu, chip semikonduktor GaN MOSFET dengan *golden thermal slug*, serta kapasitor perata riak tegangan tinggi dan rendah.
   - `EnergyConversionWave3D`: Gelombang sinus AC 220V parametrik 3D dengan bead indikator tegangan.
   - `ThermalRadiationParticles3D`: Sistem partikel emisi termal inframerah yang memancar ke plat penyerap panas dan dinding luar adaptor.
   - `ThermalSafetyMeter3D`: Gauge dial termal 3D dengan jarum indikator dinamis, busur zona aman hijau-oranye (40°C–55°C) dan zona bahaya merah (>65°C).

2. **Cinematography & Lighting (`src/ChargerHeatExplainer/ChargerScene3D.tsx`)**:
   - Pergerakan kamera sepenuhnya dideklarasikan melalui `CinematicCameraDirector` dengan interpolasi posisi halus dari `storyboard.json`.
   - Pencahayaan berganti secara kontekstual: `StudioSoftboxLighting` pada shot hero intro dan outro, `MacroTechnicalLighting` pada shot teknis pin dan partikel kalor, serta `DramaticLaboratoryLighting` pada exploded view.

3. **Safe-Zone UI & Typography (`src/ChargerHeatExplainer/ChargerUIOverlay.tsx`)**:
   - Mengikuti parameter Instagram Reels: margin atas 220px, bawah 420px, kiri 60px, kanan 140px.
   - `StudioHeadline` menyajikan judul per adegan dengan animasi pop terukur.
   - `StudioTechnicalCallout` menampilkan label spesifikasi teknis (seperti `INPUT PIN 220V AC`, `100.000x / DETIK`, `JOULE HEATING LOSSES`, `SAFETY THRESHOLD`).
   - `StudioKineticSubtitles` menampilkan subtitle kata-per-kata yang sinkron dengan pembacaan narator dari Edge TTS.

4. **Multi-Track Audio Engine (`src/studio/audio/AudioEngine.tsx`)**:
   - Voice-over: `public/charger-heat-explainer.mp3` (durasi aktual 59.81s).
   - BGM: `public/assets/audio/bgm-scheming-weasel.mp3` dengan *auto-ducking* otomatis ke volume 0.12 selama narasi berlangsung.
   - Sound Effects terjadwal otomatis berdasarkan storyboard: `whoosh.wav`, `impact.wav`, `switch.wav`, `riser.wav`, dan `ding.wav`.

---

## 5. Quality Assurance & Deterministic Verification

Hasil pengujian otomatis melalui `scripts/qa-engine.mjs`:

- **Technical Lint & Typecheck**: `PASSED` (0 error, 0 warning pada TypeScript dan ESLint).
- **Physical Asset Integrity**: `PASSED` (10/10 file fisik terverifikasi dengan ukuran byte nyata).
- **Timeline & Audio Synchronization**: `PASSED` (Durasi audio narasi: 59.81 detik = 1794 frame vs komposisi: 1800 frame, selisih 6 frame / ~0.2 detik ekor hening, audio tidak terpotong).
- **Keyframe Luminance & Dynamic Range**: `PASSED` (Frame 100: YAVG 32.1, Frame 450: YAVG 30.6, Frame 800: YAVG 48.8, Frame 1150: YAVG 69.2, Frame 1550: YAVG 43.2. Seluruh frame berada dalam batas dynamic range video standar 16–235 tanpa *black frame* atau *clipping*).
- **Safe-Zone Compliance**: `PASSED` (0 pelanggaran terhadap batas overlay UI Instagram).
- **Semantic & Visual Editorial QA**: Ditandai secara jujur sebagai `not_evaluated` karena tidak adanya API multimodal visual real-time lokal terkonfigurasi, dengan contact sheet yang tersedia untuk inspeksi visual manusia di `out/qa/ChargerHeatExplainer/contact-sheet.png`.

---

## 6. Output Artifacts

- **Video MP4 Final**: `out/ChargerHeatExplainer.mp4`
- **Contact Sheet Keyframes**: `out/qa/ChargerHeatExplainer/contact-sheet.png`
- **Laporan QA Lengkap**: `out/qa/ChargerHeatExplainer/QA-REPORT.md`
- **QA JSON Metadata**: `out/qa/ChargerHeatExplainer/qa-report.json`
- **Naskah Narasi**: `projects/charger-heat-explainer/script.json`
- **Storyboard Single Source of Truth**: `projects/charger-heat-explainer/storyboard.json`

---

## 7. Unresolved Issues & Future Improvements

1. **Evaluasi Semantik Multimodal Otomatis**:
   - Diperlukan integrasi model vision AI (seperti Gemini 1.5 Pro / Flash) pada pipeline runner untuk mengotomatisasi penilaian estetika komposisi frame, kontras warna subjek terhadap background, dan ekspresi visual tanpa bergantung pada inspeksi manual.
2. **Procedural Wire Geometry**:
   - Lilitan kumparan kawat tembaga trafo saat ini menggunakan geometri silindris berlapis. Untuk fidelitas mikroskopis yang lebih tinggi di masa depan, dapat dibuat kurva helix spiral 3D parametrik murni.
3. **Motion Blur & Depth of Field (DoF)**:
   - Remotion ThreeCanvas saat ini merender tanpa depth of field post-processing shader. Menambahkan DoF bokeh shader pada shot makro (seperti Shot 3 dan 4) akan semakin meningkatkan kualitas sinematik visual.

