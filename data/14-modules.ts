import type { TopicData } from "@/components/topic-page";

export const modulesTopic: TopicData = {
  id: "modules",
  label: "14. Module & Structure",
  accentColor: "slate",
  gradientFrom: "from-slate-100",
  gradientTo: "to-gray-100",
  darkGradientFrom: "dark:from-slate-900/60",
  darkGradientTo: "dark:to-gray-900/60",
  iconBg: "bg-slate-700",
  concept: {
    question: "Apa itu Module dan ES6 Import?",
    explanation:
      "Awalnya, kode JavaScript ditaruh semuanya pada satu file raksasa (<code>script.js</code>). Saat baris kode mencapai 10.000, developer akan kelabakan mencarinya. <strong>ES6 Module</strong> adalah jawaban alami: Kemampuan memisah-misah (membelah) kode fungsi/variabel panjang ke dalam kepingan banyak file terpisah, lalu kita bisa memanggil/meminjam kodingan dari file tetangga menggunakan kata kunci <code>import</code> dan <code>export</code>.",
    analogy: {
      title: "Analogi LEGO & Buku Resep",
      intro: "Bayangkan kamu membuat istana Lego besar:",
      bullets: [
        "Satu Blok Solid = File JS lama, rusak satu, hancur semuanya, susah dirubah.",
        "Module = Kamu merakit Pagar di File 1, Merakit Atap di File 2.",
        "Export = 'Tolong simpan resep Atap ini, siapa yg butuh boleh minta'.",
        "Import = 'Halo tetangga file 2, saya pinjam fungsi Atapmu dong untuk taruh di Istana (File Utama) saya'.",
      ],
    },
    structure: {
      title: "Struktur Dasar Import/Export (ES6):",
      code: `// --- Buka file 'mathUtils.js' (Di Gudang) ---
export const PI = 3.14;
export function tambah(a, b) { return a + b; }


// --- Buka file 'index.js' (File Utama Tampilan) ---
import { PI, tambah } from "./mathUtils.js";

console.log("Angka sakti:", PI);
console.log("3 + 7 = ", tambah(3, 7));`,
      parts: [
        {
          num: 1,
          code: "export",
          badge: "(Buka Gembok)",
          description: "Mengekspos variabel/fungsi ini agar bisa dibaca sama File JS yang lain.",
          note: "Tanpa export, variabel mutlak terikat privasi di dalam file itu saja.",
          color: "sky",
        },
        {
          num: 2,
          code: "import { X } from",
          badge: "(Memanggil Masuk)",
          description: "Ngambil variabel X dari file path tetangga.",
          note: "Hanya perlu dipanggil sekali di tiang paling atas baris code.",
          color: "purple",
        },
      ],
    },
    flow: {
      title: "Dependency Tree (Rantai Bantuan):",
      steps: [
        { label: "File Helper Punya Tools", color: "indigo" },
        { label: "Helper tulis -> 'export'", color: "green" },
        { label: "Main JS tulis -> 'import'", color: "yellow" },
        { label: "Main JS bisa pakai Fungsi aslinya", color: "cyan" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Simulasi Import/Export",
      subtitle: "Karena kita di area satu layar latihan ini, kita pakai Objek Simulasi",
      circleColor: "bg-slate-700",
      code: `/* 
  [SIMULASI] 
  Di koding aslinya, bagian utils tidak tergabung tapi terpisah filenya beda tab-editor.
*/

// --------- ISI DARI FILE: math-utils.js ---------
const mathUtils = {
  // Anggap ini Export:
  PI: 3.14159,
  kali: (a, b) => a * b
};


// --------- ISI DARI FILE UTAMA: main.js ---------
// Anggap ini Import (mengiimitas import modern):
const { PI, kali } = mathUtils;

console.log("Luas Lingkaran Jari 5:");
console.log(PI * kali(5, 5));`,
      note: {
        bold: "Harap Ingat:",
        text: "Di NodeJS atau React sesungguhnya, kamu WAJIB memiliki beda file untuk menggunakan metode ini secara asli.",
        color: "slate",
      },
    },
    {
      number: 2,
      title: "Export Default vs Named Export",
      subtitle: "Cara ganda membedakan Ekspor Data Utama dan Ekspor Anak Bawang",
      circleColor: "bg-blue-600",
      code: `/* [SIMULASI TEXT TEORI]
-------------------------------------------
1. NAMED EXPORT (Ekspor Bernama, Banyak item bebas)
   export const warna = "Biru";
   export const mobil = "Kijang";
   
   -> Di file lain ngambilnya pakai KURUNG KURAWAL (Nama harus presisi persis!)
   import { warna, mobil } from "./file-itu.js";

-------------------------------------------
2. EXPORT DEFAULT (Hanya 1 Rajanya se file)
   export default function App() { ... }
   
   -> Di file lain ngambilnya BEBAS NAMA APAPUN tanpa kurung {}:
   import AplikasiSuper from "./file-itu.js";
*/
console.log("Export default paling sering dipake buat komponen Vue/React! ⚛️");`,
      note: {
        bold: "Aturan Mutlak:",
        text: "1 File maksimal HANYA BOLEH PUNYA 1 BUAH Export Default. Tapi boleh punya tak terhingga banyaknya Export Biasa (Named).",
        color: "blue",
      },
    },
  ],
  tips: {
    whenTitle: "Organisasi Kode Menakjubkan",
    when: [
      "Pisahkan Helper Matematika, Format Uang (Rupiah), Format Tanggal masuk ke 1 file dedikasi misal <code>utils/format.js</code>.",
      "Kumpulkan Konstanta API URL dan Secret Keys di terpisah misalnya <code>constants/index.js</code>.",
    ],
    avoidTitle: "Hindari Ini",
    avoid: [
      "Dependency Loop (Circular Dependency). File A mengimport B, B ternyata ngimport C, dan C minta data A! Browser anda akan menangis kebingungan (Rantai Maut tak berujung).",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Ekstrak Kurung Import",
      description: "Menarik Data spesifik Named Export.",
      task: "Perbaiki baris destructuring impor simulasi tersebut agar mengambil 'namaBank' dan 'kodeRahasia' dengan benar.",
      initialCode: `// SIMULASI - Dalam file secret.js Export di dalamnya berisi:
const SecretFile = { namaBank: "BNI", kodeRahasia: 1234, infoBiasa: "Publik" };

// Di Main.js, Kamu hanya ingin IMPORT 2 DATA UTAMA.
// Isi format Bracket Kurung Kurawalnya: (namaBank & kodeRahasia)
const { ???, ??? } = SecretFile;

console.log(namaBank, "->", kodeRahasia);`,
      expectedOutputs: ["BNI -> 1234"],
    },
  ],
};
