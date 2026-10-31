import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ChunkyArrow3D, Thermometer3D } from "../assets";

interface DiscBrakeSystem3DProps {
  mode: "spin" | "overheat" | "vaporlock" | "pumpBrake";
}

/**
 * High-Precision Technical 3D Cross-Section:
 * Sistem Rem Cakram Hidrolik & Fenomena Vapor Lock
 * Skala proporsional, pas di layar vertical 9:16 tanpa terpotong,
 * lengkap dengan rotor floating, kaliper 2-piston, percikan api, selang transparan,
 * dan gelembung gas mendidih.
 */
export const DiscBrakeSystem3D: React.FC<DiscBrakeSystem3DProps> = ({ mode }) => {
  const frame = useCurrentFrame();

  // Kecepatan putaran piringan cakram
  const rotorSpin = frame * 0.22;

  let tempC = 45;
  let heatIntensity = 0;
  let isBoiling = false;
  let leverPull = 0;
  let padClamp = 0;
  let showSparks = false;

  if (mode === "spin") {
    tempC = interpolate(frame, [0, 497], [45, 95], { extrapolateRight: "clamp" });
    heatIntensity = 0.15;
    leverPull = 0.25;
    padClamp = 0.3;
  } else if (mode === "overheat") {
    // 497 - 834: Gesekan ekstrem cakram membara >200°C
    tempC = interpolate(frame, [497, 834], [95, 255], { extrapolateRight: "clamp" });
    heatIntensity = interpolate(frame, [497, 834], [0.2, 1.0], { extrapolateRight: "clamp" });
    leverPull = 0.75;
    padClamp = 0.95;
    showSparks = true;
  } else if (mode === "vaporlock") {
    // 834 - 1478: Minyak rem mendidih (>230°C), tuas amblas rata ke stang
    tempC = interpolate(frame, [834, 1478], [255, 270], { extrapolateRight: "clamp" });
    heatIntensity = 1.0;
    isBoiling = true;
    leverPull = 1.0; // Tuas rem ditarik mentok menyentuh karet stang!
    padClamp = 0.12; // Piston gagal mencengkeram karena gas membal!
    showSparks = false;
  } else if (mode === "pumpBrake") {
    // 1478 - 1728: Teknik kocok rem bergantian -> pendinginan
    tempC = interpolate(frame, [1478, 1728], [240, 105], { extrapolateRight: "clamp" });
    heatIntensity = interpolate(frame, [1478, 1728], [0.75, 0.15], { extrapolateRight: "clamp" });
    const pumpWave = Math.sin(frame * 0.26);
    leverPull = pumpWave > 0 ? 0.6 : 0.05;
    padClamp = pumpWave > 0 ? 0.6 : 0.05;
  }

  // Gradasi Warna Baja Piringan: Silver Mengkilap -> Jingga -> Merah Membara
  const discColor = useMemo(() => {
    if (heatIntensity < 0.25) return "#cbd5e1"; // Stainless steel
    if (heatIntensity < 0.65) return "#ea580c"; // Burning orange
    return "#ff2200"; // Blazing glowing red
  }, [heatIntensity]);

  const discEmissive = useMemo(() => {
    if (heatIntensity < 0.3) return "#000000";
    if (heatIntensity < 0.7) return "#b91c1c";
    return "#ff3300";
  }, [heatIntensity]);

  // Gelembung uap gas mendidih di dalam selang
  const bubbles = useMemo(() => {
    const list: { id: number; x: number; y: number; size: number; speed: number }[] = [];
    for (let i = 0; i < 24; i++) {
      list.push({
        id: i,
        x: ((i % 5) - 2) * 0.024,
        y: ((i * 0.14) % 1.3) - 0.65,
        size: 0.018 + ((i * 7) % 5) * 0.006,
        speed: 0.02 + (i % 3) * 0.01,
      });
    }
    return list;
  }, []);

  // Percikan api gesekan (friction sparks)
  const sparks = useMemo(() => {
    const list: { id: number; seed: number; vx: number; vy: number; vz: number }[] = [];
    for (let i = 0; i < 20; i++) {
      const angle = 0.5 + (i * 0.19);
      list.push({
        id: i,
        seed: i * 0.91,
        vx: Math.cos(angle) * (0.35 + (i % 4) * 0.12),
        vy: -Math.sin(angle) * (0.28 + (i % 3) * 0.16),
        vz: ((i % 3) - 1) * 0.1,
      });
    }
    return list;
  }, []);

  // Lubang ventilasi piringan cakram
  const ventHoles = useMemo(() => {
    const holes: { angle: number; radius: number }[] = [];
    for (let ring = 0; ring < 2; ring++) {
      const count = ring === 0 ? 12 : 16;
      const r = ring === 0 ? 0.58 : 0.76;
      for (let i = 0; i < count; i++) {
        holes.push({ angle: (i / count) * Math.PI * 2 + ring * 0.15, radius: r });
      }
    }
    return holes;
  }, []);

  // Asap panas termal
  const smokePuffs = useMemo(() => {
    const list: { id: number; seed: number; offsetZ: number }[] = [];
    for (let i = 0; i < 14; i++) {
      list.push({
        id: i,
        seed: i * 1.37,
        offsetZ: ((i % 4) - 1.5) * 0.08,
      });
    }
    return list;
  }, []);

  return (
    <group position={[0, -0.15, 0]}>
      {/* ================================================================== */}
      {/* 1. PERFORATED FLOATING BRAKE ROTOR (RADIUS 0.9, BULAT TEGAK KE KAMERA) */}
      {/* ================================================================== */}
      <group position={[0, 0, 0]}>
        {/* Assembly Cakram Berputar */}
        <group rotation={[0, 0, rotorSpin]}>
          {/* Outer Friction Ring (Permukaan Gesek Stainless Steel) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[0.92, 0.92, 0.038, 48]} />
            <meshStandardMaterial
              color={discColor}
              emissive={discEmissive}
              emissiveIntensity={heatIntensity * 2.8}
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>

          {/* Chamfered Edge */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.935, 0.935, 0.015, 48]} />
            <meshStandardMaterial
              color={discColor}
              emissive={discEmissive}
              emissiveIntensity={heatIntensity * 2.5}
              metalness={0.75}
              roughness={0.2}
            />
          </mesh>

          {/* Center Hub Carrier (Hitam Anodized) */}
          <mesh position={[0, 0, 0.008]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.44, 0.44, 0.05, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.35} />
          </mesh>

          {/* Center Axle Nut */}
          <mesh position={[0, 0, 0.016]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* 6 Baut Rivet Emas Floating Disc */}
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const rad = (idx / 6) * Math.PI * 2;
            return (
              <mesh
                key={idx}
                position={[Math.cos(rad) * 0.46, Math.sin(rad) * 0.46, 0.008]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[0.045, 0.045, 0.06, 12]} />
                <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
              </mesh>
            );
          })}

          {/* Lubang Ventilasi Cakram */}
          {ventHoles.map((h, hIdx) => (
            <mesh
              key={hIdx}
              position={[Math.cos(h.angle) * h.radius, Math.sin(h.angle) * h.radius, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.024, 0.024, 0.045, 8]} />
              <meshStandardMaterial color="#090d16" roughness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Dynamic Glow Cahaya Panas Cakram */}
        {heatIntensity > 0.25 && (
          <pointLight
            color="#ff3300"
            intensity={heatIntensity * 6}
            distance={3.0}
            decay={2}
          />
        )}
      </group>

      {/* ================================================================== */}
      {/* 2. DUAL-PISTON HYDRAULIC BRAKE CALIPER (MENJEPIT DI SISI ATAS-KANAN) */}
      {/* ================================================================== */}
      <group position={[0.66, 0.54, 0]} rotation={[0, 0, -0.68]}>
        {/* Bodi Kaliper Balap Merah */}
        <mesh position={[0.09, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.66, 0.32]} />
          <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Celah U-Shape Piringan Cakram */}
        <mesh position={[-0.08, 0, 0]}>
          <boxGeometry args={[0.18, 0.54, 0.06]} />
          <meshStandardMaterial color="#090d16" roughness={0.8} />
        </mesh>

        {/* Dual Hydraulic Pistons */}
        {[-0.13, 0.13].map((py, pIdx) => {
          const clampOffset = padClamp * 0.02;
          return (
            <group key={pIdx} position={[0.03, py, 0]}>
              <mesh position={[0, 0, 0.075 - clampOffset]}>
                <cylinderGeometry args={[0.085, 0.085, 0.09, 14]} />
                <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0, -0.075 + clampOffset]}>
                <cylinderGeometry args={[0.085, 0.085, 0.09, 14]} />
                <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          );
        })}

        {/* Kampas Rem Sintered */}
        <mesh position={[-0.03, 0, 0.028]}>
          <boxGeometry args={[0.09, 0.44, 0.018]} />
          <meshStandardMaterial color="#475569" roughness={0.85} metalness={0.4} />
        </mesh>
        <mesh position={[-0.03, 0, -0.028]}>
          <boxGeometry args={[0.09, 0.44, 0.018]} />
          <meshStandardMaterial color="#475569" roughness={0.85} metalness={0.4} />
        </mesh>

        {/* Baut Nipel Emas */}
        <mesh position={[0.16, 0.34, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.09, 8]} />
          <meshStandardMaterial color="#facc15" metalness={0.85} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 3. PERCIKAN API GESEKAN MIKRO (FRICTION SPARKS)                    */}
      {/* ================================================================== */}
      {showSparks &&
        sparks.map((sp) => {
          const t = (frame * 0.08 + sp.seed) % 1;
          const px = 0.62 + sp.vx * t;
          const py = 0.42 + sp.vy * t;
          const pz = sp.vz + (t * 0.08);
          const size = (1 - t) * 0.024;

          return (
            <mesh key={sp.id} position={[px, py, pz]}>
              <sphereGeometry args={[size, 6, 6]} />
              <meshStandardMaterial
                color="#facc15"
                emissive="#ff5500"
                emissiveIntensity={3.5}
                roughness={0.1}
              />
            </mesh>
          );
        })}

      {/* ================================================================== */}
      {/* 4. SELANG HIDROLIK TRANSPARAN (VAPOR LOCK BOILING COLUMN)          */}
      {/* ================================================================== */}
      <group position={[0.42, 1.05, 0]} rotation={[0, 0, 0.32]}>
        {/* Baut Banjo Fitting di Kaliper */}
        <mesh position={[0, -0.58, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.09, 10]} />
          <meshStandardMaterial color="#facc15" metalness={0.85} />
        </mesh>

        {/* Selang Luar Transparan */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 1.2, 18]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            roughness={0.1}
          />
        </mesh>

        {/* Kolom Minyak Rem DOT 4 */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.056, 0.056, 1.18, 14]} />
          <meshStandardMaterial
            color={isBoiling ? "#ea580c" : "#ca8a04"}
            transparent
            opacity={0.8}
            roughness={0.15}
          />
        </mesh>

        {/* Gelembung Gas Uap Mendidih */}
        {isBoiling &&
          bubbles.map((b) => {
            const curY = ((b.y + frame * b.speed + 1) % 1.15) - 0.58;
            const bubbleScale = 0.85 + 0.3 * Math.sin(frame * 0.4 + b.id);
            return (
              <mesh
                key={b.id}
                position={[b.x, curY, 0]}
                scale={bubbleScale * (b.size / 0.018)}
              >
                <sphereGeometry args={[0.018, 8, 8]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#fed7aa"
                  emissiveIntensity={0.9}
                  transparent
                  opacity={0.95}
                  roughness={0.1}
                />
              </mesh>
            );
          })}
      </group>

      {/* ================================================================== */}
      {/* 5. MASTER REM & TUAS REM MOTOR MATIC (HANDLEBAR & LEVER ATAS)       */}
      {/* ================================================================== */}
      <group position={[-0.08, 1.55, 0]}>
        {/* Pipa Stang */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.95, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.75} roughness={0.3} />
        </mesh>
        {/* Handgrip Karet */}
        <mesh position={[-0.26, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.095, 0.095, 0.42, 12]} />
          <meshStandardMaterial color="#18181b" roughness={0.95} />
        </mesh>

        {/* Tabung Reservoir Minyak Rem */}
        <mesh position={[0.07, 0.12, 0]}>
          <boxGeometry args={[0.26, 0.2, 0.2]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* Kaca Pantau Minyak Rem */}
        <mesh position={[0.07, 0.12, 0.105]}>
          <cylinderGeometry args={[0.042, 0.042, 0.012, 10]} />
          <meshStandardMaterial
            color={isBoiling ? "#ea580c" : "#ca8a04"}
            roughness={0.1}
          />
        </mesh>

        {/* Tuas Rem Depan (Brake Lever) */}
        {/* Saat Vapor Lock: leverPull = 1.0 -> tuas ditarik amblas rapat ke stang! */}
        <group position={[0.02, -0.03, 0.1]} rotation={[0, 0, -leverPull * 0.38]}>
          <mesh position={[-0.28, -0.035, 0]} rotation={[0, 0, 0.16]}>
            <boxGeometry args={[0.58, 0.045, 0.024]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.12} />
          </mesh>
          <mesh position={[-0.56, -0.08, 0]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* 6. ASAP PANAS TERMAL & RADIASI UDARA                               */}
      {/* ================================================================== */}
      {heatIntensity > 0.4 &&
        smokePuffs.map((s) => {
          const t = (frame * 0.035 + s.seed) % 1;
          const py = 0.6 + t * 1.2;
          const px = 0.65 + Math.sin(t * 6 + s.seed) * 0.15;
          const scale = 0.05 + t * 0.15;
          const opacity = (1 - t) * 0.55;
          return (
            <mesh key={s.id} position={[px, py, s.offsetZ]} scale={scale}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshStandardMaterial
                color="#fed7aa"
                transparent
                opacity={opacity}
                roughness={1}
              />
            </mesh>
          );
        })}

      {/* ================================================================== */}
      {/* 7. GIZMOS: TERMOMETER 3D & PANAH INDIKATOR CHUNKY                  */}
      {/* ================================================================== */}
      {/* Termometer 3D di Sisi Kiri Cakram */}
      <group position={[-1.3, -0.05, 0.1]}>
        <Thermometer3D
          position={[0, 0, 0]}
          level={interpolate(tempC, [20, 270], [0.15, 0.96], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          color={tempC > 200 ? "#ef4444" : "#facc15"}
          scale={1.3}
        />
      </group>

      {/* Panah Gesekan Piringan Cakram Membara */}
      {mode === "overheat" && (
        <ChunkyArrow3D
          position={[0.9, 0.05, 0.3]}
          rotation={[0, 0, Math.PI / 2]}
          color="#ff4400"
          scale={1.0}
        />
      )}

      {/* Panah Vapor Lock pada Selang Mendidih */}
      {mode === "vaporlock" && (
        <ChunkyArrow3D
          position={[0.7, 1.2, 0.3]}
          rotation={[0, 0, -Math.PI / 4]}
          color="#ef4444"
          scale={1.0}
        />
      )}
    </group>
  );
};
