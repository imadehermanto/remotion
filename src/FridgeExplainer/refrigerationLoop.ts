import * as THREE from "three";

// Full closed loop points
export const loopPoints = [
  // 1. Compressor outlet (bottom back right)
  new THREE.Vector3(0.25, -1.45, -0.75),
  // 2. Condenser serpentine coil on the back exterior (Z = -1.02)
  new THREE.Vector3(0.7, -1.15, -1.02),
  new THREE.Vector3(-0.7, -0.8, -1.02),
  new THREE.Vector3(0.7, -0.45, -1.02),
  new THREE.Vector3(-0.7, -0.1, -1.02),
  new THREE.Vector3(0.7, 0.25, -1.02),
  new THREE.Vector3(-0.7, 0.6, -1.02),
  new THREE.Vector3(0.7, 0.95, -1.02),
  // 3. Up to the Expansion Valve on top-right side (Y = 1.25, X = 0.82)
  new THREE.Vector3(0.82, 1.22, -0.55),
  new THREE.Vector3(0.82, 1.22, -0.1), // Expansion Valve pinch point (~t = 0.54)
  new THREE.Vector3(0.82, 1.22, 0.3),
  // 4. Enters inside fridge upper compartment: Evaporator coils (Z = -0.35 to 0.15)
  new THREE.Vector3(0.55, 1.0, -0.25),
  new THREE.Vector3(-0.55, 0.8, -0.25),
  new THREE.Vector3(0.55, 0.55, -0.25),
  new THREE.Vector3(-0.55, 0.3, -0.25),
  new THREE.Vector3(0.55, 0.05, -0.25),
  // 5. Suction return line down the left-back corner to Compressor inlet
  new THREE.Vector3(-0.65, -0.35, -0.45),
  new THREE.Vector3(-0.65, -1.1, -0.65),
  new THREE.Vector3(-0.35, -1.45, -0.75),
];

export const refrigerationCurve = new THREE.CatmullRomCurve3(
  loopPoints,
  true,
  "catmullrom",
  0.25
);

// Separate curve for Hot Condenser section (for color-coded pipe rendering)
export const hotPipePoints = loopPoints.slice(0, 10);
export const hotPipeCurve = new THREE.CatmullRomCurve3(
  hotPipePoints,
  false,
  "catmullrom",
  0.25
);

// Separate curve for Cold Evaporator section
export const coldPipePoints = [
  ...loopPoints.slice(9),
  loopPoints[0],
];
export const coldPipeCurve = new THREE.CatmullRomCurve3(
  coldPipePoints,
  false,
  "catmullrom",
  0.25
);

export interface ThermodynamicState {
  temperatureColor: string;
  glowColor: string;
  isHot: boolean;
}

export function getThermodynamicState(t: number): ThermodynamicState {
  const normT = ((t % 1) + 1) % 1;

  if (normT < 0.22) {
    // Superheated high-pressure gas leaving compressor
    return {
      temperatureColor: "#ff2a00",
      glowColor: "#ff6a00",
      isHot: true,
    };
  } else if (normT < 0.53) {
    // Hot liquid-vapor condensing in back condenser coils
    return {
      temperatureColor: "#ff7b00",
      glowColor: "#ffaa00",
      isHot: true,
    };
  } else if (normT < 0.85) {
    // Freezing low-pressure mist after expansion valve & in evaporator
    return {
      temperatureColor: "#00e5ff",
      glowColor: "#70f3ff",
      isHot: false,
    };
  } else {
    // Cool gas returning to compressor
    return {
      temperatureColor: "#38bdf8",
      glowColor: "#60a5fa",
      isHot: false,
    };
  }
}
