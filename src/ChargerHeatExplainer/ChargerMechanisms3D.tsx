import React, { useMemo } from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { EmissiveFieldMaterial } from "../studio/materials/PBRMaterials";

/**
 * 1. Charger Adapter Outer Shell (Exploded-capable)
 */
export const ChargerOuterShell3D: React.FC<{
  explodeDistance?: number;
  thermalGlow?: number; // 0..1
}> = ({ explodeDistance = 0, thermalGlow = 0 }) => {
  const bodyMaterial = (
    <meshStandardMaterial
      color="#1e2430"
      roughness={0.4}
      metalness={0.2}
      emissive="#ea580c"
      emissiveIntensity={thermalGlow * 0.4}
    />
  );

  return (
    <group>
      {/* Top Half Housing */}
      <mesh position={[0, 0.45 + explodeDistance * 0.8, 0]}>
        <boxGeometry args={[1.5, 0.9, 2.2]} />
        {bodyMaterial}
      </mesh>

      {/* Bottom Half Housing */}
      <mesh position={[0, -0.45 - explodeDistance * 0.8, 0]}>
        <boxGeometry args={[1.5, 0.9, 2.2]} />
        {bodyMaterial}
      </mesh>

      {/* USB-C Port Faceplate on front face (Z = +1.1) */}
      <group position={[0, 0, 1.12 + (explodeDistance > 0 ? 0.3 : 0)]}>
        {/* Bezel */}
        <mesh>
          <boxGeometry args={[0.7, 0.3, 0.05]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.5} />
        </mesh>
        {/* Oval USB-C cavity */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.42, 0.14, 0.03]} />
          <meshStandardMaterial color="#000000" roughness={0.9} />
        </mesh>
        {/* Center Golden Tongue Connector */}
        <mesh position={[0, 0, 0.035]}>
          <boxGeometry args={[0.32, 0.03, 0.04]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* Dual AC Prongs on back face (Z = -1.1) */}
      <group position={[0, 0, -1.1]}>
        {/* Left Prong */}
        <group position={[-0.42, 0, -0.55]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 1.1, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Insulating base ring */}
          <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 24]} />
            <meshStandardMaterial color="#090d16" roughness={0.5} />
          </mesh>
        </group>

        {/* Right Prong */}
        <group position={[0.42, 0, -0.55]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 1.1, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Insulating base ring */}
          <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 24]} />
            <meshStandardMaterial color="#090d16" roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

/**
 * 2. SMPS Internal PCB & Micro-Components
 */
