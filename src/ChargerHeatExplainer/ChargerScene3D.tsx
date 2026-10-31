import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import storyboard from "../../projects/charger-heat-explainer/storyboard.json";
import { CameraWaypoint, CinematicCameraDirector } from "../studio/cameras/CinematicCamera";
import {
  CinematicThermalGauge3D,
  CinematicThermalParticles3D,
  HighDetailSMPSCircuit3D,
  PremiumChargerHousing3D,
  SineWaveEnergyStream3D,
} from "./ChargerMechanisms3D";

export const ChargerScene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 1. Professional Camera Waypoints for Vertical 9:16 Framing
  // Formulated with golden ratio composition & ample negative space for UI overlay
  const cameraWaypoints: CameraWaypoint[] = useMemo(() => {
    return [
      // Shot 1: Hero 3/4 Overview (Frames 0 - 335)
      {
        fromFrame: 0,
        toFrame: 335,
        startPos: [1.8, 1.2, 5.8],
        endPos: [1.1, 0.8, 5.2],
        startLookAt: [0.0, 0.0, 0.0],
        endLookAt: [0.0, 0.0, 0.0],
        fov: 40,
      },
      // Shot 2: Macro on AC 220V Input Pins (Frames 335 - 666)
      {
        fromFrame: 335,
        toFrame: 666,
        startPos: [-0.9, 0.6, 4.6],
        endPos: [-0.4, 0.4, 3.8],
        startLookAt: [-0.2, 0.0, 0.0],
        endLookAt: [-0.2, 0.0, 0.0],
        fov: 38,
      },
      // Shot 3: Technical Exploded View Reveal (Frames 666 - 953)
      {
        fromFrame: 666,
        toFrame: 953,
        startPos: [1.2, 2.2, 4.2],
        endPos: [0.6, 1.8, 3.8],
        startLookAt: [0.0, 0.15, 0.0],
        endLookAt: [0.0, 0.15, 0.0],
        fov: 40,
      },
      // Shot 4: Macro on Joule Heating Losses (Frames 953 - 1349)
      {
        fromFrame: 953,
        toFrame: 1349,
        startPos: [0.8, 1.2, 3.2],
        endPos: [0.35, 0.8, 2.7],
        startLookAt: [0.0, -0.12, 0.0],
        endLookAt: [0.0, -0.12, 0.0],
        fov: 38,
      },
      // Shot 5: Safety Outro with Thermal Gauge (Frames 1349 - 1800)
      {
        fromFrame: 1349,
        toFrame: 1800,
        startPos: [0.0, 0.35, 5.0],
        endPos: [0.0, 0.5, 5.6],
        startLookAt: [0.0, -0.1, 0.0],
        endLookAt: [0.0, -0.1, 0.0],
        fov: 42,
      },
    ];
  }, []);

  // 2. Shot Boundaries from Storyboard (SSOT)
  const shot2 = storyboard.shots[1];
  const shot3 = storyboard.shots[2];
  const shot4 = storyboard.shots[3];
  const shot5 = storyboard.shots[4];

  // 3. Controlled Exploded View Separation
  // Explodes open in Shot 3, holds through Shot 4, reassembles in Shot 5
  const explodeProgress = spring({
    frame: frame - shot3.startFrame,
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  const reassembleProgress = spring({
    frame: frame - (shot5.startFrame + 30),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Separation allows clean visibility of internal micro-components
  const explodeDistance = interpolate(
    explodeProgress - reassembleProgress,
    [0, 1],
    [0, 1.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 4. Heat Intensity & Thermal Glow
  let heatIntensity = 0.05;
  if (frame >= shot2.startFrame && frame < shot3.startFrame) {
    heatIntensity = 0.18;
  } else if (frame >= shot3.startFrame && frame < shot4.startFrame) {
    heatIntensity = 0.45;
  } else if (frame >= shot4.startFrame && frame < shot5.startFrame) {
    heatIntensity = interpolate(
      frame,
      [shot4.startFrame, shot4.startFrame + 50, shot4.endFrame],
      [0.45, 0.95, 0.8],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  } else if (frame >= shot5.startFrame) {
    heatIntensity = 0.3;
  }

  // 5. Dynamic Temperature for Thermal Safety Gauge in Shot 5
  let currentTemperature = 48.5;
  if (frame >= shot5.startFrame) {
    const shot5Elapsed = frame - shot5.startFrame;
    if (shot5Elapsed < 220) {
      // Normal operating warm range: 42°C - 51°C
      currentTemperature = interpolate(shot5Elapsed, [0, 90, 220], [38, 48.5, 51], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else {
      // Outro warning illustration climbing towards 68°C danger threshold
      currentTemperature = interpolate(shot5Elapsed, [220, 310, 400], [51, 68.5, 65], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }

  // 6. Natural Float & Rotation
  const isHero = frame < shot2.startFrame;
  const isPinShot = frame >= shot2.startFrame && frame < shot3.startFrame;
  const isExplodedOrJoule = frame >= shot3.startFrame && frame < shot5.startFrame;
  const isOutro = frame >= shot5.startFrame;

  const chargerRotationY = isHero
    ? (frame * 0.006) % (Math.PI * 2) - 0.4
    : isPinShot
    ? Math.PI - 0.35 + Math.sin(frame * 0.01) * 0.05
    : isExplodedOrJoule
    ? -0.32 + Math.sin(frame * 0.008) * 0.04
    : isOutro
    ? 0.25 + Math.sin(frame * 0.012) * 0.06
    : 0.15;

  const chargerTiltX = isHero
    ? Math.sin(frame * 0.015) * 0.06
    : isPinShot
    ? 0.12
    : isExplodedOrJoule
    ? 0.38 // Tilt forward so the circuit board and components are in full view
    : isOutro
    ? -0.05
    : 0.05;

  // Move charger down slightly in Shot 5 to make room for gauge
  const chargerPosY = isOutro ? -0.62 : 0;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Declarative Camera Director */}
      <CinematicCameraDirector waypoints={cameraWaypoints} />

      {/* ============================================================== */}
      {/* PROFESSIONAL MULTI-POINT STUDIO LIGHTING (HIGH-KEY TECH STUDIO) */}
      {/* ============================================================== */}
      {/* Crisp White Ambient Fill */}
      <ambientLight intensity={1.05} color="#f8fafc" />

      {/* Top Overhead Light to keep top face clean and pure white */}
      <directionalLight
        position={[0, 9, 2]}
        intensity={1.8}
        color="#ffffff"
      />

      {/* Key Softbox Light (Top-Front-Right) */}
      <directionalLight
        position={[4, 7, 6]}
        intensity={2.4}
        color="#ffffff"
      />

      {/* Soft Front-Left Fill Light to eliminate harsh shadows on white housing */}
      <directionalLight
        position={[-5, 3, 5]}
        intensity={1.4}
        color="#f1f5f9"
      />

      {/* Cool Electric Cyan Rim / Silhouette Light (Back-Left) */}
      <directionalLight
        position={[-6, 5, -4]}
        intensity={2.6}
        color="#38bdf8"
      />

      {/* Warm Ambient Under-bounce / Thermal Hint */}
      <directionalLight
        position={[0, -5, 2]}
        intensity={0.4}
        color="#f97316"
      />

      {/* Soft Contact Shadow under Charger (Translucent - seamless background) */}
      <mesh position={[0, isOutro ? -2.1 : -1.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.0, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.32}
        />
      </mesh>

      {/* ============================================================== */}
      {/* MAIN CHARGER ASSEMBLY GROUP */}
      {/* ============================================================== */}
      <group
        position={[0, chargerPosY, 0]}
        rotation={[chargerTiltX, chargerRotationY, 0]}
        scale={0.58}
      >
        {/* Premium GaN Charger Housing with Bevels & Port Details */}
        <PremiumChargerHousing3D
          explodeDistance={explodeDistance}
          thermalGlow={heatIntensity}
          statusLedColor={frame >= shot4.startFrame && frame < shot5.startFrame ? "#f97316" : "#38bdf8"}
        />

        {/* High-Fidelity SMPS Circuit Board, Transformer & Components */}
        <HighDetailSMPSCircuit3D
          heatIntensity={heatIntensity}
          switchingRate={frame >= shot3.startFrame && frame < shot4.startFrame ? 1.6 : 0.6}
        />

        {/* AC 220V Sine Wave Energy Stream (Shot 2) */}
        <SineWaveEnergyStream3D
          active={frame >= shot2.startFrame && frame < shot3.startFrame}
        />

        {/* Rising Caloric Thermal Particles (Shot 4 & 5) */}
        <CinematicThermalParticles3D
          intensity={frame >= shot4.startFrame && frame < shot5.startFrame ? heatIntensity : 0}
          count={56}
        />
      </group>

      {/* 3D Thermal Safety Gauge in Shot 5 (Safely framed at Y = 0.85) */}
      <CinematicThermalGauge3D
        visible={frame >= shot5.startFrame}
        temperatureCelsius={currentTemperature}
      />
    </ThreeCanvas>
  );
};
