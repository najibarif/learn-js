import type { TopicData } from "@/components/topic-page";

export const domTopic: TopicData = {
  id: "dom",
  label: "11. DOM (Tampilan Jembatan)",
  accentColor: "violet",
  gradientFrom: "from-violet-50",
  gradientTo: "to-fuchsia-50",
  darkGradientFrom: "dark:from-violet-950/40",
  darkGradientTo: "dark:to-fuchsia-950/40",
  iconBg: "bg-violet-600",
  concept: {
    question: "Apa itu DOM?",
    explanation:
      "<strong>DOM (Document Object Model)</strong> adalah representasi dari sebuah halaman HTML yang dikonversi menjadi 'Pohon Objek' oleh Browser agar <strong>JavaScript bisa memahaminya dan memanipulasinya</strong>. Tanpa DOM, bahasa JS tidak akan bisa merubah warna tombol, menambahkan teks, menyembunyikan gambar, dsb. Semuanya diakses melalui induk super: kata kunci <code>document</code>.",
    analogy: {
      title: "Analogi Boneka Wayang",
      intro: "Bayangkan halaman Web sebagai wayang di panggung:",
      bullets: [
        "Wayang = Halaman HTML (Tombol, Teks, Gambar, Input).",
        "Dalang = Kode JavaScript-mu.",
        "Tali Pengikat = Itulah DOM. Dia menghubungkan JavaScript ke setiap anggota tubuh HTML sehingga bisa digerakkan secara interaktif saat web sedang menyala.",
      ],
    },
    structure: {
      title: "Tahapan Utama Memanipulasi View:",
      code: `// 1. Temukan Tali (Pilih Elemen) HTML nya:
let judulText = document.getElementById("judulUtama");

// 2. Ubah Sifatnya (Manipulasi):
judulText.innerText = "Selamat Datang di Web Interaktif!";
judulText.style.color = "blue";`,
      parts: [
        {
          num: 1,
          code: "document.",
          badge: "(Pintu Masuk Utama)",
          description: "Sebuah Global Object di browser (tidak ada di backend NodeJS!).",
          note: "Semua aksi DOM wajib berawal manggil document.",
          color: "violet",
        },
        {
          num: 2,
          code: "getElementById",
          badge: "(Selector / Penyeleksi)",
          description: "Paling legendaris. Menarget HTML yang punya tag id='...'.",
          note: "Ada juga querySelector, kita pelajari di bawah.",
          color: "yellow",
        },
        {
          num: 3,
          code: ".innerText / .innerHTML",
          badge: "(Manipulator)",
          description: "Bagaimana cara kita mempengaruhi yang udah diseleksi.",
          note: "innerText mengubah teks mentah, innerHTML bisa ngirim elemen HTML spt bold <b>.",
          color: "green",
        },
      ],
    },
    flow: {
      title: "Cara Kerja Integrasi",
      steps: [
        { label: "HTML Kosongan", color: "white" },
        { label: "Browser merangkainya -> Pohon DOM", color: "cyan" },
        { label: "JS datang pakai selector document.", color: "violet" },
        { label: "Elemen berubah realtime tanpa Refreash", color: "green" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Selector Tingkat Lanjut",
      subtitle: "Cara paling modern memilih elemen pakai querySelector()",
      circleColor: "bg-violet-600",
      code: `/*
 ANGKAP KITA MEMILIKI KODE HTML BERIKUT DI BELAKANG LAYAR:
 <h1 class="judul">Teks Lama</h1>
 <button id="btnClick">Tombol Saya</button>
*/

// Menargetkan ID pakai Hashtag (#) seperti di CSS:
let myBtn = document.querySelector("#btnClick");
console.log("Dapat tombol ID ini:", myBtn?.tagName || "Ditemukan Murni Browser");

// Menargetkan Class pakai Titik (.) seperti di CSS:
let myText = document.querySelector(".judul");

// beda dengan querySelector yang ambil HANYA 1 buah saja...
// Jika butuh sekumpulan class list banyak, pakai All:
let myAllTextObject = document.querySelectorAll(".judul");
// Lalu dilooping forEach()`,
      note: {
        bold: "Bebas dari ID:",
        text: "Berkat querySelector, kita nyaris pensiun pakai getElementById. Cukup pakai teknik tembak CSS tag di parameter nya.",
        color: "violet",
      },
    },
    {
      number: 2,
      title: "Modifikasi Bentuk Nyata!",
      subtitle: "Mengenal Manipulasi Stylesheet dan Attribut",
      circleColor: "bg-fuchsia-600",
      code: `// Simulai Pembuatan DOM bayangan:
let el = document.createElement("a");
el.innerText = "Klik Google";

// --- MEMBACA DAN MENULIS ATTRIBUT HTML ---
// Merubah href= pada kotak tag a HTML
el.setAttribute("href", "http://google.com");
el.setAttribute("class", "tombol-biru");

// --- MEMANIPULASI STYLE LANGSUNG ---
el.style.backgroundColor = "green";
el.style.fontSize = "24px";  // (Tulis pakai Camel Case dario font-size)

console.log("Hasil Cetakan HTML kita melalui JS:");
console.log(el.outerHTML);`,
      note: {
        bold: "Inline Style:",
        text: "Mengubah .style.color = 'red' setara dengan menulis hard code style='color: red' ke baris HTML di browser pengguna.",
        color: "fuchsia",
      },
    },
    {
      number: 3,
      title: "Manipulasi ClassList API",
      subtitle: "Cara Modern Menghidup-Matikan CSS framework (Ex: Tailwind)",
      circleColor: "bg-sky-600",
      code: `let box = document.createElement("div");

// Daripada pakai style.color yang jorok,
// Developer handal menggunakan CLASSLIST!
// ------------------------------------

box.classList.add("bg-red-500", "p-4");
console.log(box.outerHTML);

// Menghilangkan class
box.classList.remove("p-4");

// YANG PALING KEREN: Toggle.
// Kalau ada dihilangkan, kalau GAK ADA DITAMBAHKAN!
box.classList.toggle("hidden-block");
console.log(box.outerHTML);

// Cek Boolean (True/False)
let isSembunyi = box.classList.contains("hidden-block");
console.log("Apakah punya class hidden-block?", isSembunyi);`,
      note: {
        bold: "Bersetubuh dengan Framework Tampilan:",
        text: "Manipulasi List Class ini super penting kalau kamu mau membuat Dark/Light mode, Burger menu dropdown, dll pake Tailwind.",
        color: "sky",
      },
    },
  ],
  tips: {
    whenTitle: "Metode Terfavorit",
    when: [
      "Ketika membuat aplikasi murni seperti Web App, DOM adalah tulang punggunya.",
      "Selalu gunakan <code>document.querySelector('.namaKelas')</code> untuk memilih elemen layaknya di CSS.",
      "Gunakan <code>classList.toggle('active')</code> memicu Animasi / Perubahan Warna."
    ],
    avoidTitle: "Hindari Ini",
    avoid: [
      "Mengganti langsung pakai DOM <code>innerHTML</code> jika text itu berasal dari Input Form. Hackers mengirim virus Cross-Site-Scripting (XSS) di sini! Gantilah pakai <code>innerText / textContent</code> saja kalau isinya dari Input user luar.",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Memanggil Div yang Paling Dicari",
      description: "Menemukan Div By Id",
      task: "Temukan element ID (headerArea) dengan function getElement dan output-kan isi variabel nya ke log.",
      initialCode: `// Disimulasikan elemen HTML nyata telah terbentuk.
let targetDiv = document.???("headerArea");

console.log(targetDiv ? "Ditemukan!" : "Gagal Tembak!");`,
      expectedOutputs: ["Gagal Tembak!"], // Since document.getElementById "headerArea" is null here
    },
  ],
};
