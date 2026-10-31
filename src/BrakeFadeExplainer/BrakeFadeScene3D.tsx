import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { DiscBrakeSystem3D } from "./DiscBrakeSystem3D";
import { MountainSlopeRoad3D } from "./MountainSlopeRoad3D";

interface ShotSpec {
  pos: [number, number, number];
  look: [number, number, number];
}

function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function getBrakeShotCamera(frame: number): ShotSpec {
  const ease = Easing.bezier(0.25, 1, 0.5, 1);

  // Scene 1 (0 - 268): Low-angle cinematic 3/4 tracking shot of Motor Matic descending mountain slope
  if (frame < 268) {
    const t = interpolate(frame, [0, 268], [0, 1], { easing: ease });
    return {
      pos: lerpVec3([-2.4, 2.2, 5.8], [-1.2, 1.8, 6.2], t),
      look: lerpVec3([0.45, 0.5, 0.4], [0.55, 0.5, 1.8], t),
    };
  }

  // Scene 2 (268 - 497): Cutaway reveal: Upright disc brake system & caliper overview
  if (frame < 497) {
    const t = interpolate(frame, [268, 497], [0, 1], { easing: ease });
    return {
      pos: lerpVec3([0.0, 0.65, 5.8], [0.1, 0.6, 5.4], t),
      look: lerpVec3([0.0, 0.5, 0], [0.05, 0.5, 0], t),
    };
  }

  // Scene 3 (497 - 834): Macro close-up on glowing red hot disc rotor (>200°C), friction sparks & Thermometer
  if (frame < 834) {
    const t = interpolate(frame, [497, 834], [0, 1], { easing: ease });
    return {
      pos: lerpVec3([0.25, 0.2, 4.6], [0.15, 0.12, 4.4], t),
      look: lerpVec3([0.15, 0.05, 0], [0.12, 0.02, 0], t),
    };
  }

  // Scene 4 (834 - 1175): Macro focus on transparent hose with boiling gas bubbles (Vapor Lock) + pulled lever
  if (frame < 1175) {
    const t = interpolate(frame, [834, 1175], [0, 1], { easing: ease });
    return {
      pos: lerpVec3([0.15, 1.15, 4.2], [0.22, 1.25, 4.0], t),
      look: lerpVec3([0.2, 1.1, 0], [0.22, 1.15, 0], t),
    };
  }

  // Scene 5 (1175 - 1478): Wide action shot: Runaway scooter hurtling toward emergency sand ramp
  if (frame < 1478) {
    const t = interpolate(frame, [1175, 1478], [0, 1], { easing: ease });
    return {
      pos: lerpVec3([2.8, 2.4, 6.8], [1.4, 1.8, 5.8], t),
      look: lerpVec3([1.0, 0.6, 1.4], [0.8, 0.45, 1.6], t),
    };
  }

  // Scene 6 (1478 - 1728): Rhythmic Cadence Brake pumping + cooling disc finale
  const t = interpolate(frame, [1478, 1728], [0, 1], { easing: ease });
  return {
    pos: lerpVec3([-0.1, 0.55, 5.2], [0.05, 0.45, 5.4], t),
    look: lerpVec3([0.0, 0.35, 0], [0.0, 0.35, 0], t),
  };
}

const BrakeCameraDirector: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();

  const shot = useMemo(() => getBrakeShotCamera(frame), [frame]);

  React.useLayoutEffect(() => {
    camera.position.set(shot.pos[0], shot.pos[1], shot.pos[2]);
    camera.lookAt(new THREE.Vector3(shot.look[0], shot.look[1], shot.look[2]));
  }, [camera, shot]);

  return null;
};

export const BrakeFadeScene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Mode switching between outdoor mountain road and cutaway mechanical brake
  const isOutdoorScene = frame < 268 || (frame >= 1175 && frame < 1478);

  const brakeCutawayMode = useMemo(() => {
    if (frame < 497) return "spin";
    if (frame < 834) return "overheat";
    if (frame < 1478) return "vaporlock";
    return "pumpBrake";
  }, [frame]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, near: 0.1, far: 80 }}
        style={{ width: "100%", height: "100%" }}
      >
        <BrakeCameraDirector />

        {/* Ambient & Key Light */}
        <ambientLight intensity={isOutdoorScene ? 0.95 : 0.72} />
        <directionalLight
          position={[6, 9, 6]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Cool Cyan Rim Light (Backlight) untuk Menonjolkan Kontur Bodi & Cakram Logam */}
        <directionalLight
          position={[-4, 4, -4]}
          intensity={0.65}
          color="#38bdf8"
        />

        {/* Warm Fill Light dari Bawah */}
        <pointLight position={[0, -2, 3]} intensity={0.45} color="#fed7aa" />

        {/* 3D Content Branching */}
        {isOutdoorScene ? (
          <MountainSlopeRoad3D showEmergencyRamp={true} />
        ) : (
          <DiscBrakeSystem3D mode={brakeCutawayMode} />
        )}
      </ThreeCanvas>
    </div>
  );
};
