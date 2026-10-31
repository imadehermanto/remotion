import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Asset3D,
  CharacterWorker3D,
  ChunkyArrow3D,
  MODELS,
} from "../assets";

const GRAVEL_STONES: {
  pos: [number, number, number];
  size: number;
  rot: [number, number, number];
  inCavity: boolean;
}[] = [
  // Left stable gravel stones
  { pos: [-1.45, -0.42, 0.72], size: 0.34, rot: [0.2, 0.4, 0.1], inCavity: false },
  { pos: [-1.05, -0.52, 0.74], size: 0.3, rot: [0.5, 0.2, 0.3], inCavity: false },
  { pos: [-0.72, -0.38, 0.72], size: 0.32, rot: [0.1, 0.7, 0.2], inCavity: false },
  // Center stones (inside cavity zone - get washed/pumped away in Scene 4!)
  { pos: [-0.28, -0.38, 0.75], size: 0.3, rot: [0.4, 0.1, 0.5], inCavity: true },
  { pos: [0.02, -0.45, 0.76], size: 0.33, rot: [0.3, 0.8, 0.2], inCavity: true },
  { pos: [0.32, -0.36, 0.75], size: 0.29, rot: [0.7, 0.3, 0.4], inCavity: true },
  // Right stable gravel stones
  { pos: [0.75, -0.42, 0.72], size: 0.34, rot: [0.2, 0.5, 0.6], inCavity: false },
  { pos: [1.12, -0.5, 0.74], size: 0.31, rot: [0.6, 0.2, 0.1], inCavity: false },
  { pos: [1.48, -0.38, 0.72], size: 0.35, rot: [0.3, 0.9, 0.2], inCavity: false },
];

