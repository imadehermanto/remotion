import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BRAND_THEME, SceneSFXLayer } from "./assets";
import { BrakeFadeScene3D } from "./BrakeFadeExplainer/BrakeFadeScene3D";
import { BrakeFadeUIOverlay } from "./BrakeFadeExplainer/BrakeFadeUIOverlay";

export const BrakeFadeExplainer: React.FC = () => {
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

  const cutFrames = [131, 268, 497, 834, 1175, 1349, 1478, 1620];
  const dingFrames = [15, 135, 275, 510, 670, 845, 990, 1180, 1355, 1485, 1620];

  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        overflow: "hidden",
      }}
    >
      {/* 1. 3D Mountain Slope, Runaway Ramp, Glowing Disc Rotor, Caliper & Boiling Fluid */}
      <BrakeFadeScene3D />

      {/* 2. Viral Shorts Typography, Kinetic Subtitles, Badges & Comment Trigger */}
      <BrakeFadeUIOverlay />

      {/* 3. Indonesian Edge TTS Voice-Over (Normal Pacing 0%) */}
      <Audio src={staticFile("brake-fade-explainer.mp3")} />

      {/* 4. High-Energy Backsound Music (Scheming Weasel @ volume 0.16) */}
      <Audio
        src={staticFile("assets/audio/bgm-scheming-weasel.mp3")}
        volume={0.16}
      />

      {/* 5. Channel SFX Layer (Whooshes on Camera Cuts, Dings on Badges) */}
      <SceneSFXLayer cutFrames={cutFrames} dingFrames={dingFrames} />
    </AbsoluteFill>
  );
};

export default BrakeFadeExplainer;

