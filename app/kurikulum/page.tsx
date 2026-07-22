"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  BookOpen, Box, Calculator, GitBranch, Repeat, Zap, List, Component,
  Type, AlertTriangle, Layout, MousePointerClick, Clock, Blocks, Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

const topics = [
  { id: "intro",     num: 1,  label: "Pengenalan",   icon: BookOpen,          color: "bg-slate-500",  desc: "Sejarah, sintaks dasar, console.log, dan cara kerja JavaScript di browser." },
  { id: "vars",      num: 2,  label: "Variabel",     icon: Box,               color: "bg-slate-400", desc: "Menyimpan data dengan var, let, dan const serta tipe data dasar." },
  { id: "operators", num: 3,  label: "Operator",     icon: Calculator,        color: "bg-slate-600",  desc: "Operasi matematika, perbandingan, logika, dan penugasan nilai." },
  { id: "branch",    num: 4,  label: "Percabangan",  icon: GitBranch,         color: "bg-slate-500", desc: "Membuat logika pengambilan keputusan dengan if-else dan switch." },
  { id: "loops",     num: 5,  label: "Perulangan",   icon: Repeat,            color: "bg-slate-400",  desc: "Mengulang baris kode secara efisien dengan for, while, dan do-while." },
  { id: "functions", num: 6,  label: "Function",     icon: Zap,               color: "bg-slate-500",  desc: "Menulis reusable code menggunakan parameter, return value, dan arrow function." },
  { id: "arrays",    num: 7,  label: "Array",        icon: List,              color: "bg-slate-600",  desc: "Mengelola dan memanipulasi data berurutan dengan method modern." },
  { id: "objects",   num: 8,  label: "Object",       icon: Component,         color: "bg-slate-400", desc: "Struktur data kompleks menggunakan pasangan key-value dan method." },
  { id: "strings",   num: 9,  label: "String",       icon: Type,              color: "bg-slate-500",  desc: "Manipulasi teks, string interpolation, dan method pengolah string." },
  { id: "errors",    num: 10, label: "Error",        icon: AlertTriangle,     color: "bg-slate-400", desc: "Penanganan kesalahan menggunakan try, catch, finally, dan custom error." },
  { id: "dom",       num: 11, label: "DOM",          icon: Layout,            color: "bg-slate-500",  desc: "Manipulasi dokumen HTML, mengubah elemen, atribut, dan style halaman." },
  { id: "events",    num: 12, label: "Events",       icon: MousePointerClick, color: "bg-slate-400", desc: "Merespon interaksi user seperti klik, keypress, submit, dan hover." },
  { id: "async",     num: 13, label: "Async",        icon: Clock,             color: "bg-slate-600",  desc: "Memahami eksekusi asinkronus menggunakan Promise dan async/await." },
  { id: "modules",   num: 14, label: "Modules",      icon: Blocks,            color: "bg-slate-500", desc: "Membagi kode JavaScript ke dalam modul dengan export dan import." },
  { id: "advanced",  num: 15, label: "Advanced",     icon: Rocket,            color: "bg-slate-400",  desc: "Konsep tingkat lanjut seperti closures, hoisting, scope, dan method array esensial." },
];

export default function KurikulumPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      <Navbar />

      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-medium text-slate-900 dark:text-white">
            Kurikulum JavaScript
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            15 modul lengkap dari dasar hingga lanjut. Klik modul untuk mulai belajar.
          </p>
        </div>

        <div className="space-y-4">
          {topics.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                href={`/?topic=${t.id}`}
                className="group flex items-center gap-5 p-5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm hover:shadow-md"
              >
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center shrink-0", t.color)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400 dark:text-slate-500 font-mono">{String(t.num).padStart(2, "0")}</span>
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      {t.label}
                    </h2>
                  </div>
                  <p className="text-base text-slate-500 dark:text-slate-400 mt-1">{t.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
