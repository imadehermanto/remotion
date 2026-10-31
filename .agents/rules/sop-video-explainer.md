---
description: Aturan wajib produksi video 3D Explainer Remotion AI Reels Studio V2
---

Setiap kali user meminta ide video baru atau meminta dibuatkan/dieditkan video explainer di proyek Remotion ini:
1. Wajib mematuhi SOP Studio V2 di `SOP-PRODUKSI-VIDEO.md`.
2. Gunakan alur kerja modular Studio V2: Riset Ilmiah → Naskah Narasi → Audio Voice-Over → Storyboard → Scene Three.js Deterministik → QA Engine.
3. Gunakan modul pencahayaan, material, kamera, dan tipografi modern dari `src/studio/` (`CinematicCameraDirector`, `MacroTechnicalLighting`, `StudioSoftboxLighting`, `StudioHeadline`, `StudioKineticSubtitles`).
4. Bebas memilih dari 9 struktur narasi (StepByStepMechanism, InsideTheMachine, ProblemMechanismSolution, dll) dan 4 gaya visual resmi. Jangan memaksakan formula klise atau kartu komentar bila tidak relevan.
5. Verifikasi kualitas dengan `npm run lint` dan `npm run qa -- -c <NamaComposition>`.
