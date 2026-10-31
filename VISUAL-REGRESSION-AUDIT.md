# REMOTION V2 — VISUAL REGRESSION AUDIT & QUALITY RECOVERY REPORT

**Project ID**: `charger-heat-explainer`  
**Composition ID**: `ChargerHeatExplainer`  
**Branch**: `feature/charger-heat-explainer`  
**Auditor**: Senior Creative Director, 3D Technical Artist & Remotion Motion Designer  
**Date**: October 31, 2026  

---

## 1. Executive Summary & Context

The Remotion V2 architecture overhaul introduced robust engineering scaffolding (Zod schemas, automated pipelines, deterministic QA, audio ducking engines). However, **the visual and editorial output of the newly generated composition suffered a severe regression**:

1. **Automated QA Illusion**: The deterministic QA engine reported `PASSED` because TypeScript compiled, audio durations matched ffprobe, and signalstats luminance fell within 16–235. **Technical compliance was mistaken for visual excellence.**
2. **Primitive Geometry**: The smartphone charger was rendered as a crude, sharp-cornered `boxGeometry` monolith resembling a dark shipping container or Lego block rather than a sleek, modern consumer electronics product.
3. **Severe Camera & Framing Regressions**: Vertical 9:16 portrait aspect ratio ($0.5625$) has a narrow horizontal field of view. Default camera distances caused models to occupy 80–90% of the screen, clipping at the borders, pushing into dark corners, and colliding with headline text.
4. **Visual Collisions & Clutter**: In Shot 5, the 3D thermal safety gauge was shoved directly into the top safe zone, directly obscuring the headline text. In Shot 3, the front faceplate moved directly toward the camera, completely blocking the internal circuit board it was supposed to reveal.

We have conducted a thorough frame-by-frame visual audit, preserved the working V2 architecture, and executed a complete creative overhaul across geometry, materials, lighting, cinematography, and typography.

---

## 2. Forensic Visual Audit (Before vs. After by Shot)

| Shot ID | Frame | Before Regressions (Root Cause) | After Quality Recovery |
| :--- | :--- | :--- | :--- |
| **Shot 1: Hero Overview** | Frame 150 | Murky, underexposed black cube filling 80% of screen. Claustrophobic framing, no specular highlights, callout slapped over faceplate. | Scaled to 0.58 with generous negative space; studio pedestal with contact shadow; glowing cyan power LED; brushed silver chamfer accents; callout positioned in clean lower negative space. |
| **Shot 2: AC 220V Pins** | Frame 500 | Camera pushed into a pitch-black wall; double $180^\circ$ rotation bug caused camera to look at the front rather than the prongs; 80% empty dark void. | Camera and charger aligned so dual nickel-plated cylindrical prongs with insulated collars face the viewer; glowing 3D AC sine wave wraps around the pin; crisp cyan rim highlights define metallic contours. |
| **Shot 3: Exploded SMPS** | Frame 800 | Front faceplate pushed toward camera, completely blocking the circuit board; top and bottom shell slabs covered half the screen; oversized Lego-like cylinders. | Elevated $3/4$ isometric perspective ($X=1.2, Y=2.2, Z=4.2$); front faceplate drops down; top shell ascends, exposing green FR4 PCB, gold circuit traces, micro-transformer with copper coil, and pulsing GaN MOSFET. |
| **Shot 4: Joule Heating** | Frame 1150 | Extreme zoom crammed into toy blocks; huge blurry orange bokeh circles drifting over headline text; untextured green plank. | Macro view focused on transformer and GaN transistor; incandescent red-hot copper windings; golden heat slug; rising caloric micro-particles with natural buoyancy; headline completely unobstructed. |
| **Shot 5: Safety Outro** | Frame 1550 | 3D gauge shoved to $Y=1.4$, directly colliding with and covering headline text; meter clipped by top edge; charger was an untextured red box. | Golden-ratio composition: headline in top safe zone ($Y=230$), 3D gauge cleanly framed in mid-upper area ($Y=0.85$), reassembled charger resting on pedestal in lower-third ($Y=-0.65$), zero text overlap. |

---

## 3. Top 5 Major Creative Improvements Implemented

