import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { MODELS } from "../catalog";
import { Asset3D } from "./Asset3D";

/**
 * 1. Panggung Gang Perumahan Indonesia 3D (How Come? Style)
 * Lengkap dengan deretan rumah, jalan gang beton, tiang listrik, pohon, dan opsi penutup plastik/karung goni.
 */
export interface IndonesianAlleyStage3DProps {
  /** Kondisi jalan cor: "soil" (tanah), "wet-concrete" (cor basah), "plastic" (ditutup plastik), "burlap" (ditutup karung goni), "grooved" (digaruk sapu lidi) */
  roadState?: "soil" | "wet-concrete" | "plastic" | "burlap" | "grooved";
  /** Tampilkan palang kayu di depan gang */
  showBarrier?: boolean;
}

export const IndonesianAlleyStage3D: React.FC<IndonesianAlleyStage3DProps> = ({
  roadState = "wet-concrete",
  showBarrier = false,
}) => {
  return (
    <group position={[0, -2.0, 0]}>
      {/* Tanah Dasar */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[14, 0.3, 18]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>

      {/* Jalan Gang Beton di Tengah */}
      {roadState !== "soil" && (
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <boxGeometry args={[3.2, 0.12, 16]} />
          <meshStandardMaterial
            color={roadState === "wet-concrete" ? "#64748b" : "#94a3b8"}
            roughness={roadState === "wet-concrete" ? 0.25 : 0.75}
            metalness={roadState === "wet-concrete" ? 0.15 : 0.05}
          />
        </mesh>
      )}

      {/* Alur Garukan Sapu Lidi di Atas Beton */}
      {roadState === "grooved" &&
        Array.from({ length: 28 }).map((_, i) => (
          <mesh key={`groove-${i}`} position={[0, 0.105, -6 + i * 0.45]}>
            <boxGeometry args={[3.0, 0.012, 0.04]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>
        ))}

      {/* Penutup Plastik Putih Transparan (Setengah Hari Pertama) */}
      {roadState === "plastic" && (
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[3.35, 0.02, 14]} />
          <meshStandardMaterial
            color="#f8fafc"
            transparent
            opacity={0.72}
            roughness={0.18}
          />
        </mesh>
      )}

      {/* Penutup Deretan Karung Goni Basah (7 Hari Curing) */}
      {roadState === "burlap" &&
        Array.from({ length: 8 }).map((_, row) =>
          [-0.75, 0.75].map((xPos, col) => (
            <Asset3D
              key={`burlap-${row}-${col}`}
              model={MODELS.tools.burlapFlat}
              targetSize={1.55}
              position={[xPos, 0.1, -5 + row * 1.4]}
              rotation={[0, (row + col) * 0.15, 0]}
            />
          ))
        )}

      {/* Deretan Rumah Kiri & Kanan Gang */}
      <Asset3D
        model={MODELS.buildings.house3}
        targetSize={4.2}
        position={[-3.8, 0, -1.5]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Asset3D
        model={MODELS.buildings.house4}
        targetSize={4.2}
        position={[-3.8, 0, -6.2]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Asset3D
        model={MODELS.buildings.house5}
        targetSize={4.2}
        position={[3.8, 0, -2.0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Asset3D
        model={MODELS.buildings.house1}
        targetSize={4.0}
        position={[3.8, 0, -6.5]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Pohon & Tanaman Teras */}
      <Asset3D
        model={MODELS.nature.treeSmall}
        targetSize={2.8}
        position={[-2.4, 0, -4.0]}
      />
      <Asset3D
        model={MODELS.nature.lowPolyTree}
        targetSize={3.2}
        position={[2.5, 0, -4.5]}
      />
      <Asset3D
        model={MODELS.nature.pottedPlant}
        targetSize={0.75}
        position={[-2.1, 0, -0.5]}
      />

      {/* Tiang Listrik Gang */}
      <mesh position={[1.85, 2.2, -1.2]} castShadow>
        <cylinderGeometry args={[0.11, 0.13, 4.6, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Palang Kayu "JANGAN DILEWATI" */}
      {showBarrier && (
        <group position={[0, 0, 2.2]}>
          <mesh position={[-1.5, 0.55, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.1, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.8} />
          </mesh>
          <mesh position={[1.5, 0.55, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.1, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <boxGeometry args={[3.3, 0.12, 0.08]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          {/* Papan Peringatan Gantung */}
          <mesh position={[-0.6, 0.72, 0.05]}>
            <boxGeometry args={[0.85, 0.42, 0.03]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * 2. Mesin Molen Pengaduk Semen 3D (Concrete Mixer)
 */
export const ConcreteMixer3D: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  spinSpeed?: number;
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  spinSpeed = 0.06,
}) => {
  const frame = useCurrentFrame();
  const drumSpin = frame * spinSpeed;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Rangka Bawah & Roda */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.1, 0.12, 0.8]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      {[-0.42, 0.42].map((zPos, i) => (
        <mesh
          key={i}
          position={[0, 0.24, zPos]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.24, 0.24, 0.1, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      ))}
      {/* Tiang Penyangga Drum */}
      <mesh position={[-0.45, 0.75, 0]}>
        <boxGeometry args={[0.12, 0.85, 0.14]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      {/* Drum Molen Berputar */}
      <group position={[0.05, 0.95, 0]} rotation={[0, 0, -0.45]}>
        <group rotation={[0, drumSpin, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.48, 0.32, 0.55, 24]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.28, 0.48, 0.42, 24, 1, true]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.4}
              roughness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

/**
 * 3. Pancuran Air 3D (Dari Ember atau Selang Penyiram Karung Goni)
 */
export const WaterStream3D: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  arcHeight?: number;
  thickness?: number;
}> = ({ start, end, arcHeight = 0.4, thickness = 0.045 }) => {
  const tubeGeo = useMemo(() => {
    const mid: [number, number, number] = [
      (start[0] + end[0]) / 2,
      Math.max(start[1], end[1]) + arcHeight,
      (start[2] + end[2]) / 2,
    ];
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end),
    ]);
    return new THREE.TubeGeometry(curve, 32, thickness, 12, false);
  }, [start, end, arcHeight, thickness]);

  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial
        color="#38bdf8"
        emissive="#0284c7"
        emissiveIntensity={0.4}
        transparent
        opacity={0.82}
        roughness={0.15}
      />
    </mesh>
  );
};

/**
 * 4. Efek Hujan 3D Deterministik (Untuk Adegan Hujan / Jalan Licin)
 */
export const RainParticles3D: React.FC<{
  count?: number;
}> = ({ count = 90 }) => {
  const frame = useCurrentFrame();

  const drops = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = i * 17.3;
      const progress = (frame * 0.045 + seed) % 1;
      const x = -3.5 + ((i * 37) % 70) * 0.1;
      const y = 4.5 - progress * 6.5;
      const z = -4.0 + ((i * 53) % 80) * 0.1;
      return { x, y, z };
    });
  }, [frame, count]);

  return (
    <group>
      {drops.map((d, idx) => (
        <mesh key={idx} position={[d.x, d.y, d.z]}>
          <cylinderGeometry args={[0.008, 0.008, 0.38, 6]} />
          <meshStandardMaterial
            color="#bae6fd"
            emissive="#38bdf8"
            emissiveIntensity={0.5}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}
    </group>
  );
};

