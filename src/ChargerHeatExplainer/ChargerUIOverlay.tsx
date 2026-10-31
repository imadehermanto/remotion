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
    const accentColors = ["#f97316", "#38bdf8", "#fbbf24", "#f97316", "#22c55e"];
    return storyboard.shots.map((shot, idx) => ({
      fromFrame: shot.startFrame,
      toFrame: shot.endFrame,
      title: shot.textOverlay.headline,
      subtitle: shot.textOverlay.subheadline,
      accentColor: accentColors[idx % accentColors.length],
    }));
  }, []);

  // 2. Precision Technical Callouts derived directly from Storyboard (SSOT)
  // Placed in negative space away from 3D models to eliminate visual clutter
  const callouts: TechnicalCalloutSpec[] = useMemo(() => {
    const s1 = storyboard.shots[0];
    const s2 = storyboard.shots[1];
    const s3 = storyboard.shots[2];
    const s4 = storyboard.shots[3];
    const s5 = storyboard.shots[4];

    return [
      // Shot 1: Hero Adapter Callout (below floating charger)
      {
        id: "callout-shot-1",
        fromFrame: s1.startFrame + 25,
        toFrame: s1.endFrame - 20,
        x: 540,
        y: 1260,
        label: s1.textOverlay.calloutLabel,
        detail: s1.textOverlay.technicalBadge,
        accentColor: "#f97316",
      },
      // Shot 2: AC 220V Input Pin (placed to the left beside prongs)
      {
        id: "callout-shot-2",
        fromFrame: s2.startFrame + 25,
        toFrame: s2.endFrame - 20,
        x: 360,
        y: 920,
        label: s2.textOverlay.calloutLabel,
        detail: s2.textOverlay.technicalBadge,
        accentColor: "#38bdf8",
      },
      // Shot 3: SMPS Switching Anatomy (placed cleanly below exploded PCB)
      {
        id: "callout-shot-3",
        fromFrame: s3.startFrame + 30,
        toFrame: s3.endFrame - 20,
        x: 540,
        y: 1180,
        label: s3.textOverlay.calloutLabel,
        detail: s3.textOverlay.technicalBadge,
        accentColor: "#fbbf24",
      },
      // Shot 4: Joule Heating Losses (placed in clean lower-right)
      {
        id: "callout-shot-4",
        fromFrame: s4.startFrame + 30,
        toFrame: s4.endFrame - 20,
        x: 540,
        y: 1120,
        label: s4.textOverlay.calloutLabel,
        detail: s4.textOverlay.technicalBadge,
        accentColor: "#ef4444",
      },
      // Shot 5: Thermal Safety Threshold (placed below reassembled charger)
      {
        id: "callout-shot-5",
        fromFrame: s5.startFrame + 30,
        toFrame: s5.endFrame - 20,
        x: 540,
        y: 1360,
        label: s5.textOverlay.calloutLabel,
        detail: s5.textOverlay.technicalBadge,
        accentColor: "#22c55e",
      },
    ];
  }, []);

  return (
    <>
      {/* 1. Safe-Zone Compliant Modern Studio Headline */}
      <StudioHeadline headlines={headlines} />

      {/* 2. Precision Technical Callouts with Strategic Coordinates */}
      <StudioTechnicalCallout callouts={callouts} />

      {/* 3. Word-by-Word Kinetic Subtitles in Bottom Safe Area */}
      <StudioKineticSubtitles
        words={voiceData.words}
        wordsPerPhrase={4}
        styleMode="HighContrastPill"
        accentColor="#f97316"
      />
    </>
  );
};
