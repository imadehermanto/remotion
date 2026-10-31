import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { RainParticles3D } from "../assets";
import { RoadCrossSectionModel } from "./RoadCrossSectionModel";

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

function getPotholeShotCamera(frame: number): ShotSpec {
  const ease = Easing.bezier(0.25, 1, 0.5, 1);

  // Scene 1 (0 - 188): Street view as Taxi drives across wet road & hits pothole
  if (frame < 188) {
    const t = interpolate(frame, [0, 188], [0, 1], { easing: ease });
    return {
      pos: lerpVec3([-1.4, 1.35, 5.6], [0.6, 1.15, 5.2], t),
      look: lerpVec3([-0.2, -0.05, 0], [0.2, -0.05, 0], t),
    };
  }

  // Scene 2 (188 - 468): Cutaway Reveal of 3 Road Layers (Asphalt, Gravel Base, Soil)
  if (frame < 468) {
    const t = interpolate(frame, [188, 468], [0, 1], { easing: ease });
    return {
      pos: lerpVec3([0.0, 0.25, 5.4], [0.35, 0.15, 4.9], t),
      look: lerpVec3([0, -0.45, 0.2], [0, -0.45, 0.2], t),
    };
  }

  // Scene 3 (468 - 809): Close-up on Hairline Crack & Rain Water Seeping Down into Gravel Base
  if (frame < 809) {
    const t = interpolate(frame, [468, 809], [0, 1], { easing: ease });
    return {
      pos: lerpVec3([-0.3, 0.35, 4.1], [0.25, 0.1, 3.85], t),
      look: lerpVec3([0, -0.25, 0.45], [0, -0.35, 0.45], t),
    };
  }

  // Scene 4 (809 - 1181): Heavy Truck Tire Pumping Water & Sand Out -> "Itulah alasan bawah aspal kopong!"
  if (frame < 1181) {
    const t = interpolate(frame, [809, 1181], [0, 1], { easing: ease });
    return {
      pos: lerpVec3([-0.4, 0.25, 4.65], [0.2, -0.05, 4.05], t),
      look: lerpVec3([0, -0.25, 0.35], [0, -0.38, 0.45], t),
    };
  }

  // Scene 5 (1181 - 1400): SUV Crushing Unsupported Asphalt into a Large Pothole
  if (frame < 1400) {
    const t = interpolate(frame, [1181, 1400], [0, 1], { easing: ease });
    return {
      pos: lerpVec3([-0.55, 0.45, 4.85], [0.35, 0.3, 4.45], t),
      look: lerpVec3([0, -0.2, 0.25], [0, -0.25, 0.3], t),
    };
  }

  // Scene 6 (1400 - 1620): Wide Shot with Road Worker -> "Itulah alasan pantang tambal saat masih basah!"
  const t = interpolate(frame, [1400, 1620], [0, 1], { easing: ease });
  return {
    pos: lerpVec3([-0.35, 0.85, 6.2], [0.35, 0.9, 6.4], t),
    look: lerpVec3([-0.15, 0.05, 0.1], [0.0, 0.05, 0.1], t),
  };
}

const CameraController: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();

  const { pos, look } = useMemo(() => getPotholeShotCamera(frame), [frame]);

  React.useLayoutEffect(() => {
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.lookAt(new THREE.Vector3(look[0], look[1], look[2]));
    camera.updateProjectionMatrix();
  }, [camera, pos, look]);

  return null;
};

export const PotholeScene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Rain falls during Scene 1 (0-188), Scene 3B (633-809), and Scene 6 (1400-1620)
  const isRaining =
    frame < 188 ||
    (frame >= 633 && frame < 850) ||
    frame >= 1400;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 35, near: 0.1, far: 100, position: [0, 1.2, 5.5] }}
    >
      <CameraController />

      {/* Studio & Outdoor Lighting */}
      <ambientLight intensity={1.35} color="#f8fafc" />
      <directionalLight position={[5, 8, 6]} intensity={2.2} color="#fffbeb" />
      <directionalLight position={[-5, 4, 4]} intensity={1.1} color="#bae6fd" />
      <pointLight position={[0, -0.3, 2.2]} intensity={1.2} color="#38bdf8" distance={6} />

      {/* 3D Road Cross-Section, Vehicles, Gravel Stones, Water Seepage & Worker */}
      <RoadCrossSectionModel />

      {/* Deterministic 3D Rain Streaks */}
      {isRaining && <RainParticles3D count={75} />}
    </ThreeCanvas>
  );
};
