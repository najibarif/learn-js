import type { TopicData } from "@/components/topic-page";

export const asyncTopic: TopicData = {
  id: "async",
  label: "13. Async & Promise",
  accentColor: "teal",
  gradientFrom: "from-teal-50",
  gradientTo: "to-emerald-50",
  darkGradientFrom: "dark:from-teal-950/40",
  darkGradientTo: "dark:to-emerald-950/40",
  iconBg: "bg-teal-600",
  concept: {
    question: "Apa itu Asynchronous JavaScript?",
    explanation:
      "Secara murni JavaScript berjalan **Synchronous** (Satu antrian lurus). Artinya: kerjakan tugas ke-1, tunggu beres > baru lanjut tugas ke-2.\nNamun bayangkan Jika tugas ke-1 adalah 'Download File 2GB' (Lama sekali). Maka JavaScript bakalan *Freeze* Menghang-kan Layar Browser User.\n\nKarena itulah dikenalkan konsep **Asynchronous** (Aksi Tak Singkron). Tugas yang berat akan dilempar ke 'Latar Belakang', agar program bisa jalan mulus, dan saat file berat itu beres—JS akan ditelpon lewat *Callback/Promise*.",
    analogy: {
      title: "Analogi Memasak di Restoran",
      intro: "Bayangkan kamu sebagai Koki tunggal (Single Threaded):",
      bullets: [
        "Synchronous (Buruk): Kamu masak Daging rendang di wajan (Butuh 4 jam). Kamu MELIHAT wajan itu selama 4 Jam tanpa mengedip. Pelanggan Gojek pada marah.",
        "Asynchronous (Pintar): Kamu taruh Rendang di atas kompor Timer. Sambil 4 jam rendangnya dikerjakan Kompor (Latar Belakang API), tanganmu lanjut bikin Jus Jeruk & motong Sayur.",
        "Kompor Bunyi (Promise Resolved): Rendang beres, kamu tinggal menghidangkannya.",
      ],
    },
    structure: {
      title: "Mengatasi Async Menggunakan Fetch API (Modern):",
      code: `// .then menampung 'Janji (Promise)' ketika urusan latar belakang selesai
fetch("https://api.github.com/users/google")
  .then((response) => response.json())
  .then((data) => {
    // Dipanggil nanti (Tunda)
    console.log("2. Data Berhasil diamankan:", data.name);
  });

console.log("1. Saya berjalan lebih dulu di Layar Awal, tidak diblokir si API.");`,
      parts: [
        {
          num: 1,
          code: "fetch()",
          badge: "(Pemicu Async)",
          description: "Mulai ambil data jaringan (Network), ini tidak memblokir kode di bawahnya.",
          note: "Karena ini lama, dia tidak mengembalikan DATA, ia membalikkan tiket 'Promise' (janji).",
          color: "teal",
        },
        {
          num: 2,
          code: ".then(...)",
          badge: "(Callback Konsumen)",
          description: "Blok .then akan dieksekusi SAAT Promise janjinya Terpenuhi (Berhasil).",
          note: "Di sinilah kamu naruh kodingan mengubah DOM Tampilan.",
          color: "green",
        },
      ],
    },
    flow: {
      title: "Flow Data Server -> Aplikasi",
      steps: [
        { label: "Mulai Fetch (Loading di layar)", color: "cyan" },
        { label: "Server Bekerja / Delay 3 detik", color: "yellow" },
        { label: "Resolve (.then dipanggil)", color: "green" },
        { label: "Ubah HTML dan Matikan Loding", color: "white" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Simulasi Jeda (setTimeout)",
      subtitle: "Fungsi Asynchronous Tertua",
      circleColor: "bg-teal-600",
      code: `console.log("A. Persiapan Dimulai");

// SetTimeout melempar tugas pencetakan ke Background Event Loop selama 2 Detik.
setTimeout(() => {
  console.log("C. Selesai Memanggang");
}, 2000);

// Karena C tertunda, B jalan duluan!
console.log("B. Merapikan Meja Makan");`,
      note: {
        bold: "Non-Blocking:",
        text: "Inilah bukti nyata bahwa JavaSctip di Browser tidak ter-*block* oleh delay timer 2 detik.",
        color: "teal",
      },
    },
    {
      number: 2,
      title: "Tingkat Dewa: Async / Await",
      subtitle: "Menulis Asynchronous tapi berasa seperti baris kode Sinkronus Biasa",
      circleColor: "bg-indigo-600",
      code: `// ES8 / Modern JS mempopulerkan Async-Await.
// Membaca kodenya dari atas lurus ke bawah tanpa rantai .then() .then()!

async function ambilDataCuaca() {
  console.log("Mencari awan...");
  
  // Keyword 'await' secara ajaib me-pause function INI SAJA (tidak keseluruhan JS)
  // Menunggu Promise-nya resolve 1 detik (simulasi buatan)
  
  let janjiDataHujan = new Promise((resolve) => {
    setTimeout( () => resolve("Mendung Parah") , 2000);
  });
  
  let kondisi = await janjiDataHujan; // <- Tersulap Rapi!
  
  console.log("Info Cuaca Tiba:", kondisi);
}

ambilDataCuaca();
console.log("Teks Footer Tetap Load Kilat");`,
      note: {
        bold: "Aturan Await:",
        text: "Keyword 'await' HANYA bisa diketik apabila Function pembungkus luarnya sudah diberikan tag / embel-embel 'async'.",
        color: "indigo",
      },
    },
    {
      number: 3,
      title: "Lebih Dalam: Async-Await + Try-Catch",
      subtitle: "Kombinasi Paten Frontend React / Node.js Developer",
      circleColor: "bg-rose-600",
      code: `async function getProfil() {
  try {
    // Kalau Fetch ngelempar error, misalnya Wifi Mati -> Await akan melempar throw
    let respons = await fetch("https://alamat-ngawur.com-error");
    let hasil = await respons.json();
    console.log(hasil);
    
  } catch (error) {
    console.error("Gawat, ada yg bermasalah di Server / Janji .:", error.message);
  }
}

// Terlihat rapi dan terproteksi baja!
getProfil();`,
      note: {
        bold: "The Holy Trinity:",
        text: "Selalu gabungan ASYNC + AWAIT + TRY-CATCH dalam merequest apapun ke API Server atau Database.",
        color: "rose",
      },
    },
  ],
  tips: {
    whenTitle: "Kapan Wajib Pakai Promise/Async",
    when: [
      "Mengambil Data API lewat <code>fetch()</code> atau <code>axios</code>.",
      "Menyimpan ke memori local storage yang Async / LocalForage DB.",
      "Bekerja dan Upload gambar, file base64, buffer dll.",
    ],
    avoidTitle: "Callback Hell 💀",
    avoid: [
      "Menulis gaya Callback lama yang ditumpuk bersarang di bawah, ke kanan, dan melengkung (seperti piramida siksaan). Gunakan <code>async/await</code> agar kodenya bersih rata ke bawah (Flatten array style).",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Syarat Sang Await",
      description: "Hanya berbunyi jika dibungkus...",
      task: "Ganti bagian '???' agar function tersebut sah dan di-restui untuk bisa menggunakan Await keyword di dalamnya.",
      initialCode: `// Ini butuh embel-embel apa sih di depan kurung function?
??? function dapatkanWaktu() {
  let timerPromise = new Promise(res => res("10 Pagi") );
  
  let jam = await timerPromise;
  console.log(jam);
}

dapatkanWaktu();`,
      expectedOutputs: ["10 Pagi"],
    },
    {
      number: 2,
      title: "Si Penangkap Janji (Then)",
      description: "Menghabisi promise via Then callback",
      task: "Ada sebuah janji dikirim via network. Kamu haru mengeksekusi method penanti resolvenya (Abaikan titik tanyanya, ganti dengan 'then').",
      initialCode: `let janjiAPI = new Promise((resolve) => {
  resolve("DATA_DARI_AMERIKA");
});

// Chain menggunakan method Penanti
janjiAPI.???((dataYgTiba) => {
  console.log("Berhasil ambil: " + dataYgTiba);
});`,
      expectedOutputs: ["Berhasil ambil: DATA_DARI_AMERIKA"],
    },
  ],
};
