# SYSTEM ARCHITECTURE — REMOTION AI REELS STUDIO V2

## Overview
Remotion AI Reels Studio V2 is an automated, AI-driven creative production pipeline designed to generate broadcast-quality, scientifically accurate educational Instagram Reels and YouTube Shorts (9:16, 1080×1920 @ 30fps) with minimal human friction.

---

## High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------+
|                            AI ORCHESTRATION LAYER                           |
|  [Research Director] -> [Script Director] -> [Storyboard & Art Director]     |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                            STRUCTURED SCHEMAS                               |
|  ProjectSpec | ResearchSpec | ScriptSpec | StoryboardSpec | QAReportSpec    |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                         REMOTION V2 STUDIO CORE                             |
|  +--------------------+  +--------------------+  +-----------------------+  |
|  |   CINEMATOGRAPHY   |  |   LIGHTING RIGS    |  |     PBR MATERIALS     |  |
|  | - Waypoint Director|  | - Softbox Lighting |  | - Optical Glass       |  |
|  | - Macro Tracking   |  | - Macro Technical  |  | - Brushed Aluminum    |  |
|  | - Exploded Camera  |  | - Laboratory Dark  |  | - Emissive Field      |  |
|  +--------------------+  +--------------------+  +-----------------------+  |
|  +--------------------+  +--------------------+  +-----------------------+  |
|  |  MECHANISM MOTION  |  |  MODERN TYPOGRAPHY |  |     AUDIO ENGINE      |  |
|  | - Capacitive Grid  |  | - Safe Zone Layout |  | - Edge TTS Alignment  |  |
|  | - Field Arcs       |  | - Studio Headlines|  | - Auto-Ducking BGM    |  |
|  | - Charge Particles |  | - Kinetic Subtitles|  | - Event-Bound SFX     |  |
|  +--------------------+  +--------------------+  +-----------------------+  |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                    AUTOMATED QUALITY ASSURANCE ENGINE                       |
|  [TypeScript / ESLint] -> [Keyframe Render] -> [Contact Sheet] -> [Verdict]  |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                         FINAL EXPORT (1080x1920 MP4)                        |
+-----------------------------------------------------------------------------+
```

---

## Core Modules & Directory Layout

- `src/studio/schemas/`: Zod and TypeScript schemas defining contracts for projects, storyboards, audio timing manifests, and QA reports.
- `src/studio/creative/`: Definitions for 9 supported narrative structures (`narrativeStructures.ts`) and 4 configurable visual styles (`visualStyles.ts`).
- `src/studio/lighting/`: Reusable Three.js lighting rigs (`StudioSoftboxLighting`, `MacroTechnicalLighting`, `CinematicThreePointLighting`, `DramaticLaboratoryLighting`).
- `src/studio/materials/`: Physically accurate PBR material presets for Three.js (`BrushedAluminumMaterial`, `OpticalGlassMaterial`, `SiliconSubstrateMaterial`, `EmissiveFieldMaterial`).
- `src/studio/cameras/`: Declarative, deterministic camera director (`CinematicCameraDirector`) supporting Waypoints, Easing, and lookAt tracking without R3F `useFrame()` leaks.
- `src/studio/motion/`: Procedural mechanical and electrical visualizers (`CapacitiveSensorGrid3D`, `ElectricFieldArc3D`, `ChargeFlowParticles3D`, `HumanTouchFinger3D`).
- `src/studio/typography/`: Instagram Reels safe-zone compliant typography (`StudioHeadline`, `StudioTechnicalCallout`, `StudioKineticSubtitles`).
- `src/studio/audio/`: Multi-track audio mixer (`StudioAudioEngine`) binding voice narration, ducked BGM, and context-triggered SFX.
- `scripts/qa-engine.mjs`: Automated QA evaluator capturing multi-shot keyframes, generating tiled contact sheets via FFmpeg, and producing Markdown/JSON scorecards.
- `scripts/pipeline-runner.mjs`: CLI production orchestrator.

