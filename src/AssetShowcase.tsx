import { ThreeCanvas } from "@remotion/three";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Asset3D,
  BRAND_THEME,
  CharacterWorker3D,
  ConcreteMixer3D,
  FloatingBadgePills,
  IndonesianAlleyStage3D,
  MicroscopeCrossSection3D,
  MODELS,
  ViralHeadlineBanner,
  ViralShortsOverlayContainer,
  WaterStream3D,
  WoodenFloorStage3D,
} from "./assets";

export const AssetShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const isMicroscope = frame >= 120 && frame < 240;
  const isGallery = frame >= 240;

  const bg = isMicroscope
    ? BRAND_THEME.backgrounds.microscopeDark
    : isGallery
      ? BRAND_THEME.backgrounds.warmRoom
      : BRAND_THEME.backgrounds.sunnyOutdoor;

  const hydration = interpolate(frame, [130, 225], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 36, position: [0, 1.2, 6.8] }}
      >
        <ambientLight intensity={1.35} color="#ffffff" />
        <directionalLight position={[4, 8, 6]} intensity={2.2} color="#fffbeb" />
        <directionalLight position={[-4, 5, 4]} intensity={1.1} color="#e0f2fe" />

        {/* SCENE 1 (0-120): Simulasi Gang Indonesia "How Come?" Style */}
        {frame < 120 && (
          <group rotation={[0.12, Math.sin(frame * 0.015) * 0.18, 0]}>
            <IndonesianAlleyStage3D roadState="burlap" showBarrier />
            <CharacterWorker3D
              position={[-0.85, -1.9, 0.2]}
              rotation={[0, 0.45, 0]}
              shirtColor="#38bdf8"
              showCaping
              action="digging"
              tool="shovel"
            />
            <CharacterWorker3D
              position={[0.85, -1.9, -0.4]}
              rotation={[0, -0.5, 0]}
              shirtColor="#16a34a"
              showCaping={false}
              action="carrying"
              tool="sack"
            />
            <ConcreteMixer3D
              position={[-0.2, -1.9, -2.2]}
              scale={0.95}
            />
            <WaterStream3D
              start={[0.65, -0.8, -0.2]}
              end={[0.0, -1.85, 0.8]}
              arcHeight={0.35}
            />
          </group>
        )}

        {/* SCENE 2 (120-240): Zoom Mikroskopis Penampang Beton & Kristal Hidrasi */}
        {isMicroscope && (
          <group rotation={[0, Math.sin((frame - 120) * 0.02) * 0.22, 0]}>
            <MicroscopeCrossSection3D
              hydrationProgress={hydration}
              porosityProgress={0.35}
              matrixColor="#64748b"
            />
          </group>
        )}

        {/* SCENE 3 (240-360): Panggung Koleksi Kendaraan, Hewan & Karakter */}
        {isGallery && (
          <group
            position={[0, -1.5, 0]}
            rotation={[0.1, (frame - 240) * 0.012, 0]}
          >
            <WoodenFloorStage3D />
            <Asset3D
              model={MODELS.vehicles.firetruck}
              targetSize={1.65}
              position={[-1.1, 0.02, 0.2]}
              rotation={[0, 0.5, 0]}
            />
            <Asset3D
              model={MODELS.vehicles.taxi}
              targetSize={1.45}
              position={[1.1, 0.02, 0.2]}
              rotation={[0, -0.5, 0]}
            />
            <Asset3D
              model={MODELS.vehicles.helicopter}
              targetSize={1.6}
              position={[0, 1.55, -0.5]}
              rotation={[0.15, -0.4, 0]}
            />
            <Asset3D
              model={MODELS.characters.dog}
              targetSize={0.85}
              position={[-0.45, 0.02, 1.25]}
              rotation={[0, 0.3, 0]}
            />
            <Asset3D
              model={MODELS.characters.horse}
              targetSize={1.25}
              position={[0.55, 0.02, 1.15]}
              rotation={[0, -0.4, 0]}
            />
          </group>
        )}
      </ThreeCanvas>

      <ViralShortsOverlayContainer>
        <ViralHeadlineBanner
          headlines={[
            {
              from: 0,
              to: 120,
              line1: "KATALOG ASET 1:",
              line2: "GANG & PERTUKANGAN 3D",
              line2Color: "#facc15",
            },
            {
              from: 120,
              to: 240,
              line1: "KATALOG ASET 2:",
              line2: "MIKROSKOPIS & SAINS",
              line2Color: "#00e5ff",
            },
            {
              from: 240,
              to: 360,
              line1: "KATALOG ASET 3:",
              line2: "KENDARAAN & KARAKTER",
              line2Color: "#4ade80",
            },
          ]}
        />
        <FloatingBadgePills
          badges={[
            {
              id: "s1",
              from: 5,
              to: 115,
              icon: "👷",
              text: "TUKANG CAPING + MOLEN + KARUNG GONI",
              x: 540,
              y: 1580,
              bgColor: "#fef08a",
              textColor: "#090d16",
              borderColor: "#090d16",
              tilt: -1,
            },
            {
              id: "s2",
              from: 125,
              to: 235,
              icon: "🔬",
              text: "PENAMPANG BETON & HIDRASI SEMEN",
              x: 540,
              y: 1580,
              bgColor: "#e0f2fe",
              textColor: "#0369a1",
              borderColor: "#090d16",
              tilt: 1,
            },
            {
              id: "s3",
              from: 245,
              to: 355,
              icon: "🚒",
              text: "65+ MODEL 3D SIAP PAKAI DI SRC/ASSETS",
              x: 540,
              y: 1580,
              bgColor: "#4ade80",
              textColor: "#052e16",
              borderColor: "#090d16",
              tilt: -1,
            },
          ]}
        />
      </ViralShortsOverlayContainer>
    </AbsoluteFill>
  );
};
