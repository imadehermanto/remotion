import React from "react";
import { useCurrentFrame } from "remotion";
import { MODELS } from "../catalog";
import { Asset3D } from "./Asset3D";

/**
 * Karakter Manusia Low-Poly Ber-Artikulasi (How Come? / Wait, Really!? Style)
 * Semua sendi (kepala, bahu, tangan, kaki, bodi) bergerak murni dengan `useCurrentFrame()`
 * tanpa masalah T-Pose atau glitch tekstur.
 */
export interface CharacterWorker3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  shirtColor?: string;
  pantsColor?: string;
  /** Tampilkan topi caping bambu khas tukang Indonesia */
  showCaping?: boolean;
  /** Aksi karakter */
  action?: "digging" | "carrying" | "walking" | "idle";
  /** Alat yang dipegang di tangan */
  tool?: "shovel" | "sack" | "none";
}

export const CharacterWorker3D: React.FC<CharacterWorker3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  shirtColor = "#38bdf8",
  pantsColor = "#78716c",
  showCaping = true,
  action = "digging",
  tool = "none",
}) => {
  const frame = useCurrentFrame();
  const cycle = frame * 0.14;

  // Sudut artikulasi sendi berdasarkan aksi
  const isDigging = action === "digging";
  const isCarrying = action === "carrying";
  const isWalking = action === "walking";

  const torsoLean = isDigging
    ? 0.25 + Math.sin(cycle) * 0.12
    : isCarrying
      ? -0.08
      : 0.04;

  const leftArmX = isDigging
    ? -0.85 + Math.sin(cycle) * 0.35
    : isCarrying
      ? -0.95
      : isWalking
        ? Math.sin(cycle) * 0.45
        : -0.15;

  const rightArmX = isDigging
    ? -0.75 + Math.sin(cycle) * 0.35
    : isCarrying
      ? -0.95
      : isWalking
        ? -Math.sin(cycle) * 0.45
        : -0.15;

  const leftLegX = isWalking ? -Math.sin(cycle) * 0.4 : -0.06;
  const rightLegX = isWalking ? Math.sin(cycle) * 0.4 : 0.06;
  const bobY =
    action !== "idle" ? Math.abs(Math.sin(cycle)) * 0.035 : 0;

  return (
    <group
      position={[position[0], position[1] + bobY, position[2]]}
      rotation={rotation}
      scale={scale}
    >
      {/* ===================== KAKI KIRI & SEPATU BOOTS ===================== */}
      <group position={[-0.14, 0.72, 0]} rotation={[leftLegX, 0, 0]}>
        {/* Paha & Betis */}
        <mesh position={[0, -0.26, 0]} castShadow>
          <cylinderGeometry args={[0.095, 0.08, 0.52, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        {/* Sepatu Boots Hitam */}
        <mesh position={[0, -0.58, 0.03]} castShadow>
          <boxGeometry args={[0.17, 0.22, 0.26]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      </group>

      {/* ===================== KAKI KANAN & SEPATU BOOTS ===================== */}
      <group position={[0.14, 0.72, 0]} rotation={[rightLegX, 0, 0]}>
        <mesh position={[0, -0.26, 0]} castShadow>
          <cylinderGeometry args={[0.095, 0.08, 0.52, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.58, 0.03]} castShadow>
          <boxGeometry args={[0.17, 0.22, 0.26]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      </group>

      {/* ===================== BADAN / TORSO & KEPALA ===================== */}
      <group position={[0, 0.75, 0]} rotation={[torsoLean, 0, 0]}>
        {/* Pinggul */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[0.46, 0.16, 0.26]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>

        {/* Baju / Torso */}
        <mesh position={[0, 0.36, 0]} castShadow>
          <boxGeometry args={[0.48, 0.54, 0.28]} />
          <meshStandardMaterial color={shirtColor} roughness={0.55} />
        </mesh>

        {/* Leher */}
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.075, 0.085, 0.14, 12]} />
          <meshStandardMaterial color="#f5d0a9" roughness={0.5} />
        </mesh>

        {/* Kepala Low-Poly */}
        <group position={[0, 0.88, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.21, 18, 18]} />
            <meshStandardMaterial color="#f5d0a9" roughness={0.45} />
          </mesh>
          {/* Rambut Hitam */}
          <mesh position={[0, 0.06, -0.02]}>
            <sphereGeometry args={[0.215, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          {/* Mata Kiri & Kanan */}
          <mesh position={[-0.07, 0.02, 0.19]}>
            <sphereGeometry args={[0.026, 10, 10]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.07, 0.02, 0.19]}>
            <sphereGeometry args={[0.026, 10, 10]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>

          {/* Topi Caping Bambu Khas Indonesia */}
          {showCaping && (
            <group position={[0, 0.22, 0]} rotation={[-0.08, 0, 0]}>
              <mesh castShadow>
                <coneGeometry args={[0.46, 0.22, 24]} />
                <meshStandardMaterial color="#fde68a" roughness={0.75} />
              </mesh>
              <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.45, 0.015, 8, 24]} />
                <meshStandardMaterial color="#b45309" roughness={0.8} />
              </mesh>
            </group>
          )}
        </group>

        {/* ===================== LENGAN KIRI ===================== */}
        <group position={[-0.31, 0.56, 0]} rotation={[leftArmX, 0, 0.12]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.46, 12]} />
            <meshStandardMaterial color="#f5d0a9" roughness={0.5} />
          </mesh>
          {/* Lengan Baju */}
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.085, 0.08, 0.2, 12]} />
            <meshStandardMaterial color={shirtColor} roughness={0.55} />
          </mesh>
        </group>

        {/* ===================== LENGAN KANAN & ALAT ===================== */}
        <group position={[0.31, 0.56, 0]} rotation={[rightArmX, 0, -0.12]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.46, 12]} />
            <meshStandardMaterial color="#f5d0a9" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.085, 0.08, 0.2, 12]} />
            <meshStandardMaterial color={shirtColor} roughness={0.55} />
          </mesh>

          {/* Sekop / Cangkul 3D di Tangan */}
          {tool === "shovel" && (
            <group
              position={[-0.18, -0.42, 0.15]}
              rotation={[Math.PI / 2.2, 0, 0.25]}
            >
              <Asset3D
                model={MODELS.tools.shovel}
                targetSize={1.25}
                anchor="center"
              />
            </group>
          )}

          {/* Karung Semen 3D di Pelukan */}
          {tool === "sack" && (
            <group
              position={[-0.31, -0.35, 0.18]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <Asset3D
                model={MODELS.tools.sackBag}
                targetSize={0.72}
                anchor="center"
              />
            </group>
          )}
        </group>
      </group>
    </group>
  );
};
