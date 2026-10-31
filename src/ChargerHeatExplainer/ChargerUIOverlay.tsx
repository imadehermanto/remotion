import React, { useMemo } from "react";
import storyboard from "../../projects/charger-heat-explainer/storyboard.json";
import voiceData from "../../public/charger-heat-explainer.json";
import {
  HeadlineSpec,
  StudioHeadline,
  StudioKineticSubtitles,
  StudioTechnicalCallout,
  TechnicalCalloutSpec,
} from "../studio/typography/ModernTypography";

export const ChargerUIOverlay: React.FC = () => {
  // 1. Derive headlines directly from Storyboard shots (SSOT)
  const headlines: HeadlineSpec[] = useMemo(() => {
    const accentColors = ["#f97316", "#38bdf8", "#fbbf24", "#ef4444", "#22c55e"];
    return storyboard.shots.map((shot, idx) => ({
      fromFrame: shot.startFrame,
      toFrame: shot.endFrame,
      title: shot.textOverlay.headline,
      subtitle: shot.textOverlay.subheadline,
      accentColor: accentColors[idx % accentColors.length],
    }));
  }, []);

  // 2. Derive precision technical callouts from Storyboard shots (SSOT)
  const callouts: TechnicalCalloutSpec[] = useMemo(() => {
    return storyboard.shots.map((shot, idx) => {
      const colors = ["#f97316", "#38bdf8", "#fbbf24", "#ef4444", "#22c55e"];
      // Place callout safely in mid-lower section below 3D hero center
      const yPos = idx === 1 ? 980 : idx === 2 ? 1120 : 1080;
      return {
        id: `callout-${shot.shotId}`,
        fromFrame: shot.startFrame + 15,
        toFrame: shot.endFrame - 10,
        x: 540,
        y: yPos,
        label: shot.textOverlay.calloutLabel || "STATUS",
        detail: shot.textOverlay.technicalBadge || "",
        accentColor: colors[idx % colors.length],
      };
    });
  }, []);

  return (
    <>
      {/* 1. Safe-Zone Compliant Modern Studio Headline */}
      <StudioHeadline headlines={headlines} />

      {/* 2. Precision Technical Callouts */}
      <StudioTechnicalCallout callouts={callouts} />

      {/* 3. Word-by-Word Kinetic Subtitles */}
      <StudioKineticSubtitles
        words={voiceData.words}
        wordsPerPhrase={4}
        styleMode="HighContrastPill"
        accentColor="#f97316"
      />
    </>
  );
};

