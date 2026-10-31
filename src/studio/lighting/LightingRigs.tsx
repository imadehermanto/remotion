import React from "react";

export interface LightingRigProps {
  intensity?: number;
  colorTemperature?: string; // hex color tint
  castShadow?: boolean;
}

/**
 * 1. Studio Softbox Lighting:
 * Pencahayaan studio lembut, merata, tanpa bayangan keras yang mengganggu.
 * Sangat ideal untuk produk, smartphone, dan permukaan reflektif/kaca.
 */
export const StudioSoftboxLighting: React.FC<LightingRigProps> = ({
  intensity = 1.0,
}) => {
  return (
    <>
      <ambientLight intensity={0.45 * intensity} color="#ffffff" />
      {/* Key Softbox (Top-Front-Right) */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.2 * intensity}
        color="#f8fafc"
      />
      {/* Fill Softbox (Front-Left) */}
      <directionalLight
        position={[-5, 3, 4]}
        intensity={0.6 * intensity}
        color="#e2e8f0"
      />
      {/* Rim / Hair Light (Back-Top) */}
      <directionalLight
        position={[0, 6, -5]}
        intensity={0.9 * intensity}
        color="#ffffff"
      />
      {/* Subtle floor bounce */}
      <pointLight
        position={[0, -4, 2]}
        intensity={0.25 * intensity}
        color="#cbd5e1"
      />
    </>
  );
};

/**
 * 2. Cinematic Three-Point Lighting:
 * Pencahayaan sinematik dengan kontras terukur antara Key, Fill, dan Rim.
 */
export const CinematicThreePointLighting: React.FC<LightingRigProps> = ({
  intensity = 1.0,
}) => {
  return (
    <>
      <ambientLight intensity={0.3 * intensity} color="#0f172a" />
      {/* Key Light */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.5 * intensity}
        color="#ffffff"
      />
      {/* Fill Light (Cooler tone) */}
      <directionalLight
        position={[-4, 2, 3]}
        intensity={0.45 * intensity}
        color="#93c5fd"
      />
      {/* High-Contrast Rim Light (Gives edge outline to 3D models) */}
      <directionalLight
        position={[-1, 4, -4]}
        intensity={1.8 * intensity}
        color="#38bdf8"
      />
    </>
  );
};

/**
 * 3. Macro Technical Lighting:
 * Pencahayaan presisi tinggi untuk inspeksi jarak dekat komponen elektronik mikroskopis.
 * Dilengkapi rim light ganda untuk memisahkan layer tipis dan sirkuit.
 */
export const MacroTechnicalLighting: React.FC<LightingRigProps> = ({
  intensity = 1.0,
}) => {
  return (
    <>
      <ambientLight intensity={0.4 * intensity} color="#0f172a" />
      {/* Overhead Key Light */}
      <directionalLight
        position={[0, 6, 2]}
        intensity={1.4 * intensity}
        color="#ffffff"
      />
      {/* Left Specular Glint Light */}
      <pointLight
        position={[-3, 2, 2]}
        intensity={1.0 * intensity}
        color="#38bdf8"
        distance={12}
      />
      {/* Right Edge Rim Light */}
      <pointLight
        position={[3, 2, -1]}
        intensity={1.2 * intensity}
        color="#00f2fe"
        distance={12}
      />
      {/* Under-glow for transparent dielectric/glass layers */}
      <pointLight
        position={[0, -2, 0]}
        intensity={0.7 * intensity}
        color="#818cf8"
        distance={8}
      />
    </>
  );
};

/**
 * 4. Dramatic Laboratory Lighting:
 * Nuansa lab riset gelap dengan pencahayaan moody dan backlight tajam.
 */
export const DramaticLaboratoryLighting: React.FC<LightingRigProps> = ({
  intensity = 1.0,
}) => {
  return (
    <>
      <ambientLight intensity={0.25 * intensity} color="#020617" />
      <directionalLight
        position={[2, 6, 3]}
        intensity={1.1 * intensity}
        color="#f1f5f9"
      />
      <pointLight
        position={[-4, 3, -2]}
        intensity={1.6 * intensity}
        color="#3b82f6"
      />
      <pointLight
        position={[3, -1, 2]}
        intensity={0.8 * intensity}
        color="#06b6d4"
      />
    </>
  );
};

/**
 * 5. Dramatic Mechanical Lighting:
 * Pencahayaan dramatis untuk logam, gesekan panas, rem, dan knalpot.
 */
export const DramaticMechanicalLighting: React.FC<LightingRigProps> = ({
  intensity = 1.0,
}) => {
  return (
    <>
      <ambientLight intensity={0.3 * intensity} color="#180d0d" />
      <directionalLight
        position={[4, 5, 3]}
        intensity={1.3 * intensity}
        color="#fef3c7"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={2.0 * intensity}
        color="#ef4444"
        distance={10}
      />
      <directionalLight
        position={[-3, 3, -3]}
        intensity={0.8 * intensity}
        color="#f97316"
      />
    </>
  );
};

