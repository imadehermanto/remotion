# CLI & TOOLING MANUAL — REMOTION AI REELS STUDIO V2

This document details all executable command-line tools in Remotion AI Reels Studio V2.

---

## 1. Environment Requirements
- **Node.js**: v20+ (tested on Node v24.2.0)
- **FFmpeg**: v6+ (tested on FFmpeg 7.1.1)
- Ensure Homebrew path is exported on macOS:
  ```bash
  export PATH="/opt/homebrew/bin:$PATH"
  ```

---

## 2. CLI Command Reference

### A. Quality Assurance Engine
Runs full technical, visual, and frame-capture QA on any composition:
```bash
npm run qa -- -c <CompositionName>
```
Options:
- `-c, --composition <Name>`: Name of the registered Remotion composition (e.g. `TouchscreenExplainer`, `BrakeFadeExplainer`).
- `-f, --frames <list>`: Comma-separated list of keyframe numbers to capture (e.g. `50,350,750,1100,1450`).
- `-o, --out <dir>`: Target output directory for QA reports and contact sheets (default: `out/qa`).

Outputs produced:
- `out/qa/<CompositionName>/QA-REPORT.md` (Human-readable Markdown scorecard)
- `out/qa/<CompositionName>/qa-report.json` (Machine-readable JSON schema)
- `out/qa/<CompositionName>/contact-sheet.png` (Tiled contact sheet)
- `out/qa/<CompositionName>/frame-*.png` (Full-resolution inspected keyframes)

---

### B. Voice-Over Generation with Word Alignment
Generates Indonesian voice narration and word-level timestamp metadata:
```bash
npm run voice -- -v ardi -o <slug> -t "<naskah teks>"
```
Options:
- `-v, --voice`: `ardi` (`id-ID-ArdiNeural`, male) or `gadis` (`id-ID-GadisNeural`, female).
- `-o, --output`: Base name for generated files (will output to `public/<output>.mp3`, `.json`, `.srt`).
- `-t, --text`: Inline text string.
- `-f, --file`: Path to text or JSON file containing narration.

---

### C. Procedural Sound Effect Generator
Synthesizes clean, license-free WAV sound effects directly via FFmpeg audio evaluation:
```bash
npm run sfx
```
Produces:
- `public/assets/sfx/pop.wav` (Badge / layer pop)
- `public/assets/sfx/impact.wav` (Climax impact / touch contact)
- `public/assets/sfx/riser.wav` (Tension riser)
- `public/assets/sfx/swoosh.wav` (Camera cut whoosh)
- `public/assets/sfx/tick.wav` (Crosshair coordinate lock)

---

### D. Pipeline Runner
Convenience command runner for managing video projects:
```bash
npm run pipeline -- qa -c TouchscreenExplainer
npm run pipeline -- render -c TouchscreenExplainer
```

---

### E. Remotion Video Rendering
Renders the final publication-ready MP4 file:
```bash
npx remotion render <CompositionName> out/<CompositionName>.mp4
```

---

### F. Remotion Studio (Visual Preview)
Launches the Remotion interactive web studio for real-time scrubbing:
```bash
npm run dev
```

