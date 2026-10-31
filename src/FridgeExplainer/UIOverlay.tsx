import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import {
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
    to: 172,
    line1: "KENAPA BODI KULKAS",
    line2: "TERASA HANGAT?!",
    line2Color: "#facc15",
  },
  {
    from: 172,
    to: 416,
    line1: "FAKTA UNIK:",
    line2: "KULKAS PENCURI PANAS!",
    line2Color: "#fb923c",
  },
  {
    from: 416,
    to: 561,
    line1: "TAHAP 1: EVAPORATOR",
    line2: "SERAP PANAS MAKANAN",
    line2Color: "#38bdf8",
  },
  {
    from: 561,
    to: 715,
    line1: "TAHAP 2: KOMPRESOR",
    line2: "POMPA GAS JADI PANAS!",
    line2Color: "#ef4444",
  },
  {
    from: 715,
    to: 821,
    line1: "TAHAP 2B: KONDENSATOR",
    line2: "BUANG PANAS KE DINDING",
    line2Color: "#f97316",
  },
  {
    from: 821,
    to: 971,
    line1: "ITULAH ALASANNYA!",
    line2: "BODI KULKAS HANGAT",
    line2Color: "#facc15",
  },
  {
    from: 971,
    to: 1313,
    line1: "TAHAP 3: KATUP EKSPANSI",
    line2: "SUHU ANJLok JADI ES!",
    line2Color: "#00e5ff",
  },
  {
    from: 1313,
    to: 1530,
    line1: "ITULAH ALASANNYA!",
    line2: "PANTANG TARUH PANAS!",
    line2Color: "#4ade80",
  },
];

const FLOATING_BADGES: FloatingBadgeSpec[] = [
  {
    id: "badge-hook",
    from: 12,
    to: 165,
    icon: "✋",
    text: "BODI LUAR: TERASA HANGAT?",
    x: 540,
    y: 460,
    bgColor: "#fef3c7",
    textColor: "#b45309",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "badge-not-cold",
    from: 185,
    to: 410,
    icon: "❌",
    text: "BUKAN CIPTAKAN DINGIN",
    x: 540,
    y: 450,
    bgColor: "#fee2e2",
    textColor: "#b91c1c",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "badge-steal-heat",
    from: 280,
    to: 412,
    icon: "🔥",
    text: "MENCURI PANAS MAKANAN!",
    x: 540,
    y: 1260,
    bgColor: "#fef08a",
    textColor: "#9a3412",
    borderColor: "#090d16",
    tilt: 1.5,
  },
  {
    id: "badge-evap",
    from: 425,
    to: 555,
    icon: "❄️",
    text: "PIPA EVAPORATOR (-18°C)",
    x: 540,
    y: 455,
    bgColor: "#e0f2fe",
    textColor: "#0369a1",
    borderColor: "#090d16",
    tilt: -1,
  },
  {
    id: "badge-comp",
    from: 572,
    to: 710,
    icon: "⚙️",
    text: "KOMPRESOR: TEKANAN NAIK!",
    x: 540,
    y: 455,
    bgColor: "#ffedd5",
    textColor: "#c2410c",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "badge-temp-up",
    from: 645,
    to: 712,
    icon: "🌡️",
    text: "SUHU MELONJAK +65°C!",
    x: 540,
    y: 1265,
    bgColor: "#ef4444",
    textColor: "#ffffff",
    borderColor: "#090d16",
    tilt: 1.5,
  },
  {
    id: "badge-condenser",
    from: 725,
    to: 965,
    icon: "💨",
    text: "PANAS MAKANAN DIBUANG KE SINI",
    x: 540,
    y: 1260,
    bgColor: "#fffbeb",
    textColor: "#9a3412",
    borderColor: "#090d16",
    tilt: 1,
  },
  {
    id: "badge-fact-warm",
    from: 822,
    to: 968,
    icon: "💡",
    text: "ALASAN BODI KULKAS TERASA HANGAT!",
    x: 540,
    y: 485,
    bgColor: "#4ade80",
    textColor: "#052e16",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "badge-valve",
    from: 982,
    to: 1118,
    icon: "⚡",
    text: "CELAH SEMPIT: KATUP EKSPANSI",
    x: 540,
    y: 460,
    bgColor: "#fef08a",
    textColor: "#854d0e",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "badge-freeze",
    from: 1122,
    to: 1308,
    icon: "🧊",
    text: "TEKANAN TURUN = SEDINGIN ES!",
    x: 540,
    y: 1265,
    bgColor: "#00e5ff",
    textColor: "#082f49",
    borderColor: "#090d16",
    tilt: 1.5,
  },
  {
    id: "badge-fact-hotfood",
    from: 1318,
    to: 1525,
    icon: "🚫",
    text: "JANGAN MASUKKAN MAKANAN PANAS!",
    x: 540,
    y: 495,
    bgColor: "#ef4444",
    textColor: "#ffffff",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "badge-fact-compressor-overwork",
    from: 1410,
    to: 1525,
    icon: "⚙️",
    text: "KOMPRESOR BAKAL KERJA LEMBUR!",
    x: 540,
    y: 1270,
    bgColor: "#facc15",
    textColor: "#090d16",
    borderColor: "#090d16",
    tilt: 1.5,
  },
];

const RED_CIRCLES: RedCircleSpec[] = [
  {
    id: "circle-compressor",
    from: 575,
    to: 705,
    x: 530,
    y: 920,
    size: 320,
  },
  {
    id: "circle-valve",
    from: 985,
    to: 1115,
    x: 490,
    y: 880,
    size: 290,
  },
];

function getFridgeWordColor(word: string): string {
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (
    [
      "panas",
      "hangat",
      "kompresor",
      "kondensator",
      "melonjak",
      "tinggi",
      "mencuri",
      "membuangnya",
      "pantang",
      "keras",
    ].includes(clean)
  ) {
    return "#ff5500";
  }
  if (
    ["dingin", "es", "evaporator", "sedingin", "anjlok", "menyerap"].includes(
      clean
    )
  ) {
    return "#00e5ff";
  }
  if (["alasan", "kenapa", "itulah", "ternyata"].includes(clean)) {
    return "#facc15";
  }
  return "#facc15";
}

export const UIOverlay: React.FC = () => {
  const [words, setWords] = useState<WordTiming[]>([]);
  const [handle] = useState(() =>
    delayRender("Loading fridge-explainer.json subtitles")
  );

  useEffect(() => {
    fetch(staticFile("fridge-explainer.json"))
      .then((r) => r.json())
      .then((data) => {
        setWords(data.words || []);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(err);
        cancelRender(err);
      });
  }, [handle]);

  return (
    <ViralShortsOverlayContainer>
      <ViralHeadlineBanner headlines={TOP_HEADLINES} />
      <RedFocusRings circles={RED_CIRCLES} />
      <FloatingBadgePills badges={FLOATING_BADGES} />
      <ViralWordSubtitles
        words={words}
        wordsPerPhrase={4}
        getWordColor={getFridgeWordColor}
      />
    </ViralShortsOverlayContainer>
  );
};