### Improvement 1: Authentic, Premium Ceramic White Charger Geometry (`PremiumChargerHousing3D`)
- **Action**: Replaced crude monolithic box and dark red casing with authentic **Pristine Ceramic White** (`#ffffff`) GaN fast charger.
- **Details**:
  - Pure Ceramic White chassis (`#ffffff`, `roughness: 0.16, metalness: 0.06`) matching authentic commercial Apple / Anker fast chargers.
  - High-polish silver chrome chamfer trims (`#e2e8f0`, `roughness: 0.12, metalness: 0.90`) catching bright specular highlights.
  - High-fidelity European-standard cylindrical AC prongs in polished nickel silver (`#f1f5f9`, `metalness: 0.65, roughness: 0.15`) with dark slate insulating safety collars (`#1e293b`).
  - Recessed USB-C receptacle with golden contact tongue (`#fbbf24`) and glowing smart status LED indicator ring (`#38bdf8`).
  - Thermal red emission strictly confined to the internal micro-transformer copper coil, GaN power MOSFET, and caloric heat particles—leaving the white outer shell realistic and pristine.

### Improvement 2: High-Key Tech Studio Lighting Rig & Luminous Sapphire Backdrop
- **Action**: Eliminated murky darkness and gloomy backdrops; introduced radiant tech studio illumination and luminous radial vignette.
- **Details**:
  - **Luminous Studio Backdrop**: Replaced pitch-black void with a vibrant electric royal blue spotlight vignette (`radial-gradient(ellipse at 50% 36%, #2563eb 0%, #1d4ed8 22%, #0e2448 55%, #070d18 100%)`), giving maximum visual punch and contrast to the white charger.
  - **Crisp High-Key Ambient Fill**: Raised from `0.42` to `1.05` pure white (`#f8fafc`), ensuring the ceramic white surfaces remain bright, clean, and commercial from every viewing angle.
  - **Top Overhead Directional Light**: Positioned at `[0, 9, 2]` (`intensity: 1.8`) to eliminate grey shadows on top horizontal surfaces.
  - **Key Softbox Light**: Positioned at `[4, 7, 6]` (`intensity: 2.4`) producing clean specular highlights.
  - **Electric Cyan Rim Light**: Positioned at `[-6, 5, -4]` (`intensity: 2.6`, `#38bdf8`) providing razor-sharp edge separation.
  - **Seamless Contact Shadow**: Replaced the opaque dark blue floor disc with a soft, translucent shadow plane (`opacity: 0.32`), unifying the entire 9:16 vertical composition.

### Improvement 3: 9:16 Vertical Cinematography & Golden-Ratio Negative Space
- **Action**: Corrected camera FOV and distance distortions inherent to portrait orientation ($0.5625$ aspect ratio).
- **Details**:
  - Scaled charger group to $0.58$, keeping subject within $45\%$ of screen width and reserving $55\%$ for breathing room, typography, and HUD callouts.
  - Re-anchored camera coordinates across all 5 shots with smooth cubic-bezier transitions.
  - In Shot 5 (Outro), scaled the 3D gauge by 18% to `scale={0.82}` and lowered position to $Y = 0.45$, with the charger resting at $Y = -0.62$, establishing clear negative space between the top headline, the dial needle, and the product.

### Improvement 4: High-Fidelity Internal SMPS Circuit Board (`HighDetailSMPSCircuit3D`)
- **Action**: Replaced toy-like blocks with an intricate technical cutaway.
- **Details**:
  - Multi-layer FR4 PCB with metallic gold and copper circuit traces.
  - High-frequency ferrite E-core micro-transformer with multi-layered copper coil windings and yellow Kapton insulating tape.
  - GaNFast power switching IC with metallic gold thermal slug and 6 solder lead pins.
  - Aluminum heatsink with stamped cooling fins.
  - Dual primary (400V electrolytic) and secondary (solid polymer) filter capacitors with etched top vents.
  - Procedural array of surface-mount components (SMD chips, ceramic caps, diodes).

### Improvement 5: Strategic Visual Hierarchy & Typography Layout
- **Action**: Redesigned UI overlay coordinates and kinetic subtitle pacing.
- **Details**:
  - Headlines anchored strictly to `LAYOUT.headlineTop` ($230$px) with pop spring animations.
  - Technical callouts shifted out of the center and into dedicated negative space beside components with high-contrast badge styling.
  - Subtitles positioned safely in bottom margin ($Y = 1500$px) with dynamic active-word illumination (`#f97316`).

---

## 4. Latest Overhaul: Creative 3D Room Environment & In-Depth Script Revision

Following user feedback:
> *"saya ga suka bgnya yang biru saya, harusnya lebih kreatif, kyk bg ruangan tapi fokusnya tetap ke charger, terus kurang juga penjelasannya kyk nanggung"*

We executed a comprehensive creative environment and editorial overhaul:

