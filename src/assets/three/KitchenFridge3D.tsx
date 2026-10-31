import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useLayoutEffect, useMemo } from "react";
import { staticFile } from "remotion";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { DRACO_DECODER_PATH, MODELS } from "../catalog";

type GLTFResult = GLTF & {
  nodes: {
    Mesh_kitchenFridge: THREE.Mesh;
    Mesh_kitchenFridge_1: THREE.Mesh;
    Mesh_doorFreezer: THREE.Mesh;
    Mesh_doorFreezer_1: THREE.Mesh;
    Mesh_doorFridge: THREE.Mesh;
    Mesh_doorFridge_1: THREE.Mesh;
    Mesh_doorFridge_2: THREE.Mesh;
  };
  materials: {
    metalLight: THREE.MeshStandardMaterial;
    metalDark: THREE.MeshStandardMaterial;
    metal: THREE.MeshStandardMaterial;
    glass: THREE.MeshStandardMaterial;
  };
};

export interface KitchenFridge3DProps {
  /** Door opening angle in radians (negative = swings open to the left) */
  doorAngle: number;
  /** 0 = opaque solid body, 1 = X-ray / cutaway body so internal pipes & food stay visible */
  cutawayProgress: number;
}

export const KitchenFridge3D: React.FC<KitchenFridge3DProps> = ({
  doorAngle,
  cutawayProgress,
}) => {
  const { nodes, materials } = useGLTF(
    staticFile(MODELS.appliances.fridge),
    staticFile(DRACO_DECODER_PATH)
  ) as unknown as GLTFResult;

  const advance = useThree((s) => s.advance);
  const invalidate = useThree((s) => s.invalidate);

  const shellLightMat = useMemo(() => {
    const m = materials.metalLight.clone();
    m.color = new THREE.Color("#f8fafc");
    m.roughness = 0.32;
    m.metalness = 0.1;
    m.transparent = cutawayProgress > 0.01;
    m.opacity = Math.max(0, 1 - cutawayProgress * 1.15);
    m.depthWrite = cutawayProgress < 0.15;
    return m;
  }, [materials.metalLight, cutawayProgress]);

  const shellDarkMat = useMemo(() => {
    const m = materials.metalDark.clone();
    m.color = new THREE.Color("#334155");
    m.roughness = 0.5;
    m.transparent = cutawayProgress > 0.01;
    m.opacity = Math.max(0, 1 - cutawayProgress * 1.15);
    m.depthWrite = cutawayProgress < 0.15;
    return m;
  }, [materials.metalDark, cutawayProgress]);

  const doorBodyMat = useMemo(() => {
    const m = materials.metalLight.clone();
    m.color = new THREE.Color("#f1f5f9");
    m.roughness = 0.28;
    m.metalness = 0.12;
    return m;
  }, [materials.metalLight]);

  const handleMat = useMemo(() => {
    const m = materials.metal.clone();
    m.color = new THREE.Color("#facc15");
    m.metalness = 0.55;
    m.roughness = 0.25;
    return m;
  }, [materials.metal]);

  const glassMat = useMemo(() => {
    const m = materials.glass.clone();
    m.color = new THREE.Color("#bae6fd");
    m.transparent = true;
    m.opacity = 0.55;
    return m;
  }, [materials.glass]);

  useLayoutEffect(() => {
    invalidate();
    advance(performance.now());
  }, [doorAngle, cutawayProgress, advance, invalidate]);

  return (
    <group
      position={[-0.99, -1.9, 0.79]}
      scale={[4.6, 4.1, 5.8]}
      dispose={null}
    >
      {/* 3D Fridge Outer Body Shell */}
      {cutawayProgress < 0.88 && (
        <>
          <mesh
            geometry={nodes.Mesh_kitchenFridge.geometry}
            material={shellLightMat}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={nodes.Mesh_kitchenFridge_1.geometry}
            material={shellDarkMat}
            castShadow
            receiveShadow
          />
        </>
      )}

      {/* Animated Top Freezer Door with Handle */}
      <group
        position={[0.027, 0.703, -0.025]}
        rotation={[0, doorAngle, 0]}
      >
        <mesh
          geometry={nodes.Mesh_doorFreezer.geometry}
          material={doorBodyMat}
          castShadow
        />
        <mesh
          geometry={nodes.Mesh_doorFreezer_1.geometry}
          material={handleMat}
          castShadow
        />
      </group>

      {/* Animated Main Fridge Door with Handle & Door Bins */}
      <group
        position={[0.027, 0.087, -0.025]}
        rotation={[0, doorAngle, 0]}
      >
        <mesh
          geometry={nodes.Mesh_doorFridge.geometry}
          material={doorBodyMat}
          castShadow
        />
        <mesh
          geometry={nodes.Mesh_doorFridge_1.geometry}
          material={handleMat}
          castShadow
        />
        <mesh
          geometry={nodes.Mesh_doorFridge_2.geometry}
          material={glassMat}
        />
      </group>
    </group>
  );
};

