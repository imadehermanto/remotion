import React from "react";
import * as THREE from "three";

/**
 * Material presets for Three.js / React Three Fiber.
 * Engineered for clean, physical PBR response without shader glitches.
 */

export const BrushedAluminumMaterial: React.FC<{
  color?: string;
  roughness?: number;
  metalness?: number;
}> = ({ color = "#d1d5db", roughness = 0.35, metalness = 0.88 }) => {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      envMapIntensity={1.2}
    />
  );
};

export const OpticalGlassMaterial: React.FC<{
  color?: string;
  opacity?: number;
  roughness?: number;
}> = ({ color = "#e0f2fe", opacity = 0.45, roughness = 0.08 }) => {
  return (
    <meshPhysicalMaterial
      color={color}
      transparent
      opacity={opacity}
      roughness={roughness}
      metalness={0.05}
      transmission={0.85}
      ior={1.52}
      thickness={0.4}
      depthWrite={false}
      side={THREE.DoubleSide}
    />
  );
};

export const CopperConductorMaterial: React.FC<{
  roughness?: number;
  metalness?: number;
}> = ({ roughness = 0.28, metalness = 0.95 }) => {
  return (
    <meshStandardMaterial
      color="#f59e0b"
      roughness={roughness}
      metalness={metalness}
    />
  );
};

export const SiliconSubstrateMaterial: React.FC<{
  color?: string;
  roughness?: number;
}> = ({ color = "#1e293b", roughness = 0.2 }) => {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0.7}
    />
  );
};

export const MattePolymerMaterial: React.FC<{
  color?: string;
  roughness?: number;
}> = ({ color = "#0f172a", roughness = 0.65 }) => {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0.1}
    />
  );
};

export const EmissiveFieldMaterial: React.FC<{
  color?: string;
  intensity?: number;
  opacity?: number;
}> = ({ color = "#38bdf8", intensity = 2.5, opacity = 0.9 }) => {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      transparent={opacity < 1}
      opacity={opacity}
      toneMapped={false}
    />
  );
};

export const ElectricGridLineMaterial: React.FC<{
  color?: string;
  opacity?: number;
}> = ({ color = "#00f2fe", opacity = 0.75 }) => {
  return (
    <meshBasicMaterial
      color={color}
      transparent
      opacity={opacity}
      wireframe
    />
  );
};

