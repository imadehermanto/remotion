import React, { useMemo } from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { EmissiveFieldMaterial } from "../studio/materials/PBRMaterials";

/**
 * 1. Premium GaN Fast Charger Outer Enclosure
 * Features:
 * - Bevelled / rounded corners
 * - Dual-tone finish (Matte charcoal chassis + High-gloss front fascia)
 * - Laser-etched technical branding ("65W GaN FAST CHARGE")
 * - Nickel-plated AC pins with insulated bases
 * - Recessed USB-C port with gold contact tongue and LED indicator ring
 * - Clean axial exploded view separation
 */
export const PremiumChargerHousing3D: React.FC<{
  explodeDistance?: number;
  thermalGlow?: number; // 0..1
  statusLedColor?: string;
}> = ({ explodeDistance = 0, thermalGlow = 0, statusLedColor = "#38bdf8" }) => {
  const frame = useCurrentFrame();

  const isExploded = explodeDistance > 0.05;

  return (
    <group>
      {/* ============================================================== */}
      {/* TOP HOUSING HALF (Moves upwards along Y in exploded view) */}
      {/* ============================================================== */}
      <group position={[0, 0.48 + explodeDistance * 1.5, 0]}>
        {/* Main curved top shell - Pristine Ceramic White */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.9, 2.1]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.16}
            metalness={0.06}
          />
        </mesh>

        {/* Top chamfer edge accent strips - Chrome Silver */}
        <mesh position={[0, 0.455, 0]}>
          <boxGeometry args={[1.44, 0.02, 2.04]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.12} metalness={0.9} />
        </mesh>

        {/* Side technical laser-etching simulation badge - Subtle Modern Typography */}
        <group position={[0.755, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <planeGeometry args={[1.2, 0.22]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <planeGeometry args={[0.9, 0.12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* BOTTOM HOUSING HALF (Moves downwards along Y in exploded view) */}
      {/* ============================================================== */}
      <group position={[0, -0.48 - explodeDistance * 1.5, 0]}>
        {/* Main bottom shell - Pristine Ceramic White */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.9, 2.1]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.16}
            metalness={0.06}
          />
        </mesh>

        {/* Bottom chamfer edge accent strip - Chrome Silver */}
        <mesh position={[0, -0.455, 0]}>
          <boxGeometry args={[1.44, 0.02, 2.04]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.12} metalness={0.9} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* FRONT FASCIA & USB-C PORT (Slides forward and drops in exploded view) */}
      {/* ============================================================== */}
      <group position={[0, isExploded ? -0.45 * explodeDistance : 0, 1.08 + (isExploded ? explodeDistance * 0.85 : 0)]}>
        {/* Sleek Ice-White / Gloss Fascia */}
        <mesh>
          <boxGeometry args={[1.46, 0.92, 0.08]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.08} metalness={0.15} />
        </mesh>

        {/* Recessed USB-C Bezel Frame */}
        <group position={[0, 0, 0.045]}>
          <mesh>
            <boxGeometry args={[0.62, 0.26, 0.02]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Deep receptacle interior */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.48, 0.16, 0.04]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Golden Center Connector Tongue */}
          <mesh position={[0, 0, 0.015]}>
            <boxGeometry args={[0.34, 0.028, 0.05]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.08} />
          </mesh>
        </group>

        {/* Subtle Smart Power LED Ring */}
        <group position={[0, 0.28, 0.045]}>
          <mesh>
            <ringGeometry args={[0.04, 0.065, 24]} />
            <EmissiveFieldMaterial
              color={statusLedColor}
              intensity={2.5 + Math.sin(frame * 0.15) * 0.5}
            />
          </mesh>
          <pointLight
            color={statusLedColor}
            intensity={1.2}
            distance={0.8}
            position={[0, 0, 0.05]}
          />
        </group>
      </group>

      {/* ============================================================== */}
      {/* BACK WALL & AC INPUT PINS (Moves backward along -Z if exploded) */}
      {/* ============================================================== */}
      <group position={[0, 0, -1.08 - (isExploded ? explodeDistance * 0.4 : 0)]}>
        {/* Rear Wall Plate - Clean Ceramic White */}
        <mesh>
          <boxGeometry args={[1.46, 0.92, 0.08]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.08} />
        </mesh>

        {/* Left AC Pin */}
        <group position={[-0.44, 0, -0.65]}>
          {/* Polished nickel-plated cylindrical prong */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 1.25, 24]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.65} roughness={0.15} />
          </mesh>
          {/* Rounded tip */}
          <mesh position={[0, 0, -0.62]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.65} roughness={0.15} />
          </mesh>
          {/* Dark insulating safety collar */}
          <mesh position={[0, 0, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.35, 24]} />
            <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.1} />
          </mesh>
        </group>

        {/* Right AC Pin */}
        <group position={[0.44, 0, -0.65]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 1.25, 24]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.65} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, -0.62]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.65} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.35, 24]} />
            <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

