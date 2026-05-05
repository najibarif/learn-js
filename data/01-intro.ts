import type { TopicData } from "@/components/topic-page";

export const introTopic: TopicData = {
  id: "intro",
  label: "1. Pengenalan Javascript",
  accentColor: "blue",
  gradientFrom: "from-blue-50",
  gradientTo: "to-indigo-50",
  darkGradientFrom: "dark:from-blue-950/40",
  darkGradientTo: "dark:to-indigo-950/40",
  iconBg: "bg-blue-600",
  examplesSubtitle: 'Edit kode di bawah, lalu tekan "Jalankan Kode" untuk melihat hasilnya',
  concept: {
    question: "Apa itu JavaScript?",
    explanation:
      "<strong>JavaScript</strong> adalah bahasa pemrograman yang membuat halaman web menjadi <strong>interaktif dan dinamis</strong>. Awalnya diciptakan hanya untuk berjalan di browser (Frontend), kini JavaScript bisa berjalan di mana saja termasuk di server (Backend) berkat Node.js. Engine paling populer yang menjalankan JS adalah <strong>V8 Engine</strong> bawaan Google Chrome.",
    analogy: {
      title: "Analogi Membangun Rumah",
      intro: "Bayangkan sebuah website seperti sebuah rumah yang sedang dibangun:",
      bullets: [
        "HTML = Struktur bangunan (dinding, atap, pondasi)",
        "CSS = Interior & Eksterior (warna cat, jenis lantai)",
        "JavaScript = Instalasi listrik & air (membuat lampu menyala saat ditekan, keran mengalir)",
      ],
    },
    structure: {
      title: "Struktur Dasar Program:",
      code: `// Ini adalah komentar satu baris
/* 
  Ini komentar banyak baris,
  biasanya untuk dokumentasi atau menonaktifkan kode
*/

console.log("Halo, Dunia!"); // Mencetak output ke console`,
      parts: [
        {
          num: 1,
          code: "// Komentar",
          badge: "(Tidak Dieksekusi)",
          description: "Penjelasan untuk manusia",
          note: "Sangat penting untuk dokumentasi agar programmer lain (dan kamu di masa depan) paham kodenya.",
          color: "green",
        },
        {
          num: 2,
          code: "console.log()",
          badge: "(Perintah Output)",
          description: "Mencetak sesuatu ke layar / console",
          note: "Ini adalah 'mata' kamu saat ngoding JS. Gunakan ini untuk melihat data yang sedang diproses.",
          color: "blue",
        },
      ],
    },
    flow: {
      title: "Cara JS Bekerja di Browser:",
      steps: [
        { label: "Browser Baca HTML", color: "cyan" },
        { label: "Temukan <script>", color: "yellow" },
        { label: "Engine V8 Compile", color: "white" },
        { label: "Eksekusi Baris per Baris", color: "green" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Hello World!",
      subtitle: "Program pertama setiap programmer",
      circleColor: "bg-blue-600",
      code: `// Tampilkan teks ke console
console.log("Halo, Dunia!");
console.log("Selamat datang di Roadmap Lengkap JavaScript!");`,
      note: {
        bold: "Tradisi:",
        text: 'Program pertama dalam bahasa pemrograman apapun selalu "Hello World".',
        color: "blue",
      },
    },
    {
      number: 2,
      title: "Mencetak Berbagai Bentuk Data",
      subtitle: "Teks, Angka, dan Nilai Benar/Salah",
      circleColor: "bg-purple-600",
      code: `// Teks harus diapit tanda kutip ("" atau '')
console.log("Ini teks");

// Angka tidak perlu kutip
console.log(2023);

// Matematika dasar
console.log("Hasil 10 + 5 adalah:");
console.log(10 + 5);

// Boolean (Benar/Salah)
console.log(true);
console.log(false);`,
      note: {
        bold: "Tipe Data Dasar:",
        text: "Kita akan belajar membedakan tipe data ini lebih dalam di bab selanjutnya.",
        color: "purple",
      },
    },
    {
      number: 3,
      title: "Peringatan & Error di Console",
      subtitle: "Selain console.log, ada jenis log lainnya",
      circleColor: "bg-amber-600",
      code: `// Informasi biasa
console.log("User telah login.");

// Peringatan kuning
console.warn("Koneksi lambat!");

// Error merah
console.error("Gagal menyimpan data!");`,
      note: {
        bold: "Trik Debugging:",
        text: "Gunakan warn dan error agar pesanmu terlihat menonjol jika terjadi masalah penting.",
        color: "amber",
      },
    },
  ],
  tips: {
    whenTitle: "Kapan Pakai JavaScript?",
    when: [
      "Frontend: Bikin animasi, respon tombol, validasi form",
      "Backend: Bikin API dan server (via Node.js)",
      "Mobile App: React Native",
      "Game: Phaser.js",
    ],
    avoidTitle: "Kesalahan Umum Pemula",
    avoid: [
      "Mengira Java dan JavaScript itu sama (Sangat berbeda!)",
      "Lupa tanda kutip pada teks (misal: <code>console.log(Halo)</code>)",
      "Tidak memperhatikan besar-kecil huruf (JavaScript it Case-Sensitive)",
    ],
    operatorsTitle: "Ciri Khas Penulisan (Sintaks):",
    operators: [
      { code: "//", meaning: "Komentar inline" },
      { code: "/* */", meaning: "Komentar blok" },
      { code: ";", meaning: "Akhiri baris (opsional tapi disarankan)" },
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Mencetak Namamu",
      description: "Latihan console.log pertama",
      task: "Ganti bagian '???' dengan namamu untuk menampilkannya di console.",
      initialCode: `console.log("???");`,
      expectedOutputs: [],
    },
    {
      number: 2,
      title: "Berbagai Tipe Cetakan",
      description: "Mencetak peringatan dan gaya console lain",
      task: "Perbaiki kode di bawah ini sehingga memunculkan sebuah Error dengan pesan 'Akses Ditolak'. Jangan gunakan console.log!",
      initialCode: `// Ganti "log" dengan perintah untuk menampilkan error merah
console.log("Akses Ditolak");`,
      expectedOutputs: ["Akses Ditolak"], // It expects the text regardless of log/error type in our crude runner, but gets the idea across natively.
    },
  ],
};
