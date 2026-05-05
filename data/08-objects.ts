import type { TopicData } from "@/components/topic-page";

export const objectsTopic: TopicData = {
  id: "objects",
  label: "8. Object",
  accentColor: "rose",
  gradientFrom: "from-rose-50",
  gradientTo: "to-pink-50",
  darkGradientFrom: "dark:from-rose-950/40",
  darkGradientTo: "dark:to-pink-950/40",
  iconBg: "bg-rose-600",
  concept: {
    question: "Apa itu Object?",
    explanation:
      "Berlari menyempurnakan struktur Array, <strong>Object</strong> adalah kumpulan properti. Jika Array menyusun isi datanya dengan menggunakan angka indeks (0, 1, 2), maka Object menggunakan label karakter bernama <strong>Key</strong> (kunci) yang berpasangan dengan valuenya. Object sangat kuat dalam mendefinisikan sebuah 'Benda Nyata' karena sifat-sifatnya terangkum jelas di dalam Key.",
    analogy: {
      title: "Analogi Kartu Tanda Penduduk (KTP)",
      intro: "Bayangkan Object adalah sebuah blanko Kartu KTP:",
      bullets: [
        "Objek = KTP itu sendiri.",
        "Key (Properti) = Nama Kolomnya (misal: 'NamaLengkap', 'GolDarah', 'Alamat').",
        "Value (Nilai) = Isi tulisan di kolomnya (misal: 'Budi Santoso', 'O', 'Jl. Merdeka').",
      ],
    },
    structure: {
      title: "Membuat Sebuah Object (Object Literal):",
      code: `let mobil = {
  merk: "Toyota",
  tipe: "SUV",
  tahun: 2021,
  sudahPajak: true
};

// Mengakses isinya:
console.log(mobil.merk);  // Output: Toyota
console.log(mobil.tahun); // Output: 2021`,
      parts: [
        {
          num: 1,
          code: "{ ... }",
          badge: "(Kurung Kurawal)",
          description: "Membungkus sebuah Object utuh.",
          note: "Jangan sampai tertukar dengan Array yang menggunakan siku [ ].",
          color: "rose",
        },
        {
          num: 2,
          code: "merk:",
          badge: "(Key / Properti)",
          description: "Nama label atau atribut (sebelah kiri titik-dua).",
          note: "Ditulis tanpa tanda kutip kalau nama key nya tidak ada jarak/spasinya.",
          color: "yellow",
        },
        {
          num: 3,
          code: "\"Toyota\"",
          badge: "(Value)",
          description: "Isinya (sebelah kanan titik dua).",
          note: "Pisahkan setiap anggota (key:value) dengan karakter koma (,).",
          color: "green",
        },
      ],
    },
    flow: {
      title: "Langkah Akses Object - Dot Notation:",
      steps: [
        { label: "1. Panggil Nama Variabel (mobil)", color: "rose" },
        { label: "2. Tulis sebuah Titik (.)", color: "yellow" },
        { label: "3. Tulis nama Label Key", color: "white" },
        { label: "Output di layar: Isi Value!", color: "green" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Akses dan Ubah Object",
      subtitle: "Manipulasi data di dalam object",
      circleColor: "bg-rose-600",
      code: `let user = {
  namaLengkap: "Siti Zubaidah",
  umur: 22,
  kota: "Bandung"
};

console.log("Nama sebelum nikah:", user.namaLengkap);

// Mengubah Value (Akses -> Assign):
user.namaLengkap = "Siti Ahmad";
console.log("Nama sesudah nikah:", user.namaLengkap);

// Menambahkan properti baru yang belum ada:
user.status = "Menikah";
console.log("Data Lengkap:", user);`,
      note: {
        bold: "Dinamis:",
        text: "Object sangat fleksibel. Kita dapat mendadak menambahkan 'key' baru kapanpun kita butuh.",
        color: "rose",
      },
    },
    {
      number: 2,
      title: "Bracket Notation (Akses Cara Lain)",
      subtitle: "Saat key ada sepasi atau dipanggil dari variabel dinamis",
      circleColor: "bg-purple-600",
      code: `let orang = {
  nama: "Rudi",
  "hobi favorit": "Main Gitar" // key dengan spasi butuh text string
};

// Error jika: console.log(orang.hobi favorit); !

// Cara Aman (Bracket Notation):
console.log(orang["hobi favorit"]);

// Berguna Untuk akses lewat data variabel:
let pilihanYangMauDiambil = "nama";
console.log( "Memanggil isi nama secara dinamis:", orang[pilihanYangMauDiambil] );`,
      note: {
        bold: "Kapan dipakai?:",
        text: "Hampir 90% waktu kamu akan pakai Titik (Dot Notation). Bracket notation hanya dipakai saat membaca Key yang dinamis/berspasi.",
        color: "purple",
      },
    },
    {
      number: 3,
      title: "Destructuring Object (ES6)",
      subtitle: "Memecah isi Object jadi Variabel Independen",
      circleColor: "bg-blue-600",
      code: `const laptop = {
  merk: "Lenovo",
  ram: "16GB",
  prosesor: "AMD Ryzen"
};

// Mengeluarkan (Destruct) properti ke variabel terpisah!
const { merk, ram } = laptop;

// Kita bisa pakai langsung tanpa 'laptop.merk' lagi:
console.log("Promo hari ini!", merk, "dengan RAM raksasa", ram);`,
      note: {
        bold: "React Ready:",
        text: "Syntax Destructuring inilah cara React JS mengekstrak Props yang masuk ke dalam Komponen.",
        color: "blue",
      },
    },
    {
      number: 4,
      title: "Array di dalam Object (Kombinasi)",
      subtitle: "Sistem Data Nyata (JSON Like)",
      circleColor: "bg-emerald-600",
      code: `// Data Keranjang Belanja Bukalapak/Tokped:
let pesanan = {
  idTransaksi: "INV-29938",
  customer: "Bambang",
  produk: [
    { nama: "Sepatu Converse", qty: 1, harga: 400000 },
    { nama: "Kaos Polos", qty: 2, harga: 50000 }
  ]
};

// Akses dalam kombinasi:
console.log("Hai " + pesanan.customer + "!");
console.log("Barang pertama kamu: " + pesanan.produk[0].nama);`,
      note: {
        bold: "Struktur Global:",
        text: "Kombinasi Objek bersarang Array begini adalah bentuk resmi JSON format transfer data lintas server sedunia.",
        color: "emerald",
      },
    },
  ],
  tips: {
    whenTitle: "Metode Terfavorit",
    when: [
      "Setiap kali Anda bermaksud menggambarkan sebuah entitas riil yang memiliki sifat (Manusia, Produk, Transaksi).",
      "Gunakan <code>Object.keys(obj)</code> jika ingin mengekstrak SEMUA daftar NAMA LABEL secara sekaligus jadi Array baru.",
    ],
    avoidTitle: "Tips Penting",
    avoid: [
      "Menggunakan 'this' pada Arrow Function yang di-embed di Object Literal (Ini bahasan Advanced di masa depan, tapi patut diketahui panah '=>' merusak scope Object internal).",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Bedah Pasien",
      description: "Memahami Dot Notation",
      task: "Gunakan The Dot Notation agar outputnya hanya mencetak nama Penyakit yang dimasukkan ke log.",
      initialCode: `let pasien = {
  nama: "Slamet",
  sakit: "Batuk Berdahak"
};

// Akses bagian penyakit ke dalam console log
console.log(pasien.???);`,
      expectedOutputs: ["Batuk Berdahak"],
    },
    {
      number: 2,
      title: "Ubah Data Di Tengah Jalan",
      description: "Update Value Propery",
      task: "Warna sepatu pada object diganti secara sistematis dari Merah menjadi 'Biru Gelap'. Tuliskan dengan assignment biasa pada baris yang rumpang.",
      initialCode: `let sepatu = {
  merk: "Vans",
  warna: "Merah"
};

// Panggil properti warna dan Replace valuenya jadi string "Biru Gelap"
sepatu.??? = "???";

console.log(sepatu.warna);`,
      expectedOutputs: ["Biru Gelap"],
    },
    {
      number: 3,
      title: "Destructuring Extraction",
      description: "Bongkar cepat property jadi variabel biasa",
      task: "Tarik properti 'level' menggunakan destructuring ke dalam tanda kurung kurawal rumpang tersebut.",
      initialCode: `const gameUser = {
  username: "DragonSlayer99",
  level: 65,
  job: "Warrior"
};

const { username, ??? } = gameUser;

console.log("Player " + username + " adalah level " + level);`,
      expectedOutputs: ["Player DragonSlayer99 adalah level 65"],
    },
  ],
};
