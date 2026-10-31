import React from "react";
import { EmissiveFieldMaterial } from "../studio/materials/PBRMaterials";

/**
 * Creative 3D Aesthetic Room & Modern Desk Workspace
 * Specially formulated for Vertical 9:16 Framing:
 * - Elements positioned within narrow horizontal FOV (|X| <= 1.6 at Z ~ -2.5)
 * - Upper wall (behind headline) remains smooth, calm, and uncluttered
 * - Warm ambient desk lamp on midground right (X = +1.35)
 * - Minimalist succulent plant on midground left (X = -1.35)
 * - Rich natural Scandinavian oak desk with felt desk pad
 * - Focus stays 100% locked on the foreground Ceramic White charger
 */
export const CreativeRoomEnvironment3D: React.FC = () => {
  // Tasteful fluted wood paneling positioned purely as an architectural accent on the left
  const slats = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < 8; i++) {
      list.push(-2.1 + i * 0.14);
    }
    return list;
  }, []);

  return (
    <group>
      {/* ============================================================== */}
      {/* 1. FOREGROUND / DESK SURFACE & MAT */}
      {/* ============================================================== */}
      <group position={[0, -1.65, 0]}>
        {/* Main Scandinavian Oak Wood Desk */}
        <mesh position={[0, -0.15, 0]} receiveShadow>
          <boxGeometry args={[10, 0.3, 8]} />
          <meshStandardMaterial
            color="#45311f"
            roughness={0.58}
            metalness={0.05}
          />
        </mesh>

        {/* Front Bevel Accent of Desk */}
        <mesh position={[0, -0.01, 3.98]}>
          <boxGeometry args={[10, 0.04, 0.04]} />
          <meshStandardMaterial color="#5c3f27" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Modern Dark Slate Felt Desk Mat */}
        <mesh position={[0, 0.005, 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.2, 2.6]} />
          <meshStandardMaterial
            color="#181f28"
            roughness={0.92}
            metalness={0.02}
          />
        </mesh>

        {/* Soft Contact Ambient Occlusion Shadow directly under Charger */}
        <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.35, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.28} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 2. BACKGROUND ROOM WALL (WARM JAPANDI / TECH AESTHETIC) */}
      {/* ============================================================== */}
      <group position={[0, 1.6, -3.8]}>
        {/* Warm Textured Matte Interior Wall (Soft & Clean behind Headline) */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[10, 9]} />
          <meshStandardMaterial
            color="#1b1f27"
            roughness={0.94}
            metalness={0.02}
          />
        </mesh>

        {/* Fluted Wood Slat Accent on Left Wall */}
        {slats.map((x, idx) => (
          <mesh key={idx} position={[x, -0.2, 0.02]}>
            <boxGeometry args={[0.08, 5.2, 0.04]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? "#5a3d28" : "#4b3220"}
              roughness={0.65}
              metalness={0.05}
            />
          </mesh>
        ))}

        {/* Floating Minimalist Wall Shelf (Mid-Upper Right) */}
        <group position={[0.7, 1.25, 0.08]}>
          <mesh>
            <boxGeometry args={[1.6, 0.05, 0.24]} />
            <meshStandardMaterial color="#45311f" roughness={0.55} />
          </mesh>
          {/* Decorative Ceramic Vase on Shelf */}
          <mesh position={[-0.45, 0.14, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.22, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Small Framed Art Block on Shelf */}
          <mesh position={[0.3, 0.12, 0]}>
            <boxGeometry args={[0.26, 0.18, 0.06]} />
            <meshStandardMaterial color="#b45309" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 3. COZY WARM ACCENT LAMP (Midground Right, X = +1.35) */}
      {/* ============================================================== */}
      <group position={[1.35, -0.7, -2.5]} scale={0.85}>
        {/* Lamp Base on Desk */}
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.06, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Lamp Brass Stem */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.4, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Lamp Linen / Warm Shade */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.26, 0.34, 0.55, 24]} />
          <meshStandardMaterial
            color="#fef3c7"
            roughness={0.65}
            emissive="#f59e0b"
            emissiveIntensity={0.85}
          />
        </mesh>
        {/* Glowing Filament Core */}
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <EmissiveFieldMaterial color="#fbbf24" intensity={5.2} />
        </mesh>

        {/* Warm Golden Room Ambient Light Source */}
        <pointLight
          position={[0, 0.55, 0.2]}
          color="#f59e0b"
          intensity={3.8}
          distance={5.8}
          decay={1.8}
        />
      </group>

      {/* ============================================================== */}
      {/* 4. MINIMALIST POTTED SUCCULENT / PLANT (Midground Left, X = -1.35) */}
      {/* ============================================================== */}
      <group position={[-1.35, -1.35, -2.3]} scale={0.72}>
        {/* Matte White Ceramic Pot */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.17, 0.42, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.1} />
        </mesh>
        {/* Dark Soil */}
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#2d1e16" roughness={0.95} />
        </mesh>
        {/* Natural Sage Green Succulent Foliage */}
        <group position={[0, 0.24, 0]}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const rotY = (i * Math.PI) / 3;
            return (
              <mesh
                key={i}
                position={[Math.cos(rotY) * 0.09, 0.08, Math.sin(rotY) * 0.09]}
                rotation={[0.38, rotY, 0.22]}
              >
                <coneGeometry args={[0.07, 0.22, 8]} />
                <meshStandardMaterial color="#15803d" roughness={0.6} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* ============================================================== */}
      {/* 5. SOFT ROOM AMBIENT ILLUMINATION */}
      {/* ============================================================== */}
      {/* Cozy Warm Room Ambient */}
      <ambientLight intensity={0.55} color="#fed7aa" />

      {/* Soft Window Daylight Fill from Upper Left */}
      <directionalLight
        position={[-4, 6, 2]}
        intensity={0.75}
        color="#e0f2fe"
      />
    </group>
  );
};
