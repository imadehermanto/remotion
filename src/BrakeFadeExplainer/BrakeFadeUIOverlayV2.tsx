import React from "react";
import voiceData from "../../public/brake-fade-explainer.json";
import {
  HeadlineSpec,
  StudioHeadline,
  StudioKineticSubtitles,
  StudioTechnicalCallout,
  TechnicalCalloutSpec,
} from "../studio/typography/ModernTypography";

export const BrakeFadeUIOverlayV2: React.FC = () => {
  const headlines: HeadlineSpec[] = [
    {
      fromFrame: 0,
      toFrame: 268,
      title: "KENAPA REM MOTOR MATIC BISA BLONG?",
      subtitle: "Bukan Selang Putus, Tapi Fenomena Fisika",
      accentColor: "#facc15",
    },
    {
      fromFrame: 268,
      toFrame: 497,
      title: "ANATOMI SISTEM CAKRAM",
      subtitle: "Suhu Minyak Rem Melampaui Batas Didih",
      accentColor: "#f97316",
    },
    {
      fromFrame: 497,
      toFrame: 834,
      title: "GESEKAN EKSTREM DI TURUNAN",
      subtitle: "Temperatur Rotor Mencapai >200°C",
      accentColor: "#ef4444",
    },
    {
      fromFrame: 834,
      toFrame: 1175,
      title: "FENOMENA VAPOR LOCK",
      subtitle: "Gelembung Uap Mengompresi Tekanan Hidrolis",
      accentColor: "#ef4444",
    },
    {
      fromFrame: 1175,
      toFrame: 1478,
      title: "HILANGNYA GAYA PENGEREMAN",
      subtitle: "Tuas Rem Amblas Tanpa Hambatan",
      accentColor: "#facc15",
    },
    {
      fromFrame: 1478,
      toFrame: 1728,
      title: "SOLUSI: TEKNIK CADENCE BRAKING",
      subtitle: "Kocok Rem Berirama Beri Waktu Pendinginan",
      accentColor: "#38bdf8",
    },
  ];

  const callouts: TechnicalCalloutSpec[] = [
    {
      id: "callout-rotor-temp",
      fromFrame: 520,
      toFrame: 810,
      label: "Temperatur Rotor > 200°C",
      sublabel: "Energi Kinetik Menjadi Panas Ekstrem",
      x: 340,
      y: 720,
      accentColor: "#ef4444",
    },
    {
      id: "callout-vapor-lock",
      fromFrame: 860,
      toFrame: 1140,
      label: "Vapor Lock: Gelembung Uap",
      sublabel: "Gas Bersifat Kompresibel (Tekanan Drop)",
      x: 340,
      y: 700,
      accentColor: "#f97316",
    },
    {
      id: "callout-cadence",
      fromFrame: 1500,
      toFrame: 1710,
      label: "Cadence Braking",
      sublabel: "Lepas-Tekan Rem untuk Pelepasan Panas",
      x: 340,
      y: 720,
      accentColor: "#38bdf8",
    },
  ];

  return (
    <>
      {/* 1. Safe-Zone Compliant Modern Headline */}
      <StudioHeadline headlines={headlines} />

      {/* 2. Precision Technical Callouts (Replaces giant red dashed rings) */}
      <StudioTechnicalCallout callouts={callouts} />

      {/* 3. Word-by-Word Kinetic Subtitles with clean backdrop */}
      <StudioKineticSubtitles
        words={voiceData.words}
        wordsPerPhrase={4}
        styleMode="HighContrastPill"
        accentColor="#facc15"
      />
    </>
  );
};

