import React, { useMemo } from "react";

interface MotorMatic3DProps {
  wheelRotation?: number;
  brakeGlow?: number; // 0 to 1
  bodyColor?: string;
  accentColor?: string;
  scale?: number;
}

/**
 * 3D Motor Matic Indonesia Modern (Vario / Aerox Style)
 * Proporsi seimbang, aerodinamis, lampu LED tajam, boks CVT kiri, knalpot kanan,
 * dan pengendara berhelm.
 */
export const MotorMatic3D: React.FC<MotorMatic3DProps> = ({
  wheelRotation = 0,
  brakeGlow = 0,
  bodyColor = "#0284c7",
  accentColor = "#0f172a",
  scale = 1,
}) => {
  const heatColor = useMemo(() => {
    if (brakeGlow <= 0.2) return "#cbd5e1";
    if (brakeGlow <= 0.6) return "#ea580c";
    return "#ff2200";
  }, [brakeGlow]);

  const heatEmissive = useMemo(() => {
    if (brakeGlow <= 0.25) return "#000000";
    if (brakeGlow <= 0.65) return "#c2410c";
    return "#ff3300";
  }, [brakeGlow]);

  return (
    <group scale={scale}>
      {/* ================================================================== */}
      {/* 1. RODA DEPAN & REM CAKRAM (FRONT WHEEL & DISC BRAKE)              */}
      {/* ================================================================== */}
      <group position={[0, 0.34, 0.74]}>
        {/* Roda Depan yang Berputar */}
        <group rotation={[wheelRotation, 0, 0]}>
          {/* Ban Luar Karet Tebal */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.3, 0.075, 16, 32]} />
            <meshStandardMaterial color="#18181b" roughness={0.92} />
          </mesh>

          {/* Velg Alloy Racing */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.23, 0.23, 0.065, 20]} />
            <meshStandardMaterial color="#090d16" roughness={0.4} metalness={0.6} />
          </mesh>

          {/* Palang Velg Racing Bintang */}
          {[0, 1, 2, 3, 4].map((s) => (
            <mesh
              key={s}
              rotation={[(s * Math.PI * 2) / 5, 0, 0]}
              position={[0, 0, 0]}
            >
              <boxGeometry args={[0.022, 0.22, 0.03]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.7} />
            </mesh>
          ))}

          {/* Piringan Cakram Depan (Floating Rotor) di Sisi Kanan */}
          <group position={[0.055, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.014, 24]} />
            <meshStandardMaterial
              color={heatColor}
              emissive={heatEmissive}
              emissiveIntensity={brakeGlow * 3.0}
              roughness={0.25}
              metalness={0.65}
            />
          </group>
        </group>

        {/* Kaliper Rem Balap Merah */}
        <group position={[0.07, 0.11, -0.05]} rotation={[-0.3, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.055, 0.11, 0.07]} />
            <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.3} />
          </mesh>
        </group>

        {/* Dynamic Glow Panas Cakram */}
        {brakeGlow > 0.2 && (
          <pointLight
            color="#ff3300"
            intensity={brakeGlow * 4.5}
            distance={1.6}
            decay={2}
          />
        )}

        {/* Suspensi Teleskopik Depan */}
        {[-0.075, 0.075].map((fx, idx) => (
          <group key={idx} position={[fx, 0.22, -0.02]} rotation={[-0.14, 0, 0]}>
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.026, 0.026, 0.24, 12]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.85} />
            </mesh>
          </group>
        ))}

        {/* Spatbor Depan (Front Mudguard) */}
        <group position={[0, 0.32, 0.02]} rotation={[-0.2, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.18, 0.08, 0.38]} />
            <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.25} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* 2. RODA BELAKANG, BOKS CVT & KNALPOT SPORTY                        */}
      {/* ================================================================== */}
      <group position={[0, 0.34, -0.7]}>
        {/* Roda Belakang Berputar */}
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.3, 0.08, 16, 32]} />
            <meshStandardMaterial color="#18181b" roughness={0.92} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.23, 0.23, 0.065, 20]} />
            <meshStandardMaterial color="#090d16" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>

        {/* Boks Transmisi CVT di Sisi Kiri */}
        <group position={[-0.14, 0.04, 0.16]}>
          <mesh>
            <boxGeometry args={[0.09, 0.15, 0.52]} />
            <meshStandardMaterial color="#334155" roughness={0.45} metalness={0.5} />
          </mesh>
          {/* Box Filter Udara */}
          <mesh position={[0, 0.13, -0.05]}>
            <boxGeometry args={[0.1, 0.11, 0.28]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        </group>

        {/* Knalpot Racing di Sisi Kanan */}
        <group position={[0.15, 0.07, 0.05]} rotation={[-0.12, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.075, 0.6, 14]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Ujung Silver */}
          <mesh position={[0, -0.015, -0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.065, 0.08, 12]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>

        {/* Monoshock Belakang Per Kuning */}
        <group position={[-0.11, 0.24, 0.06]} rotation={[0.24, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.028, 0.028, 0.28, 10]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ================================================================== */}
      {/* 3. DEK KAKI & CHASSIS STEP-THROUGH (CIRI KHAS MOTOR MATIC)         */}
      {/* ================================================================== */}
      <group position={[0, 0.35, 0.04]}>
        {/* Dek Kaki Datar */}
        <mesh>
          <boxGeometry args={[0.42, 0.07, 0.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} />
        </mesh>
        {/* Karpet Karet Hitam */}
        <mesh position={[0, 0.038, 0]}>
          <boxGeometry args={[0.38, 0.01, 0.44]} />
          <meshStandardMaterial color="#090d16" roughness={0.95} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 4. TAMENG DEPAN, LAMPU UTAMA LED GANDA & VISOR                     */}
      {/* ================================================================== */}
      <group position={[0, 0.76, 0.5]} rotation={[-0.26, 0, 0]}>
        {/* Fairing Tameng Depan */}
        <mesh>
          <boxGeometry args={[0.38, 0.54, 0.22]} />
          <meshStandardMaterial color={bodyColor} roughness={0.28} metalness={0.3} />
        </mesh>

        {/* Panel Samping Sayap Aerodinamis */}
        {[-0.2, 0.2].map((sx, idx) => (
          <mesh key={idx} position={[sx, -0.04, 0.02]} rotation={[0, sx > 0 ? 0.25 : -0.25, 0]}>
            <boxGeometry args={[0.05, 0.46, 0.18]} />
            <meshStandardMaterial color={accentColor} roughness={0.5} />
          </mesh>
        ))}

        {/* Lampu Utama LED Ganda V-Shape */}
        <mesh position={[0, -0.08, 0.115]}>
          <boxGeometry args={[0.3, 0.11, 0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>

        {/* DRL Strip Alis Biru */}
        <mesh position={[0, -0.01, 0.116]}>
          <boxGeometry args={[0.32, 0.02, 0.015]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2.2}
          />
        </mesh>

        {/* Visor Smoke Depan */}
        <mesh position={[0, 0.28, 0.06]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.22, 0.18, 0.02]} />
          <meshStandardMaterial color="#090d16" roughness={0.2} metalness={0.6} />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 5. STANG, SPEEDOMETER DIGITAL, KACA SPION & DUAL TUAS REM          */}
      {/* ================================================================== */}
      <group position={[0, 1.08, 0.38]}>
        {/* Cover Speedometer */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.28, 0.12, 0.16]} />
          <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.25} />
        </mesh>

        {/* Layar Digital LCD */}
        <mesh position={[0, 0.065, -0.01]} rotation={[-0.35, 0, 0]}>
          <boxGeometry args={[0.16, 0.08, 0.012]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={1.0}
            roughness={0.1}
          />
        </mesh>

        {/* Stang & Tuas Rem Kiri Kanan */}
        {[-0.3, 0.3].map((hx, idx) => (
          <group key={idx} position={[hx, -0.01, 0]}>
            {/* Pipa Stang */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.18, 10]} />
              <meshStandardMaterial color="#090d16" roughness={0.5} />
            </mesh>
            {/* Handgrip Karet */}
            <mesh position={[hx > 0 ? 0.035 : -0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.026, 0.026, 0.11, 12]} />
              <meshStandardMaterial color="#18181b" roughness={0.95} />
            </mesh>
            {/* Tuas Rem Depan / Belakang */}
            <mesh
              position={[0, -0.01, 0.07]}
              rotation={[0, hx > 0 ? -0.25 : 0.25, 0]}
            >
              <boxGeometry args={[0.14, 0.018, 0.012]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.9} />
            </mesh>
            {/* Kaca Spion */}
            <group position={[0, 0.12, -0.02]}>
              <mesh rotation={[0.2, hx > 0 ? -0.2 : 0.2, 0]}>
                <cylinderGeometry args={[0.007, 0.007, 0.15, 6]} />
                <meshStandardMaterial color="#090d16" metalness={0.7} />
              </mesh>
              <mesh position={[hx > 0 ? 0.06 : -0.06, 0.08, 0]}>
                <boxGeometry args={[0.1, 0.06, 0.018]} />
                <meshStandardMaterial color="#090d16" roughness={0.4} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* ================================================================== */}
      {/* 6. JOK DUA TINGKAT, BODI BELAKANG & STOPLAMP MERAH                 */}
      {/* ================================================================== */}
      {/* Bodi Bawah Jok */}
      <mesh position={[0, 0.64, -0.3]}>
        <boxGeometry args={[0.36, 0.4, 0.72]} />
        <meshStandardMaterial color={bodyColor} roughness={0.28} metalness={0.3} />
      </mesh>

      {/* Jok Kulit Dua Tingkat */}
      <group position={[0, 0.82, -0.28]} rotation={[-0.06, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.33, 0.1, 0.68]} />
          <meshStandardMaterial color="#18181b" roughness={0.92} />
        </mesh>
        {/* Jahitan Merah */}
        <mesh position={[0, 0.052, 0]}>
          <boxGeometry args={[0.3, 0.006, 0.65]} />
          <meshStandardMaterial color="#ef4444" roughness={0.7} />
        </mesh>
      </group>

      {/* Stoplamp Belakang Tajam */}
      <mesh position={[0, 0.64, -0.68]}>
        <boxGeometry args={[0.24, 0.08, 0.025]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={1.8}
          roughness={0.2}
        />
      </mesh>

      {/* ================================================================== */}
      {/* 7. PENGENDARA MOTOR MATIC (RIDER BERHELM FULL-FACE)                */}
      {/* ================================================================== */}
      <group position={[0, 0.78, -0.18]}>
        {/* Jaket Pengendara */}
        <mesh position={[0, 0.32, 0.02]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.34, 0.42, 0.24]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.7} />
        </mesh>

        {/* Helm Full-Face Glossy */}
        <group position={[0, 0.68, 0.1]}>
          <mesh>
            <sphereGeometry args={[0.17, 18, 18]} />
            <meshStandardMaterial color="#090d16" roughness={0.2} metalness={0.6} />
          </mesh>
          {/* Visor Iridium Biru Mengkilap */}
          <mesh position={[0, 0.02, 0.13]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.2, 0.09, 0.07]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.1}
              metalness={0.95}
            />
          </mesh>
        </group>

        {/* Lengan Meraih Stang */}
        {[-0.2, 0.2].map((ax, idx) => (
          <group key={idx} position={[ax, 0.24, 0.28]} rotation={[-0.46, ax > 0 ? -0.2 : 0.2, 0]}>
            <mesh>
              <boxGeometry args={[0.065, 0.065, 0.38]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
