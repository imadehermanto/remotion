import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import {
  Asset3D,
  ChunkyArrow3D,
  KitchenFridge3D,
  MODELS,
  Thermometer3D,
} from "../assets";
import { coldPipeCurve, hotPipeCurve } from "./refrigerationLoop";

interface FridgeModelProps {
  doorAngle: number;
  cutawayProgress: number; // 0 = closed right wall, 1 = solid cross-section cutaway
}

export const FridgeModel: React.FC<FridgeModelProps> = ({
  doorAngle,
  cutawayProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Separate high-contrast tube geometries for Hot Side vs Cold Side
  const hotTubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(hotPipeCurve, 120, 0.048, 16, false);
  }, []);

  const coldTubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(coldPipeCurve, 120, 0.048, 16, false);
  }, []);

  // Steady, readable mechanical piston pumping cycle inside Compressor
  const pistonCycle = Math.sin(frame * 0.22);
  const pistonY = pistonCycle * 0.11;
  // Gas compression glow peaks when piston is at top of stroke
  const compressionHeat = (pistonCycle + 1) * 0.5;

  // Thermometer scales in during Scene 4 (Compressor: 561-715) and Scene 6B (Expansion Valve: 1119-1313)
  const compThermoScale =
    spring({
      frame: frame - 568,
      fps,
      config: { damping: 14 },
    }) *
    interpolate(frame, [700, 715], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const compThermoLevel = interpolate(frame, [575, 685], [0.25, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const valveThermoScale =
    spring({
      frame: frame - 1122,
      fps,
      config: { damping: 14 },
    }) *
    interpolate(frame, [1295, 1312], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const valveThermoLevel = interpolate(frame, [1130, 1225], [0.85, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gentle animated offset for 3D heat arrows
  const arrowWave = (frame * 0.018) % 1;

  return (
    <group position={[0, 0, 0]}>
      {/* =====================================================================
          1. SOLID CUTAWAY FRIDGE CABINET (Zero Muddy Wireframe Clutter!)
         ===================================================================== */}

      {/* Left Solid Wall */}
      <mesh position={[-0.95, 0.15, 0]}>
        <boxGeometry args={[0.12, 3.5, 1.75]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
      </mesh>
      {/* Left Wall Toon Dark Trim */}
      <mesh position={[-1.02, 0.15, 0]}>
        <boxGeometry args={[0.02, 3.54, 1.79]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Top Solid Roof */}
      <mesh position={[0, 1.85, 0]}>
        <boxGeometry args={[2.02, 0.12, 1.75]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
      </mesh>
      {/* Red Cross-Section Cutaway Rim on Top Right Edge */}
      {cutawayProgress > 0.05 && (
        <mesh position={[0.95, 1.85, 0]}>
          <boxGeometry args={[0.08, 0.13, 1.76]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.25} />
        </mesh>
      )}

      {/* Bottom Floor of Food Compartment (Separates Fridge Cavity from Bottom Compressor Bay!) */}
      <mesh position={[0, -0.95, 0]}>
        <boxGeometry args={[1.98, 0.12, 1.75]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      {/* Red Cross-Section Cutaway Rim on Floor Edge */}
      {cutawayProgress > 0.05 && (
        <mesh position={[0.95, -0.95, 0]}>
          <boxGeometry args={[0.08, 0.13, 1.76]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.25} />
        </mesh>
      )}

      {/* Bottom Base Plinth */}
      <mesh position={[0, -1.92, 0]}>
        <boxGeometry args={[2.04, 0.16, 1.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Solid Insulated Partition Wall (Separates Interior Food from Back Condenser Coils!) */}
      <mesh position={[0, 0.45, -0.82]}>
        <boxGeometry args={[1.92, 2.75, 0.12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Inner Cold Blue Back Liner */}
      <mesh position={[0, 0.45, -0.75]}>
        <boxGeometry args={[1.82, 2.65, 0.02]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.3} />
      </mesh>
      {/* Exterior Dark Back Panel behind Condenser Coils (High contrast for hot orange coils!) */}
      <mesh position={[0, 0.45, -0.89]}>
        <boxGeometry args={[1.92, 2.75, 0.02]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Right Wall: Slides away smoothly for Solid Cutaway View */}
      {cutawayProgress < 0.98 && (
        <mesh
          position={[
            0.95 + cutawayProgress * 1.5,
            0.15,
            0,
          ]}
        >
          <boxGeometry args={[0.12, 3.5, 1.75]} />
          <meshStandardMaterial
            color="#f1f5f9"
            roughness={0.35}
            transparent={cutawayProgress > 0}
            opacity={1 - cutawayProgress}
          />
        </mesh>
      )}

      {/* Red Cutaway Frame Strip along Front-Right & Back-Right Pillar */}
      {cutawayProgress > 0.1 && (
        <group>
          <mesh position={[0.95, 0.45, -0.82]}>
            <boxGeometry args={[0.08, 2.8, 0.14]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.25} />
          </mesh>
        </group>
      )}

      {/* =====================================================================
          2. INTERIOR SHELVES & REAL 3D GLTF/GLB FOOD ASSETS
         ===================================================================== */}
      {/* Top Shelf */}
      <mesh position={[0, 0.98, 0]}>
        <boxGeometry args={[1.76, 0.04, 1.4]} />
        <meshStandardMaterial color="#bae6fd" roughness={0.2} />
      </mesh>
      {/* Middle Shelf */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.76, 0.04, 1.4]} />
        <meshStandardMaterial color="#bae6fd" roughness={0.2} />
      </mesh>

      {/* Food Item 1: Real 3D Roast Turkey on Ceramic Plate (Middle Shelf) */}
      <group position={[0.12, 0.07, 0.14]}>
        <Asset3D
          model={MODELS.food.plate}
          targetSize={0.68}
          position={[0, 0, 0]}
        />
        <Asset3D
          model={MODELS.food.roastTurkey}
          targetSize={0.5}
          position={[0, 0.04, 0]}
          rotation={[0, 0.4, 0]}
        />
      </group>

      {/* Food Item 2: Real 3D Milk Carton on Middle Shelf Left */}
      <Asset3D
        model={MODELS.food.milkCarton}
        targetSize={0.56}
        position={[-0.52, 0.07, 0.12]}
        rotation={[0, 0.35, 0]}
      />

      {/* Food Item 3: Real 3D Red Apple, Orange & Soda Can on Top Shelf */}
      <Asset3D
        model={MODELS.food.apple}
        targetSize={0.32}
        position={[-0.42, 1.0, 0.14]}
      />
      <Asset3D
        model={MODELS.food.orange}
        targetSize={0.28}
        position={[-0.05, 1.0, 0.18]}
      />
      {frame < 1313 && (
        <Asset3D
          model={MODELS.food.sodaCan}
          targetSize={0.38}
          position={[0.42, 1.0, 0.12]}
          rotation={[0, -0.4, 0]}
        />
      )}

      {/* Scene 7 Fact Reveal: Real 3D Steaming Hot Stew Pot ("Pantang Masukkan Makanan Panas!") */}
      {frame >= 1313 && (
        <group
          position={[0.38, 1.0, 0.22]}
          scale={spring({
            frame: frame - 1315,
            fps,
            config: { damping: 12 },
          })}
        >
          <Asset3D
            model={MODELS.food.hotStewPot}
            targetSize={0.62}
            position={[0, 0, 0]}
            rotation={[0, -0.35, 0]}
            emissiveColor="#ff3b00"
            emissiveIntensity={0.32}
          />
        </group>
      )}

      {/* =====================================================================
          3. COLOR-CODED REFRIGERATION PIPES (Hot Back vs Cold Inside)
         ===================================================================== */}
      {/* Hot Condenser Tube (Glowing Copper-Orange on Back Exterior) */}
      <mesh geometry={hotTubeGeo}>
        <meshStandardMaterial
          color="#ea580c"
          emissive="#c2410c"
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>

      {/* Back Condenser Vertical Radiator Wire Fins */}
      {[-0.5, -0.25, 0, 0.25, 0.5].map((xPos, i) => (
        <mesh key={i} position={[xPos, -0.05, -1.03]}>
          <cylinderGeometry args={[0.012, 0.012, 2.2, 8]} />
          <meshStandardMaterial color="#78350f" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Cold Evaporator Tube (Frosty Ice-Cyan Inside Compartment) */}
      <mesh geometry={coldTubeGeo}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.45}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* =====================================================================
          4. CUTAWAY MECHANICAL PISTON COMPRESSOR (Bottom Back)
         ===================================================================== */}
      <group position={[-0.05, -1.45, -0.75]}>
        {/* Outer Dark Steel Cylinder Housing (Back Half) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.72, 24, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>

        {/* Top & Bottom Caps of Compressor */}
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.39, 0.39, 0.06, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.36, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Red Cross-Section Cutaway Walls on Compressor Edges (Diesel Hammer Style!) */}
        <mesh position={[-0.37, 0, 0]}>
          <boxGeometry args={[0.05, 0.72, 0.08]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0.37, 0, 0]}>
          <boxGeometry args={[0.05, 0.72, 0.08]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.4} />
        </mesh>

        {/* Glowing Hot Compression Chamber Above Piston */}
        <mesh position={[0, 0.16 + pistonY * 0.4, 0]}>
          <cylinderGeometry
            args={[0.31, 0.31, Math.max(0.08, 0.32 - pistonY * 1.1), 20]}
          />
          <meshStandardMaterial
            color="#ff2a00"
            emissive="#ff4500"
            emissiveIntensity={0.8 + compressionHeat * 1.6}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Animated Silver Piston Head Pumping Up & Down */}
        <group position={[0, -0.05 + pistonY, 0]}>
          <mesh>
            <cylinderGeometry args={[0.32, 0.32, 0.16, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.15} />
          </mesh>
          {/* Piston Rings */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.325, 0.325, 0.02, 24]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Connecting Rod */}
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.26, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Crankshaft Wheel at Bottom of Compressor */}
        <mesh position={[0, -0.25, 0.02]} rotation={[Math.PI / 2, frame * 0.22, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 20]} />
          <meshStandardMaterial color="#facc15" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* 3D Thermometer Next to Compressor (Active in Shot 3) */}
        {compThermoScale > 0.01 && (
          <Thermometer3D
            position={[-0.68, 0.05, 0.0]}
            rotation={[0, Math.PI, 0]}
            level={compThermoLevel}
            color="#ff2a00"
            scale={0.65 * compThermoScale}
          />
        )}
      </group>

      {/* =====================================================================
          5. CUTAWAY EXPANSION VALVE NOZZLE (Top Right [0.82, 1.22, -0.1])
         ===================================================================== */}
      <group position={[0.82, 1.22, -0.1]}>
        {/* Outer Brass Valve Block with Cutaway Window */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.52, 24, 1, false, 0, Math.PI * 1.25]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.75}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Red Cutaway Rim on Valve Housing */}
        <mesh position={[0.14, 0.02, 0]}>
          <boxGeometry args={[0.04, 0.06, 0.52]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.4} />
        </mesh>

        {/* Hot High-Pressure Inlet Cone (Back half of valve) */}
        <mesh position={[0, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.11, 0.22, 16]} />
          <meshStandardMaterial
            color="#ff5500"
            emissive="#ff3300"
            emissiveIntensity={0.9}
          />
        </mesh>

        {/* Narrow Bottleneck Orifice Ring (Center Pinch Point) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.035, 12, 24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>

        {/* Cold Expanding Mist Spray Cone (Front half of valve) */}
        <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.022, 0.22, 16]} />
          <meshStandardMaterial
            color="#00f2fe"
            emissive="#00e5ff"
            emissiveIntensity={1.2}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Top Pressure Gauge Dial on Expansion Valve */}
        <group position={[0, 0.24, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <circleGeometry args={[0.1, 24]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* 3D Thermometer Side-by-Side Next to Expansion Valve (Active in Shot 6) */}
        {valveThermoScale > 0.01 && (
          <Thermometer3D
            position={[0.0, 0.08, 0.55]}
            rotation={[0, Math.PI / 2, 0]}
            level={valveThermoLevel}
            color="#00e5ff"
            scale={0.55 * valveThermoScale}
          />
        )}
      </group>

      {/* =====================================================================
          6. 3D ANIMATED ARROWS (Visualizing Heat Extraction & Rejection)
         ===================================================================== */}
      {/* Scene 2, 3 & 7: Heat Arrows Pulled from Food into Evaporator */}
      {((frame >= 260 && frame <= 560) || (frame >= 1315 && frame <= 1530)) && (
        <group>
          <ChunkyArrow3D
            position={[0.05, 0.45 + arrowWave * 0.25, 0.05 - arrowWave * 0.2]}
            rotation={[-0.6, 0, 0]}
            color="#ff3b00"
            scale={0.85}
          />
          <ChunkyArrow3D
            position={[-0.35, 0.65 + arrowWave * 0.25, 0.05 - arrowWave * 0.2]}
            rotation={[-0.6, 0, 0]}
            color="#ff3b00"
            scale={0.75}
          />
          <ChunkyArrow3D
            position={[0.35, 0.65 + arrowWave * 0.25, 0.05 - arrowWave * 0.2]}
            rotation={[-0.6, 0, 0]}
            color="#ff3b00"
            scale={0.75}
          />
        </group>
      )}

      {/* Scene 5: Big 3D Heat Arrows Shooting Outward from Back Condenser Coils */}
      {frame >= 715 && frame <= 970 && (
        <group>
          <ChunkyArrow3D
            position={[-0.45, -0.3 + arrowWave * 0.2, -1.22 - arrowWave * 0.25]}
            rotation={[-Math.PI / 2.4, 0, 0.2]}
            color="#ff5500"
            scale={0.95}
          />
          <ChunkyArrow3D
            position={[0.0, 0.15 + arrowWave * 0.2, -1.22 - arrowWave * 0.25]}
            rotation={[-Math.PI / 2.4, 0, 0]}
            color="#ff5500"
            scale={1.05}
          />
          <ChunkyArrow3D
            position={[0.45, 0.55 + arrowWave * 0.2, -1.22 - arrowWave * 0.25]}
            rotation={[-Math.PI / 2.4, 0, -0.2]}
            color="#ff5500"
            scale={0.95}
          />
        </group>
      )}

      {/* =====================================================================
          7. REAL 3D GLB FRIDGE BODY & ANIMATED FREEZER/FRIDGE DOORS (kitchenFridge.glb)
         ===================================================================== */}
      <KitchenFridge3D doorAngle={doorAngle} cutawayProgress={cutawayProgress} />
    </group>
  );
};
