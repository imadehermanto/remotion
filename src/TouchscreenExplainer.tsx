import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import storyboard from "../projects/touchscreen-explainer/storyboard.json";
import voiceData from "../public/touchscreen-explainer.json";
import { StudioAudioEngine } from "./studio/audio/AudioEngine";
import { AudioTimingManifest } from "./studio/schemas/qa";
import { TouchscreenScene3D } from "./TouchscreenExplainer/TouchscreenScene3D";
import { TouchscreenUIOverlay } from "./TouchscreenExplainer/TouchscreenUIOverlay";

export const TouchscreenExplainer: React.FC = () => {
  const frame = useCurrentFrame();

  const shotField = storyboard.shots[2];
  const shotTouch = storyboard.shots[3];

  // Dynamic subtle gradient based on electrostatic tension derived from storyboard shots
  let bgGradient = "linear-gradient(180deg, #090d16 0%, #0f172a 100%)";
  if (frame >= shotField.startFrame && frame < shotField.endFrame) {
    // Electric field cyan tint
    bgGradient = "linear-gradient(180deg, #06111f 0%, #0b1a2e 100%)";
  } else if (frame >= shotTouch.startFrame && frame < shotTouch.endFrame) {
    // Touch charge absorption amber/cyan glow
    bgGradient = "linear-gradient(180deg, #090d16 0%, #111c38 100%)";
  }

  // Audio Manifest derived directly from storyboard.json (SSOT)
  const audioManifest: AudioTimingManifest = useMemo(() => {
    const sfxEvents: {
      id: string;
      file: string;
      triggerFrame: number;
      volume: number;
      description?: string;
    }[] = [];

    storyboard.shots.forEach((shot) => {
      shot.soundEffects.forEach((sfx, idx) => {
        sfxEvents.push({
          id: `${shot.shotId}-${sfx.cue}-${idx}`,
          file: sfx.soundFile,
          triggerFrame: shot.startFrame + sfx.triggerFrameOffset,
          volume: sfx.volume,
          description: sfx.cue,
        });
      });
    });

    return {
      projectId: storyboard.projectId,
      voiceFile: "touchscreen-explainer.mp3",
      voiceProvider: "EdgeTTS",
      voiceName: voiceData.voice,
      fps: storyboard.fps,
      totalDurationMs: voiceData.totalDurationMs,
      totalDurationFrames: storyboard.totalFrames,
      sentences: voiceData.sentences,
      words: voiceData.words,
      bgm: {
        file: "assets/audio/bgm-scheming-weasel.mp3",
        volume: 0.12,
        fadeInFrames: 25,
        fadeOutFrames: 50,
      },
      sfxEvents,
    };
  }, []);

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

      {/* 3. Studio Audio Engine (Voice, Ducked BGM, and Event-Bound SFX from Storyboard) */}
      <StudioAudioEngine manifest={audioManifest} />
    </AbsoluteFill>
  );
};

export default TouchscreenExplainer;
