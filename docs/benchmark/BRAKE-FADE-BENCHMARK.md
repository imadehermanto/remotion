# OBJECTIVE BENCHMARK REPORT: BRAKE FADE EXPLAINER (V1 VS. V2)

**Evaluation Date**: 2026-10-31  
**Methodology**: Identical composition comparison on the exact same audio, 3D assets, and keyframe timestamps.  
**Baseline Composition**: `BrakeFadeExplainer` (V1 Architecture)  
**Upgraded Composition**: `BrakeFadeExplainerV2` (Studio V2 Architecture)  
**Inspected Keyframes**: Frame 350, Frame 600, Frame 950, Frame 1650  

---

## 1. Apples-to-Apples Evaluation Matrix

Both compositions share the exact same 3D scene (`BrakeFadeScene3D`), models (`DiscBrakeSystem3D`, `MountainSlopeRoad3D`), narration audio (`brake-fade-explainer.mp3`), and ambient music (`bgm-scheming-weasel.mp3`).

| Dimension | Baseline V1 (`BrakeFadeExplainer`) | Studio V2 (`BrakeFadeExplainerV2`) | Objective Verification Method |
|---|---|---|---|
| **Audio Sync Integrity** | ❌ **FAILED (Audio Clipped)**: Audio duration 58.44s (1753 frames) vs Video 1728 frames. Voice narration truncated by **25 frames**. | ✅ **PASSED**: Video timeline synchronized to 1754 frames (1 frame buffer). Full narration speech preserved cleanly. | `ffprobe -v error -show_entries format=duration` |
| **Top Safe Zone (0–220px)** | ❌ **VIOLATION**: Top headline positioned at `top: 95px`, directly colliding with Instagram Reels header UI. | ✅ **COMPLIANT**: Headline placed at `top: 230px`, strictly below the 220px boundary. | `src/assets/production/safeZone.ts` layout check |
| **Hero 3D Subject Area (`Y: 540–1300px`)** | ❌ **OBSTRUCTED**: Obscured by giant dashed red focus rings (`border: 8px dashed #ff2a2a`, size 460–520px) and tilted cartoon badges. | ✅ **CLEAR & FOCUSED**: Red focus rings removed. Replaced with precision technical callouts with anchor dots. | Visual frame comparison (Frames 350, 600, 950) |
| **Outro & Cadence Braking Demonstration** | ❌ **BLOCKED**: Bottom 360px covered by `<CommentTriggerCard />` (debating Option A vs Option B), completely obscuring the 3D cadence brake animation. | ✅ **UNENCUMBERED**: Comment debate card removed. Cadence braking demonstration is 100% visible with a clean callout pill. | Frame 1650 inspection |
| **Typography & Subtitles** | `WebkitTextStroke: 13px #090d16` with yellow fills; prone to visual vibration against 3D highlights. | `StudioKineticSubtitles` with `HighContrastPill` backdrop and clean drop shadow; zero cartoon stroke. | Frame 350, 600, 950 pixel review |

---

## 2. Objective Frame Luminance Metrics (FFmpeg signalstats)

Both compositions were analyzed using identical FFmpeg `signalstats` filters across the same frame sequence:

| Frame Timestamp | Baseline V1 (File Size & YAVG) | Studio V2 (File Size & YAVG) | Observation |
|---|---|---|---|
| **Frame 350** (Caliper & Disc Cutaway) | 485.1 KB \| YAVG = 73.9 | 370.4 KB \| YAVG = 68.6 | V1 has higher visual noise from dashed red rings; V2 has higher subject contrast and cleaner focus on the disc assembly. |
| **Frame 600** (Glowing Rotor >200°C) | 454.1 KB \| YAVG = 61.2 | 420.6 KB \| YAVG = 52.2 | V2 emphasizes the deep red thermal glow of the rotor against a controlled slate gradient rather than clashing yellow badges. |
| **Frame 950** (Vapor Lock Boiling Fluid) | 549.6 KB \| YAVG = 71.3 | 455.0 KB \| YAVG = 63.2 | V2 features a readable technical callout (`Vapor Lock: Gelembung Uap`) with clear bubble visualization. |
| **Frame 1650** (Cadence Braking Finale) | 431.0 KB \| YAVG = 71.3 | 391.2 KB \| YAVG = 69.1 | V1 displays the massive comment trigger card; V2 displays the physical pumping action of the caliper and brake lever. |

---

## 3. Artifact Verification

- **Baseline Contact Sheet**: `out/benchmark/baseline/BrakeFadeExplainer/`
- **Studio V2 Contact Sheet**: `out/benchmark/v2/BrakeFadeExplainerV2/contact-sheet.png`
- **Baseline QA Report**: `out/benchmark/baseline/BrakeFadeExplainer/QA-REPORT.md`
- **Studio V2 QA Report**: `out/benchmark/v2/BrakeFadeExplainerV2/QA-REPORT.md`
- **Baseline Video**: `out/benchmark/BrakeFadeExplainer-baseline.mp4`