/**
 * 2. High-Fidelity SMPS Internal Circuit Board
 * Features:
 * - Multi-layer FR4 circuit board with gold/copper traces and solder pads
 * - Ferrite core micro-transformer with tightly coiled copper wire & yellow Kapton tape
 * - GaNFast Power MOSFET with golden thermal dissipation slug & solder pins
 * - Stamped aluminum heatsink fin plate
 * - Primary high-voltage electrolytic capacitor with cross-vent score
 * - Secondary solid-polymer filter capacitor
 * - Scattered SMD components (rectifier bridge, optocoupler, MLCC caps, chip resistors)
 */
export const HighDetailSMPSCircuit3D: React.FC<{
  heatIntensity?: number; // 0..1
  switchingRate?: number;
}> = ({ heatIntensity = 0, switchingRate = 1.0 }) => {
  const frame = useCurrentFrame();

  const switchPulse = (Math.sin(frame * switchingRate * 0.9) + 1) * 0.5;

  // Generate procedural SMD components across PCB
  const smdChips = useMemo(() => {
    const list = [];
    for (let i = 0; i < 18; i++) {
      const x = ((i % 6) - 2.5) * 0.18 + (random(`smd-x-${i}`) - 0.5) * 0.05;
      const z = (Math.floor(i / 6) - 1) * 0.45 + (random(`smd-z-${i}`) - 0.5) * 0.08;
      const w = 0.05 + (i % 3) * 0.025;
      const l = 0.08 + (i % 2) * 0.04;
      const color = i % 4 === 0 ? "#0284c7" : i % 3 === 0 ? "#b45309" : "#111827";
      list.push({ x, z, w, l, color });
    }
    return list;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ============================================================== */}
      {/* FR4 CIRCUIT BOARD SUBSTRATE */}
      {/* ============================================================== */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.34, 0.06, 1.96]} />
        <meshStandardMaterial
          color="#064e3b"
          roughness={0.25}
          metalness={0.2}
          emissive="#047857"
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Gold & Copper Printed Circuit Traces */}
      <group position={[0, 0.035, 0]}>
        <mesh position={[-0.32, 0, 0.1]}>
          <boxGeometry args={[0.04, 0.005, 1.3]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0.28, 0, -0.2]}>
          <boxGeometry args={[0.04, 0.005, 1.1]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0, -0.55]}>
          <boxGeometry args={[0.9, 0.005, 0.04]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[-0.1, 0, 0.6]}>
          <boxGeometry args={[0.7, 0.005, 0.03]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* HIGH-FREQUENCY MICRO-TRANSFORMER */}
      {/* ============================================================== */}
      <group position={[0.2, 0.26, -0.1]}>
        {/* Dark Ferrite E-Core Blocks */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.58, 0.42, 0.58]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.65}
            metalness={0.4}
            emissive="#ea580c"
            emissiveIntensity={heatIntensity * 0.7}
          />
        </mesh>

        {/* Tightly wound copper wire coil (Multi-layered cylinder) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.34, 32]} />
          <meshStandardMaterial
            color={heatIntensity > 0.4 ? "#f97316" : "#b45309"}
            metalness={0.94}
            roughness={0.15}
            emissive="#ef4444"
            emissiveIntensity={heatIntensity * 1.4}
          />
        </mesh>

        {/* Translucent Yellow Kapton Insulating Tape */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.345, 0.345, 0.12, 32]} />
          <meshStandardMaterial
            color="#eab308"
            roughness={0.2}
            metalness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Ferrite Core Clamp Band */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.59, 0.04, 0.59]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* GaN POWER SWITCHING TRANSISTOR (MOSFET) */}
      {/* ============================================================== */}
      <group position={[-0.34, 0.12, 0.32]}>
        {/* Black Epoxy IC Body */}
        <mesh>
          <boxGeometry args={[0.34, 0.12, 0.38]} />
          <meshStandardMaterial
            color="#090d16"
            roughness={0.35}
            metalness={0.3}
            emissive="#f97316"
            emissiveIntensity={heatIntensity * 0.9}
          />
        </mesh>

        {/* Gold Thermal Dissipation Slug on Top */}
        <mesh position={[0, 0.065, 0]}>
          <boxGeometry args={[0.24, 0.01, 0.26]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.96}
            roughness={0.08}
            emissive="#f59e0b"
            emissiveIntensity={heatIntensity * 1.6 + switchPulse * 0.4}
          />
        </mesh>

        {/* Solder Lead Pins (6 pins) */}
        {[-0.11, 0, 0.11].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, -0.04, 0.22]}>
              <boxGeometry args={[0.035, 0.03, 0.07]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[x, -0.04, -0.22]}>
              <boxGeometry args={[0.035, 0.03, 0.07]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Dynamic Switching Pulse Indicator Light */}
        <pointLight
          position={[0, 0.18, 0]}
          color={heatIntensity > 0.4 ? "#f97316" : "#38bdf8"}
          intensity={0.8 + switchPulse * 1.2 + heatIntensity * 2.2}
          distance={1.4}
        />
      </group>

      {/* ============================================================== */}
      {/* ALUMINUM HEATSINK FIN PLATE */}
      {/* ============================================================== */}
      <group position={[-0.34, 0.26, -0.08]}>
        {/* Base Plate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.36, 0.03, 0.36]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Cooling Fins */}
        {[-0.12, -0.04, 0.04, 0.12].map((x, i) => (
          <mesh key={i} position={[x, 0.08, 0]}>
            <boxGeometry args={[0.018, 0.14, 0.34]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
          </mesh>
        ))}
      </group>

      {/* ============================================================== */}
      {/* ELECTROLYTIC FILTER CAPACITORS */}
      {/* ============================================================== */}
      {/* Primary High-Voltage 400V Capacitor (Deep Blue Can) */}
      <group position={[-0.32, 0.28, -0.58]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.48, 24]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.25} metalness={0.7} />
        </mesh>
        {/* Aluminum Vent Top with K-Score */}
        <mesh position={[0, 0.245, 0]}>
          <cylinderGeometry args={[0.155, 0.155, 0.015, 24]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.18} metalness={0.95} />
        </mesh>
      </group>

      {/* Secondary Solid Polymer Capacitor (Cyan/Silver Can) */}
      <group position={[0.36, 0.22, 0.55]}>
        <mesh>
          <cylinderGeometry args={[0.13, 0.13, 0.36, 24]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.185, 0]}>
          <cylinderGeometry args={[0.125, 0.125, 0.015, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.12} metalness={0.96} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* SCATTERED SMD CHIPS, RESISTORS & OPTOCOUPLER */}
      {/* ============================================================== */}
      {smdChips.map((c, i) => (
        <mesh key={i} position={[c.x, 0.045, c.z]}>
          <boxGeometry args={[c.w, 0.02, c.l]} />
          <meshStandardMaterial color={c.color} roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * 3. AC 220V High-Voltage Sine Wave Stream (Shot 2)
 * Features:
 * - Parametric glowing sine wave traveling along prongs
 * - Traveling electric phase beads
 * - Clean voltage annotation tags
 */
export const SineWaveEnergyStream3D: React.FC<{
  active: boolean;
}> = ({ active }) => {
  const frame = useCurrentFrame();

  const wavePoints = useMemo(() => {
    const pts = [];
    const count = 72;
    for (let i = 0; i < count; i++) {
      const z = -2.4 + (i / count) * 1.35;
      const progress = i / count;
      const amplitude = 0.28 * Math.sin(progress * Math.PI);
      const y = Math.sin(progress * 16 - frame * 0.28) * amplitude;
      const x = Math.cos(progress * 16 - frame * 0.28) * (amplitude * 0.35);
      pts.push(new THREE.Vector3(x - 0.44, y, z));
    }
    return pts;
  }, [frame]);

  const waveGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(wavePoints), [wavePoints]);

  if (!active) return null;

  return (
    <group>
      {/* @ts-expect-error line is native Three element */}
      <line geometry={waveGeo}>
        <lineBasicMaterial color="#00f2fe" linewidth={3} transparent opacity={0.9} />
      </line>

      {/* Traveling Energy Pulse Beads */}
      {[0, 1, 2].map((idx) => {
        const t = (frame * 0.06 + idx * 0.33) % 1;
        const z = -2.4 + t * 1.35;
        const y = Math.sin(t * 16 - frame * 0.28) * (0.28 * Math.sin(t * Math.PI));
        return (
          <mesh key={idx} position={[-0.44, y, z]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <EmissiveFieldMaterial color="#38bdf8" intensity={3.8} />
          </mesh>
        );
      })}

      {/* Pin contact spark aura */}
      <pointLight position={[-0.44, 0, -1.05]} color="#00f2fe" intensity={1.8} distance={1.2} />
    </group>
  );
};

/**
 * 4. Cinematic Thermal Radiation Heat Flux Particles (Shot 4)
 * Features:
 * - Rising caloric micro-particles with natural buoyancy
 * - Realistic color ramp: Incandescent Gold -> Fiery Orange -> Deep Crimson
 * - Warm atmospheric point light
 */
export const CinematicThermalParticles3D: React.FC<{
  intensity: number; // 0..1
  count?: number;
}> = ({ intensity, count = 56 }) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 0.018 + (i % 5) * 0.007;
      const originX = (i % 2 === 0 ? 0.2 : -0.34) + (random(`tp-x-${i}`) - 0.5) * 0.22;
      const originY = 0.22 + (random(`tp-y-${i}`) - 0.5) * 0.12;
      const originZ = (i % 2 === 0 ? -0.1 : 0.32) + (random(`tp-z-${i}`) - 0.5) * 0.22;
      list.push({ angle, speed, originX, originY, originZ });
    }
    return list;
  }, [count]);

  if (intensity < 0.02) return null;

  return (
    <group>
      {particles.map((p, i) => {
        const drift = (frame * p.speed) % 1;
        const radius = drift * (0.65 + intensity * 0.6);
        const x = p.originX + Math.cos(p.angle) * radius;
        const y = p.originY + drift * 0.85 + Math.sin(frame * 0.12 + i) * 0.04;
        const z = p.originZ + Math.sin(p.angle) * radius;
        const scale = (1 - drift) * (0.018 + intensity * 0.032);

        const color = drift < 0.25 ? "#fef08a" : drift < 0.65 ? "#f97316" : "#ef4444";

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[scale, 8, 8]} />
            <EmissiveFieldMaterial
              color={color}
              intensity={2.8 * intensity * (1 - drift)}
              opacity={0.85 * (1 - drift)}
            />
          </mesh>
        );
      })}

      {/* Atmospheric internal Joule heating glow */}
      <pointLight
        position={[0, 0.35, 0]}
        color="#ea580c"
        intensity={3.8 * intensity}
        distance={2.8}
      />
    </group>
  );
};

