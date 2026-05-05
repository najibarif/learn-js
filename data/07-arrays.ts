import type { TopicData } from "@/components/topic-page";

export const arraysTopic: TopicData = {
  id: "arrays",
  label: "7. Array",
  accentColor: "sky",
  gradientFrom: "from-sky-50",
  gradientTo: "to-blue-50",
  darkGradientFrom: "dark:from-sky-950/40",
  darkGradientTo: "dark:to-blue-950/40",
  iconBg: "bg-sky-600",
  concept: {
    question: "Apa itu Array?",
    explanation:
      "<strong>Array</strong> adalah struktur data khusus yang dapat menyimpan banyak nilai di dalam satu variabel tunggal. Jika variabel biasa adalah 'satu kotak', maka Array adalah <strong>'rak laci bersusun'</strong> di mana setiap laci punya nomor urut otomatis (disebut <em>Index</em>). Index Array dan banyak bahasa pemograman lain selalu dimulai dari <strong>0</strong>, bukan 1.",
    analogy: {
      title: "Analogi Lemari Loker Sekolah",
      intro: "Bayangkan Array sebagai sebuah lemari loker memanjang:",
      bullets: [
        "Lemari Loker = Variabel Array-nya (misal: lockerBuku).",
        "Nomor Loker = Index-nya (Dimulai dari 0, 1, 2, 3...).",
        "Isi Loker = Data atau Nilainya (bisa String, Number, dll).",
      ],
    },
    structure: {
      title: "Sintaks Dasar Array:",
      code: `// Array menggunakan Kurung Siku []
let buah = ["Apel", "Mangga", "Pisang"];

// Mengakses data (Berdasarkan Index)
console.log(buah[0]); // Apel
console.log(buah[2]); // Pisang`,
      parts: [
        {
          num: 1,
          code: "[ ... ]",
          badge: "(Notasi Siku)",
          description: "Mendefinisikan bahwa ini adalah tipe data Array.",
          note: "Setiap elemen dipisahkan dengan tanda koma.",
          color: "sky",
        },
        {
          num: 2,
          code: "buah[0]",
          badge: "(Akses Index)",
          description: "Membaca data pada laci urutan 0.",
          note: "Index nol (0) selalu memegang elemen pertama dalam urutan.",
          color: "blue",
        },
      ],
    },
    flow: {
      title: "Iterasi Dasar Array Bersama For:",
      steps: [
        { label: "Hitung Panjang Array (.length)", color: "cyan" },
        { label: "Mulai for(let i=0;)", color: "yellow" },
        { label: "Limit: i < length", color: "indigo" },
        { label: "Cetak myArr[i]", color: "green" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Membuat & Memanipulasi Array",
      subtitle: "Menambah dan Menghapus elemen dasar",
      circleColor: "bg-sky-600",
      code: `let garasi = ["Mobil", "Motor"];
console.log("Isi awal:", garasi);

// push() - Menambah ke paling BELAKANG
garasi.push("Sepeda");
console.log("Setelah push:", garasi);

// pop() - Menghapus dari paling BELAKANG
garasi.pop();
console.log("Setelah pop:", garasi);

// shift() - Menghapus dari paling DEPAN
garasi.shift();
console.log("Setelah shift:", garasi);

// unshift() - Menambah ke paling DEPAN
garasi.unshift("Bus");
console.log("Setelah unshift:", garasi);`,
      note: {
        bold: "Mudah Dihafal:",
        text: "Pop/Push urusannya di belakang. Shift/Unshift urusannya di depan.",
        color: "sky",
      },
    },
    {
      number: 2,
      title: "Looping Lama vs For-Of",
      subtitle: "Cara membaca semua isi laci",
      circleColor: "bg-blue-600",
      code: `let namaHero = ["Gatotkaca", "Arjuna", "Bima"];

console.log("CARA LAMA (The For Loop):");
for (let i = 0; i < namaHero.length; i++) {
  console.log(i + " - " + namaHero[i]);
}

console.log("\\nCARA BARU (For...Of):");
for (let hero of namaHero) {
  console.log("Hero:", hero);
}

// Catatan: For...of lebih ringkas jika kita
// tidak butuh nomor urut / index-nya.`,
      note: {
        bold: "Aturan Length:",
        text: "Kondisi di loop lama adalah (i < length). JANGAN gunakan (<=) atau akan terjadi 'undefined' di akhir iterasi.",
        color: "blue",
      },
    },
    {
      number: 3,
      title: "Modern Array Method: forEach",
      subtitle: "Pengulangan dengan Higher Order Function",
      circleColor: "bg-teal-600",
      code: `let daftarNilai = [75, 80, 95];

// Method modern: forEach menerima Callback Arrow Function!
daftarNilai.forEach((nilai, nomerUrut) => {
  console.log("Data Laci ke-" + nomerUrut + " nilainya: " + nilai);
});`,
      note: {
        bold: "The Callback:",
        text: "Parameter pertama adalah 'Nilai Aslinya', Parameter kedua selalu 'Nomor Index-nya'.",
        color: "teal",
      },
    },
    {
      number: 4,
      title: "Advanced: Map dan Filter",
      subtitle: "Senjata andalan para React Developer ⚛️",
      circleColor: "bg-indigo-600",
      code: `let angka = [1, 2, 3, 4, 5];

// MAP: Mengubah/Menduplikasi (semua dikali 10)
let hasilMap = angka.map((a) => {
  return a * 10;
});
console.log("Map dikali 10:", hasilMap);

// FILTER: Menyaring (hanya ambil angka ganjil)
let hasilFilter = angka.filter((a) => {
  return a % 2 !== 0; // Return True/False penentu diambil!
});
console.log("Filter Ganjil:", hasilFilter);`,
      note: {
        bold: "MAP vs FILTER:",
        text: "Map mengubah setiap bentuk nilai isi array. Filter menyaring isi lama tanpa mengubah bentuk nilainya.",
        color: "indigo",
      },
    },
  ],
  tips: {
    whenTitle: "Metode Terfavorit",
    when: [
      "Mengumpulkan kumpulan data identik (Misal: Daftar nama siswa).",
      "Gunakan <code>.map()</code> untuk mengubah semua data yang masuk dari Backend menjadi cetakan Tabel di Frontend.",
      "Gunakan <code>.length</code> untuk mengetahui total banyak data saat mencetak laporan penjualan.",
    ],
    avoidTitle: "Kesalahan Array",
    avoid: [
      "Menggunakan <code>const arr = []</code> BUKAN berarti arraynya tak bisa di-push. Ia masih bisa di-push! Yang tidak bisa adalah diassign ulang = [].",
      "Mengakses <code>Array[length]</code>. Element terakhir selalu <code>Array[length - 1]</code> karena indeks mulai dari 0.",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Tebak Index Ke-2",
      description: "Ambil barang spesifik dari laci.",
      task: "Ganti ??? dengan nomor laci (index) yang pas, agar 'Teh' yang tercetak ke konsol.",
      initialCode: `let minuman = ["Kopi", "Susu", "Teh", "Boba"];

let cetakIni = minuman[???];
console.log(cetakIni);`,
      expectedOutputs: ["Teh"],
    },
    {
      number: 2,
      title: "Hukuman Metode Ujung",
      description: "Menghapus elemen array ujung belakang.",
      task: "Murid bernama 'Joko' dikeluarkan dari sistem daftar di bawah ini. Tolong tulis satu baris kode untuk membuangnya menggunakan method Pop.",
      initialCode: `let murid = ["Ani", "Budi", "Cici", "Joko"];

???; // Panggil fungsi penghapus elemen belakang pada variabel murid

console.log(murid.length); // Panjang harus sisa 3`,
      expectedOutputs: ["3"],
    },
    {
      number: 3,
      title: "Menyaring Dewasa dengan Filter",
      description: "Gunakan The Filter Method",
      task: "Return kondisi pengecekan di baris filter sehingga hanya yang >= 18 yang masuk.",
      initialCode: `let daftarUmur = [12, 18, 25, 15, 30];

let lulusSensor = daftarUmur.filter((umur) => {
  return umur >= ???;
});

// Output yang diharapkan dari console log di bawah ini harus berupa text Array yang diconvert jadi string
console.log(lulusSensor.join(","));`,
      expectedOutputs: ["18,25,30"],
    },
  ],
};
