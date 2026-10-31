# INITIAL ARCHITECTURAL & CREATIVE AUDIT
**Remotion AI Reels Production Studio V2**
*Date: 2026-10-31*
*Auditor: Principal Software Architect & Creative Production Team*

---

## Executive Summary

An exhaustive audit of the existing Remotion repository reveals a technically functional rendering environment constrained by brittle production patterns, overly rigid viral formula dogmas, and the complete absence of a structured pre-production creative direction and automated quality assurance layer.

While the project successfully integrates Remotion with Three.js / React Three Fiber (`@remotion/three`, `@react-three/fiber`, `@react-three/drei`) and provides deterministic frame-based animation with Edge TTS voice-overs, video generation was previously approached as:
$$\text{PROMPT} \longrightarrow \text{CODE} \longrightarrow \text{RENDER} \longrightarrow \text{DONE}$$

This direct jump to code leads to:
1. Visual homogenization across disparate topics.
2. Cluttered, claustrophobic viewports where 3D mechanical subjects are eclipsed by oversized graphic badges, loud red focus rings, and aggressive comment debate cards.
3. Brittle timing synchronization based on arbitrary frame lists rather than semantic events.
4. Total absence of automated visual QA, frame composition metrics, styleframes, or revision mechanics.

---

## Section 1: Detailed Findings by Category

### A. Architectural Problems
1. **Monolithic Video Compositions**: Compositions such as `BrakeFadeExplainer.tsx`, `AsphaltPotholeExplainer.tsx`, and `FridgeExplainer.tsx` couple audio layers, 3D scenes, UI overlays, and hardcoded camera cuts into tightly coupled components.
2. **Hardcoded Frame Cuts**: Cut points (e.g. `const cutFrames = [131, 268, 497, 834, 1175, 1349, 1478, 1620]`) and sound triggers (e.g. `dingFrames = [15, 135, ...]`) are hardcoded manually in the composition instead of being derived from a structured storyboard or audio alignment manifest.
3. **Lack of Isolated Production Workspaces**: Assets, voice files, and metadata are dumped directly into `public/` (e.g., `public/brake-fade-explainer.mp3`, `public/brake-fade-explainer.json`), risking collisions and making projects difficult to version, branch, or resume.
4. **No Schema Validation**: No TypeScript or Zod schemas exist for project manifests, shot lists, storyboard beats, or QA reports.

### B. Poor Creative Design Decisions
1. **Dogmatic 6-Act Structure**: `SOP-PRODUKSI-VIDEO.md` mandated that *every single video* must follow:
   - Act 1: Everyday phenomenon hook (0–6s)
   - Act 2: Myth-busting plot twist (6–15s)
   - Act 3: Mechanism step 1 (15–27s)
   - Act 4: Mechanism step 2 + "Nah, itulah alasan kenapa..." (27–40s)
   - Act 5: Visual climax (40–47s)
   - Act 6: Practical tip + Comment Trigger Card (47–55s)
   This formula forces unnatural pacing, prevents alternative narrative structures (such as Mystery-Reveal, Inside-the-Machine, Step-by-Step Mechanical Disassembly, Cause & Effect), and degrades scientific communication into formulaic content farm output.
2. **Forced Engagement Gimmicks**: Mandating a `<CommentTriggerCard />` in the final 4 seconds with a binary debate question (e.g., Option A vs Option B) often clashes with serious educational or technical explanations.
3. **Repetitive "Easter Egg" Mandate**: The requirement to insert a hidden dog or bunny in every scene distracts from scientific and engineering clarity.

### C. Repetitive or Generic Visual Templates
1. **One-Size-Fits-All Graphic Language**:
   - Every video defaults to heavy Montserrat 900 typography, `WebkitTextStroke: 13px #090d16`, bright yellow pop `#facc15`, and dashed red circular focus rings (`border: 8px dashed #ff2a2a`).
   - A brake failure explainer looks identical in art direction to a kitchen refrigerator explainer or an asphalt road explainer.
2. **Visual Clutter & Safe Zone Violations**:
   - The headline banner at the top (`top: 95px`), floating badges, and comment cards encroach upon the 3D subject area (`LAYOUT.subject: { top: 540, bottom: 1300 }`), forcing 3D subjects into cramped vertical slivers.

### D. Unnecessary Component Restrictions
1. The asset library forced all videos to import exclusively from `src/assets/ui/ViralShortsUI.tsx` and `src/assets/catalog.ts`.
2. Clean, minimal, technical, cinematic, or product-style motion graphics had no component support.

### E. Inefficient Animation Patterns
1. **Direct Lerping in Render Loops**: Camera interpolation is calculated via manual `lerpVec3` inside component render branches instead of using declarative, reusable cinematic camera rigs.
2. **Arbitrary SFX Stacking**: `SceneSFXLayer` spawns independent `<Sequence>` elements for every whoosh and ding, without volume balancing or ducking against background music and voice narration.

### F. Asset Quality Limitations
1. **Low-Poly Catalog Dominance**: `src/assets/catalog.ts` points primarily to low-poly models (Kenney / KayKit game assets: `house1.gltf`, `sedan.gltf`, `dogue.gltf`). While great for dioramas, they lack mechanical fidelity for complex technical explainers (e.g., smartphone capacitive layers, semiconductor gates, internal combustion pistons).
2. **Lack of Procedural 3D Generators**: No reusable procedural Three.js primitives exist for exploded view assemblies, transparent dielectric layers, electromagnetic field lines, or capacitive charge particles.

