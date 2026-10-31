# CREATIVE PIPELINE GUIDE — REMOTION AI REELS STUDIO V2

## Overview
Studio V2 rejects the naive "Prompt → Code" pipeline. Every production follows an orchestrated 10-stage lifecycle designed to ensure scientific accuracy, narrative engagement, and pristine visual cinematography.

---

## 10 Production Stages

### 1. Topic Research (`projects/<slug>/research.json`)
- Pinpoints the core educational question.
- Extracts scientific principles (e.g. mutual capacitance, ITO conductivity).
- Documents verified facts and debunked misconceptions.
- Records real academic or technical citations.

### 2. Creative Brief (`projects/<slug>/creative-brief.json`)
- Selects target audience, duration, and tone.
- Chooses one of the **9 Narrative Structures** (e.g. `StepByStepMechanism`, `InsideTheMachine`, `ProblemMechanismSolution`).
- Selects one of the **4 Visual Styles** (e.g. `CinematicTechnicalExplainer`, `MinimalistProductVisualization`).

### 3. Scriptwriting (`projects/<slug>/script.json`)
- Written in natural, conversational Indonesian.
- Strong hook without sensationalist clickbait.
- Timed to ~2.5 words per second to avoid rushed narration.

### 4. Indonesian Voice Generation & Audio Alignment (`public/<slug>.mp3`)
- Uses Microsoft Edge TTS (`id-ID-ArdiNeural` or `id-ID-GadisNeural`) with **0% speed-up**.
- Emits exact word-level and sentence-level millisecond & frame boundaries (`public/<slug>.json`).

### 5. Storyboard & Shot Design (`projects/<slug>/storyboard.json`)
- Maps every narration sentence to a distinct 3D shot.
- Specifies camera shot type, camera movement, start/end 3D positions, and lookAt targets.
- Binds sound effects (SFX) to physical visual occurrences (e.g. touch contact, layer separation).

### 6. Visual Styleframes & Safe Zone Compliance
- Verifies that 3D hero objects reside within the safe zone (`Y: 540–1300px`).
- Verifies that headlines stay in the top margin (`Y: 230px`) and subtitles stay above the bottom UI margin (`Y: 1480px`).

### 7. Remotion Scene Assembly (`src/<CompositionName>.tsx`)
- Declarative Three.js components driven purely by `useCurrentFrame()`.
- Uses reusable studio lighting rigs and PBR materials.
- 100% deterministic animation (no `Math.random()`, no CSS transitions, no `useFrame()`).

### 8. Automated Quality Assurance (`scripts/qa-engine.mjs`)
- Runs TypeScript and ESLint type checks.
- Captures keyframe stills across every shot boundary.
- Tiles frames into an automated contact sheet via FFmpeg.
- Inspects byte sizes to detect black/empty frames.

### 9. Revision Loop
- If any blocking or visual issue is detected, the affected shot is isolated, revised, and re-verified.

### 10. Final Render & Delivery
- Exports publication-ready 1080×1920 MP4 video at 30 FPS.

