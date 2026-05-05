import type { TopicData } from "@/components/topic-page";

export const stringsTopic: TopicData = {
  id: "strings",
  label: "9. String & Method",
  accentColor: "yellow",
  gradientFrom: "from-yellow-50",
  gradientTo: "to-amber-50",
  darkGradientFrom: "dark:from-yellow-950/40",
  darkGradientTo: "dark:to-amber-950/40",
  iconBg: "bg-yellow-600",
  concept: {
    question: "Manipulasi Teks (String)?",
    explanation:
      "Tipe data <strong>String</strong> mewakili kumpulan karakter tunggal (huruf, angka, spasi, simbol). JavaScript memfasilitasi banyak sekali properti bawaan dan method bawaan agar kita selaku Programmer tak perlu membuat logika pecah-kata secara manual.",
    analogy: {
      title: "Analogi Kalung Mutiara",
      intro: "Bayangkan String adalah tali kalung dan setiap huruf adalah mutiara:",
      bullets: [
        "String punya panjang (length) — persis array.",
        "Setiap mutiara bisa dipotong (slice).",
        "Atau mutiara yang kusam bisa diganti mutiara baru (replace).",
      ],
    },
    structure: {
      title: "Built-In Methods Populer:",
      code: `let kalimat = "Belajar Kode JavaScript";

// Properti umum
console.log(kalimat.length); // Panjang teks

// Ubah Ke Kapital
console.log(kalimat.toUpperCase());

// Cari urutan huruf
console.log(kalimat.indexOf("Kode"));`,
      parts: [
        {
          num: 1,
          code: "length",
          badge: "(Property)",
          description: "Membaca jumlah rincian huruf Total termasuk Space bar.",
          note: "Ini tanpa kurung kurawal, karena Property asli, bukan method fungsi.",
          color: "sky",
        },
        {
          num: 2,
          code: "toUpperCase()",
          badge: "(Method)",
          description: "Konversi ke huruf besar (Uppercase).",
          note: "Segala Method selalu ditutup oleh tanda kurung () bak sebuah pemanggilan rutin.",
          color: "purple",
        },
      ],
    },
    flow: {
      title: "Bagaimana Trim() Bekerja?",
      steps: [
        { label: "Menerima Teks ( \"  Budi  \" )", color: "yellow" },
        { label: "Analisis Space Kiri Kanan", color: "white" },
        { label: "Potong (Cut) Space Tsb", color: "amber" },
        { label: "Return (\"Budi\")", color: "green" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Concat Vs Template Literal",
      subtitle: "Menyambung teks gaya purba vs gaya kekinian",
      circleColor: "bg-yellow-600",
      code: `let namaDepan = "Reza";
let skor = 90;

// Cara Lama (Penambahan +)
console.log("Halo nama saya " + namaDepan + ", saya dapat skor " + skor);

// Cara Baru (Template Literals) - TANDA BACKTICK (\`) BUKAN KUTIP SINGLE
// Backtick ini di kibord letaknya di perbatasan Kiri-Atas dekat angka 1
console.log(\`Halo nama saya \${namaDepan}, saya dapat skor \${skor}\`);`,
      note: {
        bold: "Kemewahan Backtick:",
        text: "Memungkinkan kita memasukkan variabel langsung ke dalam teks lewat notasi $\\{namaVariabel} tanpa pusing menghitung kompas Tanda +, \", & Spasi.",
        color: "yellow",
      },
    },
    {
      number: 2,
      title: "Potong Memotong Teks",
      subtitle: "Slice dan Substring",
      circleColor: "bg-sky-600",
      code: `let teksPenuh = "IndonesiaRaya";

// Slice memotong Mulai Index dan Sampai (tapi tidak ambil batas titiknya)
// Potong dari huruf Indeks ke 0 SAMPAI menyentuh posisi Indeks ke 9
let negara = teksPenuh.slice(0, 9);
console.log(negara);

// Jika hanya diisi 1 angka, ia potong dari indeks sana sampai Habis ujung text.
let lagu = teksPenuh.slice(9);
console.log(lagu);`,
      note: {
        bold: "Index String:",
        text: "Cara kerja Indeks Array sama dengan index untaian teks huruf per huruf ini. Indeks 0 = Huruf 'I'.",
        color: "sky",
      },
    },
    {
      number: 3,
      title: "Mengganti atau Menyensor Kata",
      subtitle: "Replace() the original",
      circleColor: "bg-rose-600",
      code: `let kalimatChat = "Kamu itu sangat bodoh dan jelek!";

// Metode Sensor yang Ramah Keluarga
let filterLevel1 = kalimatChat.replace("bodoh", "***");
let hasilAkhir = filterLevel1.replace("jelek", "*****");

console.log("Chat terkirim:", hasilAkhir);`,
      note: {
        bold: "Peringatan Berantai:",
        text: ".replace('a','b') standar hanya mengganti 1 temuan KATA SAJA di kiri kalimat. Kalau ada kalimat berulang, butuh ReplaceALL().",
        color: "rose",
      },
    },
  ],
  tips: {
    whenTitle: "Aplikasi Nyata",
    when: [
      "Menggunakan <code>.toLowerCase()</code> sangat esensial pada fungsi Kotak Pencarian Barang agar <em>Case Insensitive</em>.",
      "Selalu gunakan <code>.trim()</code> jika menyimpan input Formulir Textbox ke Database untuk membuang spasi eror dari user.",
    ],
    avoidTitle: "Hindari Ini",
    avoid: [
      "Menggunakan <code>eval()</code> pada string. Ini pintu gerbang masuknya Hacker ke script program karena mengeksekusi string menjadi perintah javascript asli.",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "String Literal Super Ringkas",
      description: "Lebih baik the backtick.",
      task: "Ganti kurung TandaTanya pada bagian console.log menggunakan metode interpolasi Template Literal (Backtick) ke dua object tersebut. Abaikan spasi ekstra jika ada, hasil akhir harus 'Apple Merah'.",
      initialCode: `let warna = "Merah";
let produk = "Apple";

// Hapus ??? dan modif agar string bisa menelan variabel warna dan produk
console.log(\`\${???} \${???}\`);`,
      expectedOutputs: ["Apple Merah"],
    },
    {
      number: 2,
      title: "Menyelamatkan Panjang Huruf Pw",
      description: "Deteksi validasi Length",
      task: "Minta if pengecekan password ini menggunakan method panjang (Length) agar dia mengeluarkan 'true' bila lebih dari 8.",
      initialCode: `let passwordOrang = "Rahasia123Aman";

// Isilah pengecekan if
if (passwordOrang.??? > 8) {
  console.log("true");
} else {
  console.log("false");
}`,
      expectedOutputs: ["true"],
    },
    {
      number: 3,
      title: "Semua Jadi Huruf Kecil",
      description: "Ubah ke non kapital",
      task: "Jalankan sebuah method native untuk mengubah input user yang ber-huruf kapital ini ke tampilan Huruf Kecil Semua.",
      initialCode: `let idAkun = "JOKO_SASONGKO99";

// Method apa yang dipakai? (Abaikan Tanda Kurung nya)
let hurufKecil = idAkun.???();
console.log(hurufKecil);`,
      expectedOutputs: ["joko_sasongko99"],
    },
  ],
};
