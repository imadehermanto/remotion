---
name: viral-3d-explainer
description: Standar produksi video explainer vertikal 3D (9:16, 1080x1920, 30fps) di Remotion AI Reels Studio V2 menggunakan arsitektur modular, Three.js / React Three Fiber, dan pencahayaan sinematik.
---

# Skill: Remotion 3D Explainer Studio V2

Gunakan skill ini untuk memproduksi video edukasi 3D Instagram Reels & YouTube Shorts berkualitas tinggi.

## 1. Alur Produksi Modular
1. **Riset & Narasi**: Buat naskah edukatif berbasis fakta sains akurat (bahasa Indonesia natural).
2. **Audio Voice-Over**: Generate audio dengan `npm run voice -- -v ardi -o <slug> -t "<naskah>"` untuk mendapatkan file audio dan metadata word alignment (`public/<slug>.json`).
3. **Storyboard & Kamera**: Rancang pergerakan kamera sinematik (`CinematicCameraDirector`) dan pencahayaan (`MacroTechnicalLighting`, `StudioSoftboxLighting`).
4. **Visual Elements**: Gunakan tipografi modern aman safe-zone (`StudioHeadline`, `StudioKineticSubtitles`) serta material PBR (`src/studio/materials/PBRMaterials.tsx`).
5. **Quality Assurance**: Jalankan `npm run qa -- -c <CompositionName>` untuk menghasilkan contact sheet keyframe dan memverifikasi kualitas komposisi visual.

## 2. Fleksibilitas Kreatif
- Bebas memilih dari 9 struktur narasi sesuai topik (StepByStepMechanism, InsideTheMachine, ProblemMechanismSolution, MysteryReveal, dsb).
- Dilarang memaksakan kartu kuis komentar atau stiker kartun berlebih pada konten teknis/ilmiah serius.
- Selalu utamakan kejelasan visual mekanisme 3D di area Hero Zone (`Y: 540–1300px`).
