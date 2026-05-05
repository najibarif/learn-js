import type { TopicData } from "@/components/topic-page";

export const advancedTopic: TopicData = {
  id: "advanced",
  label: "15. JS Lanjutan (Advanced)",
  accentColor: "indigo",
  gradientFrom: "from-indigo-50",
  gradientTo: "to-blue-50",
  darkGradientFrom: "dark:from-indigo-950/40",
  darkGradientTo: "dark:to-blue-950/40",
  iconBg: "bg-indigo-700",
  concept: {
    question: "Apa Saja Pilar JS Lanjutan?",
    explanation:
      "Selamat datang di tahap akhir peta pengembangan diri! Kita akan menyentuh tingkat mendalam yang biasanya ditanyakan saat <strong>Wawancara Kerja (Interview) Kelas Menengah atas (Mid-Senior)</strong>. Komponen unggulan ini mencakup: <strong>Class (OOP Modern JS), Closure (Fungsi Bersarang Privasi), dan Hoisting/Scope Tingkat Lanjut</strong>.",
    analogy: {
      title: "Analogi Arsitektur Bangunan & The Class",
      intro: "Bayangkan Class sebagai sebuah 'Cetak Biru (Blueprint)' pabrik pembuat mobil:",
      bullets: [
        "Class/Blueprint = Gambar desain bentuk mobil yang ada instruksi warnanya tapi belum jadi wujud aslinya.",
        "Constructor = Buruh pabrik perakit awal.",
        "New Object = Mobil nyata yang sukses di print/dirakit menurut blueprint dan siap ditunggangi! (disebut Instance).",
      ],
    },
    structure: {
      title: "OOP dengan Class:",
      code: `// Mencetak Blueprint 'User'
class PesertaJS {
  // Method yang Otomatis berjalan saat Objek "New" lahir
  constructor(nama) {
    this.nama = nama;  // This menempelkan milik ke diri sendiri
    this.status = "Aktif";
  }

  // Method Kemampuan
  absen() {
    console.log(this.nama + " telah present!");
  }
}

// Melahirkan Objek Nyata (Instance)
const budi = new PesertaJS("Budi Sudarsono");
budi.absen();`,
      parts: [
        {
          num: 1,
          code: "class TagNama",
          badge: "(Pabriknya)",
          description: "Mendeklarasikan sebuah pabrik cetak biru objek.",
          note: "Nama Class umumnya Diawali Huruf Besar (PascalCase).",
          color: "blue",
        },
        {
          num: 2,
          code: "constructor()",
          badge: "(Bidan Pembangun)",
          description: "Fungsi bawaan yang menyambut data bawaan new Object.",
          note: "Di sinilah kamu memparsing nilai settingan dasar (property).",
          color: "purple",
        },
        {
          num: 3,
          code: "this.",
          badge: "(Diri Sendiri)",
          description: "Penunjuk bahwa variabel ini HANYA eksklusif dimiliki object yang meminjamnya.",
          note: "Keyword dewa di OOP JS.",
          color: "cyan",
        },
      ],
    },
    flow: {
      title: "Cara Kerja Object Initiation:",
      steps: [
        { label: "Panggil 'new Class()'", color: "indigo" },
        { label: "Lari ke Constructor()", color: "yellow" },
        { label: "this merekatkan Variabel baru", color: "white" },
        { label: "Object Hidup Merdeka!", color: "green" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Encapsulation (Simulasi Info Pribadi)",
      subtitle: "Melindungi Rekening Bank dari Luar",
      circleColor: "bg-indigo-600",
      code: `class RekeningBank {
  // Hashtag # membuatnya PRIVATE! Gak bisa diintip dari luar class.
  #passwordRahasia;

  constructor(nama, danaAwal, pin) {
    this.nama = nama;
    this.saldo = danaAwal;
    this.#passwordRahasia = pin;
  }

  // Trik Get - Membuat metod seolah itu property
  get infoRekening() {
    return \`User \${this.nama} punya harta \${this.saldo}!\`;
  }
}

const rekPakJoko = new RekeningBank("Joko", 500000, "999BOS");

console.log(rekPakJoko.infoRekening);

// Kalau mau Hack PIN?? AKAN EROR UNDEFINED/NOT FOUND.
// Rahasia Aman Dilindungi Negara!
console.log("Nyoba ngehack Password:", rekPakJoko.passwordRahasia);`,
      note: {
        bold: "Private Property ES2022:",
        text: "Fitur hashtag (#) sangat menakjubkan bagi JS karena dulunya JS ga punya pengunci (Gembok) data sehingga semuanya Publik telanjang.",
        color: "indigo",
      },
    },
    {
      number: 2,
      title: "Inheritance (Penurunan Sifat Murni)",
      subtitle: "Bapak Mewariskan Sifat ke Anak",
      circleColor: "bg-purple-600",
      code: `// Kelas Atas (Sang Ayah / Parent)
class Hewan {
  constructor(nama) {
    this.nama = nama;
  }
  nafas() {
    console.log(this.nama + " Bernapas Oksigen...");
  }
}

// Anak Turunan Mewarisi Sifat:
class Burung extends Hewan {
  terbang() {
    console.log(this.nama + " Mengepakkan Sayap Terbang Tinggi!!");
  }
}

const cucakRowo = new Burung("Burung Rowo");
// Ia bisa memakai fungsi warisan dari Hewan!
cucakRowo.nafas();

// Ia juga merdeka menjalankan fungsi sendirinya!
cucakRowo.terbang();`,
      note: {
        bold: "extends:",
        text: "Cara termudah mengkoloni metode dari kelas Parent tanpa harus Copy-Paste ulang kode.",
        color: "purple",
      },
    },
    {
      number: 3,
      title: "Closures (Dunia di Dalam Function)",
      subtitle: "Konsep yang paling sering ditanya pas Wawancara Senior!",
      circleColor: "bg-teal-600",
      code: `function buatCounterRahasia() {
  // Hitungan ini Terperangkap, tidak bisa diakses main JS Global
  let hitunganMemori = 0;

  // Fungsi internal yang dikembalikan, memiliki 'Hubungan Batin' dengan memori ibunya
  return function () {
    hitunganMemori++;
    console.log("Klik tombol... Ke:", hitunganMemori);
  }
}

// Klik Mesin ini Memiliki Memori! Dialah Instance Counter nya.
const mesinPencetak = buatCounterRahasia();

mesinPencetak(); // Ke 1!
mesinPencetak(); // Ke 2!
mesinPencetak(); // Ke 3!

// Orang biasa gatau apa isi variabel aslinya, karena let hitunganMemori disembunyikan.`,
      note: {
        bold: "CLOSURE:",
        text: "Bila sebuah Anak-Fungsi mengingat masa lalunya di tubuh Induk-Fungsi nya betapapun lamanya ia dilempar keluar. Itulah Cinta (Closure).",
        color: "teal",
      },
    },
  ],
  tips: {
    whenTitle: "Target Mastery Kamu",
    when: [
      "Pelajari <strong>This</strong>. Kalau kamu menguasainya, kamu Dewa Frontend/Backend JS.",
      "Gunakan OOP jika kamu membangun Sistem Complex bertipe nyata (Sistem Perbankan, Game Canvas Hero, e-Comerce Cart).",
    ],
    avoidTitle: "Perangkap Terakhir",
    avoid: [
      "Menganggap 'This' di Arrow function = 'This' di Fungsi biasa. (Arrow function TIDAK PUNYA this bawaan dia sendiri, dia ngambil this dari ruangan bapanya).",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Kelahiran Sang Pahlawan",
      description: "Membuat Instansi Class (New)",
      task: "Ganti teks ??? untuk menge-summon 'new' Instance Objek pahlawan ke dalam memori aplikasi pakai Class satria.",
      initialCode: `class SatriaJS {
  constructor(kekuatan) {
    this.power = kekuatan;
  }
}

// Lahirkan kekuatan Api Power ke Hero!
const heroSaya = ??? SatriaJS("Api Power");
console.log(heroSaya.power);`,
      expectedOutputs: ["Api Power"],
    },
    {
      number: 2,
      title: "Keyword Terdalam (This)",
      description: "Pemahaman referencing.",
      task: "Bagaimana cara agar Method di dalam objek ini memanggil nama 'Bambang' miliknya sendiri? Masukan kata bantu 4 huruf magis yang populer.",
      initialCode: `const bosBesar = {
  nama: "Bambang",
  panggilBos: function() {
    // Panggil nama bapanya (diri sendiri)
    console.log("Tuan " + ???.nama + " Hadir!");
  }
};

bosBesar.panggilBos();`,
      expectedOutputs: ["Tuan Bambang Hadir!"],
    },
  ],
};
