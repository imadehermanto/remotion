import React from "react";
import voiceData from "../../public/touchscreen-explainer.json";
import {
  HeadlineSpec,
  StudioHeadline,
  StudioKineticSubtitles,
  StudioTechnicalCallout,
  TechnicalCalloutSpec,
} from "../studio/typography/ModernTypography";

export const TouchscreenUIOverlay: React.FC = () => {
  const headlines: HeadlineSpec[] = [
    {
      fromFrame: 0,
      toFrame: 251,
      title: "KENAPA LAYAR HP CUMA MERESPONS JARI?",
      subtitle: "Bukan Panas, Bukan Tekanan",
      accentColor: "#38bdf8",
    },
    {
      fromFrame: 251,
      toFrame: 612,
      title: "ANATOMI LAYAR KAPASITIF",
      subtitle: "Elektroda Transparan Indium Tin Oxide",
      accentColor: "#f59e0b",
    },
    {
      fromFrame: 612,
      toFrame: 971,
      title: "MEDAN ELEKTROSTATIK STABIL",
      subtitle: "Kisi-Kisi Matriks Sumbu X & Y",
      accentColor: "#00f2fe",
    },
    {
      fromFrame: 971,
      toFrame: 1320,
      title: "DISTORSI MEDAN LISTRIK",
      subtitle: "Jari Manusia Menyerap Muatan",
      accentColor: "#38bdf8",
    },
    {
      fromFrame: 1320,
      toFrame: 1700,
      title: "PEMETAAN KOORDINAT SENTUHAN",
      subtitle: "Kuku & Plastik = Isolator Listrik",
      accentColor: "#34d399",
    },
  ];

  const callouts: TechnicalCalloutSpec[] = [
    {
      id: "callout-ito",
      fromFrame: 320,
      toFrame: 580,
      label: "Indium Tin Oxide (ITO)",
      sublabel: "Tebal < 100 nm, 90% Transparan",
      x: 320,
      y: 780,
      accentColor: "#f59e0b",
    },
    {
      id: "callout-delta",
      fromFrame: 1040,
      toFrame: 1280,
      label: "Delta Kapasitansi (ΔC)",
      sublabel: "Penurunan Muatan Lokal -3.8%",
      x: 340,
      y: 720,
      accentColor: "#38bdf8",
    },
    {
      id: "callout-coords",
      fromFrame: 1360,
      toFrame: 1600,
      label: "Koordinat Titik Sentuh",
      sublabel: "X: 540 | Y: 960 (480 Hz Scan)",
      x: 340,
      y: 740,
      accentColor: "#34d399",
    },
  ];

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