export const SMPSInternalCircuit3D: React.FC<{
  heatIntensity?: number; // 0..1 (Joule Heating level)
  switchingRate?: number; // frequency pulse rate
}> = ({ heatIntensity = 0, switchingRate = 0.5 }) => {
  const frame = useCurrentFrame();

  const switchPulse = (Math.sin(frame * switchingRate * 0.8) + 1) * 0.5;

  return (
    <group position={[0, 0, 0]}>
      {/* Main FR4 PCB Substrate (Greenish Dark Epoxy) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.35, 0.08, 1.95]} />
        <meshStandardMaterial
          color="#064e3b"
          roughness={0.3}
          metalness={0.1}
          emissive="#047857"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Copper PCB Traces */}
      <group position={[0, 0.045, 0]}>
        <mesh position={[-0.3, 0, 0.2]}>
          <boxGeometry args={[0.06, 0.005, 1.2]} />
          <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[0.3, 0, -0.3]}>
          <boxGeometry args={[0.06, 0.005, 0.9]} />
          <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -0.6]}>
          <boxGeometry args={[0.8, 0.005, 0.06]} />
          <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.2} />
        </mesh>
      </group>

      {/* High-Frequency Ferrite Transformer Core & Copper Winding */}
      <group position={[0.18, 0.28, -0.15]}>
        {/* Ferrite Core E-Blocks (Dark ceramic magnetic core) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.62, 0.45, 0.62]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.7}
            metalness={0.4}
            emissive="#ea580c"
            emissiveIntensity={heatIntensity * 0.6}
          />
        </mesh>

        {/* Copper Wire Windings (Layered Coils) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.36, 32]} />
          <meshStandardMaterial
            color={heatIntensity > 0.4 ? "#f97316" : "#b45309"}
            metalness={0.92}
            roughness={0.18}
            emissive="#ef4444"
            emissiveIntensity={heatIntensity * 1.2}
          />
        </mesh>

        {/* Transformer Yellow Insulating Mylar Tape */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.385, 0.385, 0.12, 32]} />
          <meshStandardMaterial
            color="#eab308"
            roughness={0.25}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* GaN / Silicon Power MOSFET Switching IC */}
      <group position={[-0.35, 0.14, 0.35]}>
        {/* Black Epoxy Package */}
        <mesh>
          <boxGeometry args={[0.38, 0.14, 0.42]} />
          <meshStandardMaterial
            color="#111827"
            roughness={0.4}
            metalness={0.3}
            emissive="#f97316"
            emissiveIntensity={heatIntensity * 0.9}
          />
        </mesh>
        {/* Gold Plated Thermal Slug / Cooling Pad on top */}
        <mesh position={[0, 0.075, 0]}>
          <boxGeometry args={[0.26, 0.01, 0.28]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.1}
            emissive="#f59e0b"
            emissiveIntensity={heatIntensity * 1.5 + switchPulse * 0.4}
          />
        </mesh>
        {/* Solder Lead Pins */}
        {[-0.14, 0, 0.14].map((x, i) => (
          <mesh key={i} position={[x, -0.05, 0.24]}>
            <boxGeometry args={[0.04, 0.04, 0.08]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Switching High-Frequency Glow Indicator */}
        <pointLight
          position={[0, 0.2, 0]}
          color={heatIntensity > 0.3 ? "#f97316" : "#38bdf8"}
          intensity={0.6 + switchPulse * 0.8 + heatIntensity * 2.0}
          distance={1.2}
        />
      </group>

      {/* Primary High-Voltage Electrolytic Smoothing Capacitors (Cylindrical Cans) */}
      <group position={[-0.32, 0.32, -0.55]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.55, 24]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Aluminum Vent Top */}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.02, 24]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* Secondary Solid Polymer Filter Capacitors */}
      <group position={[0.35, 0.24, 0.6]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.14, 0.4, 24]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.205, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 24]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.1} metalness={0.95} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * 3. AC 220V Sine Wave vs DC 5V-9V Energy Flow
 */
