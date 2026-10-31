import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import {
  CommentTriggerCard,
  FloatingBadgePills,
  FloatingBadgeSpec,
  RedCircleSpec,
  RedFocusRings,
  TopHeadlineSpec,
  ViralHeadlineBanner,
  ViralShortsOverlayContainer,
  ViralWordSubtitles,
  WordTiming,
} from "../assets";

const TOP_HEADLINES: TopHeadlineSpec[] = [
  {
    from: 0,
    to: 268,
    line1: "KENAPA REM MOTOR MATIC",
    line2: "BISA BLONG DI TURUNAN?!",
    line2Color: "#facc15",
  },
  {
    from: 268,
    to: 497,
    line1: "PLOT TWIST: BUKAN PUTUS!",
    line2: "MINYAK REMNYA MENDIDIH!",
    line2Color: "#ff5500",
  },
  {
    from: 497,
    to: 834,
    line1: "TAHAP 1: GESEKAN EKSTREM",
    line2: "SUHU CAKRAM >200°C!",
    line2Color: "#ef4444",
  },
  {
    from: 834,
    to: 1175,
    line1: "TAHAP 2: VAPOR LOCK",
    line2: "UAP GAS BIKIN REM AMBLAS!",
    line2Color: "#ef4444",
  },
  {
    from: 1175,
    to: 1349,
    line1: "ITULAH ALASANNYA!",
    line2: "PANTANG TAHAN REM TERUS!",
    line2Color: "#facc15",
  },
  {
    from: 1349,
    to: 1478,
    line1: "REM KOSONG MELOMPONG",
    line2: "TEKANAN HILANG TOTAL!",
    line2Color: "#ef4444",
  },
  {
    from: 1478,
    to: 1620,
    line1: "SOLUSI TEPAT DI TURUNAN:",
    line2: "KOCOK REM BERGANTIAN!",
    line2Color: "#4ade80",
  },
  {
    from: 1620,
    to: 1728,
    line1: "DEBAT NETIZEN:",
    line2: "TURUNAN MANA PALING HOROR?",
    line2Color: "#facc15",
  },
];

const FLOATING_BADGES: FloatingBadgeSpec[] = [
  {
    id: "ramp-hook",
    from: 15,
    to: 130,
    icon: "⚠️",
    text: "JALUR PENYELAMAT REM BLONG",
    x: 540,
    y: 335,
    bgColor: "#fef3c7",
    textColor: "#b45309",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "cable-intact",
    from: 135,
    to: 260,
    icon: "🛵",
    text: "KABEL UTUH TAPI REM KOSONG?",
    x: 540,
    y: 335,
    bgColor: "#fee2e2",
    textColor: "#b91c1c",
    borderColor: "#090d16",
    tilt: 1.2,
  },
  {
    id: "vapor-lock-reveal",
    from: 275,
    to: 490,
    icon: "🔥",
    text: "VAPOR LOCK: MINYAK REM MENDIDIH",
    x: 540,
    y: 335,
    bgColor: "#ffedd5",
    textColor: "#c2410c",
    borderColor: "#090d16",
    tilt: -1.2,
  },
  {
    id: "no-engine-brake",
    from: 510,
    to: 660,
    icon: "⚙️",
    text: "MOTOR MATIC = TANPA ENGINE BRAKE",
    x: 540,
    y: 335,
    bgColor: "#e0f2fe",
    textColor: "#0369a1",
    borderColor: "#090d16",
    tilt: 1.5,
  },
  {
    id: "heat-surge",
    from: 670,
    to: 830,
    icon: "🌡️",
    text: "SUHU GESEKAN TEMBUS >200°C",
    x: 540,
    y: 335,
    bgColor: "#fee2e2",
    textColor: "#dc2626",
    borderColor: "#090d16",
    tilt: -1.8,
  },
  {
    id: "boiling-bubbles",
    from: 845,
    to: 980,
    icon: "🫧",
    text: "MINYAK BERUBAH JADI UAP GAS",
    x: 540,
    y: 335,
    bgColor: "#fef3c7",
    textColor: "#b45309",
    borderColor: "#090d16",
    tilt: 1.2,
  },
  {
    id: "gas-compress",
    from: 990,
    to: 1170,
    icon: "💥",
    text: "GAS BISA DIMAMPATKAN (MEMBAL)",
    x: 540,
    y: 335,
    bgColor: "#fee2e2",
    textColor: "#b91c1c",
    borderColor: "#090d16",
    tilt: -1.4,
  },
  {
    id: "rule-dont-drag",
    from: 1180,
    to: 1345,
    icon: "🚫",
    text: "PANTANG TAHAN REM TERUS-MENERUS!",
    x: 540,
    y: 335,
    bgColor: "#fef08a",
    textColor: "#854d0e",
    borderColor: "#090d16",
    tilt: 1.6,
  },
  {
    id: "zero-pressure",
    from: 1355,
    to: 1475,
    icon: "🚨",
    text: "TEKANAN KALIPER ANJLOK KE 0!",
    x: 540,
    y: 335,
    bgColor: "#fee2e2",
    textColor: "#991b1b",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "solution-cadence",
    from: 1485,
    to: 1615,
    icon: "✅",
    text: "TEKNIK KOCOK DEPAN-BELAKANG",
    x: 540,
    y: 335,
    bgColor: "#dcfce7",
    textColor: "#15803d",
    borderColor: "#090d16",
    tilt: 1.2,
  },
];

const RED_RINGS: RedCircleSpec[] = [
  // Scene 1: Focus on scooter front wheel
  {
    id: "ring-wheel",
    from: 140,
    to: 260,
    x: 540,
    y: 1100,
    size: 260,
  },
  // Scene 3: Focus on glowing red hot brake rotor
  {
    id: "ring-hot-rotor",
    from: 680,
    to: 825,
    x: 540,
    y: 1020,
    size: 320,
  },
  // Scene 4: Focus on boiling vapor bubbles in hose
  {
    id: "ring-boiling-hose",
    from: 860,
    to: 1050,
    x: 600,
    y: 820,
    size: 250,
  },
];

export const BrakeFadeUIOverlay: React.FC = () => {
  const [words, setWords] = useState<WordTiming[]>([]);
  const [handle] = useState(() => delayRender("Loading Brake Fade Metadata"));

  useEffect(() => {
    fetch(staticFile("brake-fade-explainer.json"))
      .then((res) => res.json())
      .then((data) => {
        if (data?.words) {
          setWords(data.words);
        }
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Failed to load brake fade metadata json:", err);
        cancelRender(err);
      });
  }, [handle]);

  return (
    <ViralShortsOverlayContainer>
      {/* 1. Viral Top Headline Banner (Synchronized with 6-Act Formula) */}
      <ViralHeadlineBanner headlines={TOP_HEADLINES} />

      {/* 2. Floating Status Badge Pills */}
      <FloatingBadgePills badges={FLOATING_BADGES} />

      {/* 3. Red Focus Callout Rings */}
      <RedFocusRings circles={RED_RINGS} />

      {/* 4. High-Energy Word-by-Word Kinetic Subtitles */}
      <ViralWordSubtitles words={words} />

      {/* 5. Comment Trigger Card at Finale to explode comment section */}
      <CommentTriggerCard
        from={1620}
        to={1728}
        question="Jalur turunan mana yang paling bikin rem kalian berasa panas?"
        optionA="Pacet / Jalur Cangar"
        optionB="Turunan Bromo / Dieng"
      />
    </ViralShortsOverlayContainer>
  );
};
