import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import storyboard from "../../projects/charger-heat-explainer/storyboard.json";
import { CameraWaypoint, CinematicCameraDirector } from "../studio/cameras/CinematicCamera";
import {
  DramaticLaboratoryLighting,
  MacroTechnicalLighting,
  StudioSoftboxLighting,
} from "../studio/lighting/LightingRigs";
import {
  ChargerOuterShell3D,
  EnergyConversionWave3D,
  SMPSInternalCircuit3D,
  ThermalRadiationParticles3D,
  ThermalSafetyMeter3D,
} from "./ChargerMechanisms3D";

export const ChargerScene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 1. Camera Waypoints derived strictly from storyboard.json (SSOT)
  const cameraWaypoints: CameraWaypoint[] = useMemo(() => {
    return storyboard.shots.map((shot) => ({
      fromFrame: shot.startFrame,
      toFrame: shot.endFrame,
      startPos: shot.cameraConfig.startPos as [number, number, number],
      endPos: shot.cameraConfig.endPos as [number, number, number],
      startLookAt: shot.cameraConfig.startLookAt as [number, number, number],
      endLookAt: shot.cameraConfig.endLookAt as [number, number, number],
      fov: shot.cameraConfig.fov,
    }));
  }, []);

  // 2. Shot Boundaries from Storyboard (SSOT)
  const shot2 = storyboard.shots[1];
  const shot3 = storyboard.shots[2];
  const shot4 = storyboard.shots[3];
  const shot5 = storyboard.shots[4];

  // 3. Exploded View Layer Separation (Starts in Shot 3, holds through Shot 4, reassembles in Shot 5)
  const explodeProgress = spring({
    frame: frame - shot3.startFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const reassembleProgress = spring({
    frame: frame - (shot5.startFrame + 40),
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const explodeDistance = interpolate(
    explodeProgress - reassembleProgress,
    [0, 1],
    [0, 0.95],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 4. Heat Intensity & Thermal Glow
  let heatIntensity = 0.05;
  if (frame >= shot2.startFrame && frame < shot3.startFrame) {
    heatIntensity = 0.15;
  } else if (frame >= shot3.startFrame && frame < shot4.startFrame) {
    heatIntensity = 0.45;
  } else if (frame >= shot4.startFrame && frame < shot5.startFrame) {
    // Peak Joule Heating dissipation in Shot 4
    heatIntensity = interpolate(
      frame,
      [shot4.startFrame, shot4.startFrame + 60, shot4.endFrame],
      [0.45, 0.95, 0.85],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  } else if (frame >= shot5.startFrame) {
    heatIntensity = 0.35;
  }

  // 5. Dynamic Temperature for Thermal Safety Meter in Shot 5
  // Narration: "Suhu 40 hingga 55 derajat Celsius adalah normal saat fast charging, tapi jika tercium bau gosong dan tembus 65 derajat, segera cabut!"
  let currentTemperature = 48;
  if (frame >= shot5.startFrame) {
    const shot5Elapsed = frame - shot5.startFrame;
    if (shot5Elapsed < 220) {
      // Normal operating warm range: 45°C - 52°C
      currentTemperature = interpolate(shot5Elapsed, [0, 80, 220], [38, 48.5, 51], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else {
      // Outro warning illustration climbing towards 68°C danger threshold
      currentTemperature = interpolate(shot5Elapsed, [220, 320, 420], [51, 68, 65], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }

  // 6. Charger Object Floating & Subtle Rotation in Hero / Outro Shots
  const chargerRotationY =
    frame < shot2.startFrame
      ? (frame * 0.007) % (Math.PI * 2) - 0.4
      : frame >= shot5.startFrame
      ? 0.3 + Math.sin(frame * 0.015) * 0.1
      : 0.15;

  const chargerTiltX =
    frame < shot2.startFrame ? Math.sin(frame * 0.02) * 0.08 : 0.05;

  // Active lighting rig per shot
  const isLabLighting = frame >= shot3.startFrame && frame < shot4.startFrame;
  const isMacroLighting =
    (frame >= shot2.startFrame && frame < shot3.startFrame) ||
    (frame >= shot4.startFrame && frame < shot5.startFrame);

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
      {/* Declarative Camera Director synced with Storyboard */}
      <CinematicCameraDirector waypoints={cameraWaypoints} />

      {/* Cinematic Studio Lighting Rig */}
      {isLabLighting ? (
        <DramaticLaboratoryLighting
          colorTemperature="#38bdf8"
          intensity={1.2}
        />
      ) : isMacroLighting ? (
        <MacroTechnicalLighting
          colorTemperature="#f97316"
          intensity={1.1}
        />
      ) : (
        <StudioSoftboxLighting
          colorTemperature="#ffffff"
          intensity={1.05}
        />
      )}

      {/* Main Charger Assembly Group */}
      <group
        position={[0, 0, 0]}
        rotation={[chargerTiltX, chargerRotationY, 0]}
      >
        {/* Outer Enclosure (Can explode in Shot 3 & 4) */}
        <ChargerOuterShell3D
          explodeDistance={explodeDistance}
          thermalGlow={heatIntensity}
        />

        {/* Internal SMPS Circuit Board & Power Electronics */}
        <SMPSInternalCircuit3D
          heatIntensity={heatIntensity}
          switchingRate={frame >= shot3.startFrame && frame < shot4.startFrame ? 1.5 : 0.5}
        />

        {/* AC 220V High-Voltage Sine Wave in Shot 2 */}
        <EnergyConversionWave3D
          active={frame >= shot2.startFrame && frame < shot3.startFrame}
        />

        {/* Joule Heating Dissipation Particles in Shot 4 & 5 */}
        <ThermalRadiationParticles3D
          intensity={frame >= shot4.startFrame && frame < shot5.startFrame ? heatIntensity : 0}
          count={54}
        />
      </group>

      {/* Thermal Safety Gauge in Shot 5 */}
      <ThermalSafetyMeter3D
        visible={frame >= shot5.startFrame}
        temperatureCelsius={currentTemperature}
      />
    </ThreeCanvas>
  );
};
