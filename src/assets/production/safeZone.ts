/**
 * ============================================================================
 * SAFE ZONE INSTAGRAM REELS / TIKTOK / YOUTUBE SHORTS (kanvas 1080 x 1920)
 * ============================================================================
 * Area di luar kotak aman akan TERTUTUP UI aplikasi:
 * - Atas   ±220px : header "Reels", tombol kamera, tab Following/For You
 * - Bawah  ±420px : username, caption, info audio, progress bar
 * - Kanan  ±140px : tombol Like / Comment / Share / Remix
 * - Kiri   ±60px  : margin aman agar teks tidak menempel tepi layar
 *
 * SEMUA elemen teks wajib ditempatkan memakai konstanta ini.
 * Gunakan prop `showSafeZone` di Studio / `npm run qc` untuk memeriksa.
 */
export const CANVAS = { width: 1080, height: 1920 } as const;

export const SAFE_ZONE = {
  top: 220,
  bottom: 420,
  left: 60,
  right: 140,
} as const;

/** Lebar area teks yang aman (px) */
export const SAFE_TEXT_WIDTH = CANVAS.width - SAFE_ZONE.left - SAFE_ZONE.right;

/** Titik tengah horizontal area aman (sedikit ke kiri karena tombol di kanan) */
export const SAFE_CENTER_X = SAFE_ZONE.left + SAFE_TEXT_WIDTH / 2;

/**
 * Slot tata letak standar (koordinat Y absolut di kanvas 1080x1920).
 * Objek 3D utama (hero) harus dibingkai di dalam `subject` agar tidak
 * tertabrak headline, badge, subtitle, maupun UI aplikasi.
 */
export const LAYOUT = {
  /** Top edge headline 2 baris */
  headlineTop: SAFE_ZONE.top + 10,
  /** Titik tengah (Y) badge pill di bawah headline */
  badgeCenterY: 470,
  /** Zona bingkai objek 3D utama */
  subject: { top: 540, bottom: 1300 },
  /** Batas bawah blok subtitle (subtitle tumbuh ke atas dari sini) */
  subtitleBottom: SAFE_ZONE.bottom + 20,
  /** Batas bawah kartu CTA (di atas subtitle) */
  ctaBottom: SAFE_ZONE.bottom + 230,
} as const;

/**
 * Hitung ukuran font agar sebaris teks muat di lebar tertentu.
 * Asumsi rata-rata lebar karakter Montserrat 900 UPPERCASE ≈ 0.66em.
 */
export function fitFontSize(
  text: string,
  maxSize: number,
  minSize: number,
  maxWidth: number = SAFE_TEXT_WIDTH,
  charWidthEm = 0.66,
): number {
  const chars = Math.max(1, text.length);
  const fitted = maxWidth / (chars * charWidthEm);
  return Math.round(Math.max(minSize, Math.min(maxSize, fitted)));
}

