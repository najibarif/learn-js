import type { TopicData } from "@/components/topic-page";

export const errorsTopic: TopicData = {
  id: "errors",
  label: "10. Error Handling",
  accentColor: "red",
  gradientFrom: "from-red-50",
  gradientTo: "to-orange-50",
  darkGradientFrom: "dark:from-red-950/40",
  darkGradientTo: "dark:to-orange-950/40",
  iconBg: "bg-red-600",
  concept: {
    question: "Apa itu Error Handling?",
    explanation:
      "Dalam dunia nyata, program pasti akan mengalami masalah (Error), entah karena input user yang salah, server yang mati, atau file yang gagal dibaca. <strong>Error Handling</strong> adalah cara kita menangkap Error tersebut agar aplikasi <strong>tidak hancur total (Crash)</strong>, dan memberikan pesan yang jelas kepada pengguna (berupa notifikasi santun) bukan tulisan merah menakutkan.",
    analogy: {
      title: "Analogi Membawa Telur Hias",
      intro: "Bayangkan kamu membawa barang rapuh pakai mobil pick-up:",
      bullets: [
        "Jalanan Mulus (Block Try) = Kamu jalan dengan kecepatan normal, berharap aman.",
        "Telur Jatuh (Throw Error) = Ada polisi tidur yang kelewat tinggi.",
        "Pelindung Kasur Busa (Block Catch) = Menyelamatkan telur yang mau pecah, dan kamu bisa berhenti memungutnya tanpa membuat mobil meledak.",
      ],
    },
    structure: {
      title: "Blok Try - Catch:",
      code: `try {
  // 1. Coba lakukan hal berisiko di sini
  let skor = hitungSesuatu(100);
  console.log(skor);
  
} catch (error) {
  // 2. Jika di try ada YANG MELEDAK, blok jalannya pindah ke sini
  console.error("Maaf, terjadi kesalahan:", error.message);
  
} finally {
  // 3. (Opsional) Akan selau dijalankan apapun yang terjadi
  console.log("Pengecekan selesai dijalankan.");
}`,
      parts: [
        {
          num: 1,
          code: "try { ... }",
          badge: "(Uji Coba)",
          description: "Jalurnya kode-kode yang rentan bug/error (seperti download file).",
          note: "Jika di tengah blok ini ada yang eror, baris bawahnya tidak dijalankan, tapi MELOMPAT langsung ke catch.",
          color: "blue",
        },
        {
          num: 2,
          code: "catch (param) { ... }",
          badge: "(Penangkap)",
          description: "Menerima lemparan error dan kita bebas memodifikasi apa response nya.",
          note: "Program selamat! Lanjutkan aktivitas web seolah tak terjadi apa-apa.",
          color: "red",
        },
      ],
    },
    flow: {
      title: "Alur Try-Catch-Finally:",
      steps: [
        { label: "Mulai (Try)", color: "cyan" },
        { label: "Jika Normal → (Skip Catch) → Finally", color: "green" },
        { label: "Jika Error → Langsung ke Catch", color: "red" },
        { label: "Keluar Catch → Finally → Program Aman!", color: "white" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Menyelamatkan Dari Kiamat Syntax",
      subtitle: "Menangkap Fungsi yang tidak ada",
      circleColor: "bg-red-600",
      code: `console.log("1. Program Buka.");

try {
  // Kita sengaja memanggil hal Gaib (Fungsi tidak pernah dibuat!)
  cetakFaktur();
  console.log("Bagian ini dilewati karena yang atas meledak!");
} 
catch (err) {
  // Program Lari ke Sini Saat Gagal
  console.log("2. Menangkap masalah:", err.message);
}

// Lihat, baris ini tetap bisa jalan! Padahal ada kode Error.
console.log("3. Program Berakhir Dengan Selamat.");`,
      note: {
        bold: "Tersembunyi:",
        text: "Jika tanpa try-catch, baris 3 tidak akan pernah tereksekusi, dan layar putih Crash/Blank Screen akan terjadi di Frontend user.",
        color: "red",
      },
    },
    {
      number: 2,
      title: "Membuat (Throw) Custom Error Sendiri",
      subtitle: "Validasi Form Buatan Sendiri",
      circleColor: "bg-orange-600",
      code: `function cekUmur(umur) {
  if (umur < 18) {
    // THROW: Membuat Bom Buatan Sendiri!
    throw new Error("Umur belum mencukupi untuk membuat akun Bank.");
  }
  return "Akun Berhasil Dibuat!";
}

try {
  let pendaftaran1 = cekUmur(15);
  console.log(pendaftaran1);
} catch (err) {
  // Menangkap Bom-nya
  console.log("NOTIF TO USER:", err.message);
}`,
      note: {
        bold: "Keyword 'throw':",
        text: "Sangat baik agar tim Backend dan Frontend bisa berkomunikasi mengirimkan Notifikasi Validasi Bisnis yang jelas (KTP Kurang, Dana Kurang, dll.)",
        color: "orange",
      },
    },
  ],
  tips: {
    whenTitle: "Prioritas Try-Catch",
    when: [
      "Mengambil (Fetch) API Data dari server asing lewat internet.",
      "Membaca File sistem atau Database.",
      "Mengonversi String JSON yang tak menentu berantakan dari pengguna.",
    ],
    avoidTitle: "Jangan Dilakukan",
    avoid: [
      "Membungkus SATU halam utuh kode di dalam satu Try-Catch. Pisahkan blok try catch hanya di fungsi-fungsi yang krusial.",
      "Menangkap Error tapi dibiarkan kosong (Swallowing Errors) <code>catch(err) {}</code>. Ini akan membuat pelacakan Bug jadi mustahil saat Aplikasi sudah disebarkan.",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Jaring Penyelamat",
      description: "Blok catch()",
      task: "Sial! Ada fungsi misteriTumbang() di API kita. Tolong tangkap di dalam kurung kurawal catch dan tuliskan kata kuncinya (nama variabel default standar) untuk merekam argumen penangkap error, biasa dibilang 'err'.",
      initialCode: `try {
  misteriTumbang(); // Ini pasti Eror.
} catch (???) {
  console.log("Aplikasi diselamatkan karena error ditangkap!");
}`,
      expectedOutputs: ["Aplikasi diselamatkan karena error ditangkap!"],
    },
    {
      number: 2,
      title: "Pasti Dieksekusi!",
      description: "Menutup sambungan API.",
      task: "Panggil sebuah blok/kewyord yang secara teknis SELALU berjalan terlepas Try berhasil atau Catch Gagal/Bekerja. (Abaikan spasi). Tulis perintah console log 'Loading Ditutup' di dalamnya.",
      initialCode: `try {
  console.log("Download Dimulai..");
  // ... Error internet mati
  throw new Error("Connection Lost");
} catch (error) {
  console.log(error.message);
} ??? {
  console.log("Loading Ditutup");
}`,
      expectedOutputs: ["Download Dimulai..", "Connection Lost", "Loading Ditutup"],
    },
  ],
};
