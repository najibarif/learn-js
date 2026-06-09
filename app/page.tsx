"use client";

import { useState, useEffect } from "react";
import { TopicPage } from "@/components/topic-page";
import { ThemeToggle } from "@/components/theme-toggle";
import { introTopic } from "@/data/01-intro";
import { varsTopic } from "@/data/02-vars";
import { operatorsTopic } from "@/data/03-operators";
import { branchTopic } from "@/data/04-branching";
import { loopsTopic } from "@/data/05-loops";
import { functionsTopic } from "@/data/06-functions";
import { arraysTopic } from "@/data/07-arrays";
import { objectsTopic } from "@/data/08-objects";
import { stringsTopic } from "@/data/09-strings";
import { errorsTopic } from "@/data/10-errors";
import { domTopic } from "@/data/11-dom";
import { eventsTopic } from "@/data/12-events";
import { asyncTopic } from "@/data/13-async";
import { modulesTopic } from "@/data/14-modules";
import { advancedTopic } from "@/data/15-advanced";

import {
  BookOpen, Box, Calculator, GitBranch, Repeat, Zap, List, Component,
  Type, AlertTriangle, Layout, MousePointerClick, Clock, Blocks, Rocket,
  ChevronRight, CheckCircle2, Code, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Topic registry ───────────────────────────────────────────────────────────

const topics = [
  { id: "intro",     label: "1. Pengenalan",   icon: BookOpen,          color: "from-blue-500 to-cyan-500",      data: introTopic,     desc: "Sejarah, sintaks dasar, console.log, dan cara kerja JavaScript di browser." },
  { id: "vars",      label: "2. Variabel",     icon: Box,               color: "from-violet-500 to-purple-500",  data: varsTopic,      desc: "Menyimpan data dengan var, let, dan const serta tipe data dasar." },
  { id: "operators", label: "3. Operator",     icon: Calculator,        color: "from-indigo-500 to-blue-500",    data: operatorsTopic, desc: "Operasi matematika, perbandingan, logika, dan penugasan nilai." },
  { id: "branch",    label: "4. Percabangan",  icon: GitBranch,         color: "from-amber-500 to-orange-500",   data: branchTopic,    desc: "Membuat logika pengambilan keputusan dengan if-else dan switch." },
  { id: "loops",     label: "5. Perulangan",   icon: Repeat,            color: "from-emerald-500 to-teal-500",   data: loopsTopic,     desc: "Mengulang baris kode secara efisien dengan for, while, dan do-while." },
  { id: "functions", label: "6. Function",     icon: Zap,               color: "from-pink-500 to-rose-500",      data: functionsTopic, desc: "Menulis reusable code menggunakan parameter, return value, dan arrow function." },
  { id: "arrays",    label: "7. Array",        icon: List,              color: "from-sky-500 to-blue-500",       data: arraysTopic,    desc: "Mengelola dan memanipulasi data berurutan dengan method modern." },
  { id: "objects",   label: "8. Object",       icon: Component,         color: "from-rose-500 to-pink-500",      data: objectsTopic,   desc: "Struktur data kompleks menggunakan pasangan key-value dan method." },
  { id: "strings",   label: "9. String",       icon: Type,              color: "from-yellow-500 to-amber-500",   data: stringsTopic,   desc: "Manipulasi teks, string interpolation, dan method pengolah string." },
  { id: "errors",    label: "10. Error",       icon: AlertTriangle,     color: "from-red-500 to-orange-500",     data: errorsTopic,    desc: "Penanganan kesalahan menggunakan try, catch, finally, dan custom error." },
  { id: "dom",       label: "11. DOM",         icon: Layout,            color: "from-violet-500 to-fuchsia-500", data: domTopic,       desc: "Manipulasi dokumen HTML, mengubah elemen, atribut, dan style halaman." },
  { id: "events",    label: "12. Events",      icon: MousePointerClick, color: "from-orange-500 to-amber-500",   data: eventsTopic,    desc: "Merespon interaksi user seperti klik, keypress, submit, dan hover." },
  { id: "async",     label: "13. Async",       icon: Clock,             color: "from-teal-500 to-emerald-500",   data: asyncTopic,     desc: "Memahami eksekusi asinkronus menggunakan Promise dan async/await." },
  { id: "modules",   label: "14. Modules",     icon: Blocks,            color: "from-slate-500 to-gray-500",     data: modulesTopic,   desc: "Membagi kode JavaScript ke dalam modul dengan export dan import." },
  { id: "advanced",  label: "15. Advanced",    icon: Rocket,            color: "from-indigo-500 to-blue-500",    data: advancedTopic,  desc: "Konsep tingkat lanjut seperti closures, hoisting, scope, dan method array esensial." },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeTopic = topics.find((t) => t.id === activeId);
  const activeIdx   = topics.findIndex((t) => t.id === activeId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeId]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 85; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  // If on landing page (no active topic), show the landing page
  if (activeId === null || !activeTopic) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm shadow-sm transition-colors">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20 animate-pulse">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">LearnJS</span>
                <span className="text-slate-400 dark:text-slate-500 text-xs ml-2 hidden sm:inline font-medium">
                  Platform Belajar JavaScript Interaktif
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                <a href="#fitur" onClick={(e) => handleAnchorClick(e, "fitur")} className="hover:text-violet-500 transition-colors">Fitur</a>
                <a href="#kurikulum" onClick={(e) => handleAnchorClick(e, "kurikulum")} className="hover:text-violet-500 transition-colors">Kurikulum</a>
                <Link href="/submissions" className="hover:text-violet-500 transition-colors font-semibold text-violet-600 dark:text-violet-400">Kumpul Tugas</Link>
                <Link href="/quiz" className="hover:text-violet-500 transition-colors">Kuis</Link>
              </nav>
              <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />
              <Link
                href="/quiz"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                <Zap className="h-4 w-4" />
                <span>Kuis</span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent">
          {/* Background decorative circles */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none dark:bg-violet-600/5" />
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none dark:bg-indigo-600/5" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/50">
                <span className="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
                Modul Interaktif 100% Gratis
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none text-balance">
                Kuasai <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">JavaScript</span> dari Nol dengan Cara Baru
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-pretty font-normal">
                Belajar JavaScript secara interaktif langsung dari browsermu. Tulis kode, jalankan latihan, visualisasikan alur program, dan uji pemahamanmu dengan kuis seru.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="#kurikulum"
                  onClick={(e) => handleAnchorClick(e, "kurikulum")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-95 text-white font-bold text-base shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Mulai Belajar
                  <ChevronRight className="h-5 w-5" />
                </a>
                <Link
                  href="/quiz"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Zap className="h-5 w-5 text-indigo-500 animate-bounce" />
                  Ikuti Kuis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 py-12 transition-colors">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-violet-600 dark:text-violet-400">15</p>
                <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Modul Pembelajaran</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-purple-600 dark:text-purple-400">100%</p>
                <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Interaktif & Real-Time</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">30+</p>
                <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Latihan Soal Langsung</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">Gratis</p>
                <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Selamanya Tanpa Iklan</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="fitur" className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Mengapa Belajar di LearnJS?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-normal">
                Platform ini didesain khusus agar belajar pemrograman JavaScript terasa interaktif, visual, dan tidak membosankan.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md hover:border-violet-500/30 dark:hover:border-violet-500/30 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">Editor Kode Langsung</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Tulis kode JavaScript langsung di peramban web Anda. Eksekusi instan dan lihat hasilnya seketika tanpa konfigurasi.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                  <Repeat className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">Visualisasi Kode</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Lihat alur eksekusi perulangan (loop) dan pembacaan baris demi baris secara animasi untuk mempermudah pemahaman logika.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">Kurikulum Terstruktur</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Materi disusun runut sebanyak 15 modul, mulai dari konsep sintaksis paling dasar hingga penanganan asinkronus dan modul modern.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">Kuis & Gamifikasi</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Bermain kuis interaktif dengan skor real-time dan feedback suara yang menarik untuk memperkuat pemahaman konsep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Grid Section */}
        <section id="kurikulum" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-800 transition-colors">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Daftar Modul JavaScript
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-normal">
                Pilih topik di bawah ini untuk mulai belajar secara langsung. Setiap modul dilengkapi penjelasan, sandbox kode, dan latihan mandiri.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {topics.map((t, index) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    className="group flex flex-col text-left p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 hover:border-transparent hover:ring-2 hover:ring-violet-500 transition-all duration-300 hover:scale-[1.01] shadow-sm hover:shadow-xl hover:shadow-violet-500/5 cursor-pointer relative overflow-hidden"
                  >
                    {/* Top card coloring border decoration */}
                    <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", t.color)} />
                    
                    <div className="flex items-center gap-3.5 mb-4 mt-2">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-md", t.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                        Modul {index + 1}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors">
                      {t.label.replace(/^\d+\.\s*/, "")}
                    </h3>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex-grow line-clamp-2 leading-relaxed font-normal">
                      {t.desc}
                    </p>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-violet-500 transition-colors w-full">
                      <span>MULAI BELAJAR</span>
                      <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
          <div className="container mx-auto px-4 text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Code className="h-4 w-4 text-white" />
              </div>
              <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">LearnJS</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <a href="#fitur" onClick={(e) => handleAnchorClick(e, "fitur")} className="hover:text-violet-500 transition-colors">Tentang Kami</a>
              <a href="#kurikulum" onClick={(e) => handleAnchorClick(e, "kurikulum")} className="hover:text-violet-500 transition-colors">Kurikulum</a>
              <Link href="/submissions" className="hover:text-violet-500 transition-colors font-bold text-violet-600">Kumpul Tugas Kelompok</Link>
              <Link href="/quiz" className="hover:text-violet-500 transition-colors font-bold text-indigo-500">Ikut Kuis Interaktif</Link>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-xs">
              &copy; {new Date().getFullYear()} LearnJS. Dibuat untuk mempermudah belajar JavaScript secara gratis dan interaktif.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">

      {/* ── Sidebar Overlay ───────────────────────────────────────────── */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-white dark:bg-slate-950 shadow-2xl z-[70] transform transition-transform duration-300 ease-out border-r border-slate-200 dark:border-slate-800 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">Daftar Modul</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-hide">
          <button
            onClick={() => {
              setActiveId(null);
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-violet-600 dark:text-violet-400 border border-dashed border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/20 text-left transition-all cursor-pointer"
          >
            &larr; Kembali ke Beranda
          </button>
          <div className="h-[1px] bg-slate-100 dark:bg-slate-900 my-1" />

          {topics.map((t, idx) => {
            const Icon = t.icon;
            const isActive = t.id === activeId;
            const isDone   = idx < activeIdx;
            
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveId(t.id);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border text-left cursor-pointer",
                  isActive
                    ? `bg-gradient-to-r ${t.color} text-white border-transparent shadow-md`
                    : isDone
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/50"
                    : "bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                {isDone
                  ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  : <Icon className="h-4 w-4 flex-shrink-0" />
                }
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Sticky Header ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3">

          {/* Brand row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Buka Menu Sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                onClick={() => setActiveId(null)}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <Code className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">LearnJS</span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs ml-2 hidden lg:inline font-medium">
                    Belajar JavaScript Interaktif
                  </span>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveId(null)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Beranda
              </button>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono hidden sm:block">
                {activeIdx + 1}/{topics.length} Topik
              </span>
              <Link
                href="/quiz"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                <Zap className="h-4 w-4" />
                <span className="inline">Kuis</span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Section for active topic ───────────────────────────────── */}
      <section className={cn("bg-gradient-to-br py-14 md:py-20", activeTopic.color.replace("from-", "from-").replace("to-", "to-"), "to-indigo-50 dark:to-slate-950")}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 text-white shadow-lg bg-gradient-to-r",
              activeTopic.color
            )}>
              <activeTopic.icon className="h-4 w-4" />
              Topik {activeIdx + 1} dari {topics.length}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 text-balance">
              Belajar{" "}
              <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", activeTopic.color)}>
                {activeTopic.label}
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 text-pretty font-normal">
              Pahami konsep dengan mudah melalui penjelasan lengkap, contoh interaktif, dan latihan soal.
            </p>
          </div>
        </div>
      </section>

      {/* ── Topic Content ────────────────────────────────────────────────── */}
      <TopicPage data={activeTopic.data} />

      {/* ── Navigation footer ───────────────────────────────────────────── */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 animate-fade-in">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">

            {/* Prev */}
            <button
              onClick={() => {
                if (activeIdx > 0) {
                  setActiveId(topics[activeIdx - 1].id);
                } else {
                  setActiveId(null);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            >
              {activeIdx === 0 ? "← Beranda" : "← Sebelumnya"}
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {topics.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "rounded-full transition-all duration-200 cursor-pointer",
                    t.id === activeId
                      ? "w-6 h-2.5 bg-violet-500"
                      : i < activeIdx
                      ? "w-2.5 h-2.5 bg-emerald-400"
                      : "w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                  )}
                  title={t.label}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => {
                if (activeIdx < topics.length - 1) {
                  setActiveId(topics[activeIdx + 1].id);
                } else {
                  setActiveId(null);
                }
              }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all shadow-md cursor-pointer",
                "bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90"
              )}
            >
              {activeIdx === topics.length - 1 ? "Selesai & Beranda ✓" : <>Selanjutnya <ChevronRight className="h-4 w-4" /></>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 text-center space-y-4">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
          >
            <Zap className="h-4 w-4" />
            Ikuti Kuis Interaktif
          </Link>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            LearnJS — Platform Belajar JavaScript Interaktif
          </p>
        </div>
      </footer>
    </div>
  );
}
