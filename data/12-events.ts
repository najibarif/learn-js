import type { TopicData } from "@/components/topic-page";

export const eventsTopic: TopicData = {
  id: "events",
  label: "12. Event",
  accentColor: "orange",
  gradientFrom: "from-orange-50",
  gradientTo: "to-amber-50",
  darkGradientFrom: "dark:from-orange-950/40",
  darkGradientTo: "dark:to-amber-950/40",
  iconBg: "bg-orange-600",
  concept: {
    question: "Apa itu Event dalam JavaScript?",
    explanation:
      "Tanpa <strong>Event (Kejadian)</strong>, situs web akan diam saja paten (statis) seperti membaca Koran PDF. Event adalah saat di mana JavaScript bereaksi ketika User (Pengguna Nyata) melakukan sebuah <strong>Tindakan Action</strong> terhadap layout halaman.",
    analogy: {
      title: "Analogi Kamera Keamanan",
      intro: "Bayangkan kamu seorang Satpam memantau Kamera Gedung:",
      bullets: [
        "Objek = Pintu depan gedung.",
        "Kamera (Listener) = Menatap terus ke arah pintu itu, gak pernah tidur menunggu pergerakan spesifik.",
        "Event (Kejadian) = 'Ada orang lewat / Click'.",
        "Aksi (Callback Function) = Bunyikan sirine atau buka palang parkir.",
      ],
    },
    structure: {
      title: "Memasang Perangkap Event (Event Listener):",
      code: `let tombol = document.querySelector(".btn-submit");

// Menunggu kejadian "click", jalankan function ini jika terjadi!
tombol.addEventListener("click", function() {
  console.log("Tombol berhasil ditekan!");
  alert("Data Tersimpan!");
});`,
      parts: [
        {
          num: 1,
          code: "tombol",
          badge: "(Node Elemen)",
          description: "Target benda HTML yang sudah ditangkap oleh querySelector.",
          note: "Kamu ga bisa kasih event ke variabel kosongan/text.",
          color: "sky",
        },
        {
          num: 2,
          code: "addEventListener",
          badge: "(Method Sakti)",
          description: "Fungsi resmi untuk memasang alat pendengar di elemen tersebut.",
          note: "Arti harafiahnya: Tambahkan Pendengar Kejadian.",
          color: "orange",
        },
        {
          num: 3,
          code: "\"click\"",
          badge: "(Jenis Action)",
          description: "Pemicu yang ditunggu.",
          note: "Ada banyak: dblclick, keydown, mouseover, submit.",
          color: "blue",
        },
        {
          num: 4,
          code: "function(){...}",
          badge: "(Callback Aksi)",
          description: "Reaksi Kode JS yang meledak setelah di-Click tsb.",
          note: "Function ini tidur ga akan jalan SEBELUM user beneran ngeklik.",
          color: "red",
        },
      ],
    },
    flow: {
      title: "Flow Interaksi 2 Arah",
      steps: [
        { label: "Pasang Listener di Komponen", color: "indigo" },
        { label: "Standby 24 Jam Nunggu User", color: "yellow" },
        { label: "USER KLIK MOUSE", color: "red" },
        { label: "Fire / Eksekusi Fungsi!", color: "green" },
      ],
    },
  },
  examples: [
    {
      number: 1,
      title: "Object Event (e) yang Tersembunyi",
      subtitle: "Mengetahui info rahasia saat user bereaksi",
      circleColor: "bg-orange-600",
      code: `/* 
  Saat event meledak, JS otomatis mengirim 1 buah Paramater Spesial (biasa disebut e atau event).
  Ini berisi DATA SUPER LENGKAP kejadian tersebut! 
*/

function tangkapTikanan(e) {
  console.log("Terdeteksi Klik!");
  console.log("Di koordinat layar X:", e.clientX);
  console.log("Di koordinat layar Y:", e.clientY);
  console.log("Tag asal benda:", e.target.tagName);
}

// Simulasi Manggil (karena ini editor pasif)
let mockEvent = {
  clientX: 120, clientY: 53,
  target: { tagName: "BUTTON" }
};
tangkapTikanan(mockEvent);`,
      note: {
        bold: "Paramater 'e':",
        text: "Sangat genting saat membuat Drag And Drop karena butuh e.clientX dan e.clientY.",
        color: "orange",
      },
    },
    {
      number: 2,
      title: "Type Event Keyboard",
      subtitle: "Nge-log semua tekanan tuts keyboard gamer",
      circleColor: "bg-blue-600",
      code: `function sadapKeyboard(event) {
  // Hanya bereaksi jika yang ditekan ENTER
  if (event.key === "Enter") {
    console.log("User Mensubmit Pencarian!");
  } else {
    console.log("Tuts ditekan:", event.key);
  }
}

// Coba Panggil
sadapKeyboard({ key: "n" });
sadapKeyboard({ key: "Enter" });`,
      note: {
        bold: "Event input dinamis:",
        text: "Kamu pasang di input text: addEventListener('keyup', ...)",
        color: "blue",
      },
    },
    {
      number: 3,
      title: "The Prevent Default! (Sering Dipakai)",
      subtitle: "Mencegah refresh alamiah Browser",
      circleColor: "bg-rose-600",
      code: `function submitFormManual(event) {
  // FORM HTML alami punya habit = "Kalau di enter, REFRESH PAGE KESELURUHAN".
  // Kita BENTROK hal tsb di React / Modern JS. Cegat pakai kodingan wajib ini:
  
  event.preventDefault(); 
  
  console.log("Halaman tidak jadi ngerefresh.");
  console.log("Gantian JS yang akan kirim data inputnya pelan2 via Ajax/Async!");
}

submitFormManual({ preventDefault: () => {} });`,
      note: {
        bold: "Aturan Mutlak Forms:",
        text: "Hampir semua onSubmit di era Vanilla JS/React diawali oleh baris pertama yaitu e.preventDefault().",
        color: "rose",
      },
    },
  ],
  tips: {
    whenTitle: "Action Umum",
    when: [
      "Tombol: <code>click</code>",
      "Kolom Input Teks Tereksekusi Per KarakterTulis: <code>input</code>",
      "Formular Utuh Dikirim: <code>submit</code> (di tag <form>)",
      "Mouse diHover diam ke gambar: <code>mouseenter</code> / <code>mouseleave</code>",
    ],
    avoidTitle: "Tenggelam Memory",
    avoid: [
      "Meng-attach puluhan <code>addEventListener</code> ber-looping di dalam For Loop ke 1.000 div/item. Bikin lemot, solusinya Event Delegation.",
      "Menggunakan penulisan lama di html <code>onclick='foo()'</code> — Pisahkan murni Javascript mu (addEventLister) dari File HTML mu.",
    ],
  },
  exercises: [
    {
      number: 1,
      title: "Mencetak Tuts SpaceBar",
      description: "Ambil key dari event object.",
      task: "Ganti teks ??? sesuai The Magic Keyword Event Param agar dia berhasil mengeprint isi karakter key dari Event Object di fungsi itu.",
      initialCode: `function penangkapKey(e) {
  // Outputkan Properti "key" dari variabel "e", the Event Object itu sendiri.
  console.log(e.???);  
}

penangkapKey( { key: "Spacebar" } );`,
      expectedOutputs: ["Spacebar"],
    },
    {
      number: 2,
      title: "Mencegah Refresh Page",
      description: "Menyetabilkan React ecosystem Form",
      task: "Panggil fungsi method paten pembeku The Nature of HTML Browser Refresh Form, agar 'Aman' yg tecetak (Abaikan Spasinya).",
      initialCode: `function cegatForm(e) {
  e.???();
  console.log("Aman");
}

let mockE = { 
  preventDefault: function(){ return true; } 
};
cegatForm(mockE);`,
      expectedOutputs: ["Aman"],
    },
  ],
};
