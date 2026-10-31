import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
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

  // Waypoints derived directly from storyboard.json
  const cameraWaypoints: CameraWaypoint[] = [
    // Shot 1: Hero Intro (0 - 251)
    {
      fromFrame: 0,
      toFrame: 251,
      startPos: [-0.6, 0.4, 5.2],
      endPos: [0.3, 0.1, 4.6],
      startLookAt: [0, 0, 0],
      endLookAt: [0, 0, 0],
      fov: 42,
    },
    // Shot 2: Exploded Layers Cutaway (251 - 612)
    {
      fromFrame: 251,
      toFrame: 612,
      startPos: [0.2, 1.0, 4.8],
      endPos: [0.5, 1.4, 4.2],
      startLookAt: [0, 0.2, 0],
      endLookAt: [0, 0.3, 0],
      fov: 40,
    },
    // Shot 3: Electrostatic Field Macro (612 - 971)
    {
      fromFrame: 612,
      toFrame: 971,
      startPos: [0.1, 0.3, 3.6],
      endPos: [-0.1, 0.1, 2.9],
      startLookAt: [0, 0.1, 0],
      endLookAt: [0, 0.1, 0],
      fov: 38,
    },
    // Shot 4: Touch Interaction Climax (971 - 1320)
    {
      fromFrame: 971,
      toFrame: 1320,
      startPos: [0.3, 0.5, 3.3],
      endPos: [0.15, 0.25, 3.0],
      startLookAt: [0, 0, 0.1],
      endLookAt: [0, 0, 0.1],
      fov: 42,
    },
    // Shot 5: Controller & Outro (1320 - 1700)
    {
      fromFrame: 1320,
      toFrame: 1700,
      startPos: [0.1, 0.2, 3.6],
      endPos: [0.0, 0.0, 5.4],
      startLookAt: [0, 0, 0],
      endLookAt: [0, 0, 0],
      fov: 45,
    },
  ];

  // Exploded View Layer Separation (Starts in Shot 2, merges back in Shot 5)
  const explodeProgress = spring({
    frame: frame - 251,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const collapseProgress = spring({
    frame: frame - 1320,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const explodeZ = interpolate(
    explodeProgress - collapseProgress,
    [0, 1],
    [0, 0.45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Finger Animation (Approaches in Shot 4, frame 971 - 1320)
  const isTouchActive = frame >= 1020 && frame < 1320;
  const fingerApproach = spring({
    frame: frame - 980,
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

  // Touch intensity for ripple/particles
  const touchIntensity = isTouchActive
    ? interpolate(frame, [1020, 1060, 1280, 1320], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Phone chassis slight wobble/tilt in Shot 1
  const phoneTiltX = frame < 251 ? Math.sin(frame * 0.02) * 0.1 : 0.05;
  const phoneTiltY = frame < 251 ? (frame * 0.008) % (Math.PI * 2) - 0.2 : 0.1;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{
        position: "absolute",
        inset: 0,
      }}
    >
      {/* 1. Cinematic Camera Director */}
      <CinematicCameraDirector waypoints={cameraWaypoints} />

      {/* 2. Reusable Studio Lighting Rig */}
      {frame >= 1320 ? (
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

        {/* 6. Human Touch Finger (Appears in Shot 4) */}
        {frame >= 970 && frame < 1350 && (
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
        {frame >= 612 && frame < 1320 && (
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
        {frame >= 1320 && frame < 1620 && (
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
