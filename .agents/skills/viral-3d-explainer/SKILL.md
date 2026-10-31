---
name: viral-3d-explainer
description: SOP dan standar wajib untuk membuat video 3D explainer vertikal (9:16, 1080x1920, 30fps) bergaya "How Come?" (@howcomeidyt) dan "Wait, Really!?" di Remotion menggunakan pustaka aset terpusat `src/assets/`. Aktifkan skill ini setiap kali user meminta ide video baru, meminta dibuatkan video explainer baru, atau memodifikasi video explainer yang ada.
---

# Skill: Viral 3D Explainer (SOP Channel)

Setiap kali kamu membuat atau mengedit video explainer di workspace ini, kamu **WAJIB** mematuhi seluruh SOP di bawah ini (lihat juga `SOP-PRODUKSI-VIDEO.md`):

## 1. Struktur Naskah 6 Babak & Tempo Normal
1. **Generate Voice-Over dengan Kecepatan Normal (`0%`)**:
   - Jalankan `npm run voice -- -v ardi -o <slug-video> -t "<naskah>"` tanpa flag `-r` agar ritme bicara tenang, jelas, dan tidak terburu-buru.
2. **Wajib Memuat Konsep *"Itulah Alasan Kenapa..."***:
   - Naskah harus menjawab rasa penasaran sehari-hari dan menyertakan minimal **2 kalimat fakta aplikatif**:
     - Di tengah video: *"Nah, itulah alasan kenapa [fakta sehari-hari 1]!"*
     - Di akhir video: *"Dan itulah alasan kenapa [tips/pantangan sehari-hari 2]!"*
3. **Tempo Visual Tenang (Durasi 45–60 detik / 1350–1800 frame @ 30fps)**:
   - Setiap adegan kamera diberi durasi 5–8 detik.
   - Kecepatan aliran partikel/gerakan mekanis harus lembut (`frame * 0.003` s/d `0.02`).

## 2. Wajib Menggunakan Shared Asset Library (`src/assets/`)
Jangan membuat ulang komponen UI atau model dasar dari nol. Impor langsung dari `src/assets`:
- `MODELS`, `BRAND_THEME`, `SFX` (`src/assets/catalog.ts`)
- `<Asset3D />` (`src/assets/three/Asset3D.tsx`) — bila butuh model baru, cari & unduh dulu dengan `npm run assets -- search <kata>` lalu `npm run assets -- add <nama>`.
- `<ChunkyArrow3D />`, `<Thermometer3D />`, `<WoodenFloorStage3D />` (`src/assets/three/Gizmos3D.tsx`)
- `<IndonesianAlleyStage3D />`, `<ConcreteMixer3D />`, `<WaterStream3D />`, `<RainParticles3D />` (`src/assets/three/EnvironmentStage3D.tsx`)
- `<CharacterWorker3D />` (`src/assets/three/CharacterWorker3D.tsx`)
- `<MicroscopeCrossSection3D />` (`src/assets/three/MicroscopeCutaway3D.tsx`)
- `<ViralShortsOverlayContainer />`, `<ViralHeadlineBanner />`, `<FloatingBadgePills />`, `<RedFocusRings />`, `<ViralWordSubtitles />`, `<CommentTriggerCard />`, `<SceneSFXLayer />` (`src/assets/ui/ViralShortsUI.tsx`)

## 3. Strategi Engagement (Like, Komen, Follow)
- **Visual Easter Egg**: Selalu letakkan minimal 1 detail unik/lucu di latar belakang 3D (misal: `MODELS.characters.dog` atau `MODELS.characters.bunny` di teras/pinggir jalan) agar penonton salfok dan berkomentar.
- **Comment Trigger Card**: Di 4 detik terakhir video, tampilkan `<CommentTriggerCard />` berisi pertanyaan dua kubu atau pertanyaan daerah penonton.

## 4. Verifikasi Wajib
- Dilarang memakai `useFrame()` dari `@react-three/fiber` atau CSS `transition`.
- Jalankan `npm run lint` hingga 0 error, dan cek visual dengan `npx remotion still` (lalu hapus file PNG sementara setelah dicek).

