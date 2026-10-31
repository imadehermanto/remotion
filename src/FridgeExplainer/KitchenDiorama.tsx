import React from "react";
import { Asset3D, MODELS, WoodenFloorStage3D } from "../assets";

interface KitchenDioramaProps {
  isBackView: boolean;
}

export const KitchenDiorama: React.FC<KitchenDioramaProps> = ({ isBackView }) => {
  return (
    <group position={[0, -2.02, 0]}>
      {/* Signature Wooden Diorama Floor Stage from Shared Asset Library */}
      <WoodenFloorStage3D />

      {/* Floor Mat under Fridge */}
      <mesh position={[0, 0.02, 0.1]}>
        <boxGeometry args={[2.7, 0.03, 2.5]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.015, 0.1]}>
        <boxGeometry args={[2.82, 0.02, 2.62]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Kitchen Back Wall & 3D Props from Shared Catalog */}
      {!isBackView && (
        <group>
          {/* Warm Cream-Terracotta Back Wall */}
          <mesh position={[0, 3.5, -2.2]}>
            <boxGeometry args={[10, 7.2, 0.2]} />
            <meshStandardMaterial color="#432818" roughness={0.75} />
          </mesh>

          {/* Wainscoting Lower Wall Panel */}
          <mesh position={[0, 1.1, -2.08]}>
            <boxGeometry args={[10, 2.2, 0.06]} />
            <meshStandardMaterial color="#582f0e" roughness={0.7} />
          </mesh>

          {/* Wooden Baseboard */}
          <mesh position={[0, 0.12, -2.03]}>
            <boxGeometry args={[10, 0.24, 0.1]} />
            <meshStandardMaterial color="#271206" roughness={0.8} />
          </mesh>

          {/* Left Kitchen Counter: Drawer Cabinet + Coffee Machine + Plant */}
          <group position={[-2.35, 0, -0.55]}>
            <Asset3D
              model={MODELS.furniture.kitchenCabinetDrawer}
              targetSize={1.85}
              position={[0, 0, 0]}
            />
            <Asset3D
              model={MODELS.appliances.coffeeMachine}
              targetSize={0.68}
              position={[-0.32, 1.68, 0.1]}
              rotation={[0, 0.25, 0]}
            />
            <Asset3D
              model={MODELS.nature.pottedPlant}
              targetSize={0.85}
              position={[0.38, 1.68, 0.05]}
            />
          </group>

          {/* Right Kitchen Counter: Cabinet + Blender */}
          <group position={[2.45, 0, -0.55]}>
            <Asset3D
              model={MODELS.furniture.kitchenCabinet}
              targetSize={1.85}
              position={[0, 0, 0]}
            />
            <Asset3D
              model={MODELS.appliances.blender}
              targetSize={0.65}
              position={[-0.25, 1.68, 0.12]}
              rotation={[0, -0.3, 0]}
            />
          </group>
        </group>
      )}
    </group>
  );
};
