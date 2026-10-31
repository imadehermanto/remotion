import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import React, { useLayoutEffect } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { FridgeModel } from "./FridgeModel";
import { HeatColdEffects } from "./HeatColdEffects";
import { KitchenDiorama } from "./KitchenDiorama";
import { RefrigerantParticles } from "./RefrigerantParticles";

function getShotCamera(frame: number): {
  pos: [number, number, number];
  target: [number, number, number];
} {
  const ease = Easing.bezier(0.25, 0.1, 0.25, 1);

  if (frame < 172) {
    // SCENE 1 (0 - 172 | 5.7s): Everyday Hook ("Kenapa bodi luar kulkas hangat, dalamnya dingin?")
    const t = interpolate(frame, [0, 171], [0, 1], { easing: ease, extrapolateRight: "clamp" });
    return {
      pos: [
        interpolate(t, [0, 1], [5.0, 3.7]),
        interpolate(t, [0, 1], [1.5, 1.05]),
        interpolate(t, [0, 1], [6.8, 5.3]),
      ],
      target: [-0.15, 0.15, 0],
    };
  } else if (frame < 416) {
    // SCENE 2 (172 - 416 | 8.1s): The Twist ("Kulkas nggak bikin dingin, tapi mencuri panas makanan!")
    const t = interpolate(frame, [172, 415], [0, 1], { easing: ease, extrapolateRight: "clamp" });
    return {
      pos: [
        interpolate(t, [0, 1], [4.3, 3.6]),
        interpolate(t, [0, 1], [1.15, 0.85]),
        interpolate(t, [0, 1], [3.2, 2.2]),
      ],
      target: [0, 0.35, -0.15],
    };
  } else if (frame < 561) {
    // SCENE 3 (416 - 561 | 4.8s): 1. Evaporator Inside Absorbing Heat from Food
    const t = interpolate(frame, [416, 560], [0, 1], { easing: ease, extrapolateRight: "clamp" });
    return {
      pos: [
        interpolate(t, [0, 1], [1.95, 1.45]),
        interpolate(t, [0, 1], [0.85, 0.75]),
        interpolate(t, [0, 1], [3.85, 3.35]),
      ],
      target: [0, 0.55, -0.15],
    };
  } else if (frame < 715) {
    // SCENE 4 (561 - 715 | 5.1s): 2. Compressor Pumping Gas to High Temp + Thermometer
    const t = interpolate(frame, [561, 714], [0, 1], { easing: ease, extrapolateRight: "clamp" });
    return {
      pos: [
        interpolate(t, [0, 1], [-0.45, -0.25]),
        interpolate(t, [0, 1], [-1.05, -1.15]),
        interpolate(t, [0, 1], [-3.5, -3.15]),
      ],
      target: [-0.32, -1.38, -0.75],
    };
  } else if (frame < 971) {
    // SCENE 5 (715 - 971 | 8.5s): Condenser Coils at Back ("Itulah alasan kenapa bodi kulkas terasa hangat!")
    const t = interpolate(frame, [715, 970], [0, 1], { easing: ease, extrapolateRight: "clamp" });
    return {
      pos: [
        interpolate(t, [0, 1], [-1.7, 1.6]),
        interpolate(t, [0, 1], [-0.05, 0.4]),
        interpolate(t, [0, 1], [-4.15, -4.0]),
      ],
      target: [0, 0.05, -0.95],
    };
  } else if (frame < 1119) {
    // SCENE 6A (971 - 1119 | 4.9s): 3. Expansion Valve Narrow Bottleneck
    const t = interpolate(frame, [971, 1118], [0, 1], { easing: ease, extrapolateRight: "clamp" });
    return {
      pos: [
        interpolate(t, [0, 1], [2.7, 2.4]),
        interpolate(t, [0, 1], [1.45, 1.35]),
        interpolate(t, [0, 1], [-0.35, 0.0]),
      ],
      target: [0.82, 1.22, -0.05],
    };
  } else if (frame < 1313) {
    // SCENE 6B (1119 - 1313 | 6.5s): Pressure Drops -> Freezing Spray (-20°C) + Thermometer
    const t = interpolate(frame, [1119, 1312], [0, 1], { easing: ease, extrapolateRight: "clamp" });
    return {
      pos: [
        interpolate(t, [0, 1], [2.7, 2.5]),
        interpolate(t, [0, 1], [1.38, 1.28]),
        interpolate(t, [0, 1], [0.25, 0.45]),
      ],
      target: [0.82, 1.22, 0.18],
    };
  } else {
    // SCENE 7 (1313 - 1530 | 7.2s): Everyday Payoff ("Itulah alasan kenapa pantang masukin makanan panas!")
    const t = interpolate(frame, [1313, 1530], [0, 1], { easing: ease, extrapolateRight: "clamp" });
    return {
      pos: [
        interpolate(t, [0, 1], [4.3, 5.1]),
        interpolate(t, [0, 1], [1.2, 1.55]),
        interpolate(t, [0, 1], [4.1, 4.8]),
      ],
      target: [0, 0.0, -0.15],
    };
  }
}

const CameraController: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();

  const { pos, target } = getShotCamera(frame);

  useLayoutEffect(() => {
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.lookAt(new THREE.Vector3(target[0], target[1], target[2]));
    camera.updateProjectionMatrix();
  }, [camera, pos, target]);

  return null;
};

export const FridgeScene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Door swings open smoothly around frame 45
  const doorSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.9 },
  });
  const doorAngle = interpolate(doorSpring, [0, 1], [0, -2.05]);

  // Solid Cross-Section Cutaway opens calmly at frame 180
  const cutawaySpring = spring({
    frame: frame - 180,
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.9 },
  });
  const cutawayProgress = interpolate(cutawaySpring, [0, 1], [0, 1]);

  // Hide kitchen back wall during Scene 4 & 5 when camera is behind the fridge
  const isBackView = frame >= 561 && frame < 971;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{
        fov: 42,
        near: 0.1,
        far: 100,
        position: [5.0, 1.5, 6.8],
      }}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <CameraController />

      {/* ===================== BRIGHT, HIGH-CONTRAST STUDIO LIGHTING ===================== */}
      <ambientLight color="#fff7ed" intensity={1.05} />

      {/* Warm Key Light (Front-Right) */}
      <directionalLight position={[7, 12, 8]} intensity={2.4} color="#fffbeb" />

      {/* Back Key Light (illuminates Compressor & Condenser clearly during back shots!) */}
      <directionalLight position={[-5, 6, -9]} intensity={2.1} color="#fed7aa" />

      {/* Cool Interior Fridge Light */}
      <pointLight position={[0, 1.2, 0.1]} color="#e0f2fe" intensity={1.8} distance={3.5} />

      {/* Hot Glow Accent on Compressor & Condenser */}
      <pointLight position={[0, -1.2, -1.1]} color="#ff4500" intensity={2.2} distance={3.5} />

      {/* Cold Glow Accent on Expansion Valve */}
      <pointLight position={[0.9, 1.2, 0.1]} color="#00f2fe" intensity={2.0} distance={3.0} />

      {/* ===================== WARM KITCHEN DIORAMA SET ===================== */}
      <KitchenDiorama isBackView={isBackView} />

      {/* ===================== CUTAWAY FRIDGE & MECHANICAL PARTS ===================== */}
      <FridgeModel doorAngle={doorAngle} cutawayProgress={cutawayProgress} />

      {/* ===================== FLOWING REFRIGERANT & STEAM/FROST ===================== */}
      <RefrigerantParticles />
      <HeatColdEffects />
    </ThreeCanvas>
  );
};
