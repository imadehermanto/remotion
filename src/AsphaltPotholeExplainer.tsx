import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BRAND_THEME, SceneSFXLayer } from "./assets";
import { PotholeScene3D } from "./AsphaltPotholeExplainer/PotholeScene3D";
import { PotholeUIOverlay } from "./AsphaltPotholeExplainer/PotholeUIOverlay";

export const AsphaltPotholeExplainer: React.FC = () => {
  const frame = useCurrentFrame();

  // Dynamic backdrop from Shared Brand Theme
  const isCrossSectionFocus = frame >= 468 && frame < 1400;
  const bgGradient = isCrossSectionFocus
    ? BRAND_THEME.backgrounds.engineeringBlue
    : BRAND_THEME.backgrounds.rainyOvercast;

  const cutFrames = [188, 468, 633, 809, 1044, 1181, 1400];
  const dingFrames = [302, 640, 1046, 1225, 1408];

  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        overflow: "hidden",
      }}
    >
      {/* 3D Road Cross-Section, Vehicles, Seeping Water, Cavity & Worker */}
      <PotholeScene3D />

      {/* Viral Shorts Typography, Floating Status Pills, Red Focus Rings & Pop Subtitles */}
      <PotholeUIOverlay />

      {/* Synchronized Indonesian Voice Over */}
      <Audio src={staticFile("pothole-explainer.mp3")} />

      {/* Shared Channel SFX Layer (Whoosh & Ding on Cuts/Badges) */}
      <SceneSFXLayer cutFrames={cutFrames} dingFrames={dingFrames} />
    </AbsoluteFill>
  );
};

export default AsphaltPotholeExplainer;

