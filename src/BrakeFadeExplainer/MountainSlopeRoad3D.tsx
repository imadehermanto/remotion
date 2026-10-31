import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Asset3D, MODELS, MotorMatic3D } from "../assets";

interface MountainSlopeRoad3DProps {
  showEmergencyRamp?: boolean;
}

export const MountainSlopeRoad3D: React.FC<MountainSlopeRoad3DProps> = ({
  showEmergencyRamp = true,
}) => {
  const frame = useCurrentFrame();

  // Downhill scooter motion:
  // Scene 1 (0 - 268) bike moves steadily down the slope
  const bikeProg1 = interpolate(frame, [0, 268], [-4.0, 3.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 5 (1175 - 1478) runaway bike hurtles down faster towards emergency ramp
  const runawayProg = interpolate(frame, [1175, 1478], [-5.0, 4.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isRunaway = frame >= 1175 && frame < 1478;
  const bikeProg = isRunaway ? runawayProg : bikeProg1;

  // Road slope angle: ~16 degrees
  const slopeAngle = 0.28;

  // Road marking dash offset for speed illusion
  const roadMarkingOffset = (frame * (isRunaway ? 0.38 : 0.22)) % 2;

  // Wheel rotation
  const wheelSpin = frame * (isRunaway ? 0.48 : 0.26);

  // Brake glow intensity on the front wheel
  const brakeGlow = isRunaway
    ? 1.0
    : interpolate(frame, [0, 268], [0.35, 0.85], { extrapolateRight: "clamp" });

  const dashPositions = useMemo(() => {
    const list: number[] = [];
    for (let i = -16; i <= 16; i += 2) {
      list.push(i);
    }
    return list;
  }, []);

  // Speed dust particles trailing behind the scooter
  const dustParticles = useMemo(() => {
    const list: { id: number; seed: number; offset: [number, number, number] }[] = [];
    for (let i = 0; i < 18; i++) {
      list.push({
        id: i,
        seed: i * 0.77,
        offset: [((i % 3) - 1) * 0.12, 0.1, -0.6 - (i * 0.08)],
      });
    }
    return list;
  }, []);

  return (
    <group rotation={[slopeAngle, 0, 0]}>
      {/* Mountain Terrain Slope Base */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[14, 0.7, 34]} />
        <meshStandardMaterial color="#2d3748" roughness={0.92} />
      </mesh>

      {/* Lush Green Mountain Verge */}
      <mesh position={[-3.8, -0.02, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.15, 34]} />
        <meshStandardMaterial color="#1e3a1e" roughness={0.95} />
      </mesh>
      <mesh position={[3.8, -0.02, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.15, 34]} />
        <meshStandardMaterial color="#1e3a1e" roughness={0.95} />
      </mesh>

      {/* Main Asphalt Road */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[4.4, 0.12, 34]} />
        <meshStandardMaterial color="#111827" roughness={0.82} />
      </mesh>

      {/* Road White Side Edges */}
      <mesh position={[-1.95, 0.12, 0]}>
        <boxGeometry args={[0.15, 0.01, 34]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      <mesh position={[1.95, 0.12, 0]}>
        <boxGeometry args={[0.15, 0.01, 34]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Center Yellow Dashed Line */}
      <group position={[0, 0.12, -roadMarkingOffset]}>
        {dashPositions.map((z, idx) => (
          <mesh key={idx} position={[0, 0, z]}>
            <boxGeometry args={[0.16, 0.01, 1.1]} />
            <meshStandardMaterial color="#facc15" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Red/White Warning Rumble Strips before Emergency Ramp */}
      {[-2, -1.4, -0.8, -0.2].map((rz, rIdx) => (
        <mesh key={rIdx} position={[0.7, 0.125, rz]}>
          <boxGeometry args={[2.2, 0.008, 0.18]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
      ))}

      {/* Guardrails (Pembatas Jalan Baja) */}
      {[-2.3, 2.3].map((xSide, sIdx) => (
        <group key={sIdx} position={[xSide, 0.45, 0]}>
          {/* Rail bar */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.25, 34]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
          </mesh>
          {/* Support posts */}
          {[-14, -11, -8, -5, -2, 1, 4, 7, 10, 13].map((pz, pIdx) => (
            <mesh key={pIdx} position={[0, -0.25, pz]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Emergency Runaway Sand Ramp (JALUR PENYELAMAT REM BLONG) */}
      {showEmergencyRamp && (
        <group position={[3.3, 0.25, 3]} rotation={[0, -0.22, 0]}>
          {/* Red Gravel Sand Trap Bed */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.0, 0.3, 10]} />
            <meshStandardMaterial color="#c2410c" roughness={0.98} />
          </mesh>
          {/* Striped Entry Curb */}
          <mesh position={[-1.0, 0.2, -4.6]}>
            <boxGeometry args={[0.2, 0.4, 1.4]} />
            <meshStandardMaterial color="#eab308" roughness={0.5} />
          </mesh>
          {/* Emergency Sandbags & Barrels at the end */}
          {[-0.6, 0, 0.6].map((bx, bIdx) => (
            <mesh key={bIdx} position={[bx, 0.4, 4.5]}>
              <cylinderGeometry args={[0.26, 0.26, 0.7, 12]} />
              <meshStandardMaterial color="#ea580c" roughness={0.7} />
            </mesh>
          ))}

          {/* Signboard: JALUR PENYELAMAT REM BLONG */}
          <group position={[-1.2, 1.25, -4.0]} rotation={[0, 0.3, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.6, 0.65, 0.06]} />
              <meshStandardMaterial color="#dc2626" roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.7, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.85, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>
          </group>
        </group>
      )}

      {/* Steep Slope Warning Sign (AWAS TURUNAN CURAM) */}
      <group position={[-2.7, 1.35, -3.5]} rotation={[0, 0.35, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.95, 0.95, 0.04]} />
          <meshStandardMaterial color="#facc15" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.025]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.8, 0.01]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.035]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.7, 0.7, 0.01]} />
          <meshStandardMaterial color="#facc15" roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 1.25, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>

      {/* Roadside Trees and Rocks for Mountain Atmosphere */}
      <group position={[-4.5, 0.1, -5]}>
        <Asset3D model={MODELS.nature.treeSmall} targetSize={2.5} />
      </group>
      <group position={[-4.8, 0.1, 4]}>
        <Asset3D model={MODELS.nature.treeSmall} targetSize={2.8} />
      </group>
      <group position={[4.6, 0.1, -2]}>
        <Asset3D model={MODELS.nature.treeSmall} targetSize={2.2} />
      </group>
      <group position={[-3.6, 0.1, 1]}>
        <Asset3D model={MODELS.nature.rock} targetSize={1.1} />
      </group>

      {/* Visual Easter Egg: Cute Roadside Dog watching with curiosity */}
      <group position={[-3.2, 0.2, -1]} rotation={[0, 1.2, 0]}>
        <Asset3D model={MODELS.characters.dog} targetSize={0.8} />
      </group>

      {/* ================================================================== */}
      {/* 3D MOTOR MATIC INDONESIA (MELUNCUR TURUN DI JALUR TURUNAN)         */}
      {/* ================================================================== */}
      <group position={[0.65, 0.12, bikeProg]}>
        {/* Motor Matic 3D Model: Menghadap ke Bawah Lereng (+Z) */}
        <MotorMatic3D
          scale={1.05}
          wheelRotation={wheelSpin}
          brakeGlow={brakeGlow}
          bodyColor="#0284c7"
          accentColor="#0f172a"
        />

        {/* Speed Dust / Friction Smoke Partikel di Belakang Roda */}
        {dustParticles.map((d) => {
          const t = (frame * (isRunaway ? 0.06 : 0.035) + d.seed) % 1;
          const px = d.offset[0] + Math.sin(t * 5 + d.seed) * 0.08;
          const py = d.offset[1] + t * 0.35;
          const pz = d.offset[2] - t * 0.8;
          const scale = 0.04 + t * 0.12;
          const opacity = (1 - t) * 0.55;

          return (
            <mesh key={d.id} position={[px, py, pz]} scale={scale}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshStandardMaterial
                color={brakeGlow > 0.5 ? "#fed7aa" : "#e2e8f0"}
                transparent
                opacity={opacity}
                roughness={1}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
