import React from "react";

/**
 * 1. Panah 3D Chunky Ciri Khas Channel (Wait, Really!? Style)
 * Digunakan untuk menunjukkan arah gaya, aliran panas, tekanan, atau gerakan mekanis.
 */
export const ChunkyArrow3D: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  scale?: number;
}> = ({ position, rotation = [0, 0, 0], color, scale = 1 }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Arrow Shaft */}
      <mesh position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.28, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.25}
        />
      </mesh>
      {/* Arrow Cone Head */}
      <mesh position={[0, 0.08, 0]}>
        <coneGeometry args={[0.13, 0.24, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
};

/**
 * 2. Termometer 3D Animasi Ciri Khas Channel
 * Digunakan untuk memvisualisasikan kenaikan/penurunan suhu secara dramatis.
 */
export const Thermometer3D: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  level: number; // 0.1 to 1.0
  color: string;
  scale?: number;
}> = ({ position, rotation = [0, 0, 0], level, color, scale = 1 }) => {
  const clampedLevel = Math.max(0.1, Math.min(1, level));
  const barHeight = clampedLevel * 0.52;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* White Backing Pill */}
      <mesh position={[0, 0.25, -0.03]}>
        <boxGeometry args={[0.24, 0.78, 0.04]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Dark Border Backing */}
      <mesh position={[0, 0.25, -0.045]}>
        <boxGeometry args={[0.28, 0.82, 0.02]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Bottom Bulb */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>
      {/* Empty Glass Tube */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.048, 0.048, 0.56, 16]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.45}
          roughness={0.1}
        />
      </mesh>
      {/* Dynamic Liquid Mercury Column */}
      <mesh position={[0, 0.04 + barHeight / 2, 0]}>
        <cylinderGeometry args={[0.036, 0.036, barHeight, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.75}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

/**
 * 3. Panggung Lantai Kayu Diorama Ciri Khas Channel
 * Bisa dipakai di berbagai video explainer 3D untuk memberikan kesan studio miniature yang hangat.
 */
export const WoodenFloorStage3D: React.FC<{
  plankCount?: number;
}> = ({ plankCount = 12 }) => {
  return (
    <group>
      {/* Base Wooden Slab */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[10, 0.24, 10]} />
        <meshStandardMaterial color="#8b4513" roughness={0.65} />
      </mesh>

      {/* Dark Toon Outline Base Trim */}
      <mesh position={[0, -0.26, 0]}>
        <boxGeometry args={[10.12, 0.08, 10.12]} />
        <meshStandardMaterial color="#271206" roughness={0.8} />
      </mesh>

      {/* Alternating Wooden Planks */}
      {Array.from({ length: plankCount }).map((_, idx) => {
        const xOffset = -4.5 + idx * 0.82;
        const shade = idx % 2 === 0 ? "#a0522d" : "#934824";
        return (
          <group key={idx} position={[xOffset, 0.005, 0]}>
            <mesh>
              <boxGeometry args={[0.78, 0.02, 9.8]} />
              <meshStandardMaterial color={shade} roughness={0.6} />
            </mesh>
            <mesh position={[0.4, -0.002, 0]}>
              <boxGeometry args={[0.03, 0.022, 9.8]} />
              <meshStandardMaterial color="#3e1f0d" roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

