import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";

const HEAT_PUFF_COUNT = 20;
const FROST_CRYSTAL_COUNT = 24;

export const HeatColdEffects: React.FC = () => {
  const frame = useCurrentFrame();

  // Heat steam puffs behind condenser (peaks in Scene 4 & 5: frames 560-970)
  const heatOpacity = interpolate(
    frame,
    [550, 620, 940, 1000],
    [0.2, 0.85, 0.85, 0.25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Frost crystals around Expansion Valve & Evaporator
  const coldOpacity = interpolate(
    frame,
    [400, 460, 1480, 1530],
    [0.25, 0.85, 0.85, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Gentle rising warm steam puffs off the back Condenser Coils
  const heatPuffs = useMemo(() => {
    return Array.from({ length: HEAT_PUFF_COUNT }).map((_, i) => {
      const seed = i * 13.7;
      const progress = (frame * 0.012 + seed) % 1;
      const x = -0.55 + ((i % 7) / 6) * 1.1 + Math.sin(frame * 0.03 + i) * 0.06;
      const y = -0.9 + progress * 2.1;
      const z = -1.12 - progress * 0.42;
      const scale = 0.055 + progress * 0.1;
      const alpha = Math.sin(progress * Math.PI) * heatOpacity;

      return { x, y, z, scale, alpha };
    });
  }, [frame, heatOpacity]);

  // Gently floating 3D ice crystals inside the fridge & around Expansion Valve
  const frostCrystals = useMemo(() => {
    return Array.from({ length: FROST_CRYSTAL_COUNT }).map((_, i) => {
      const seed = i * 23.1;
      const progress = (frame * 0.01 + seed) % 1;
      const isValveCluster = i < 10;
      const x = isValveCluster
        ? 0.82 + Math.cos(progress * Math.PI * 2 + i) * (0.14 + progress * 0.2)
        : -0.55 + ((i % 6) / 5) * 1.1 + Math.sin(frame * 0.025 + i) * 0.06;
      const y = isValveCluster
        ? 1.22 + Math.sin(progress * Math.PI * 2 + i) * (0.14 + progress * 0.2)
        : 1.0 - progress * 0.85;
      const z = isValveCluster
        ? 0.05 + progress * 0.35
        : -0.15 + Math.cos(frame * 0.025 + i) * 0.22;
      const scale = (isValveCluster ? 0.052 : 0.042) * (1 - progress * 0.25);
      const alpha = Math.sin(progress * Math.PI) * coldOpacity;
      const rot = frame * 0.035 + i;

      return { x, y, z, scale, alpha, rot };
    });
  }, [frame, coldOpacity]);

  return (
    <group>
      {/* Rising Warm Steam Puffs */}
      {heatPuffs.map((p, idx) => {
        if (p.alpha <= 0.02) return null;
        return (
          <mesh key={`heat-${idx}`} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.scale, 12, 12]} />
            <meshStandardMaterial
              color="#fed7aa"
              emissive="#f97316"
              emissiveIntensity={0.9}
              transparent
              opacity={p.alpha}
              roughness={0.7}
            />
          </mesh>
        );
      })}

      {/* Low-Poly 3D Ice / Frost Crystals (Octahedron) */}
      {frostCrystals.map((p, idx) => {
        if (p.alpha <= 0.02) return null;
        return (
          <mesh
            key={`cold-${idx}`}
            position={[p.x, p.y, p.z]}
            rotation={[p.rot, p.rot * 0.7, 0]}
          >
            <octahedronGeometry args={[p.scale, 0]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#00f2fe"
              emissiveIntensity={1.4}
              transparent
              opacity={p.alpha}
              roughness={0.15}
            />
          </mesh>
        );
      })}
    </group>
  );
};
