import type { TopicData } from "@/components/topic-page";

export const loopsTopic: TopicData = {
  id: "loops",
  label: "5. Perulangan",
  accentColor: "emerald",
  gradientFrom: "from-emerald-50",
  gradientTo: "to-teal-50",
  darkGradientFrom: "dark:from-emerald-950/40",
  darkGradientTo: "dark:to-teal-950/40",
  iconBg: "bg-emerald-600",
  concept: {
    question: "Apa itu Perulangan (Looping)?",
    explanation:
      "<strong>Perulangan (Looping)</strong> adalah teknik untuk menjalankan satu blok kode <strong>berulang-ulang</strong> secara otomatis. Daripada menulis <code>console.log()</code> sebanyak 100 kali untuk mencetak angka 1-100, kita cukup meminta JavaScript untuk menggerakkan 'mesin pengulang' melalui tiga pilar penting: Awal, Batas Akhir, dan Langkah (Increment).",
    analogy: {
      title: "Analogi Lari Keliling Lapangan",
      intro: "Bayangkan disuruh lari keliling lapangan 5 kali:",
      bullets: [
        "1. Start (Inisialisasi) = Kamu mulai dari putaran ke-1.",
        "2. Kondisi (Limit) = Guru berpesan: 'Terus lari selama kurang dari 5 putaran'.",
        "3. Lari & Increment = Selesai 1 putaran, hitungan naik (1, jadi 2). Lalu kamu cek lagi syarat guru.",
      ],
    },
    structure: {
      title: "Struktur For Loop:",
      code: `for (let i = 1; i <= 5; i++) {
  // Blok yang akan diulang-ulang
  console.log("Putaran ke-" + i);
}`,
      parts: [
        {
          num: 1,
          code: "let i = 1",
          badge: "(Inisialisasi)",
          description: "Mulai dari angka berapa?",
          note: "Bagian ini hanya dieksekusi 1x di awal waktu mesin hidup.",
          color: "cyan",
        },
        {
          num: 2,
          code: "i <= 5",
          badge: "(Evaluasi / Limit)",
          description: "Sampai batasan apa mesin bekerja?",
          note: "Setiap sebelum blok berjalan, ini dicek. Jika true lanjut, false berhenti total.",
          color: "yellow",
        },
        {
          num: 3,
          code: "i++",
          badge: "(Increment/Langkah)",
          description: "Update perputaran",
          note: "i++ artinya tambah 1. Ini dieksekusi di akhir blok untuk memajukan limit.",
          color: "green",
        },
      ],
    },
    flow: {
      title: "Siklus Kehidupan Loop:",
      steps: [
        { label: "1. Variabel Start diset", color: "cyan" },
        { label: "2. Cek apakah masih <= Syarat", color: "yellow" },
        { label: "3. Eksekusi Blok Program", color: "white" },
        { label: "4. Angka ditambah (++) trus ulang ke #2", color: "green" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "For Loop Biasa & Descending",
      subtitle: "Menghitung maju dan menghitung mundur",
      circleColor: "bg-emerald-600",
      code: `// Loop Maju
console.log("MAJU:");
for (let i = 1; i <= 3; i++) {
  console.log("Angka maju:", i);
}

// Loop Mundur
console.log("\\nMUNDUR:");
for (let x = 3; x >= 1; x--) {
  console.log("Sisa waktu:", x);
}`,
      note: {
        bold: "Sintaks '\\n':",
        text: "Tanda '\\n' dalam teks JavaScript artinya baris baru (Enter).",
        color: "emerald",
      },
    },
    {
      number: 2,
      title: "While Loop",
      subtitle: "Looping dengan gaya berbeda",
      circleColor: "bg-teal-600",
      code: `// While Loop memisahkan keadaannya
let koin = 0; // 1. Nilai Awal

while (koin < 3) { // 2. Syarat Lanjut
  console.log("Koin terkumpul:", koin);
  
  // SANGAT PENTING: Langkah update agar tidak Infinite Loop
  koin++; // 3. Increment
}

console.log("Semua koin lengkap!");`,
      note: {
        bold: "Kapan pakai While?",
        text: "Gunakan untuk event tak pasti: Misal 'Selama User tidak menekan tombol Exit, biarkan Program Jalan'. Sementara 'For' dipakai jika kita TAU PASTI jumlah loop misal 5x / 100x.",
        color: "teal",
      },
    },
    {
      number: 3,
      title: "Do...While Loop",
      subtitle: "Kerjakan dulu 1x, baru evaluasi!",
      circleColor: "bg-blue-600",
      code: `let energi = 0;

// Blok JALAN DULU satu kali,
// walaupun syaratnya langsung FALSE.
do {
  console.log("Minum 1 gelas air. Sisa energi:", energi);
  energi--; 
} while (energi > 0);

console.log("Energi habis!");`,
      note: {
        bold: "Ciri Khas Do-While:",
        text: "Bandingkan dengan 'while' biasa yang mungkin tidak pernah jalan sama sekali, Do-While dijamin dijalankan MINIMAL 1 kali.",
        color: "blue",
      },
    },
    {
      number: 4,
      title: "Pengendali Lanjut (Break & Continue)",
      subtitle: "Men-skip atau Menghentikan loop secara paksa",
      circleColor: "bg-rose-600",
      code: `console.log("Uji Coba Continue:");
for (let b = 1; b <= 5; b++) {
  if (b === 3) {
    // Lewati eksekusi ke bawah, langsung panggil b++
    continue;
  }
  console.log("Iterasi", b);
} // Hasil tidak mengeprint angka 3!

console.log("\\nUji Coba Break:");
for (let a = 1; a <= 5; a++) {
  if (a === 4) {
    // Menghancurkan loop sepenuhnya
    break;
  }
  console.log("Iterasi", a);
} // Berhenti total di 3.`,
      note: {
        bold: "Shortcut ajaib:",
        text: "Break sering dipanggil kalau kita sedang 'Mencari Data Di Loop Besar' lalu Datanya ketemu, kita break biar hemat resource komputer.",
        color: "rose",
      },
    },
    {
      number: 5,
      title: "Nested Loop",
      subtitle: "Membuat sistem koordinat/Grid",
      circleColor: "bg-indigo-600",
      code: `// Membuat papan kecil
for (let x = 1; x <= 3; x++) {       // Baris (Luar)
  let barisTeks = "";
  for (let y = 1; y <= 3; y++) {     // Kolom (Dalam)
    barisTeks += \`(\${x},\${y}) \`;
  }
  console.log(barisTeks);
}`,
      note: {
        bold: "Aturan Berlapis:",
        text: "Setiap 1 lompatan loop Luar, loop Dalam akan dieksekusi secara PENUH dari awal ke akhir.",
        color: "indigo",
      },
    },
  ],
  tips: {
    whenTitle: "Kaidah Perulangan",
    when: [
      "Gunakan <code>For</code> untuk menghitung array, tabel data, atau perputaran pasti.",
      "Gunakan <code>While</code> jika menunggu kondisi eksternal (misal status server yang sedang 'loading').",
      "Kumpulkan dulu data pada satu variabel teks, dan gunakan SATU eksekusi <code>console.log()</code> untuk mencegah output layar 'banjir'.",
    ],
    avoidTitle: "Bahaya Infinite Loop 💀",
    avoid: [
      "Paling mematikan: Lupa menambahkan <code>i++</code> (angka increment). Program akan berjalan tanpa henti dan membuat memori sistem lumpuh.",
      "Lupa mengganti kondisi operator, misalnya <code>for(let i=0; i<10; i--)</code> (Malah hitung mundur, i akan minus tak terhingga).",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Perulangan Sederhana",
      description: "Pemahaman struktur the For Loop.",
      task: "Perbaiki sintaks for loop ini agar mencetak kata 'Iterasi' persis 3 kali.",
      initialCode: `// Ganti bagian ??? dengan struktur for yang benar
for (let i = 1; i ??? 3; i???) {
  console.log("Iterasi");
}`,
      expectedOutputs: ["Iterasi", "Iterasi", "Iterasi"],
    },
    {
      number: 2,
      title: "Kelipatan Dua",
      description: "Memanipulasi Increment counter",
      task: "Ganti increment-nya dari berjalan '1'-demi-'1' menjadi lompat '2', agar ia mencetak angka bulat Genap dari 2 sampai 8.",
      initialCode: `for (let i = 2; i <= 8; i ??? 2) {
  console.log(i);
}`,
      expectedOutputs: ["2", "4", "6", "8"],
    },
    {
      number: 3,
      title: "Cegah Infinite Loop!",
      description: "Menambahkan break secara taktis.",
      task: "While true bermakna dia akan jalan tiada henti selamanya! Tolong tambahkan perisai 'break' jika hitungan menabrak angka 2.",
      initialCode: `let roketJalan = 1;

while (true) {
  console.log("Wush...");
  
  if (roketJalan === 2) {
    ???; // ketik keyword penghenti maut
  }
  
  roketJalan++;
}
console.log("Berhenti dengan aman.");`,
      expectedOutputs: ["Wush...", "Wush...", "Berhenti dengan aman."],
    },
  ],
};
