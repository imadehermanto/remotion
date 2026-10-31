import { NarrativeStructure } from "../schemas/project";

export interface NarrativeTemplate {
  name: NarrativeStructure;
  title: string;
  description: string;
  recommendedDurationSeconds: [number, number];
  actBreakdown: {
    name: string;
    targetDurationPercent: number;
    purpose: string;
    narrativeGoal: string;
  }[];
}

export const NARRATIVE_STRUCTURES: Record<NarrativeStructure, NarrativeTemplate> = {
  StepByStepMechanism: {
    name: "StepByStepMechanism",
    title: "Tahapan Mekanisme Berurutan",
    description: "Membongkar alur kerja teknologi atau mesin tahap demi tahap dengan fokus visual mikro dan makro.",
    recommendedDurationSeconds: [45, 60],
    actBreakdown: [
      {
        name: "Hook Fenomena",
        targetDurationPercent: 12,
        purpose: "Sorot keajaiban atau misteri yang dialami pengguna setiap hari.",
        narrativeGoal: "Menangkap atensi dan memicu rasa ingin tahu seketika.",
      },
      {
        name: "Anatomi Layer / Cutaway",
        targetDurationPercent: 25,
        purpose: "Membuka struktur fisik internal dari luar ke dalam.",
        narrativeGoal: "Memperkenalkan komponen pembangun utama.",
      },
      {
        name: "Reaksi Fisika / Aliran Sinyal",
        targetDurationPercent: 35,
        purpose: "Menjelaskan perpindahan energi, arus, atau gaya saat dipicu.",
        narrativeGoal: "Inti edukasi mekanis yang memuaskan rasa ingin tahu.",
      },
      {
        name: "Pengolahan & Output",
        targetDurationPercent: 16,
        purpose: "Bagaimana sistem menerjemahkan sinyal fisik menjadi aksi nyata.",
        narrativeGoal: "Menghubungkan sains mikroskopis dengan hasil makroskopis.",
      },
      {
        name: "Kesimpulan & Dampak",
        targetDurationPercent: 12,
        purpose: "Pelajaran praktis atau apresiasi kecanggihan teknologi.",
        narrativeGoal: "Penutupan yang memuaskan dan berkesan.",
      },
    ],
  },
  InsideTheMachine: {
    name: "InsideTheMachine",
    title: "Menembus Jantung Mesin (Cutaway Dive)",
    description: "Kamera masuk ke dalam perangkat fisik dan menjelajahi dunia mikroskopis internal.",
    recommendedDurationSeconds: [40, 55],
    actBreakdown: [
      {
        name: "Tampilan Luar & Pertanyaan",
        targetDurationPercent: 15,
        purpose: "Kamera mengitari objek biasa dari luar.",
        narrativeGoal: "Menetapkan konteks objek yang akrab.",
      },
      {
        name: "Kamera Menembus Casing (X-Ray Cutaway)",
        targetDurationPercent: 25,
        purpose: "Casing memudar transparan mengungkap arsitektur dalam.",
        narrativeGoal: "Efek visual 'Wah!' yang dramatis.",
      },
      {
        name: "Zona Mikro Kritis",
        targetDurationPercent: 40,
        purpose: "Zoom ekstrem ke titik terkecil di mana hukum fisika bekerja.",
        narrativeGoal: "Penjelasan mendalam tanpa distraksi UI berlebih.",
      },
      {
        name: "Kembali ke Skala Manusia",
        targetDurationPercent: 20,
        purpose: "Kamera zoom out kembali ke tangan manusia.",
        narrativeGoal: "Rasa kagum atas apa yang terjadi dalam sepersekian detik.",
      },
    ],
  },
  ProblemMechanismSolution: {
    name: "ProblemMechanismSolution",
    title: "Masalah → Akar Masalah Sains → Solusi",
    description: "Berangkat dari kegagalan nyata (seperti rem blong atau jalan berlubang) ke sains penyebab dan pencegahan.",
    recommendedDurationSeconds: [45, 60],
    actBreakdown: [
      {
        name: "Insiden / Bahaya Nyata",
        targetDurationPercent: 18,
        purpose: "Momen krisis atau fenomena menyebalkan yang dialami orang.",
        narrativeGoal: "Relevansi emosional tinggi.",
      },
      {
        name: "Apa yang Sebenarnya Terjadi di Dalam",
        targetDurationPercent: 30,
        purpose: "Cutaway teknis memperlihatkan gesekan, panas, atau erosi.",
        narrativeGoal: "Akar ilmiah masalah diungkap secara visual.",
      },
      {
        name: "Titik Kritis Kegagalan",
        targetDurationPercent: 27,
        purpose: "Titik di mana materi melebihi toleransi (mendidih, retak, patah).",
        narrativeGoal: "Klimaks visual edukatif.",
      },
      {
        name: "Solusi / Tindakan Benar",
        targetDurationPercent: 25,
        purpose: "Prosedur pencegahan yang tepat dan aman.",
        narrativeGoal: "Nilai guna nyata bagi penonton.",
      },
    ],
  },
  MysteryReveal: {
    name: "MysteryReveal",
    title: "Misteri → Penyelidikan → Pengungkapan",
    description: "Pertanyaan aneh yang tampaknya mustahil, diuraikan fakta demi fakta hingga misteri terpecahkan.",
    recommendedDurationSeconds: [45, 60],
    actBreakdown: [
      {
        name: "Pertanyaan Membingungkan",
        targetDurationPercent: 15,
        purpose: "Fakta aneh yang terdengar seperti paradoks.",
        narrativeGoal: "Menahan retensi penonton 10 detik pertama.",
      },
      {
        name: "Teori Populer yang Salah",
        targetDurationPercent: 20,
        purpose: "Menguji anggapan umum dan menunjukkan di mana kesalahannya.",
        narrativeGoal: "Menolak simplifikasi klise.",
      },
      {
        name: "Petunjuk Kunci Sains",
        targetDurationPercent: 35,
        purpose: "Eksperimen visual atau ilustrasi 3D yang membuka mata.",
        narrativeGoal: "Momen eureka penonton.",
      },
      {
        name: "Pengungkapan Penuh",
        targetDurationPercent: 30,
        purpose: "Menyatukan semua petunjuk menjadi pemahaman utuh.",
        narrativeGoal: "Kepuasan intelektual tinggi.",
      },
    ],
  },
  MythRealityDemonstration: {
    name: "MythRealityDemonstration",
    title: "Mitos vs Realita",
    description: "Membongkar mitos populer yang dipercaya banyak orang dengan pembuktian visual 3D.",
    recommendedDurationSeconds: [40, 55],
    actBreakdown: [
      { name: "Mitos yang Dipercaya", targetDurationPercent: 15, purpose: "Kutipan mitos populer.", narrativeGoal: "Relate ke kepercayaan lama." },
      { name: "Kenapa Mitos Ini Salah", targetDurationPercent: 35, purpose: "Simulasi 3D mengapa logika mitos runtuh.", narrativeGoal: "Patahkan asumsi." },
      { name: "Realita Sebenarnya", targetDurationPercent: 35, purpose: "Mekanisme nyata yang terjadi.", narrativeGoal: "Fakta akurat." },
      { name: "Takeaway Praktis", targetDurationPercent: 15, purpose: "Apa yang harus dilakukan mulai sekarang.", narrativeGoal: "Tindakan konkret." },
    ],
  },
  CauseAndEffect: {
    name: "CauseAndEffect",
    title: "Sebab & Akibat Berantai",
    description: "Efek domino dari satu pemicu kecil yang memicu rantai reaksi fisika/kimia.",
    recommendedDurationSeconds: [40, 55],
    actBreakdown: [
      { name: "Pemicu Awal", targetDurationPercent: 15, purpose: "Tindakan kecil yang sepele.", narrativeGoal: "Titik mula." },
      { name: "Reaksi Berantai Tahap 1 & 2", targetDurationPercent: 50, purpose: "Domino fisika yang berjalan beruntun.", narrativeGoal: "Dinamisme alur." },
      { name: "Dampak Akhir", targetDurationPercent: 20, purpose: "Hasil akhir yang mencengangkan.", narrativeGoal: "Klimaks." },
      { name: "Ringkasan Alur", targetDurationPercent: 15, purpose: "Diagram cepat rantai peristiwa.", narrativeGoal: "Kerapian pemahaman." },
    ],
  },
  VisualExperiment: {
    name: "VisualExperiment",
    title: "Eksperimen Laboratorium Visual",
    description: "Uji coba visual di panggung virtual untuk membuktikan hipotesis ilmiah.",
    recommendedDurationSeconds: [45, 60],
    actBreakdown: [
      { name: "Hipotesis", targetDurationPercent: 15, purpose: "Apa yang akan kita uji.", narrativeGoal: "Tujuan uji coba." },
      { name: "Setup Laboratorium 3D", targetDurationPercent: 25, purpose: "Peralatan & variabel uji.", narrativeGoal: "Kredibilitas visual." },
      { name: "Pengujian Ekstrem", targetDurationPercent: 40, purpose: "Menaikkan voltase/suhu/tekanan.", narrativeGoal: "Tensi visual." },
      { name: "Hasil Data & Makna", targetDurationPercent: 20, purpose: "Kesimpulan eksperimen.", narrativeGoal: "Validasi ilmiah." },
    ],
  },
  Comparison: {
    name: "Comparison",
    title: "Perbandingan Langsung (A vs B)",
    description: "Dua teknologi atau mekanisme diperbandingkan side-by-side untuk melihat perbedaannya.",
    recommendedDurationSeconds: [40, 55],
    actBreakdown: [
      { name: "Dilema Pilihan", targetDurationPercent: 15, purpose: "Kenapa orang sering bingung.", narrativeGoal: "Konteks." },
      { name: "Sistem A: Kelebihan & Batasan", targetDurationPercent: 35, purpose: "Bedah sistem lama/standar.", narrativeGoal: "Titik acuan." },
      { name: "Sistem B: Inovasi Modern", targetDurationPercent: 35, purpose: "Bedah sistem baru/unggul.", narrativeGoal: "Pembeda utama." },
      { name: "Keputusan Akhir", targetDurationPercent: 15, purpose: "Kapan memakai masing-masing.", narrativeGoal: "Rekomendasi objektif." },
    ],
  },
  ContinuousJourneyThroughSystem: {
    name: "ContinuousJourneyThroughSystem",
    title: "Perjalanan Sinematik Menelusuri Sistem",
    description: "Satu gerakan kamera kontinu mengalir menelusuri pipa, jalur sirkuit, atau sistem tubuh.",
    recommendedDurationSeconds: [45, 60],
    actBreakdown: [
      { name: "Titik Masuk", targetDurationPercent: 15, purpose: "Kamera memasuki pintu gerbang sistem.", narrativeGoal: "Awal ekspedisi." },
      { name: "Stasiun 1: Pemrosesan Awal", targetDurationPercent: 25, purpose: "Filter/transformasi pertama.", narrativeGoal: "Laju konstan." },
      { name: "Stasiun 2: Inti Transformasi", targetDurationPercent: 35, purpose: "Pusat gravitasi/proses utama.", narrativeGoal: "Puncak keindahan." },
      { name: "Titik Keluar & Dampak Global", targetDurationPercent: 25, purpose: "Kamera keluar ke panorama luas.", narrativeGoal: "Koneksi akhir." },
    ],
  },
};