### 1. Creative 3D Room & Aesthetic Desk Environment (`CreativeRoomEnvironment3D`)
- **Action**: Completely replaced the flat blue spotlight gradient with an authentic, lived-in 3D tech workspace interior while maintaining absolute focus on the charger.
- **Details**:
  - **Scandinavian Oak Desk**: Solid wood desk surface (`#45311f`) with front chamfer and dark slate felt desk mat (`#181f28`) centered under the charger.
  - **Cozy Ambient Lamp**: Minimalist Scandinavian brass stem lamp on the midground right ($X = +1.35$) emitting a warm golden glow (`#f59e0b`, intensity 3.8), creating depth and lifestyle warmth.
  - **Minimalist Plant**: Matte white ceramic pot with natural sage-green succulent foliage on the midground left ($X = -1.35$), balancing the composition.
  - **Architectural Japandi Wall**: Textured matte interior wall with fluted wood acoustic slats on the left accent wall and a floating minimalist shelf on the right.
  - **Subject Isolation**: The room background stays warmly diffused and moody (30–40% ambient light), while the Ceramic White charger in the foreground receives a dedicated crisp white studio softbox key light (`#ffffff`, intensity 2.2) and cyan rim accent (`#38bdf8`), guaranteeing that the viewer's eyes stay 100% focused on the charger.

### 2. Comprehensive Educational Script (Eliminating "Nanggung" Explanations)
- **Problem**: Previous script only mentioned 220V to 5V and general heat loss, leaving viewers wondering why modern chargers get hotter, when heat peaks, and what practical precautions to take.
- **Solution**: Re-authored the entire narration to answer the core questions thoroughly:
  1. **Extreme Voltage Step-Down**: 220V wild AC to 5V–9V DC inside a tiny handheld enclosure.
  2. **Modern GaN Technology**: Gallium Nitride power MOSFETs switching over 100,000 times per second to squeeze out 90% efficiency.
  3. **Peak Current Phase (Why it gets hottest at start)**: Explaining that during low battery charge (0–50%), the charger draws peak amperage causing maximal Joule heating ($I^2R$), which then naturally cools down as the battery approaches 100%.
  4. **The Casing as Heatsink**: Emphasizing that a warm outer body is actually an intentional safety mechanism dissipating calories outward so internal chips never overheat.
  5. **Actionable Safety Habits**: Explicitly warning against charging on beds/pillows (which trap heat), affirming 40°C–55°C as safe fast charging, and advising disconnection at >65°C or burning smells.
- **Duration**: Expanded composition to 2215 frames (~73.8 seconds at 30fps) with Edge TTS Indonesian voice *ArdiNeural*, matching word-level kinetic subtitles and dynamic storyboard camera waypoints.

---

## 5. Technical QA vs. Semantic Creative Review Separation

To prevent future regressions where an automated script falsely certifies poor visuals as "perfect", QA is now explicitly separated into two independent tiers:

1. **Automated Technical QA (Deterministic Gate)**:
   - ESLint & TypeScript compilation ($0$ errors).
   - Physical asset existence and non-zero byte size verification.
   - Timeline synchronization via `ffprobe` (video duration $\ge$ audio duration, buffer $\le 15$ frames).
   - Luminance and black-frame detection via FFmpeg `signalstats` ($16 \le Y \le 235$).
   - Mathematical safe-zone boundary checks.
2. **Semantic Creative QA (Visual Director Gate)**:
   - **Must inspect actual rendered frames / contact sheet.**
   - Evaluates product realism, material reflections, camera framing, subject occlusion, and visual elegance.
   - If vision-capable AI is not connected in headless mode, **status must explicitly be recorded as `not_evaluated` with reference to the human inspection artifact** (`contact-sheet.png`).
   - Technical PASS **never** implies creative clearance.

---

## 5. Artifact Verification

- **Before Contact Sheet**: `out/audit/before/contact-sheet.png`
- **After Contact Sheet**: `out/audit/after/contact-sheet.png`
- **Side-by-Side Comparisons**:
  - Shot 1 (Hero Reveal): `out/audit/comparisons/shot-1-comparison.png`
  - Shot 2 (AC Voltage Step-Down): `out/audit/comparisons/shot-2-comparison.png`
  - Shot 3 (SMPS Internal Anatomy): `out/audit/comparisons/shot-3-comparison.png`
  - Shot 4 (Joule Heating Thermal Flux): `out/audit/comparisons/shot-4-comparison.png`
  - Shot 5 (Safety Gauge Outro): `out/audit/comparisons/shot-5-comparison.png`
- **Final Production Video**: `out/ChargerHeatExplainer.mp4`

