import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { getThermodynamicState, refrigerationCurve } from "./refrigerationLoop";

const PARTICLE_COUNT = 52;

export const RefrigerantParticles: React.FC = () => {
  const frame = useCurrentFrame();

  // Calm, readable circulation along the closed loop
  const flowProgress = (frame * 0.0032) % 1;

  const particles = useMemo(() => {
    const list: Array<{
      position: [number, number, number];
      color: string;
      glowColor: string;
      scale: number;
    }> = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseT = i / PARTICLE_COUNT;
      const t = (baseT + flowProgress) % 1;

      const pt = refrigerationCurve.getPointAt(t);
      const state = getThermodynamicState(t);

      // Squeeze particles smaller right at the Expansion Valve bottleneck (~0.53-0.55)
      const isAtPinch = Math.abs(t - 0.54) < 0.025;
      const pulse = isAtPinch
        ? 0.55
        : 1 + Math.sin(frame * 0.25 + i * 0.7) * 0.16;

      list.push({
        position: [pt.x, pt.y, pt.z],
        color: state.temperatureColor,
        glowColor: state.glowColor,
        scale: 0.064 * pulse,
      });
    }

    return list;
  }, [flowProgress, frame]);

  return (
    <group>
      {particles.map((p, idx) => (
        <mesh key={idx} position={p.position}>
          <sphereGeometry args={[p.scale, 14, 14]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.glowColor}
            emissiveIntensity={1.8}
            roughness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
};
