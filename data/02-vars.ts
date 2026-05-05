import type { TopicData } from "@/components/topic-page";

export const varsTopic: TopicData = {
  id: "vars",
  label: "2. Variabel & Tipe Data",
  accentColor: "violet",
  gradientFrom: "from-violet-50",
  gradientTo: "to-purple-50",
  darkGradientFrom: "dark:from-violet-950/40",
  darkGradientTo: "dark:to-purple-950/40",
  iconBg: "bg-violet-600",
  concept: {
    question: "Apa itu Variabel?",
    explanation:
      "<strong>Variabel</strong> adalah tempat (wadah) untuk menyimpan data di memori komputer. Bayangkan variabel seperti <strong>kotak berlabel</strong> — kamu bisa memasukkan barang (data) ke dalamnya, membaca labelnya, dan mengambil barangnya nanti.\n\nJavaScript punya 3 cara membuat variabel: <strong>let</strong> (wadah yang isinya bisa diganti), <strong>const</strong> (wadah bersegel, isinya tidak bisa diganti), dan <strong>var</strong> (cara jadul yang sering banyak bug, hindari ini!).",
    analogy: {
      title: "Analogi Gelas",
      intro: "Bayangkan kamu menuangkan minuman ke gelas:",
      bullets: [
        "const = Gelas tersegel (contoh: botol kaleng). Isinya tidak bisa diganti. Jika awal isinya Coca-cola, selamanya Coca-cola.",
        "let = Gelas biasa. Kamu bisa isi air, lalu kosongkan, lalu isi susu.",
        "var = Gelas ajaib zaman dulu yang kadang bocor dan muncul di ruangan lain tanpa permisi (hindari pemakaiannya).",
      ],
    },
    structure: {
      title: "Deklarasi dan Inisialisasi:",
      code: `// Membuat kotak 'nama', langsung diisi "Budi"
let nama = "Budi";

// Membuat kotak 'umur', tidak bisa diubah lagi
const umur = 18;

// Tipe data Primitive
let isStudent = true;   // Boolean
let skor = null;        // Kosong secara sengaja
let pendaftaran;        // undefined (belum diisi)`,
      parts: [
        {
          num: 1,
          code: "let / const",
          badge: "(Keyword)",
          description: "Perintah membuat variabel",
          note: "Gunakan const sebagai default. Ganti jadi let HANYA JIKA nilainya memang nanti akan kamu ubah.",
          color: "purple",
        },
        {
          num: 2,
          code: "nama",
          badge: "(Identifier)",
          description: "Nama label variabel kamu",
          note: "Tidak boleh pakai spasi, gunakan gaya camelCase (misal: namaLengkap).",
          color: "blue",
        },
        {
          num: 3,
          code: "=",
          badge: "(Assignment)",
          description: "Memasukkan nilai ke kanan ke dalam wadah di kiri.",
          note: "Bukan berarti 'sama dengan' matematika.",
          color: "yellow",
        },
      ],
    },
    flow: {
      title: "Kategori Tipe Data:",
      steps: [
        { label: "Primitif 👇", color: "indigo" },
        { label: "String (Teks)", color: "cyan" },
        { label: "Number (Angka)", color: "blue" },
        { label: "Boolean (Benar/Salah)", color: "green" },
        { label: "Null / Undefined", color: "white" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "let vs const",
      subtitle: "Bisa diubah vs Tidak bisa diubah",
      circleColor: "bg-violet-600",
      code: `// const: nilainya TETAP
const namaAplikasi = "LearnJS";
console.log("Nama app:", namaAplikasi);

// namaAplikasi = "AppsBaru"; // INI AKAN ERROR!

// let: nilainya BISA BERUBAH
let poin = 50;
console.log("Poin awal:", poin);

poin = 75; // Mengubah nilai
console.log("Poin sekarang:", poin);`,
      note: {
        bold: "Ingat:",
        text: "Kita tidak perlu menulis kata 'let' lagi saat mengubah nilai (baris 11).",
        color: "purple",
      },
    },
    {
      number: 2,
      title: "Tipe Data Number & String",
      subtitle: "Angka dan Teks itu berbeda",
      circleColor: "bg-blue-600",
      code: `let angka1 = 10;
let angka2 = 5;

let teks1 = "10";
let teks2 = "5";

console.log("Tipe Number dijumlah:", angka1 + angka2);
// Output: 15

console.log("Tipe String dijumlah (digabung):", teks1 + teks2);
// Output: 105`,
      note: {
        bold: "Type Coercion:",
        text: "Operator + pada String akan menggabungkan teks, bukan menambah secara matematika.",
        color: "blue",
      },
    },
    {
      number: 3,
      title: "Tipe Data Boolean, Null, dan Undefined",
      subtitle: "Kondisi kebenaran dan kekosongan",
      circleColor: "bg-teal-600",
      code: `let sedangBelajar = true;
let sudahMenyerah = false;

// Undefined: variabel sudah ada wadahnya, isinya belum ada
let namaPacar;
console.log("Pacar:", namaPacar);

// Null: variabel sengaja dikosongkan (memang tidak ada)
let saldoDompet = null;
console.log("Saldo:", saldoDompet);`,
      note: {
        bold: "Beda null vs undefined:",
        text: "undefined = belum dikasih value. null = memang sengaja dikasih tau bahwa ini tu KOSONG.",
        color: "teal",
      },
    },
  ],
  tips: {
    whenTitle: "Aturan Penamaan Variabel (Wajib)",
    when: [
      "Gunakan <code>camelCase</code>: namaMataPelajaran, totalHargaBuku",
      "Gunakan penamaan bahasa Inggris (disarankan, misal: isLogged, totalPrice)",
      "Harus deskriptif (<code>harga</code> lebih baik dari <code>hrg</code> atau <code>x</code>)",
    ],
    avoidTitle: "Jangan Lakukan Ini",
    avoid: [
      "Menggunakan <code>var</code> (sulit melacak error Scope)",
      "Memulai nama dengan angka: <code>let 1nama;</code> (Akan Error)",
      "Menggunakan spasi: <code>let total harga;</code>",
      "Menggunakan reserved word seperti: <code>let let = 5;</code> atau <code>let class = 'A';</code>",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Mendeklarasikan Variabel",
      description: "Buat variabel sesuai intruksi berbekal teori let dan const.",
      task: "Buat konstan 'NEGARA' berisi 'Indonesia' dan variabel 'kota' berisi 'Jakarta'. Tampilkan ke konsol dalam satu baris pakai koma.",
      initialCode: `// Buat variabel/konstanta di sini
??? NEGARA = "???";
??? kota = "???";

console.log(NEGARA, kota);`,
      expectedOutputs: ["Indonesia Jakarta"],
    },
    {
      number: 2,
      title: "Memperbaiki Type Error",
      description: "Pemahaman perbedaan string dan number",
      task: "Hasil dari variabel 'total' saat ini adalah teks gabungan, yaitu '500200'. Ubahlah tipe datanya agar hasilnya menjadi perhitungan matematika 700.",
      initialCode: `// Hilangkan kutip agar menjadi tipe Number
let harga = "500";
let ongkir = "200";

let total = harga + ongkir;
console.log(total);`,
      expectedOutputs: ["700"],
    },
  ],
};
