import React, { useMemo } from "react";
import { random, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { EmissiveFieldMaterial } from "../materials/PBRMaterials";

/**
 * 1. Capacitive Touchscreen Sensor Grid:
 * Dua layer konduktif ortogonal (driving lines X dan sensing lines Y)
 * yang membentuk matriks kapasitansi mutual.
 */
export const CapacitiveSensorGrid3D: React.FC<{
  rows?: number;
  cols?: number;
  width?: number;
  height?: number;
  spacing?: number;
  activePoint?: [number, number]; // normalized [0..1, 0..1]
  touchIntensity?: number; // 0..1
}> = ({
  rows = 14,
  cols = 8,
  width = 2.4,
  height = 4.8,
  activePoint = [0.5, 0.5],
  touchIntensity = 0,
}) => {
  const frame = useCurrentFrame();

  const xLines = useMemo(() => {
    const list = [];
    const step = height / (rows - 1);
    for (let r = 0; r < rows; r++) {
      const y = -height / 2 + r * step;
      list.push(y);
    }
    return list;
  }, [rows, height]);

  const yLines = useMemo(() => {
    const list = [];
    const step = width / (cols - 1);
    for (let c = 0; c < cols; c++) {
      const x = -width / 2 + c * step;
      list.push(x);
    }
    return list;
  }, [cols, width]);

  // Touch position in 3D
  const touchX = -width / 2 + activePoint[0] * width;
  const touchY = -height / 2 + activePoint[1] * height;

  return (
    <group>
      {/* Driving Lines (Horizontal Layer - Amber/Gold) */}
      <group position={[0, 0, -0.02]}>
        {xLines.map((y, idx) => (
          <mesh key={`x-${idx}`} position={[0, y, 0]}>
            <boxGeometry args={[width, 0.025, 0.005]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.9}
              roughness={0.2}
              emissive="#f59e0b"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Sensing Lines (Vertical Layer - Electric Cyan) */}
      <group position={[0, 0, 0.02]}>
        {yLines.map((x, idx) => (
          <mesh key={`y-${idx}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.025, height, 0.005]} />
            <meshStandardMaterial
              color="#38bdf8"
              metalness={0.9}
              roughness={0.2}
              emissive="#38bdf8"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Dielectric / Insulating Spacer Layer */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width * 1.05, height * 1.05, 0.02]} />
        <meshPhysicalMaterial
          color="#0f172a"
          transparent
          opacity={0.3}
          roughness={0.1}
          transmission={0.8}
        />
      </mesh>

      {/* Electric Field Distortion Ring when touched */}
      {touchIntensity > 0.01 && (
        <group position={[touchX, touchY, 0.04]}>
          <mesh rotation={[0, 0, (frame * 0.05) % Math.PI]}>
            <ringGeometry args={[0.18, 0.22, 32]} />
            <EmissiveFieldMaterial
              color="#00f2fe"
              intensity={2.8 * touchIntensity}
              opacity={0.85 * touchIntensity}
            />
          </mesh>
          <mesh rotation={[0, 0, (-frame * 0.03) % Math.PI]}>
            <ringGeometry args={[0.32, 0.35, 32]} />
            <EmissiveFieldMaterial
              color="#38bdf8"
              intensity={1.8 * touchIntensity}
              opacity={0.6 * touchIntensity}
            />
          </mesh>
          {/* Capacitance Drop Wave */}
          <pointLight
            color="#00f2fe"
            intensity={2.5 * touchIntensity}
            distance={1.5}
          />
        </group>
      )}
    </group>
  );
};

/**
 * 2. Electrostatic Field Lines:
 * Garis gaya medan listrik melengkung antara jari konduktif manusia
 * dan sensor grid layar.
 */
export const ElectricFieldArc3D: React.FC<{
  fromPos: [number, number, number];
  toPos: [number, number, number];
  chargeActive?: boolean;
  color?: string;
}> = ({
  fromPos,
  toPos,
  chargeActive = true,
  color = "#00f2fe",
}) => {
  const frame = useCurrentFrame();

  const curve = useMemo(() => {
    const start = new THREE.Vector3(...fromPos);
    const end = new THREE.Vector3(...toPos);
    const mid = new THREE.Vector3(
      (start.x + end.x) / 2,
      (start.y + end.y) / 2,
      Math.max(start.z, end.z) + 0.35
    );
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [fromPos, toPos]);

  const points = useMemo(() => curve.getPoints(24), [curve]);
  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const pulse = Math.sin(frame * 0.2) * 0.5 + 0.5;

  return (
    <group>
      {/* @ts-expect-error line is native Three element */}
      <line geometry={lineGeo}>
        <lineBasicMaterial
          color={color}
          linewidth={2}
          transparent
          opacity={chargeActive ? 0.4 + 0.5 * pulse : 0.1}
        />
      </line>
    </group>
  );
};

/**
 * 3. Charge Particles / Free Electrons:
 * Partikel muatan listrik yang mengalir ke titik sentuh jari manusia.
 */
export const ChargeFlowParticles3D: React.FC<{
  count?: number;
  centerPos: [number, number, number];
  active: boolean;
  radius?: number;
}> = ({
  count = 60,
  centerPos,
  active,
  radius = 0.8,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 0.15 + (i % 5) * (radius / 5);
      const speed = 0.02 + (i % 3) * 0.01;
      pts.push({ angle, dist, speed, baseZ: (random(`particle-z-${i}`) - 0.5) * 0.1 });
    }
    return pts;
  }, [count, radius]);

  if (!active) return null;

  return (
    <group position={centerPos}>
      {particles.map((p, idx) => {
        // Animate inward drift towards touch point
        const drift = (frame * p.speed) % 1;
        const currentDist = p.dist * (1 - drift);
        const x = Math.cos(p.angle + drift * 2) * currentDist;
        const y = Math.sin(p.angle + drift * 2) * currentDist;
        const z = p.baseZ + Math.sin(frame * 0.1 + idx) * 0.02;

        return (
          <mesh key={idx} position={[x, y, z]}>
            <sphereGeometry args={[0.016, 8, 8]} />
            <EmissiveFieldMaterial color="#38bdf8" intensity={3} />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * 4. Human Finger Probe 3D:
 * Model geometris jari manusia konduktif yang menyentuh layar smartphone.
 */
export const HumanTouchFinger3D: React.FC<{
  position: [number, number, number];
  touchFrameOffset?: number;
  isPressed?: boolean;
}> = ({ position, isPressed = false }) => {
  return (
    <group position={position} rotation={[-0.4, 0.2, 0.1]}>
      {/* Finger Tip / Flesh */}
      <mesh position={[0, 0.35, 0.5]} rotation={[0.4, 0, 0]}>
        <capsuleGeometry args={[0.22, 1.2, 16, 32]} />
        <meshStandardMaterial
          color="#d97706"
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>
      {/* Fingernail detail */}
      <mesh position={[0, 0.2, 0.72]} rotation={[0.55, 0, 0]}>
        <boxGeometry args={[0.18, 0.3, 0.02]} />
        <meshStandardMaterial
          color="#fef3c7"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Bioelectric potential indicator glow around fingertip */}
      {isPressed && (
        <pointLight
          position={[0, 0, 0.1]}
          color="#38bdf8"
          intensity={1.2}
          distance={0.8}
        />
      )}
    </group>
  );
};
