import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import storyboard from "../../projects/touchscreen-explainer/storyboard.json";
import { CameraWaypoint, CinematicCameraDirector } from "../studio/cameras/CinematicCamera";
import { MacroTechnicalLighting, StudioSoftboxLighting } from "../studio/lighting/LightingRigs";
import {
  BrushedAluminumMaterial,
  OpticalGlassMaterial,
  SiliconSubstrateMaterial,
} from "../studio/materials/PBRMaterials";
import {
  CapacitiveSensorGrid3D,
  ChargeFlowParticles3D,
  ElectricFieldArc3D,
  HumanTouchFinger3D,
} from "../studio/motion/MechanismHelpers";

export const TouchscreenScene3D: React.FC = () => {
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

  // 2. Shot Boundaries from Storyboard (No hardcoded duplicated numbers)
  const shotIntro = storyboard.shots[0];
  const shotCutaway = storyboard.shots[1];
  const shotField = storyboard.shots[2];
  const shotTouch = storyboard.shots[3];
  const shotOutro = storyboard.shots[4];

  // 3. Exploded View Layer Separation (Derived from Cutaway shot to Outro shot)
  const explodeProgress = spring({
    frame: frame - shotCutaway.startFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const collapseProgress = spring({
    frame: frame - shotOutro.startFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const explodeZ = interpolate(
    explodeProgress - collapseProgress,
    [0, 1],
    [0, 0.45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 4. Finger Animation during Touch Shot
  const touchStartFrame = shotTouch.startFrame + 40;
  const touchEndFrame = shotTouch.endFrame;
  const isTouchActive = frame >= touchStartFrame && frame < touchEndFrame;

  const fingerApproach = spring({
    frame: frame - shotTouch.startFrame,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const fingerY = interpolate(fingerApproach, [0, 1], [2.2, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fingerZ = interpolate(fingerApproach, [0, 1], [1.5, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 5. Touch intensity for delta capacitance visual wave
  const touchIntensity = isTouchActive
    ? interpolate(
        frame,
        [touchStartFrame, touchStartFrame + 30, touchEndFrame - 40, touchEndFrame],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // Phone chassis subtle 3D rotation in Hero Intro shot
  const phoneTiltX = frame < shotIntro.endFrame ? Math.sin(frame * 0.02) * 0.1 : 0.05;
  const phoneTiltY = frame < shotIntro.endFrame ? (frame * 0.008) % (Math.PI * 2) - 0.2 : 0.1;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{
        position: "absolute",
        inset: 0,
      }}
    >
      {/* 1. Cinematic Camera Director driven by Storyboard Waypoints */}
      <CinematicCameraDirector waypoints={cameraWaypoints} />

      {/* 2. Reusable Studio Lighting Rig */}
      {frame >= shotOutro.startFrame ? (
        <StudioSoftboxLighting intensity={1.1} />
      ) : (
        <MacroTechnicalLighting intensity={1.3} />
      )}

      {/* 3. Central Smartphone & Mechanism Group */}
      <group rotation={[phoneTiltX, phoneTiltY, 0]}>
        {/* Phone Chassis Back & Bezel */}
        <mesh position={[0, 0, -0.15]}>
          <boxGeometry args={[2.7, 5.2, 0.18]} />
          <BrushedAluminumMaterial color="#1e293b" />
        </mesh>

        {/* OLED Display Matrix Base (Dark Substrate) */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[2.5, 5.0, 0.02]} />
          <SiliconSubstrateMaterial color="#0b0f19" />
        </mesh>

        {/* Dynamic Display Wallpaper (Dark Sci-Fi Blueprint Glow) */}
        <mesh position={[0, 0, -0.038]}>
          <planeGeometry args={[2.46, 4.96]} />
          <meshBasicMaterial color="#030712" />
        </mesh>

        {/* 4. Capacitive Sensor Grid (ITO Electrodes & Dielectric Spacer) */}
        <group position={[0, 0, explodeZ * 0.5]}>
          <CapacitiveSensorGrid3D
            rows={12}
            cols={8}
            width={2.35}
            height={4.75}
            activePoint={[0.55, 0.52]}
            touchIntensity={touchIntensity}
          />
        </group>

        {/* 5. Outer Protective Cover Glass (Gorilla Glass) */}
        <mesh position={[0, 0, 0.06 + explodeZ]}>
          <boxGeometry args={[2.48, 4.98, 0.04]} />
          <OpticalGlassMaterial opacity={0.4} />
        </mesh>

        {/* 6. Human Touch Finger (Active during Shot 4) */}
        {frame >= shotTouch.startFrame && frame < shotTouch.endFrame + 30 && (
          <HumanTouchFinger3D
            position={[0.12, fingerY, fingerZ + explodeZ]}
            isPressed={isTouchActive}
          />
        )}

        {/* 7. Free Electron Charge Flow to Finger */}
        <ChargeFlowParticles3D
          centerPos={[0.12, 0.1, 0.08 + explodeZ]}
          active={touchIntensity > 0.05}
          count={50}
          radius={0.7}
        />

        {/* 8. Electrostatic Field Arcs (Shot 3 & 4) */}
        {frame >= shotField.startFrame && frame < shotTouch.endFrame && (
          <group position={[0, 0, explodeZ * 0.5]}>
            <ElectricFieldArc3D
              fromPos={[-0.4, 0.2, 0.03]}
              toPos={[0.12, 0.1, 0.06]}
              chargeActive={touchIntensity > 0.1}
            />
            <ElectricFieldArc3D
              fromPos={[0.5, -0.2, 0.03]}
              toPos={[0.12, 0.1, 0.06]}
              chargeActive={touchIntensity > 0.1}
            />
            <ElectricFieldArc3D
              fromPos={[-0.2, -0.4, 0.03]}
              toPos={[0.12, 0.1, 0.06]}
              chargeActive={touchIntensity > 0.1}
            />
          </group>
        )}

        {/* 9. Holographic Crosshair Coordinates (Shot 5) */}
        {frame >= shotOutro.startFrame && frame < shotOutro.endFrame - 80 && (
          <group position={[0.12, 0.1, 0.08]}>
            <mesh>
              <ringGeometry args={[0.22, 0.25, 32]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[0.6, 0.015, 0.005]} />
              <meshBasicMaterial color="#00f2fe" />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <boxGeometry args={[0.015, 0.6, 0.005]} />
              <meshBasicMaterial color="#00f2fe" />
            </mesh>
          </group>
        )}
      </group>
    </ThreeCanvas>
  );
};
