import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import voiceData from "../public/touchscreen-explainer.json";
import { StudioAudioEngine } from "./studio/audio/AudioEngine";
import { AudioTimingManifest } from "./studio/schemas/qa";
import { TouchscreenScene3D } from "./TouchscreenExplainer/TouchscreenScene3D";
import { TouchscreenUIOverlay } from "./TouchscreenExplainer/TouchscreenUIOverlay";

export const TouchscreenExplainer: React.FC = () => {
  const frame = useCurrentFrame();

  // Dynamic subtle gradient based on electrostatic tension
  let bgGradient = "linear-gradient(180deg, #090d16 0%, #0f172a 100%)";
  if (frame >= 612 && frame < 971) {
    // Electric field cyan tint
    bgGradient = "linear-gradient(180deg, #06111f 0%, #0b1a2e 100%)";
  } else if (frame >= 971 && frame < 1320) {
    // Touch charge absorption amber/cyan glow
    bgGradient = "linear-gradient(180deg, #090d16 0%, #111c38 100%)";
  }

  const audioManifest: AudioTimingManifest = {
    projectId: "touchscreen-explainer",
    voiceFile: "touchscreen-explainer.mp3",
    voiceProvider: "EdgeTTS",
    voiceName: voiceData.voice,
    fps: 30,
    totalDurationMs: voiceData.totalDurationMs,
    totalDurationFrames: voiceData.totalDurationFrames,
    sentences: voiceData.sentences,
    words: voiceData.words,
    bgm: {
      file: "assets/audio/bgm-scheming-weasel.mp3",
      volume: 0.12,
      fadeInFrames: 25,
      fadeOutFrames: 50,
    },
    sfxEvents: [
      { id: "sfx-intro", file: "assets/sfx/swoosh.wav", triggerFrame: 8, volume: 0.28 },
      { id: "sfx-cutaway", file: "assets/sfx/pop.wav", triggerFrame: 260, volume: 0.35 },
      { id: "sfx-riser", file: "assets/sfx/riser.wav", triggerFrame: 620, volume: 0.22 },
      { id: "sfx-impact", file: "assets/sfx/impact.wav", triggerFrame: 1030, volume: 0.42 },
      { id: "sfx-tick", file: "assets/sfx/tick.wav", triggerFrame: 1340, volume: 0.3 },
      { id: "sfx-ding", file: "assets/sfx/ding.wav", triggerFrame: 1620, volume: 0.32 },
    ],
  };

  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        overflow: "hidden",
      }}
    >
      {/* 1. 3D Smartphone & Microscopic Capacitive Sensor Grid */}
      <TouchscreenScene3D />

      {/* 2. Safe-Zone Compliant UI, Technical Callouts & Kinetic Subtitles */}
      <TouchscreenUIOverlay />

      {/* 3. Studio Audio Engine (Voice, Ducked BGM, and Event-Bound SFX) */}
      <StudioAudioEngine manifest={audioManifest} />
    </AbsoluteFill>
  );
};

export default TouchscreenExplainer;

