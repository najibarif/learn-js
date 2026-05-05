import type { TopicData } from "@/components/topic-page";

export const functionsTopic: TopicData = {
  id: "functions",
  label: "6. Function",
  accentColor: "pink",
  gradientFrom: "from-pink-50",
  gradientTo: "to-rose-50",
  darkGradientFrom: "dark:from-pink-950/40",
  darkGradientTo: "dark:to-rose-950/40",
  iconBg: "bg-pink-600",
  concept: {
    question: "Apa itu Function (Fungsi)?",
    explanation:
      "<strong>Function</strong> adalah kumpulan kode yang dikelompokkan ke dalam satu blok terpisah sehingga bisa <strong>digunakan ulang (Reusable)</strong> tanpa perlu menulisnya dari awal. Programmer berpegang pada prinsip DRY (*Don't Repeat Yourself*).",
    analogy: {
      title: "Analogi Mesin Pembuat Jus",
      intro: "Bayangkan function itu seperti Blender jus di dapur:",
      bullets: [
        "Parameter (Bahan) = Masukkan apel, jeruk, atau mangga.",
        "Body (Proses) = Blender dinyalakan, mata pisau berputar mencampur semuanya.",
        "Return (Hasil) = Jus yang dituangkan ke dalam gelas, siap diminum.",
      ],
    },
    structure: {
      title: "Sintaks Dasar Function:",
      code: `function sapaHalo() {
  console.log("Halo, Selamat Belajar!");
}

// Cara Memanggilnya:
sapaHalo();`,
      parts: [
        {
          num: 1,
          code: "function sapaHalo",
          badge: "(Deklarasi)",
          description: "Mendefinisikan fungsi baru dan memberikan nama yang unik.",
          note: "Hanya mendefinisikan, kodenya TIDAK langsung berjalan.",
          color: "pink",
        },
        {
          num: 2,
          code: "()",
          badge: "(Parameter)",
          description: "Tempat menampung 'bahan' atau input (kosong jika tidak ada).",
          note: "Meskipun kosong, tanda kurung wajib ditulis.",
          color: "purple",
        },
        {
          num: 3,
          code: "sapaHalo()",
          badge: "(Pemanggilan)",
          description: "Menjalankan kumpulan kode yang ada di dalam fungsi.",
          note: "Tanpa tanda kurung (), fungsi tidak akan pernah berjalan.",
          color: "blue",
        },
      ],
    },
    flow: {
      title: "Siklus Pemanggilan:",
      steps: [
        { label: "Panggil myFunc(A)", color: "yellow" },
        { label: "A masuk sebagai Parameter", color: "cyan" },
        { label: "Terjadi Proses", color: "white" },
        { label: "Return keluar ke pemanggil", color: "green" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "1. Dasar (Tanpa Parameter & Return)",
      subtitle: "Hanya menjalankan blok kode yang sama",
      circleColor: "bg-blue-600",
      code: `function sapaHalo() {
  console.log("Halo semuanya!");
  console.log("Selamat belajar JavaScript.");
}

// Cara memanggilnya:
sapaHalo();`,
      note: {
        bold: "Kegunaan:",
        text: "Sangat berguna untuk kode yang sifatnya statis (tidak berubah-ubah) namun sering dipakai.",
        color: "blue",
      },
    },
    {
      number: 2,
      title: "2. Dengan Parameter (Tanpa Return)",
      subtitle: "Memberikan input agar hasil lebih dinamis",
      circleColor: "bg-indigo-600",
      code: `function sapaUser(nama) {
  console.log("Halo, " + nama + "!");
}

// Kita bisa memanggil dengan nama yang berbeda
sapaUser("Budi");
sapaUser("Siti");`,
      note: {
        bold: "Parameter:",
        text: "Variabel 'nama' bertindak sebagai penampung input yang kita kirim saat memanggil fungsi.",
        color: "indigo",
      },
    },
    {
      number: 3,
      title: "3. Lengkap (Parameter & Return)",
      subtitle: "Menerima input dan mengembalikan hasil olahan",
      circleColor: "bg-pink-600",
      code: `function tambah(a, b) {
  let hasil = a + b;
  return hasil; // Mengirim hasil keluar
}

let total = tambah(10, 5);
console.log("Totalnya adalah: " + total);`,
      note: {
        bold: "Keyword Return:",
        text: "Return digunakan untuk 'mengirim' nilai dari dalam fungsi ke variabel di luar fungsi.",
        color: "pink",
      },
    },
    {
      number: 4,
      title: "4. Arrow Function (Cara Modern)",
      subtitle: "Penulisan fungsi yang lebih singkat (ES6)",
      circleColor: "bg-rose-600",
      code: `// Versi Biasa
function kali(x, y) {
  return x * y;
}

// Versi Arrow Function
const bagi = (x, y) => {
  return x / y;
};

// Versi Super Singkat (Satu baris auto-return)
const kuadrat = n => n * n;

console.log(kali(5, 4));
console.log(bagi(10, 2));
console.log(kuadrat(9));`,
      note: {
        bold: "Implicit Return:",
        text: "Jika Arrow Function hanya 1 baris tanpa '{}', ia otomatis me-return hasil tanpa keyword 'return'.",
        color: "rose",
      },
    },
  ],
  tips: {
    whenTitle: "Kapan Membuat Function?",
    when: [
      "Jika kode yang sama ditulis lebih dari dua kali secara berurutan, bungkuslah dalam sebuah fungsi.",
      "Ketika kita ingin logika matematika menjadi blok bernama jelas yang rapi (misal: hitungPajak).",
    ],
    avoidTitle: "Penyebab Error",
    avoid: [
      "Lupa keyword <code>return</code>, sehingga ketika dipanggil, ia mengembalikan <code>undefined</code>.",
      "Lupa menambahkan kurung <code>()</code> saat memanggil fungsi (Contoh salah: <code>myFunc;</code>).",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Fungsi Statis",
      description: "Memanggil fungsi tanpa parameter",
      task: "Lengkapi kode untuk memanggil fungsi 'umumkan'.",
      initialCode: `function umumkan() {
  console.log("Kuis dimulai!");
}

// Panggil fungsi di bawah ini
???;`,
      expectedOutputs: ["Kuis dimulai!"],
    },
    {
      number: 2,
      title: "Fungsi Dinamis",
      description: "Menggunakan parameter",
      task: "Berikan parameter 'teks' agar fungsi ini mencetak 'Pesan: Belajar'.",
      initialCode: `function cetakPesan(teks) {
  console.log("Pesan: " + teks);
}

cetakPesan("???");`,
      expectedOutputs: ["Pesan: Belajar"],
    },
    {
      number: 3,
      title: "Fungsi Berhitung",
      description: "Menggunakan Return",
      task: "Gunakan keyword 'return' untuk mengembalikan hasil perkalian p * l.",
      initialCode: `function luasPersegi(p, l) {
  ??? p * l;
}

let hasil = luasPersegi(5, 4);
console.log(hasil);`,
      expectedOutputs: ["20"],
    },
  ],
};
