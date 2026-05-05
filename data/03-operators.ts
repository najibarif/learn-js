import type { TopicData } from "@/components/topic-page";

export const operatorsTopic: TopicData = {
  id: "operators",
  label: "3. Operator",
  accentColor: "indigo",
  gradientFrom: "from-indigo-50",
  gradientTo: "to-blue-50",
  darkGradientFrom: "dark:from-indigo-950/40",
  darkGradientTo: "dark:to-blue-950/40",
  iconBg: "bg-indigo-600",
  concept: {
    question: "Apa itu Operator?",
    explanation:
      "<strong>Operator</strong> adalah simbol khusus yang digunakan untuk melakukan operasi pada variabel atau nilai (operand). JavaScript memiliki banyak jenis operator mulai dari matematika dasar, perbandingan, hingga logika kompleks.",
    analogy: {
      title: "Analogi Kalkulator & Hakim",
      intro: "Operator memiliki fungsi berbeda-beda:",
      bullets: [
        "Aritmatika (+, -, *, /) = Seperti kalkulator, menghitung angka.",
        "Perbandingan (>, <, ===) = Seperti hakim, memutuskan apakah pernyataan itu Benar (true) atau Salah (false).",
        "Logika (&&, ||) = Seperti satpam berlapis, memastikan bahwa beberapa syarat terpenuhi sekaligus.",
      ],
    },
    structure: {
      title: "Contoh Penggunaan Operator:",
      code: `let a = 10;
let b = 5;

let tambah = a + b;       // Aritmatika
let apakahSama = (a === b); // Perbandingan
let hasilLogika = (a > 5 && b < 10); // Logika`,
      parts: [
        {
          num: 1,
          code: "+, -, *, /, %",
          badge: "(Aritmatika)",
          description: "Untuk perhitungan matematika.",
          note: "% (Modulo) menghitung sisa hasil bagi, bukan persentase.",
          color: "blue",
        },
        {
          num: 2,
          code: "===, !==, >, <",
          badge: "(Perbandingan)",
          description: "Membandingkan dua nilai.",
          note: "Selalu hasilnya berupa Boolean (true atau false).",
          color: "yellow",
        },
        {
          num: 3,
          code: "&&, ||, !",
          badge: "(Logika)",
          description: "AND (&&), OR (||), NOT (!)",
          note: "Digunakan untuk mengecek banyak perbandingan sekaligus.",
          color: "green",
        },
      ],
    },
    flow: {
      title: "Urutan Logika AND (&&):",
      steps: [
        { label: "Cek Syarat 1", color: "cyan" },
        { label: "Jika TRUE → Lanjut", color: "green" },
        { label: "Cek Syarat 2", color: "yellow" },
        { label: "Keduanya TRUE = TRUE", color: "indigo" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Aritmatika & Modulo",
      subtitle: "Perhitungan matematika dan sisa bagi",
      circleColor: "bg-indigo-600",
      code: `let x = 10;
let y = 3;

console.log("Ditambah:", x + y);
console.log("Dikali:", x * y);
console.log("Dipangkat (10^3):", x ** y);

// Modulo sangat penting di programming!
console.log("Sisa bagi 10 / 3 adalah:", x % y);

// Cek apakah 10 genap?
console.log("Apakah 10 Genap?", 10 % 2 === 0);`,
      note: {
        bold: "Modulo (%):",
        text: "Sangat sering digunakan untuk menentukan bilangan ganjil (angka % 2 !== 0) atau genap (angka % 2 === 0).",
        color: "indigo",
      },
    },
    {
      number: 2,
      title: "Strict Equality (===) vs Equality (==)",
      subtitle: "Kenapa harus pakai 3 sama dengan?",
      circleColor: "bg-rose-600",
      code: `let angka = 5;       // Number
let teksAngka = "5"; // String

// Double equals (==) - HANYA cek isi, Tipe datanya diabaikan
console.log("Pakai == :", angka == teksAngka);

// Triple equals (===) - Cek isi DAN tipe data (STRICT)
console.log("Pakai === :", angka === teksAngka);`,
      note: {
        bold: "Aturan Emas JavaScript:",
        text: "Hampir di semua kasus profesional, JANGAN PERNAH gunakan '=='. Selalu gunakan '===' untuk menghindari bug keamanan & tipe data.",
        color: "rose",
      },
    },
    {
      number: 3,
      title: "Operator Logika (&&, ||)",
      subtitle: "Menggabungkan beberapa boolean",
      circleColor: "bg-teal-600",
      code: `// && (AND) -> KEDUA sisi wajib TRUE
console.log("TRUE && TRUE =", true && true);
console.log("TRUE && FALSE =", true && false);

// || (OR) -> SALAH SATU saja yang TRUE, hasil TRUE
console.log("TRUE || FALSE =", true || false);
console.log("FALSE || FALSE =", false || false);

// Simulasi Cek Kelulusan
let nilaiUjian = 80;
let kehadiran = 90;
let lulus = (nilaiUjian >= 75) && (kehadiran >= 80);
console.log("Apakah murid ini lulus?", lulus);`,
      note: {
        bold: "Logika Singkat:",
        text: "AND (&&) mencari yang false. OR (||) mencari yang true.",
        color: "teal",
      },
    },
    {
      number: 4,
      title: "Assignment Shorthand",
      subtitle: "Menulis kode lebih pendek",
      circleColor: "bg-orange-600",
      code: `let poin = 10;

// Cara kuno:
poin = poin + 5;
console.log(poin);

// Cara Shorthand (Pendek):
poin += 5; 
console.log(poin);

poin -= 2; // poin: 18
poin *= 2; // poin: 36
console.log(poin);`,
      note: {
        bold: "Shorthand:",
        text: "+=, -=, *= sangat umum digunakan, terutama di perulangan (loops).",
        color: "orange",
      },
    },
  ],
  tips: {
    whenTitle: "Gunakan yang Terbaik",
    when: [
      "Selalu gunakan <code>===</code> dan <code>!==</code> untuk membandingkan kesamaan.",
      "Gunakan operator Modulo <code>%</code> untuk membuat logika bergantian/selang-seling (seperti warna tabel).",
      "Pahami Operator Ternary (<code>kondisi ? true : false</code>) nanti, ia sangat populer di modern frontend.",
    ],
    avoidTitle: "Hindari Ini",
    avoid: [
      "Menggunakan <code>=</code> (satu tanda sama dengan) di dalam pernyataan IF. Itu adalah assignment, bukan perbandingan!",
      "Menggunakan <code>==</code> (dua tanda sama dengan) karena dapat menyebabkan bug konversi tipe otomatis (Type Coercion).",
    ],
    operatorsTitle: "Tabel Kebenaran Singkat:",
    operators: [
      { code: "T && T", meaning: "True" },
      { code: "T && F", meaning: "False" },
      { code: "T || F", meaning: "True" },
      { code: "F || F", meaning: "False" },
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Menghitung Usia Emas",
      description: "Latihan Aritmatika",
      task: "Ganti bagian '???' dengan operator yang tepat. Anggap tahun kelahiranmu adalah 2005. Hitung umurmu saat ini di tahun 2050 (umur emas).",
      initialCode: `let tahunLahir = 2005;
let tahunTujuan = 2050;

let umurEmas = tahunTujuan ??? tahunLahir;
console.log(umurEmas);`,
      expectedOutputs: ["45"],
    },
    {
      number: 2,
      title: "Apakah Angka Genap?",
      description: "Penggunaan modulo dan strict equality",
      task: "Ganti '???' sehingga logic-nya benar-benar memeriksa apakah 42 itu habis dibagi 2. Output harus 'true'.",
      initialCode: `let angka = 42;
let isGenap = (angka ??? 2) ??? 0;

console.log(isGenap);`,
      expectedOutputs: ["true"],
    },
    {
      number: 3,
      title: "Logika Restoran",
      description: "Penggunaan AND (&&) dan OR (||)",
      task: "Pelanggan bisa makan di tempat JIKA (bawa masker AND sudah vaksin) ATAU (dia adalah member premium). Perbaiki kode di bawah ini.",
      initialCode: `let masker = true;
let vaksin = true;
let memberPremium = false;

// Perbaiki operator logikanya
let bolehMasuk = (masker ??? vaksin) ??? memberPremium;
console.log(bolehMasuk);`,
      expectedOutputs: ["true"],
    },
  ],
};
