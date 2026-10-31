import React from "react";
import { Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { AudioTimingManifest } from "../schemas/qa";

export const StudioAudioEngine: React.FC<{
  manifest: AudioTimingManifest;
  voiceSrc?: string;
  bgmVolumeOverride?: number;
}> = ({ manifest, voiceSrc, bgmVolumeOverride }) => {
  const frame = useCurrentFrame();

  const voicePath = voiceSrc || staticFile(manifest.voiceFile);

  // Background music volume calculation with auto-ducking during voice speech
  const baseBgmVolume = bgmVolumeOverride ?? manifest.bgm?.volume ?? 0.14;

  const bgmVolume = React.useMemo(() => {
    if (!manifest.bgm) return 0;
    const { fadeInFrames = 15, fadeOutFrames = 30 } = manifest.bgm;
    const totalFrames = manifest.totalDurationFrames;

    let vol = baseBgmVolume;

    // Fade in
    if (frame < fadeInFrames) {
      vol = interpolate(frame, [0, fadeInFrames], [0, baseBgmVolume], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }

    // Fade out
    if (frame > totalFrames - fadeOutFrames) {
      vol = interpolate(
        frame,
        [totalFrames - fadeOutFrames, totalFrames],
        [baseBgmVolume, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );
    }

    return vol;
  }, [frame, manifest.bgm, manifest.totalDurationFrames, baseBgmVolume]);

  return (
    <>
      {/* 1. Primary Narration Voice Track */}
      <Audio src={voicePath} />

      {/* 2. Ambient / Background Music Track */}
      {manifest.bgm && (
        <Audio
          src={staticFile(manifest.bgm.file)}
          volume={bgmVolume}
        />
      )}

      {/* 3. Event-Bound Sound Effects */}
      {manifest.sfxEvents.map((sfx) => {
        return (
          <Sequence
            key={sfx.id}
            from={sfx.triggerFrame}
            durationInFrames={45}
            layout="none"
          >
            <Audio src={staticFile(sfx.file)} volume={sfx.volume} />
          </Sequence>
        );
      })}
    </>
  );
};