export const EnergyConversionWave3D: React.FC<{
  active: boolean;
}> = ({ active }) => {
  const frame = useCurrentFrame();

  const points = useMemo(() => {
    const pts = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const z = -2.2 + (i / count) * 1.2;
      const progress = i / count;
      // High-voltage alternating sine wave
      const amplitude = 0.32 * Math.sin(progress * Math.PI);
      const y = Math.sin(progress * 18 - frame * 0.25) * amplitude;
      const x = Math.cos(progress * 18 - frame * 0.25) * (amplitude * 0.4);
      pts.push(new THREE.Vector3(x - 0.42, y, z));
    }
    return pts;
  }, [frame]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  if (!active) return null;

  return (
    <group>
      {/* @ts-expect-error line is native Three element */}
      <line geometry={geometry}>
        <lineBasicMaterial color="#38bdf8" linewidth={3} transparent opacity={0.85} />
      </line>

      {/* Pulsing AC voltage indicator beads */}
      {[0, 1, 2, 3].map((idx) => {
        const t = ((frame * 0.05 + idx * 0.25) % 1);
        const z = -2.2 + t * 1.2;
        const y = Math.sin(t * 18 - frame * 0.25) * 0.25;
        return (
          <mesh key={idx} position={[-0.42, y, z]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <EmissiveFieldMaterial color="#00f2fe" intensity={3.5} />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * 4. Joule Heating & Thermal Radiation Heat Flux Particles (I²R Losses)
 */
export const ThermalRadiationParticles3D: React.FC<{
  intensity: number; // 0..1
  count?: number;
}> = ({ intensity, count = 48 }) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 0.015 + (i % 4) * 0.008;
      const originX = (i % 2 === 0 ? 0.18 : -0.35) + (random(`heat-ox-${i}`) - 0.5) * 0.2;
      const originY = 0.25 + (random(`heat-oy-${i}`) - 0.5) * 0.15;
      const originZ = (i % 2 === 0 ? -0.15 : 0.35) + (random(`heat-oz-${i}`) - 0.5) * 0.2;
      list.push({ angle, speed, originX, originY, originZ });
    }
    return list;
  }, [count]);

  if (intensity < 0.02) return null;

  return (
    <group>
      {particles.map((p, i) => {
        const drift = ((frame * p.speed) % 1);
        const radius = drift * (0.8 + intensity * 0.7);
        const x = p.originX + Math.cos(p.angle) * radius;
        const y = p.originY + drift * 0.7 + Math.sin(frame * 0.1 + i) * 0.05;
        const z = p.originZ + Math.sin(p.angle) * radius;
        const scale = (1 - drift) * (0.02 + intensity * 0.035);

        const color = drift < 0.3 ? "#ef4444" : drift < 0.7 ? "#f97316" : "#eab308";

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[scale, 8, 8]} />
            <EmissiveFieldMaterial
              color={color}
              intensity={2.5 * intensity * (1 - drift)}
              opacity={0.8 * (1 - drift)}
            />
          </mesh>
        );
      })}

      {/* Omnidirectional warm thermal glow */}
      <pointLight
        position={[0, 0.4, 0]}
        color="#ea580c"
        intensity={3.2 * intensity}
        distance={2.5}
      />
    </group>
  );
};

/**
 * 5. 3D Thermal Safety Gauge Meter
 * Normal: 40°C - 55°C (Green/Amber Zone)
 * Danger: >65°C (Red Alert Zone)
 */
export const ThermalSafetyMeter3D: React.FC<{
  visible: boolean;
  temperatureCelsius?: number; // e.g. 48.5
}> = ({ visible, temperatureCelsius = 48 }) => {
  const frame = useCurrentFrame();

  if (!visible) return null;

  // Map 20°C..80°C to angle range -Math.PI * 0.75 .. Math.PI * 0.75
  const clampedTemp = Math.max(20, Math.min(80, temperatureCelsius));
  const angle = interpolate(clampedTemp, [20, 80], [Math.PI * 0.75, -Math.PI * 0.75]);

  const isSafeZone = clampedTemp >= 40 && clampedTemp <= 55;
  const isDangerZone = clampedTemp >= 65;

  return (
    <group position={[0, 1.4, 0.4]} rotation={[0.2, 0, 0]}>
      {/* Gauge Outer Ring Frame */}
      <mesh>
        <ringGeometry args={[0.62, 0.7, 48]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Normal Zone Arc (40°C - 55°C) Green / Amber Accent */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.54, 0.6, 32, 1, Math.PI * 0.1, Math.PI * 0.55]} />
        <EmissiveFieldMaterial color="#22c55e" intensity={1.8} opacity={0.8} />
      </mesh>

      {/* Danger Zone Arc (>65°C) Pulsing Warning Red */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.54, 0.6, 32, 1, -Math.PI * 0.5, Math.PI * 0.4]} />
        <EmissiveFieldMaterial
          color="#ef4444"
          intensity={isDangerZone ? 3.0 + Math.sin(frame * 0.3) * 1.5 : 1.2}
          opacity={0.85}
        />
      </mesh>

      {/* Center Dial Hub */}
      <mesh position={[0, 0, 0.04]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Indicator Needle */}
      <group position={[0, 0, 0.05]} rotation={[0, 0, angle]}>
        <mesh position={[0, 0.24, 0]}>
          <boxGeometry args={[0.025, 0.48, 0.01]} />
          <EmissiveFieldMaterial
            color={isDangerZone ? "#ef4444" : isSafeZone ? "#22c55e" : "#f59e0b"}
            intensity={2.5}
          />
        </mesh>
      </group>

      {/* Ambient Dial Point Light */}
      <pointLight
        position={[0, 0, 0.2]}
        color={isDangerZone ? "#ef4444" : "#22c55e"}
        intensity={1.5}
        distance={1.0}
      />
    </group>
  );
};
