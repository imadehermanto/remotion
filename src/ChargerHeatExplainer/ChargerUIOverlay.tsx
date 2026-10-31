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

  // 2. Precision Technical Callouts with Strategic Layout Positioning
  // Placed in negative space away from 3D models to eliminate visual clutter
  const callouts: TechnicalCalloutSpec[] = useMemo(() => {
    return [
      // Shot 1: Hero Adapter Callout (below floating charger)
      {
        id: "callout-shot-1",
        fromFrame: 25,
        toFrame: 325,
        x: 540,
        y: 1260,
        label: "ADAPTOR SMARTPHONE",
        detail: "DISIPASI DAYA",
        accentColor: "#f97316",
      },
      // Shot 2: AC 220V Input Pin (placed to the left beside prongs)
      {
        id: "callout-shot-2",
        fromFrame: 355,
        toFrame: 650,
        x: 360,
        y: 920,
        label: "INPUT PIN 220V AC",
        detail: "STEP DOWN TO 5V-9V",
        accentColor: "#38bdf8",
      },
      // Shot 3: SMPS Switching Anatomy (placed cleanly below exploded PCB)
      {
        id: "callout-shot-3",
        fromFrame: 690,
        toFrame: 940,
        x: 540,
        y: 1180,
        label: "GaN MOSFET SWITCHING",
        detail: "100.000x / DETIK",
        accentColor: "#fbbf24",
      },
      // Shot 4: Joule Heating Losses (placed in clean lower-right)
      {
        id: "callout-shot-4",
        fromFrame: 980,
        toFrame: 1330,
        x: 540,
        y: 1120,
        label: "JOULE HEATING LOSSES (I²R)",
        detail: "EFISIENSI 85-90%",
        accentColor: "#ef4444",
      },
      // Shot 5: Thermal Safety Threshold (placed below reassembled charger)
      {
        id: "callout-shot-5",
        fromFrame: 1380,
        toFrame: 1780,
        x: 540,
        y: 1360,
        label: "THERMAL DISSIPATION",
        detail: "SAFETY THRESHOLD",
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
