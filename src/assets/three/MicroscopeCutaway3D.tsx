import React, { useMemo } from "react";
import * as THREE from "three";
import { MODELS } from "../catalog";
import { Asset3D } from "./Asset3D";

/**
 * Komponen Zoom Mikroskopis / Penampang Melintang Material (How Come? Style)
 * Bisa digunakan untuk menjelaskan:
 * - Reaksi Hidrasi Semen + Air yang mengikat batu kerikil (`hydrationProgress` 0 -> 1)
 * - Pori-pori / Lubang Keropos akibat kebanyakan air (`porosityProgress` 0 -> 1)
 * - Struktur partikel di dalam benda padat
 */
export interface MicroscopeCrossSection3DProps {
  /** 0 = belum bereaksi, 1 = serabut kristal hidrasi mengikat seluruh batu kerikil */
  hydrationProgress?: number;
  /** 0 = padat, 1 = muncul lubang-lubang keropos hitam bekas air menguap */
  porosityProgress?: number;
  /** Warna dasar matriks (misal abu-abu beton atau biru air) */
  matrixColor?: string;
}

const AGGREGATE_POSITIONS: {
  pos: [number, number, number];
  size: number;
  rot: [number, number, number];
}[] = [
  { pos: [-0.85, 0.95, 0.15], size: 0.58, rot: [0.2, 0.5, 0.1] },
  { pos: [0.65, 1.05, 0.15], size: 0.64, rot: [0.7, 0.2, 0.4] },
  { pos: [-0.15, 0.42, 0.16], size: 0.52, rot: [0.4, 0.9, 0.2] },
  { pos: [-0.92, -0.25, 0.15], size: 0.62, rot: [0.1, 0.3, 0.8] },
  { pos: [0.78, -0.15, 0.15], size: 0.56, rot: [0.6, 0.1, 0.5] },
  { pos: [-0.25, -0.88, 0.15], size: 0.66, rot: [0.3, 0.7, 0.3] },
  { pos: [0.62, -1.02, 0.15], size: 0.5, rot: [0.8, 0.4, 0.2] },
];

const PORE_POSITIONS: [number, number, number][] = [
  [-0.35, 0.85, 0.22],
  [0.25, 0.75, 0.22],
  [-0.6, 0.2, 0.22],
  [0.35, 0.15, 0.22],
  [-0.45, -0.5, 0.22],
  [0.2, -0.55, 0.22],
  [-0.75, -0.95, 0.22],
  [0.15, -1.1, 0.22],
];

export const MicroscopeCrossSection3D: React.FC<
  MicroscopeCrossSection3DProps
> = ({
  hydrationProgress = 0,
  porosityProgress = 0,
  matrixColor = "#94a3b8",
}) => {
  // Jaringan ikatan kristal hidrasi antar batu kerikil
  const crystalBonds = useMemo(() => {
    const bonds: {
      mid: [number, number, number];
      len: number;
      quat: THREE.Quaternion;
    }[] = [];

    for (let i = 0; i < AGGREGATE_POSITIONS.length; i++) {
      for (let j = i + 1; j < AGGREGATE_POSITIONS.length; j++) {
        const a = new THREE.Vector3(...AGGREGATE_POSITIONS[i].pos);
        const b = new THREE.Vector3(...AGGREGATE_POSITIONS[j].pos);
        const dist = a.distanceTo(b);
        if (dist < 1.85) {
          const mid = a.clone().add(b).multiplyScalar(0.5);
          const dir = b.clone().sub(a).normalize();
          const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir
          );
          bonds.push({
            mid: [mid.x, mid.y, mid.z],
            len: dist,
            quat,
          });
        }
      }
    }
    return bonds;
  }, []);

  return (
    <group>
      {/* Blok Penampang Beton / Material */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.8, 3.2, 0.35]} />
        <meshStandardMaterial color={matrixColor} roughness={0.65} />
      </mesh>

      {/* Batu Kerikil 3D (Aggregates) */}
      {AGGREGATE_POSITIONS.map((item, idx) => (
        <Asset3D
          key={`stone-${idx}`}
          model={idx % 2 === 0 ? MODELS.nature.stone : MODELS.nature.rock}
          targetSize={item.size}
          anchor="center"
          position={item.pos}
          rotation={item.rot}
        />
      ))}

      {/* Serabut Kristal Hidrasi Putih yang Tumbuh Mengikat Batu Kerikil */}
      {hydrationProgress > 0.01 &&
        crystalBonds.map((b, idx) => (
          <mesh
            key={`bond-${idx}`}
            position={b.mid}
            quaternion={b.quat}
            scale={[1, hydrationProgress, 1]}
          >
            <cylinderGeometry args={[0.045, 0.045, b.len, 8]} />
            <meshStandardMaterial
              color="#f8fafc"
              emissive="#e0f2fe"
              emissiveIntensity={0.65}
              transparent
              opacity={Math.min(1, hydrationProgress * 1.15)}
            />
          </mesh>
        ))}

      {/* Lubang-lubang Pori Keropos (Saat Air Berlebih Menguap) */}
      {porosityProgress > 0.01 &&
        PORE_POSITIONS.map((pos, idx) => (
          <mesh
            key={`pore-${idx}`}
            position={pos}
            scale={porosityProgress}
          >
            <sphereGeometry args={[0.11 + (idx % 3) * 0.035, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.95} />
          </mesh>
        ))}
    </group>
  );
};

