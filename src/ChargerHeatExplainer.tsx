import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import storyboard from "../projects/charger-heat-explainer/storyboard.json";
import voiceData from "../public/charger-heat-explainer.json";
import { ChargerScene3D } from "./ChargerHeatExplainer/ChargerScene3D";
import { ChargerUIOverlay } from "./ChargerHeatExplainer/ChargerUIOverlay";
import { StudioAudioEngine } from "./studio/audio/AudioEngine";
import { AudioTimingManifest } from "./studio/schemas/qa";

export const ChargerHeatExplainer: React.FC = () => {
  const frame = useCurrentFrame();

  const shotJoule = storyboard.shots[3];
  const shotSafety = storyboard.shots[4];

  // Dynamic cinematic background gradient reflecting thermal state
  let bgGradient = "linear-gradient(180deg, #090c15 0%, #0f172a 100%)";
  if (frame >= shotJoule.startFrame && frame < shotJoule.endFrame) {
    // Thermal heat emission warm tint
    bgGradient = "linear-gradient(180deg, #180d0d 0%, #1c0e0b 50%, #0f172a 100%)";
  } else if (frame >= shotSafety.startFrame) {
    // Safety evaluation technical studio ambient
    bgGradient = "linear-gradient(180deg, #0b1514 0%, #0d1e1c 50%, #090d16 100%)";
  }

  // Audio Timing Manifest derived directly from storyboard.json (SSOT)
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
      voiceFile: "charger-heat-explainer.mp3",
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
      {/* 1. 3D Charger Adapter, SMPS Exploded Internals & Thermal Dissipation */}
      <ChargerScene3D />

      {/* 2. Safe-Zone Compliant UI, Technical Callouts & Kinetic Subtitles */}
      <ChargerUIOverlay />

      {/* 3. Studio Audio Engine (Voice, Auto-Ducked BGM, Event-Bound SFX) */}
      <StudioAudioEngine manifest={audioManifest} />
    </AbsoluteFill>
  );
};

export default ChargerHeatExplainer;

