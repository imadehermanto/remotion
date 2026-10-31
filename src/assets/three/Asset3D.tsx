import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useLayoutEffect, useMemo } from "react";
import { staticFile } from "remotion";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { DRACO_DECODER_PATH } from "../catalog";

export interface Asset3DProps {
  /** Path inside public/ folder (use `MODELS.*` from `src/assets/catalog.ts`) */
  model: string;
  /** Automatically normalize the largest dimension (width/height/depth) to this size in Three.js units */
  targetSize?: number;
  /** Anchor point after normalization: "bottom" puts y=0 at bottom of mesh, "center" centers all axes */
  anchor?: "bottom" | "center";
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  /** Optional tint / emissive highlight (e.g. for hot pot warning glow) */
  emissiveColor?: string;
  emissiveIntensity?: number;
}

export const Asset3D: React.FC<Asset3DProps> = ({
  model,
  targetSize = 1,
  anchor = "bottom",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  emissiveColor,
  emissiveIntensity = 0,
}) => {
  // useGLTF suspends automatically inside <ThreeCanvas>'s built-in <SuspenseLoader>
  const gltf = useGLTF(staticFile(model), staticFile(DRACO_DECODER_PATH));
  const advance = useThree((s) => s.advance);
  const invalidate = useThree((s) => s.invalidate);

  const preparedGroup = useMemo(() => {
    const cloned = SkeletonUtils.clone(gltf.scene) as THREE.Group;
    cloned.updateMatrixWorld(true);

    // Compute original bounding box accurately across both Mesh and SkinnedMesh
    const box = new THREE.Box3();
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!mesh.geometry.boundingBox) {
          mesh.geometry.computeBoundingBox();
        }
        if (mesh.geometry.boundingBox) {
          const geomBox = mesh.geometry.boundingBox.clone();
          geomBox.applyMatrix4(mesh.matrixWorld);
          box.union(geomBox);
        }
      }
    });

    if (box.isEmpty()) {
      box.setFromObject(cloned);
    }

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z, 0.0001);
    const normScale = targetSize / maxDim;

    cloned.scale.multiplyScalar(normScale);
    cloned.position.x = -center.x * normScale;
    cloned.position.z = -center.z * normScale;
    cloned.position.y =
      anchor === "bottom" ? -box.min.y * normScale : -center.y * normScale;

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (emissiveColor && emissiveIntensity > 0 && mesh.material) {
          const cloneMat = Array.isArray(mesh.material)
            ? mesh.material.map((m) => m.clone())
            : mesh.material.clone();

          const applyEmissive = (mat: THREE.Material) => {
            const stdMat = mat as THREE.MeshStandardMaterial;
            if (stdMat.emissive) {
              stdMat.emissive = new THREE.Color(emissiveColor);
              stdMat.emissiveIntensity = emissiveIntensity;
            }
          };

          if (Array.isArray(cloneMat)) {
            cloneMat.forEach(applyEmissive);
          } else {
            applyEmissive(cloneMat);
          }
          mesh.material = cloneMat;
        }
      }
    });

    const wrapper = new THREE.Group();
    wrapper.add(cloned);
    return wrapper;
  }, [gltf.scene, targetSize, anchor, emissiveColor, emissiveIntensity]);

  // Ensure ThreeCanvas advances and draws when a model mounts dynamically at any frame
  useLayoutEffect(() => {
    invalidate();
    advance(performance.now());
  }, [preparedGroup, advance, invalidate]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={preparedGroup} />
    </group>
  );
};
