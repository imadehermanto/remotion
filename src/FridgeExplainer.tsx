import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BRAND_THEME, SceneSFXLayer } from "./assets";
import { FridgeScene3D } from "./FridgeExplainer/FridgeScene3D";
import { UIOverlay } from "./FridgeExplainer/UIOverlay";

export const FridgeExplainer: React.FC = () => {
  const frame = useCurrentFrame();

  // Dynamic backdrop from Shared Brand Theme
  const isBackEngineeringShot = frame >= 416 && frame < 1313;

  const bgGradient = isBackEngineeringShot
    ? BRAND_THEME.backgrounds.engineeringBlue
    : BRAND_THEME.backgrounds.warmRoom;

  const cutFrames = [45, 172, 416, 561, 715, 971, 1119, 1313];
  const dingFrames = [282, 645, 823, 1185, 1318];

  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        overflow: "hidden",
      }}
    >
      {/* 3D Diorama, Cutaway Fridge, Piston Compressor & Particle Physics */}
      <FridgeScene3D />

      {/* Viral Shorts Typography, Floating Status Pills, Red Focus Rings & Pop Subtitles */}
      <UIOverlay />

      {/* Synchronized Indonesian Voice Over */}
      <Audio src={staticFile("fridge-explainer.mp3")} />

      {/* Shared Channel SFX Layer (Whoosh & Ding on Cuts/Badges) */}
      <SceneSFXLayer cutFrames={cutFrames} dingFrames={dingFrames} />
    </AbsoluteFill>
  );
};

export default FridgeExplainer;