### G. Rendering Performance Bottlenecks
1. **Rspack & WebGL Resource Management**: While `Config.setRspack(true)` is enabled, complex Three.js scenes with multiple point lights, shadows, and high-density particle meshes require optimized buffer geometries and dispose hooks to prevent memory leaks during long renders.
2. **Frame Format**: `remotion.config.ts` uses `Config.setVideoImageFormat("jpeg")`. While fast, high-contrast text overlays can suffer from JPEG chroma subsampling artifacts compared to PNG during still inspections.

### H. Missing Automated Quality Gates
1. **Zero Automated Visual Inspection**: QA consisted solely of `npm run lint` (`eslint src && tsc`). A video could have completely clipped text, a pitch-black camera view, a missing 3D mesh, or desynchronized narration and still pass linting with 0 errors.
2. **No Contact Sheet Generation**: No utility existed to generate contact sheets across shot boundaries or sampled frames.
3. **No Automated Revision Loop**: When an issue is discovered, there was no structured way to identify the affected shot, produce a remediation plan, and verify the fix.

### I. Conflicting Agent Instructions
1. **`bang-motion` Skill Mismatch**: `.agents/skills/bang-motion` is written for a standalone HTML + CSS + GSAP browser runtime (referencing `index.html`, `scripts/serve.py`, `scripts/export-frames.mjs`, puppeteer). An agent reading this skill would try to write vanilla HTML/GSAP files instead of Remotion React components.
2. **`viral-3d-explainer` Skill Dogma**: `.agents/skills/viral-3d-explainer/SKILL.md` and `.agents/rules/sop-video-explainer.md` locked the agent into the rigid 6-act formula, 13px text stroke, and mandatory comment trigger card.

### J. Opportunities for Reusable Production Components
1. **Cinematic Lighting Rigs**: Reusable Three.js lighting setups (Studio Softbox, Three-Point, Macro Technical, Dramatic Laboratory).
2. **Physical Material Library**: Reusable PBR materials for metals, anodized aluminum, glass/dielectric, emissive plasma/current, rubber, silicon, and matte polymers.
3. **Cinematic Camera Director**: Declarative camera rig supporting Dolly, Orbit, Macro Push, Isometric, and Cutaway tracking.
4. **Modular Explainer Pipeline**: End-to-end CLI/runner that validates project specifications, generates audio with word alignments, builds visual styleframes, renders contact sheets, analyzes frames for text/object clipping, and outputs production reports.

---

## Section 2: Severity Matrix & Corrective Actions

| Issue ID | Area | Finding | Severity | Corrective Action Plan |
|---|---|---|---|---|
| **AUD-01** | Architecture | Monolithic video files & hardcoded cut/ding frames | High | Introduce modular project/shot schema (`schemas/`), audio event manifest, and dynamic scene sequencing. |
| **AUD-02** | Creative | Rigid 6-act formula & forced comment cards | High | Deprecate mandatory 6-act rule in SOP. Support 9 narrative structures (Mystery-Reveal, Inside-the-Machine, Problem-Mechanism-Solution, etc.). Make comment card optional. |
| **AUD-03** | Visual Design | Cluttered viral UI & uniform comic styling | High | Introduce configurable Visual Styles: Technical Explainer, Minimalist Product, Macro Mechanical, Stylized 3D. Respect safe zones. |
| **AUD-04** | Agent Rules | `bang-motion` skill confuses Remotion workflow | Medium | Clarify `bang-motion` as motion-design principle reference only; establish Remotion Studio V2 as primary execution standard. |
| **AUD-05** | Agent Rules | `viral-3d-explainer` enforces dogmatic rules | High | Refactor `viral-3d-explainer` and `sop-video-explainer.md` into comprehensive Studio V2 production standards. |
| **AUD-06** | 3D / R3F | Ad-hoc lighting & materials; lack of technical rigs | Medium | Build `src/studio/lighting/` and `src/studio/materials/` with PBR presets and reusable lighting rigs. |
| **AUD-07** | Cinematography | Imperative lerp math in scene files | Medium | Build `src/studio/cameras/CinematicCamera.tsx` with declarative keyframing and camera easing. |
| **AUD-08** | Audio | Fixed-interval SFX instead of semantic event binding | Medium | Implement semantic audio engine binding whooshes to camera cuts and impacts to visual climax events. |
| **AUD-09** | QA / Engine | QA limited to `npm run lint`; no visual frame inspection | Critical | Implement automated QA engine with frame capture, contact sheet tiling, layout clipping detection, and revision tracking. |
| **AUD-10** | Production | Direct-to-code workflow without pre-production validation | Critical | Build structured staging: Idea → Research → Brief → Script → Storyboard → Styleframes → Production → QA → Revision → Render. |

---

## Section 3: Conclusion & Immediate Roadmap

The audit confirms that the technical foundation (Remotion + Three.js + Edge TTS) is sound, but the production architecture requires an immediate overhaul. We now proceed to:
- **Phase 1**: Define production philosophy, schemas, and state machine contracts.
- **Phase 2 & 3**: Implement creative direction layer, styleframe validation, and visual safe-zone standards.
- **Phase 4 & 5**: Build modular 3D cinematography rigs, materials, cameras, and Remotion studio components.
- **Phase 6 & 7**: Implement intelligent audio engine and automated visual/technical QA engine.
- **Phase 8 & 9**: Build the orchestrated CLI workflow and production runner.
- **Phase 10**: Update all agent SOPs and rules.
- **Phase 11 & 12**: Benchmark BrakeFadeExplainer and produce the new "Cara Kerja Layar Sentuh Smartphone" production test.

