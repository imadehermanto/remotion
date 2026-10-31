import React, { useMemo } from "react";
import storyboard from "../../projects/touchscreen-explainer/storyboard.json";
import voiceData from "../../public/touchscreen-explainer.json";
import {
  HeadlineSpec,
  StudioHeadline,
  StudioKineticSubtitles,
  StudioTechnicalCallout,
  TechnicalCalloutSpec,
} from "../studio/typography/ModernTypography";

export const TouchscreenUIOverlay: React.FC = () => {
  // 1. Derive headlines directly from Storyboard shots (SSOT)
  const headlines: HeadlineSpec[] = useMemo(() => {
    const accentColors = ["#38bdf8", "#f59e0b", "#00f2fe", "#38bdf8", "#34d399"];
    return storyboard.shots.map((shot, idx) => ({
      fromFrame: shot.startFrame,
      toFrame: shot.endFrame,
      title: shot.textOverlay.headline,
      subtitle: shot.textOverlay.subheadline,
      accentColor: accentColors[idx % accentColors.length],
    }));
  }, []);

  // 2. Derive callouts directly from Storyboard shots (SSOT)
  const callouts: TechnicalCalloutSpec[] = useMemo(() => {
    const list: TechnicalCalloutSpec[] = [];
    storyboard.shots.forEach((shot) => {
      if (shot.callouts) {
        list.push(...(shot.callouts as TechnicalCalloutSpec[]));
      }
    });
    return list;
  }, []);

  return (
    <>
      {/* 1. Safe-Zone Compliant Modern Headline */}
      <StudioHeadline headlines={headlines} />

      {/* 2. Precision Technical Callouts */}
      <StudioTechnicalCallout callouts={callouts} />

      {/* 3. Word-by-Word Kinetic Subtitles */}
      <StudioKineticSubtitles
        words={voiceData.words}
        wordsPerPhrase={4}
        styleMode="HighContrastPill"
        accentColor="#38bdf8"
      />
    </>
  );
};
