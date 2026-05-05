import type { TopicData } from "@/components/topic-page";

export const branchTopic: TopicData = {
  id: "branch",
  label: "4. Percabangan",
  accentColor: "amber",
  gradientFrom: "from-amber-50",
  gradientTo: "to-orange-50",
  darkGradientFrom: "dark:from-amber-950/40",
  darkGradientTo: "dark:to-orange-950/40",
  iconBg: "bg-amber-600",
  concept: {
    question: "Apa itu Percabangan?",
    explanation:
      "<strong>Percabangan (Control Flow)</strong> adalah cara membuat program <strong>mengambil keputusan</strong>. Tanpa percabangan, program hanya mengeksekusi kode dari atas ke bawah secara lurus. Dengan hal ini, program bisa memilih jalur berbeda (bercabang) tergantung pada kondisi atau data dari pengguna.",
    analogy: {
      title: "Analogi Persimpangan Jalan",
      intro: "Bayangkan kamu sedang mengendarai motor mendapati Lampu Lalu Lintas:",
      bullets: [
        "JIKA (if) lampu Hijau → Kamu jalan lurus.",
        "JIKA TIDAK, TAPI (else if) lampu Kuning → Kamu pelan-pelan.",
        "SELAIN ITU (else) (pasti merah) → Kamu berhenti.",
      ],
    },
    structure: {
      title: "Struktur Dasar (If-Else):",
      code: `if (kondisiSyarat) {
  // Jika TRUE: Kode ini dijalankan
} else if (kondisiLain) {
  // Jika FALSE dan ini TRUE: Kode ini dijalankan
} else {
  // Jika SEMUANYA FALSE: Kode darurat ini dieksekusi
}`,
      parts: [
        {
          num: 1,
          code: "if ( ... )",
          badge: "(Kondisi Utama)",
          description: "Mengevaluasi sebuah pernyataan menjadi true/false.",
          note: "Setiap IF harus mempunyai tanda kurung ().",
          color: "blue",
        },
        {
          num: 2,
          code: "{ ... }",
          badge: "(Scope/Blok Eksekusi)",
          description: "Kode di dalam kurung kurawal.",
          note: "Hanya akan dieksekusi jika kondisi di tanda kurung sebelahnya ternyata TRUE.",
          color: "purple",
        },
        {
          num: 3,
          code: "else",
          badge: "(Opsi Default)",
          description: "Tempat pembuangan akhir jika semua syarat tidak terpenuhi.",
          note: "Selalu diletakkan paling bawah penampang IF, dan opsi paling aman.",
          color: "orange",
        },
      ],
    },
    flow: {
      title: "Alur Pengecekan Bersyarat:",
      steps: [
        { label: "Cek if Pertama", color: "blue" },
        { label: "TRUE = Eksekusi & Selesai", color: "green" },
        { label: "FALSE = Cek if Lainnya", color: "yellow" },
        { label: "FALSE Semua = Eksekusi else", color: "orange" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "If dan Else Dasar",
      subtitle: "Hanya dua pilihan utama",
      circleColor: "bg-amber-600",
      code: `let uangDompet = 50000;
let hargaMakanan = 60000;

if (uangDompet >= hargaMakanan) {
  console.log("Transaksi berhasil! Selamat menikmati.");
} else {
  console.log("Maaf, uang Anda belum cukup.");
}`,
      note: {
        bold: "Evaluasi:",
        text: "Karena 50.000 TIDAK lebih besar/sama dengan 60.000 (false), maka blok 'Else' yang berjalan.",
        color: "amber",
      },
    },
    {
      number: 2,
      title: "If - Else If - Else Lengkap",
      subtitle: "Banyak pilihan yang diperiksa berurutan",
      circleColor: "bg-orange-600",
      code: `let nilaiUjian = 85;

if (nilaiUjian >= 90) {
  console.log("Predikat: A (Lulusan Terbaik!)");
} else if (nilaiUjian >= 80) {
  console.log("Predikat: B (Bagus sekali)");
} else if (nilaiUjian >= 70) {
  console.log("Predikat: C (Cukup)");
} else {
  console.log("Predikat: D (Harus remidial)");
}`,
      note: {
        bold: "Order is Important:",
        text: "Pengecekan ini diurutkan dari atas ke bawah. Saat menemukan satu yang 'true', dia skip sisa bawahnya.",
        color: "orange",
      },
    },
    {
      number: 3,
      title: "Nested If (If di dalam If)",
      subtitle: "Percabangan bertingkat",
      circleColor: "bg-teal-600",
      code: `let sedangHujan = true;
let punyaPayung = true;

if (sedangHujan) {
  console.log("Wah, di luar hujan lebat.");
  
  if (punyaPayung) {
    console.log("Untung bawa payung, ayo berangkat!");
  } else {
    console.log("Terpaksa tunggu sampai reda.");
  }

} else {
  console.log("Cuaca cerah, langsung berangkat!");
}`,
      note: {
        bold: "Gunakan secukupnya:",
        text: "Jika Nested-If sudah terlalu dalam (menjorok ke kanan), kodenya susah dibaca. Lebih baik gunakan logika AND (&&).",
        color: "teal",
      },
    },
    {
      number: 4,
      title: "Percabangan dengan Logika (AND & OR)",
      subtitle: "Memeriksa banyak syarat sekaligus dengan && dan ||",
      circleColor: "bg-blue-600",
      code: `let nilaiUjian = 85;
let kehadiran = 90;
let ikutEkstrakurikuler = true;

// Menggunakan AND (&&): Kedua syarat HARUS terpenuhi
if (nilaiUjian >= 80 && kehadiran >= 85) {
  console.log("Kamu lulus Beasiswa Utama!");
} else {
  console.log("Belum memenuhi syarat beasiswa utama.");
}

// Menggunakan OR (||): SALAH SATU syarat saja terpenuhi sudah cukup
if (nilaiUjian > 90 || ikutEkstrakurikuler === true) {
  console.log("Mendapatkan Piagam Penghargaan Ekstra.");
}`,
      note: {
        bold: "Pengingat Penting:",
        text: "AND (&&) ibarat penjagaan ketat berlapis, sedangkan OR (||) memberikan kelonggaran alternatif jika salah satunya saja terpenuhi.",
        color: "blue",
      },
    },
    {
      number: 5,
      title: "Ternary Operator",
      subtitle: "Percabangan super pendek (1 baris)",
      circleColor: "bg-indigo-600",
      code: `let umur = 20;

// Variabel status diset tergantung umur
let status = (umur >= 17) ? "Sudah Dewasa" : "Masih Kecil";

console.log(status);

// Sama persis dengan:
// if (umur >= 17) status = "Sudah Dewasa" else status = "Masih Kecil"`,
      note: {
        bold: "Format:",
        text: "(kondisi) ? <JIKA TRUE> : <JIKA FALSE>",
        color: "indigo",
      },
    },
    {
      number: 6,
      title: "Switch Case",
      subtitle: "Pengecekan spesifik suatu nilai mutlak (===)",
      circleColor: "bg-rose-600",
      code: `let letakTrafficLight = "Kuning";

switch (letakTrafficLight) {
  case "Merah":
    console.log("Berhenti sepenuhnya.");
    break; // Jangan lupa Break!
  case "Kuning":
    console.log("Pelan-pelan dan bersiap berhenti.");
    break;
  case "Hijau":
    console.log("Silakan jalan.");
    break;
  default:
    console.log("Lampu lalu lintas error.");
}`,
      note: {
        bold: "The Break Keyword:",
        text: "Tanpa break, JavaScript akan melanjutkan ke 'case' di bawahnya meskipun nilainya berbeda (disebut fall-through).",
        color: "rose",
      },
    },
  ],
  tips: {
    whenTitle: "Kapan Menggunakan Apa?",
    when: [
      "Gunakan <code>if - else</code> jika ada rentang logika kompleks (>, <, &&, ||).",
      "Gunakan <code>switch</code> jika sedang menebak satu variabel dengan kumpulan nilai mutlak (seperti enum hari dalam seminggu).",
      "Gunakan <code>Ternary Operator</code> HANYA jika ingin menge-set sebuah variabel berdasarkan 2 pilihan true/false murni.",
    ],
    avoidTitle: "Hindari Ini",
    avoid: [
      "Lupa menambahkan <code>break;</code> pada struktur Switch.",
      "Bertumpuk Terlalu Dalam (Pyramid of Doom/Callback Hell - lebih dari 3 tingkat Nested If). Jika ini terjadi, susun ulan logikanya.",
      "Asal assign. Dalam pengkondisian <code>if(a = b)</code> itu SALAH, a dan b malah disamakan (Assignment). Ingat gunakan <code>===</code>.",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Diskon Belanja",
      description: "Latihan percabangan If Else",
      task: "Ganti teks '???' dengan 10 jika total belanja >= 100000, atau 0 jika kurang. Ouput yang diminta adalah '10'.",
      initialCode: `let belanja = 150000;
let diskonPercent = 0;

if (belanja >= 100000) {
  diskonPercent = ???;
} else {
  diskonPercent = ???;
}

console.log(diskonPercent);`,
      expectedOutputs: ["10"],
    },
    {
      number: 2,
      title: "Konversi Hari dengan Switch",
      description: "Gunakan switch case secara efisien",
      task: "Tuliskan kode untuk Case 2 yang mencetak teks persis 'Selasa'.",
      initialCode: `let angkaHari = 2;

switch(angkaHari) {
  case 1:
    console.log("Senin");
    break;
  case 2:
    console.log("???");
    ???;
  case 3:
    console.log("Rabu");
    break;
}`,
      expectedOutputs: ["Selasa"],
    },
    {
      number: 3,
      title: "Singkat dengan Ternary",
      description: "Ringkas If-Else menjadi 1 baris",
      task: "Bantu satpam kelab malam ini. Jika 'age' 18 ke atas -> 'Boleh Masuk', selain itu -> 'Pulang'.",
      initialCode: `let age = 16;

let keputusan = (age >= 18) ? "???" : "???";
console.log(keputusan);`,
      expectedOutputs: ["Pulang"],
    },
    {
      number: 4,
      title: "Aturan Kelulusan Seleksi",
      description: "Gunakan operator logika OR (||) di dalam pengkondisian.",
      task: "Peserta lulus jika umurnya >= 18 ATAU memiliki suratIzin khusus. Ganti '???' dengan 18 dan juga operator logika OR.",
      initialCode: `let umur = 16;
let suratIzin = true;

// Ganti baris IF di bawah ini agar logika berjalan tepat
if (umur >= ??? ??? suratIzin === true) {
  console.log("Peserta Boleh Ikut Lomba");
} else {
  console.log("Dilarang Ikut");
}`,
      expectedOutputs: ["Peserta Boleh Ikut Lomba"],
    },
  ],
};