export const RoadCrossSectionModel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Crack appearance (starts in Scene 3: frame 480)
  const crackProgress = interpolate(frame, [475, 540], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Water seeping into sub-base (starts in Scene 3B: frame 633)
  const waterSeepProgress = interpolate(frame, [633, 760], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. Cavity / Void formation ("Kopong tanpa penyangga" in Scene 4: frame 860 -> 1060)
  const cavityProgress = interpolate(frame, [860, 1060], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4. Asphalt Collapse into Pothole (Scene 5: frame 1220 -> 1280)
  const collapseSpring = spring({
    frame: frame - 1225,
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  // Vehicle 1: Taxi hitting pothole in Scene 1 (frames 0 - 188)
  const taxiX = interpolate(frame, [0, 185], [-2.6, 2.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taxiBumpY =
    frame >= 65 && frame <= 115
      ? -Math.sin(((frame - 65) / 50) * Math.PI) * 0.18
      : 0;
  const taxiTiltZ =
    frame >= 65 && frame <= 115
      ? Math.sin(((frame - 65) / 50) * Math.PI * 2) * 0.14
      : 0;

  // Vehicle 2: Heavy Delivery Truck pressing water & pumping sand out in Scene 4 (frames 810 - 1030)
  const truckX = interpolate(frame, [810, 1020], [-2.8, 2.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Vehicle 3: SUV crushing the hollow asphalt in Scene 5 (frames 1185 - 1370)
  const suvX = interpolate(frame, [1185, 1360], [-2.6, 2.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const suvDropY =
    frame >= 1220 && frame <= 1290
      ? -Math.sin(((frame - 1220) / 70) * Math.PI) * 0.22
      : 0;

  // Animated water droplets seeping through the crack and spraying out under pressure
  const waterDrops = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => {
      const seed = i * 11.3;
      const p = (frame * 0.02 + seed) % 1;

      // During pumping (frame 850-1040), water & sand spray UP and OUT of the crack
      const isPumping = frame >= 850 && frame < 1045;
      if (isPumping) {
        const side = i % 2 === 0 ? -1 : 1;
        const x = side * p * 0.65;
        const y = -0.35 + Math.sin(p * Math.PI) * 0.75;
        const z = 0.78;
        const isSand = i % 3 === 0;
        return {
          x,
          y,
          z,
          color: isSand ? "#f59e0b" : "#00e5ff",
          scale: 0.048,
        };
      }

      // Normal seepage downward through the crack (frame 633+)
      const spreadX = ((i % 7) - 3) * 0.14 * p;
      const x = spreadX;
      const y = 0.22 - p * 0.68;
      const z = 0.78;
      return {
        x,
        y,
        z,
        color: "#00e5ff",
        scale: 0.044,
      };
    });
  }, [frame]);

  const arrowWave = (frame * 0.022) % 1;

  return (
    <group position={[0, -0.35, 0]}>
      {/* =====================================================================
          1. INDONESIAN ROADSIDE ENVIRONMENT (Houses, Trees, Sidewalk)
         ===================================================================== */}
      <group position={[0, 0.2, -1.65]}>
        {/* Concrete Sidewalk / Curb */}
        <mesh position={[0, 0.02, 0.55]} receiveShadow>
          <boxGeometry args={[6.4, 0.18, 0.9]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* Indonesian Houses & Trees in Background */}
        <Asset3D
          model={MODELS.buildings.house3}
          targetSize={2.6}
          position={[-1.6, 0.1, -0.8]}
        />
        <Asset3D
          model={MODELS.buildings.house5}
          targetSize={2.6}
          position={[1.55, 0.1, -0.8]}
        />
        <Asset3D
          model={MODELS.nature.treeSmall}
          targetSize={2.1}
          position={[0.0, 0.1, -0.6]}
        />
        <Asset3D
          model={MODELS.nature.pottedPlant}
          targetSize={0.55}
          position={[-0.75, 0.1, -0.1]}
        />
        {/* Visual Easter Egg: Cute Dog Watching the Road from the Sidewalk */}
        <Asset3D
          model={MODELS.characters.dog}
          targetSize={0.48}
          position={[0.78, 0.11, 0.25]}
          rotation={[0, -0.35, 0]}
        />
      </group>

      {/* =====================================================================
          2. 3-LAYER ROAD CROSS-SECTION DIORAMA BLOCK
         ===================================================================== */}
      {/* LAYER 3 (BOTTOM): Tanah Dasar / Subgrade Soil */}
      <mesh position={[0, -1.05, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.85, 1.5]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.9} />
      </mesh>
      {/* Dark Toon Base Frame */}
      <mesh position={[0, -1.52, 0]}>
        <boxGeometry args={[4.32, 0.1, 1.62]} />
        <meshStandardMaterial color="#1a0f07" roughness={0.9} />
      </mesh>

      {/* LAYER 2 (MIDDLE): Lapisan Pondasi Agregat Pasir & Kerikil (Sub-base) */}
      <mesh position={[0, -0.35, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.56, 1.5]} />
        <meshStandardMaterial
          color={waterSeepProgress > 0.3 ? "#78350f" : "#b45309"}
          roughness={0.85}
        />
      </mesh>

      {/* Waterlogged Blue Glow in Sub-base when Rain Seeps In */}
      {waterSeepProgress > 0.05 && (
        <mesh position={[0, -0.35, 0.755]}>
          <planeGeometry args={[1.65 * waterSeepProgress, 0.5]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#00e5ff"
            emissiveIntensity={0.35}
            transparent
            opacity={0.65 * (1 - cavityProgress * 0.4)}
          />
        </mesh>
      )}

      {/* Dark Hollow Void / Cavity ("Kopong Tanpa Penyangga!") under Asphalt */}
      {cavityProgress > 0.02 && (
        <mesh
          position={[0, -0.26, 0.76]}
          scale={[cavityProgress, cavityProgress, 1]}
        >
          <planeGeometry args={[1.35, 0.38]} />
          <meshStandardMaterial color="#090d16" roughness={0.95} />
        </mesh>
      )}

      {/* 3D Gravel Stones embedded in Front Cross-Section Face */}
      {GRAVEL_STONES.map((st, idx) => {
        // Center stones get washed out as cavity forms
        const stoneScale = st.inCavity
          ? Math.max(0, 1 - cavityProgress * 1.2)
          : 1;
        if (stoneScale <= 0.02) return null;

        return (
          <Asset3D
            key={`gravel-${idx}`}
            model={idx % 2 === 0 ? MODELS.nature.stone : MODELS.nature.rock}
            targetSize={st.size * stoneScale}
            anchor="center"
            position={st.pos}
            rotation={st.rot}
          />
        );
      })}

      {/* LAYER 1 (TOP): Lapisan Aspal Hitam (Left & Right Solid Wings) */}
      {/* Left Solid Asphalt Slab */}
      <mesh position={[-1.35, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.5, 0.3, 1.52]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} />
      </mesh>
      {/* Right Solid Asphalt Slab */}
      <mesh position={[1.35, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.5, 0.3, 1.52]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} />
      </mesh>

      {/* Center Asphalt Section (Intact -> Cracked -> Collapses into Pothole!) */}
      {frame < 188 ? (
        // Scene 1: Show Pothole Filled with Puddle Water on the Road
        <group>
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[1.2, 0.14, 1.52]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Muddy Rain Puddle Inside Pothole */}
          <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.15, 1.1]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.3}
              roughness={0.15}
            />
          </mesh>
        </group>
      ) : (
        // Scene 2 to 6: Scientific Progression (Solid -> Hairline Crack -> Collapsing Chunks)
        <group>
          {/* Left Center Asphalt Chunk */}
          <mesh
            position={[
              -0.31 - crackProgress * 0.03,
              0.08 - collapseSpring * 0.32,
              0,
            ]}
            rotation={[0, 0, -collapseSpring * 0.38]}
            castShadow
          >
            <boxGeometry args={[0.56, 0.3, 1.52]} />
            <meshStandardMaterial color="#1e293b" roughness={0.65} />
          </mesh>

          {/* Right Center Asphalt Chunk */}
          <mesh
            position={[
              0.31 + crackProgress * 0.03,
              0.08 - collapseSpring * 0.32,
              0,
            ]}
            rotation={[0, 0, collapseSpring * 0.38]}
            castShadow
          >
            <boxGeometry args={[0.56, 0.3, 1.52]} />
            <meshStandardMaterial color="#1e293b" roughness={0.65} />
          </mesh>

          {/* Glowing Crack Line in Center of Asphalt (Scene 3 & 4) */}
          {crackProgress > 0.05 && collapseSpring < 0.5 && (
            <mesh position={[0, 0.08, 0.765]}>
              <boxGeometry args={[0.055 * crackProgress, 0.31, 0.02]} />
              <meshStandardMaterial
                color="#00e5ff"
                emissive="#00e5ff"
                emissiveIntensity={0.85}
              />
            </mesh>
          )}
        </group>
      )}

      {/* White Dashed Road Markings on Top of Asphalt */}
      {[-1.5, -0.75, 0.75, 1.5].map((xMark, idx) => (
        <mesh key={`mark-${idx}`} position={[xMark, 0.235, 0]}>
          <boxGeometry args={[0.38, 0.01, 0.12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      ))}

      {/* =====================================================================
          3. SEEPING WATER & PUMPING SAND PARTICLES
         ===================================================================== */}
      {frame >= 633 &&
        frame < 1180 &&
        waterDrops.map((d, idx) => (
          <mesh key={`drop-${idx}`} position={[d.x, d.y, d.z]}>
            <sphereGeometry args={[d.scale, 12, 12]} />
            <meshStandardMaterial
              color={d.color}
              emissive={d.color}
              emissiveIntensity={0.75}
            />
          </mesh>
        ))}

      {/* =====================================================================
          4. 3D CHUNKY ARROWS (Sun/Load Stress, Water Seepage, Tire Pumping)
         ===================================================================== */}
      {/* Scene 3: Downward Arrows Showing Stress & Water Seeping into Crack */}
      {frame >= 480 && frame < 809 && (
        <group>
          <ChunkyArrow3D
            position={[0, 0.68 - arrowWave * 0.22, 0.45]}
            rotation={[Math.PI, 0, 0]}
            color={frame < 633 ? "#facc15" : "#00e5ff"}
            scale={0.95}
          />
          <ChunkyArrow3D
            position={[-0.45, 0.75 - arrowWave * 0.22, 0.45]}
            rotation={[Math.PI, 0, 0.2]}
            color={frame < 633 ? "#facc15" : "#00e5ff"}
            scale={0.8}
          />
          <ChunkyArrow3D
            position={[0.45, 0.75 - arrowWave * 0.22, 0.45]}
            rotation={[Math.PI, 0, -0.2]}
            color={frame < 633 ? "#facc15" : "#00e5ff"}
            scale={0.8}
          />
        </group>
      )}

      {/* Scene 4: Heavy Tire Load Arrows Pressing Down & Pumping Sand Out */}
      {frame >= 820 && frame < 1180 && (
        <group>
          <ChunkyArrow3D
            position={[0, 0.65 - arrowWave * 0.2, 0.55]}
            rotation={[Math.PI, 0, 0]}
            color="#ff3b00"
            scale={1.05}
          />
          <ChunkyArrow3D
            position={[-0.42 - arrowWave * 0.18, 0.42 + arrowWave * 0.18, 0.65]}
            rotation={[0, 0, 0.65]}
            color="#00e5ff"
            scale={0.8}
          />
          <ChunkyArrow3D
            position={[0.42 + arrowWave * 0.18, 0.42 + arrowWave * 0.18, 0.65]}
            rotation={[0, 0, -0.65]}
            color="#00e5ff"
            scale={0.8}
          />
        </group>
      )}

      {/* =====================================================================
          5. PASSING 3D VEHICLES & INDONESIAN ROAD WORKER
         ===================================================================== */}
      {/* Scene 1: Taxi Driving & Hitting Pothole */}
      {frame < 188 && (
        <group
          position={[taxiX, 0.23 + taxiBumpY, 0.1]}
          rotation={[0, Math.PI / 2, taxiTiltZ]}
        >
          <Asset3D model={MODELS.vehicles.taxi} targetSize={1.55} />
        </group>
      )}

      {/* Scene 4: Heavy Delivery Truck Rolling Over Wet Road */}
      {frame >= 809 && frame < 1040 && (
        <group
          position={[truckX, 0.23, 0.05]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <Asset3D model={MODELS.vehicles.deliveryTruck} targetSize={1.85} />
        </group>
      )}

      {/* Scene 5: SUV Crushing the Unsupported Asphalt into a Pothole */}
      {frame >= 1181 && frame < 1390 && (
        <group
          position={[suvX, 0.23 + suvDropY, 0.08]}
          rotation={[0, Math.PI / 2, suvDropY * 0.8]}
        >
          <Asset3D model={MODELS.vehicles.suv} targetSize={1.65} />
        </group>
      )}

      {/* Scene 6: Indonesian Road Worker with Caping & Shovel Explaining Why Wet Patching Fails */}
      {frame >= 1400 && (
        <group
          scale={spring({
            frame: frame - 1402,
            fps,
            config: { damping: 13 },
          })}
        >
          <CharacterWorker3D
            position={[-0.82, 0.23, 0.1]}
            rotation={[0, 0.55, 0]}
            scale={0.68}
            shirtColor="#f97316"
            pantsColor="#1e293b"
            showCaping
            action="digging"
            tool="shovel"
          />
          {/* Water Puddle Inside Pothole Showing Why Wet Patching Peels Off */}
          <mesh position={[0, -0.16, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.05, 0.95]} />
            <meshStandardMaterial
              color="#00e5ff"
              emissive="#0284c7"
              emissiveIntensity={0.45}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
