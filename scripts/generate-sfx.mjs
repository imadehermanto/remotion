#!/usr/bin/env node
/**
 * Generator SFX prosedural (bebas lisensi, dibuat sendiri dengan ffmpeg).
 * Menghasilkan efek suara tambahan untuk variasi editing:
 *   pop.wav       — "bloop" pendek untuk badge/pill muncul
 *   impact.wav    — dentuman rendah untuk klimaks/plot twist
 *   riser.wav     — tanjakan ketegangan 1.2 dtk (berakhir tepat di cut)
 *   swoosh.wav    — whoosh panjang lembut untuk transisi scene
 *   tick.wav      — klik kecil untuk angka/hitungan
 *
 * Pemakaian:  npm run sfx
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "public/assets/sfx");
fs.mkdirSync(outDir, { recursive: true });

const RATE = 48000;

/** @type {{name: string, args: string[]}[]} */
const recipes = [
  {
    name: "pop",
    args: [
      "-f", "lavfi",
      "-i", `aevalsrc='0.9*sin(2*PI*(260*t+700*(1-exp(-38*t))/38))*exp(-26*t)*(1-exp(-900*t))':s=${RATE}:d=0.28`,
      "-af", "aecho=0.6:0.4:35:0.18,alimiter=limit=0.8,pan=stereo|c0=c0|c1=c0",
    ],
  },
  {
    name: "impact",
    args: [
      "-f", "lavfi",
      "-i", `aevalsrc='0.95*sin(2*PI*(42*t+90*(1-exp(-11*t))/11))*exp(-3.2*t)*(1-exp(-400*t)) + 0.35*(random(0)*2-1)*exp(-22*t)':s=${RATE}:d=1.6`,
      "-af", "lowpass=f=3200,aecho=0.8:0.6:70|140:0.28|0.16,alimiter=limit=0.85,pan=stereo|c0=c0|c1=c0",
    ],
  },
  {
    name: "riser",
    args: [
      "-f", "lavfi",
      "-i", `aevalsrc='(0.45*sin(2*PI*(180*t+1100*t*t*t/(3*1.44)))*(0.6+0.4*sin(2*PI*(6+10*t)*t)) + 0.4*(random(0)*2-1))*pow(t/1.2,2.2)':s=${RATE}:d=1.2`,
      "-af", "highpass=f=250,lowpass=f=7000,afade=t=out:st=1.16:d=0.04,alimiter=limit=0.75,pan=stereo|c0=c0|c1=c0",
    ],
  },
  {
    name: "swoosh",
    args: [
      "-f", "lavfi",
      "-i", `anoisesrc=color=pink:r=${RATE}:d=0.65:a=0.9:s=7`,
      "-af", "bandpass=f=1400:width_type=h:w=2200,volume='pow(sin(PI*t/0.65),2)':eval=frame,alimiter=limit=0.7,aecho=0.5:0.3:40:0.2,pan=stereo|c0=c0|c1=0.85*c0",
    ],
  },
  {
    name: "tick",
    args: [
      "-f", "lavfi",
      "-i", `aevalsrc='0.8*sin(2*PI*2400*t)*exp(-90*t)':s=${RATE}:d=0.08`,
      "-af", "alimiter=limit=0.7,pan=stereo|c0=c0|c1=c0",
    ],
  },
];

for (const r of recipes) {
  const dest = path.join(outDir, `${r.name}.wav`);
  const raw = path.join(outDir, `${r.name}.raw.wav`);
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...r.args, "-ar", String(RATE), "-c:a", "pcm_s16le", raw], {
    stdio: "inherit",
  });
  // Normalisasi puncak ke -1.5 dBFS agar semua SFX punya level yang konsisten
  let maxDb = 0;
  const out = execFileSync("sh", ["-c", `ffmpeg -hide_banner -i "${raw}" -af volumedetect -f null - 2>&1 | grep max_volume`], {
    encoding: "utf-8",
  });
  const m = out.match(/max_volume:\s*(-?[\d.]+)/);
  if (m) maxDb = parseFloat(m[1]);
  const gain = -1.5 - maxDb;
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", raw, "-af", `volume=${gain.toFixed(2)}dB`, "-c:a", "pcm_s16le", dest], {
    stdio: "inherit",
  });
  fs.unlinkSync(raw);
  console.log(`✅ ${path.relative(process.cwd(), dest)} (gain ${gain.toFixed(1)} dB)`);
}