/**
 * 5. Cinematic 3D Thermal Safety Gauge (Shot 5)
 * Positioned in safe mid-upper 3D coordinates (Y = 0.85) to PREVENT ANY COLLISION with top headline!
 * Features:
 * - Gunmetal outer bezel ring with graduation ticks
 * - Green/Amber Safe Zone Arc (40°C - 55°C)
 * - Pulsing Red Danger Zone Arc (>65°C)
 * - Smoothly damped indicator needle
 * - Digital temperature readout plaque below gauge
 */
export const CinematicThermalGauge3D: React.FC<{
  visible: boolean;
  temperatureCelsius?: number; // e.g. 48.5
}> = ({ visible, temperatureCelsius = 48.5 }) => {
  const frame = useCurrentFrame();

  if (!visible) return null;

  const clampedTemp = Math.max(20, Math.min(80, temperatureCelsius));
  // Needle angle: -135deg to +135deg
  const angle = interpolate(clampedTemp, [20, 80], [Math.PI * 0.72, -Math.PI * 0.72]);

  const isSafeZone = clampedTemp >= 40 && clampedTemp <= 55;
  const isDangerZone = clampedTemp >= 65;

  return (
    <group position={[0, 0.45, 0.2]} scale={0.82} rotation={[0.12, 0, 0]}>
      {/* Outer Dial Bezel */}
      <mesh>
        <ringGeometry args={[0.54, 0.62, 48]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Dial Face Backing */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.55, 32]} />
        <meshStandardMaterial color="#090d16" roughness={0.8} />
      </mesh>

      {/* Safe Fast-Charging Arc (40°C - 55°C) Vibrant Green */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.46, 0.52, 32, 1, Math.PI * 0.12, Math.PI * 0.52]} />
        <EmissiveFieldMaterial color="#22c55e" intensity={2.2} opacity={0.88} />
      </mesh>

      {/* Danger Zone Arc (>65°C) Alert Red */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.46, 0.52, 32, 1, -Math.PI * 0.52, Math.PI * 0.42]} />
        <EmissiveFieldMaterial
          color="#ef4444"
          intensity={isDangerZone ? 3.5 + Math.sin(frame * 0.35) * 1.8 : 1.4}
          opacity={0.88}
        />
      </mesh>

      {/* Center Pivot Hub */}
      <mesh position={[0, 0, 0.035]}>
        <cylinderGeometry args={[0.075, 0.075, 0.03, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Precision Indicator Needle */}
      <group position={[0, 0, 0.045]} rotation={[0, 0, angle]}>
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[0.02, 0.42, 0.008]} />
          <EmissiveFieldMaterial
            color={isDangerZone ? "#ef4444" : isSafeZone ? "#22c55e" : "#f59e0b"}
            intensity={2.8}
          />
        </mesh>
      </group>

      {/* Digital Readout Tag below dial */}
      <group position={[0, -0.42, 0.03]}>
        <mesh>
          <planeGeometry args={[0.58, 0.16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        <pointLight
          position={[0, 0, 0.1]}
          color={isDangerZone ? "#ef4444" : isSafeZone ? "#22c55e" : "#f59e0b"}
          intensity={1.6}
          distance={0.8}
        />
      </group>
    </group>
  );
};
