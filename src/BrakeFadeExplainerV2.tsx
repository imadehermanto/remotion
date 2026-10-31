import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BRAND_THEME, SceneSFXLayer } from "./assets";
import { BrakeFadeScene3D } from "./BrakeFadeExplainer/BrakeFadeScene3D";
import { BrakeFadeUIOverlayV2 } from "./BrakeFadeExplainer/BrakeFadeUIOverlayV2";

export const BrakeFadeExplainerV2: React.FC = () => {
  const frame = useCurrentFrame();

  // Dynamic backdrop based on scene tension
  let bgGradient: string = BRAND_THEME.backgrounds.mountainSlope;
  if (frame >= 497 && frame < 834) {
    bgGradient = BRAND_THEME.backgrounds.dangerRed;
  } else if (frame >= 834 && frame < 1175) {
    bgGradient = BRAND_THEME.backgrounds.microscopeDark;
  } else if (frame >= 1175 && frame < 1478) {
    bgGradient = BRAND_THEME.backgrounds.mountainSlope;
  } else if (frame >= 1478) {
    bgGradient = BRAND_THEME.backgrounds.engineeringBlue;
  }

  // Event-bound cut and ding frames matching storyboard cuts
  const cutFrames = [131, 268, 497, 834, 1175, 1349, 1478];
  const dingFrames = [510, 850, 1500];

  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        overflow: "hidden",
      }}
    >
      {/* 1. 3D Mountain Slope, Runaway Ramp, Glowing Disc Rotor, Caliper & Boiling Fluid */}
      <BrakeFadeScene3D />

      {/* 2. Studio V2 Modern Safe-Zone Typography & Precision Callouts (No Clutter) */}
      <BrakeFadeUIOverlayV2 />

      {/* 3. Indonesian Edge TTS Voice-Over */}
      <Audio src={staticFile("brake-fade-explainer.mp3")} />

      {/* 4. Ambient Backsound Music */}
      <Audio
        src={staticFile("assets/audio/bgm-scheming-weasel.mp3")}
        volume={0.14}
      />

      {/* 5. Channel SFX Layer */}
      <SceneSFXLayer cutFrames={cutFrames} dingFrames={dingFrames} />
    </AbsoluteFill>
  );
};

export default BrakeFadeExplainerV2;

