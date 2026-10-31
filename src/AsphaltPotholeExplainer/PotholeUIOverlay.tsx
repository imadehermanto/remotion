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
    to: 188,
    line1: "KENAPA MUSIM HUJAN",
    line2: "ASPAL BERLUBANG?!",
    line2Color: "#facc15",
  },
  {
    from: 188,
    to: 468,
    line1: "FAKTA UNIK ASPAL:",
    line2: "MUSUHNYA AIR DI BAWAH!",
    line2Color: "#38bdf8",
  },
  {
    from: 468,
    to: 633,
    line1: "TAHAP 1: RETAK KECIL",
    line2: "PANAS & BEBAN RODA",
    line2Color: "#fb923c",
  },
  {
    from: 633,
    to: 809,
    line1: "SAAT HUJAN TURUN:",
    line2: "AIR REMBES KE PONDASI!",
    line2Color: "#00e5ff",
  },
  {
    from: 809,
    to: 1044,
    line1: "TAHAP 2: EFEK POMPA BAN",
    line2: "PASIR PONDASI TERKURAS!",
    line2Color: "#ef4444",
  },
  {
    from: 1044,
    to: 1181,
    line1: "ITULAH ALASANNYA!",
    line2: "BAWAH ASPAL KOPONG!",
    line2Color: "#facc15",
  },
  {
    from: 1181,
    to: 1400,
    line1: "TAHAP 3: TANPA PENYANGGA",
    line2: "ASPAL LANGSUNG AMBROL!",
    line2Color: "#ef4444",
  },
  {
    from: 1400,
    to: 1620,
    line1: "ITULAH ALASANNYA!",
    line2: "PERCUMA TAMBAL BASAH!",
    line2Color: "#4ade80",
  },
];

const FLOATING_BADGES: FloatingBadgeSpec[] = [
  {
    id: "pothole-hook",
    from: 12,
    to: 180,
    icon: "🚗",
    text: "HABIS HUJAN = JALAN PENUH LUBANG?",
    x: 540,
    y: 455,
    bgColor: "#fef3c7",
    textColor: "#b45309",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "pothole-layers",
    from: 195,
    to: 460,
    icon: "🪨",
    text: "3 LAPIS: ASPAL + KERIKIL + TANAH",
    x: 540,
    y: 455,
    bgColor: "#e0f2fe",
    textColor: "#0369a1",
    borderColor: "#090d16",
    tilt: -1,
  },
  {
    id: "pothole-enemy",
    from: 300,
    to: 462,
    icon: "💧",
    text: "AIR MENYUSUP KE BAWAH ASPAL!",
    x: 540,
    y: 1270,
    bgColor: "#fef08a",
    textColor: "#9a3412",
    borderColor: "#090d16",
    tilt: 1.5,
  },
  {
    id: "pothole-crack",
    from: 478,
    to: 628,
    icon: "⚡",
    text: "RETAKAN RAMBUT DI PERMUKAAN",
    x: 540,
    y: 460,
    bgColor: "#ffedd5",
    textColor: "#c2410c",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "pothole-seep",
    from: 638,
    to: 802,
    icon: "🌧️",
    text: "AIR MEREMBES KE PONDASI BATU",
    x: 540,
    y: 1265,
    bgColor: "#00e5ff",
    textColor: "#082f49",
    borderColor: "#090d16",
    tilt: 1.2,
  },
  {
    id: "pothole-pump",
    from: 818,
    to: 1038,
    icon: "🚛",
    text: "BAN TRUK MEMOMPA PASIR KELUAR!",
    x: 540,
    y: 460,
    bgColor: "#fee2e2",
    textColor: "#b91c1c",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "pothole-fact-hollow",
    from: 1046,
    to: 1175,
    icon: "💡",
    text: "ALASAN BAWAH ASPAL JADI KOPONG!",
    x: 540,
    y: 470,
    bgColor: "#4ade80",
    textColor: "#052e16",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "pothole-collapse",
    from: 1190,
    to: 1392,
    icon: "💥",
    text: "KOPONG = ASPAL PATAH & AMBROL!",
    x: 540,
    y: 1265,
    bgColor: "#ef4444",
    textColor: "#ffffff",
    borderColor: "#090d16",
    tilt: 1.5,
  },
  {
    id: "pothole-fact-wetpatch",
    from: 1408,
    to: 1615,
    icon: "🚫",
    text: "PERCUMA TAMBAL SAAT MASIH BASAH!",
    x: 540,
    y: 465,
    bgColor: "#ef4444",
    textColor: "#ffffff",
    borderColor: "#090d16",
    tilt: -1.5,
  },
  {
    id: "pothole-fact-dry",
    from: 1495,
    to: 1615,
    icon: "✅",
    text: "HARUS KERING & PONDASI DIPADATKAN!",
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
    id: "circle-crack",
    from: 495,
    to: 625,
    x: 540,
    y: 890,
    size: 280,
  },
  {
    id: "circle-hollow",
    from: 1048,
    to: 1175,
    x: 540,
    y: 960,
    size: 330,
  },
];

function getPotholeWordColor(word: string): string {
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (
    [
      "lubang",
      "retakan",
      "tertekan",
      "memompa",
      "kopong",
      "ambrol",
      "percuma",
      "lepas",
      "berat",
    ].includes(clean)
  ) {
    return "#ff5500";
  }
  if (["hujan", "air", "merembes", "basah", "celah"].includes(clean)) {
    return "#00e5ff";
  }
  if (["alasan", "kenapa", "itulah", "ternyata"].includes(clean)) {
    return "#facc15";
  }
  return "#facc15";
}

export const PotholeUIOverlay: React.FC = () => {
  const [words, setWords] = useState<WordTiming[]>([]);
  const [handle] = useState(() =>
    delayRender("Loading pothole-explainer.json subtitles")
  );

  useEffect(() => {
    fetch(staticFile("pothole-explainer.json"))
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
      <CommentTriggerCard
        from={1495}
        to={1620}
        question="JALAN DI DAERAHMU GIMANA?"
        optionA="🔥 BANYAK LUBANG!"
        optionB="✨ MULUS BANGET"
      />
      <ViralWordSubtitles
        words={words}
        wordsPerPhrase={4}
        getWordColor={getPotholeWordColor}
      />
    </ViralShortsOverlayContainer>
  );
};
