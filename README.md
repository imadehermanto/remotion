# Remotion AI Reels Production Studio V2

Automated, AI-driven creative production studio for generating high-quality, scientifically accurate educational Instagram Reels and YouTube Shorts (9:16, 1080×1920 @ 30fps) using Remotion, Three.js / React Three Fiber, and Microsoft Edge TTS.

---

## 🚀 Key Features in V2

- **Visual-First Creative Pipeline**: Replaces naive "prompt-to-code" with an orchestrated 10-stage lifecycle: Research → Creative Brief → Script → Voice Alignment → Storyboard → Styleframes → Scene Production → Automated QA → Final Render.
- **Flexible Narrative Structures**: Supports 9 narrative frameworks (Step-by-Step Mechanism, Inside-The-Machine, Problem-Mechanism-Solution, Mystery-Reveal, etc.), deprecating rigid one-size-fits-all formulas.
- **Configurable Visual Styles**: 4 distinct art directions: *Cinematic Technical Explainer*, *Minimalist Product*, *Educational Cutaway*, and *Macro Mechanical*.
- **Cinematic 3D & Camera Director**: Declarative camera waypoints with deterministic easing, reusable lighting rigs (Studio Softbox, Macro Technical, Laboratory Dark), and physical PBR materials.
- **Safe-Zone Compliant UI**: Eliminates cluttered stickers and oversized comic strokes. Clean, modern typography designed specifically for Instagram Reels & Shorts viewport constraints.
- **Automated Quality Assurance Engine**: Automated TypeScript & ESLint validation, multi-shot keyframe capture, black frame detection, and FFmpeg contact sheet generation.
- **Intelligent Audio Engine**: Natural Indonesian voice-over with word-level millisecond alignment, auto-ducked ambient backsound, and semantic event-bound sound effects.

---

## 📂 Project Structure

```
├── docs/                      # Architectural audit, creative pipeline & CLI docs
├── projects/                  # Production workspaces (research, brief, script, storyboard)
│   └── touchscreen-explainer/ # Topic: Cara Kerja Layar Sentuh Smartphone
├── scripts/                   # Production automation tools
│   ├── generate-voice.mjs     # Edge TTS Indonesian voice generator with word timestamps
│   ├── generate-sfx.mjs       # Procedural WAV sound effects synthesizer
│   ├── qa-engine.mjs          # Automated technical & visual QA engine
│   └── pipeline-runner.mjs    # Production pipeline CLI
├── src/
│   ├── studio/                # Studio V2 reusable architecture
│   │   ├── schemas/           # Zod & TypeScript production schemas
│   │   ├── creative/          # Narrative structures & visual style definitions
│   │   ├── lighting/          # Reusable Three.js studio lighting rigs
│   │   ├── materials/         # PBR physical material presets
│   │   ├── cameras/           # Declarative cinematic camera director
│   │   ├── motion/            # Procedural mechanism & field visualizers
│   │   ├── typography/        # Safe-zone modern headlines, callouts & kinetic subtitles
│   │   └── audio/             # Studio audio mixer with auto-ducking & SFX dispatcher
│   ├── TouchscreenExplainer/  # 3D capacitive touchscreen explainer scene & overlay
│   ├── BrakeFadeExplainer/    # Disc brake thermal fade explainer
│   ├── AsphaltPotholeExplainer/
│   ├── FridgeExplainer/
│   └── Root.tsx               # Remotion composition registry
└── SOP-PRODUKSI-VIDEO.md      # Authoritative production standard for AI agents
```

---

## 🛠️ Quick Start & CLI Commands

### 1. Launch Remotion Studio
```bash
npm run dev
```

### 2. Run Automated QA on a Composition
```bash
npm run qa -- -c TouchscreenExplainer
```

### 3. Generate Indonesian Voice-Over
```bash
npm run voice -- -v ardi -o touchscreen-explainer -t "Naskah narasi..."
```

### 4. Synthesize Procedural Sound Effects
```bash
npm run sfx
```

### 5. Render Final 1080x1920 MP4
```bash
npx remotion render TouchscreenExplainer out/TouchscreenExplainer.mp4
```
