"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TopicPage } from "@/components/topic-page";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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
  CheckCircle2, Code, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const topics = [
  { id: "intro",     label: "1. Pengenalan",   icon: BookOpen,          color: "bg-slate-500",  data: introTopic,     desc: "Sejarah, sintaks dasar, console.log, dan cara kerja JavaScript di browser." },
  { id: "vars",      label: "2. Variabel",     icon: Box,               color: "bg-slate-400", data: varsTopic,      desc: "Menyimpan data dengan var, let, dan const serta tipe data dasar." },
  { id: "operators", label: "3. Operator",     icon: Calculator,        color: "bg-slate-600",  data: operatorsTopic, desc: "Operasi matematika, perbandingan, logika, dan penugasan nilai." },
  { id: "branch",    label: "4. Percabangan",  icon: GitBranch,         color: "bg-slate-500", data: branchTopic,    desc: "Membuat logika pengambilan keputusan dengan if-else dan switch." },
  { id: "loops",     label: "5. Perulangan",   icon: Repeat,            color: "bg-slate-400",  data: loopsTopic,     desc: "Mengulang baris kode secara efisien dengan for, while, dan do-while." },
  { id: "functions", label: "6. Function",     icon: Zap,               color: "bg-slate-500",  data: functionsTopic, desc: "Menulis reusable code menggunakan parameter, return value, dan arrow function." },
  { id: "arrays",    label: "7. Array",        icon: List,              color: "bg-slate-600",  data: arraysTopic,    desc: "Mengelola dan memanipulasi data berurutan dengan method modern." },
  { id: "objects",   label: "8. Object",       icon: Component,         color: "bg-slate-400", data: objectsTopic,   desc: "Struktur data kompleks menggunakan pasangan key-value dan method." },
  { id: "strings",   label: "9. String",       icon: Type,              color: "bg-slate-500",  data: stringsTopic,   desc: "Manipulasi teks, string interpolation, dan method pengolah string." },
  { id: "errors",    label: "10. Error",       icon: AlertTriangle,     color: "bg-slate-400", data: errorsTopic,    desc: "Penanganan kesalahan menggunakan try, catch, finally, dan custom error." },
  { id: "dom",       label: "11. DOM",         icon: Layout,            color: "bg-slate-500",  data: domTopic,       desc: "Manipulasi dokumen HTML, mengubah elemen, atribut, dan style halaman." },
  { id: "events",    label: "12. Events",      icon: MousePointerClick, color: "bg-slate-400", data: eventsTopic,    desc: "Merespon interaksi user seperti klik, keypress, submit, dan hover." },
  { id: "async",     label: "13. Async",       icon: Clock,             color: "bg-slate-600",  data: asyncTopic,     desc: "Memahami eksekusi asinkronus menggunakan Promise dan async/await." },
  { id: "modules",   label: "14. Modules",     icon: Blocks,            color: "bg-slate-500", data: modulesTopic,   desc: "Membagi kode JavaScript ke dalam modul dengan export dan import." },
  { id: "advanced",  label: "15. Advanced",    icon: Rocket,            color: "bg-slate-400",  data: advancedTopic,  desc: "Konsep tingkat lanjut seperti closures, hoisting, scope, dan method array esensial." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeTopic = topics.find((t) => t.id === activeId);
  const activeIdx   = topics.findIndex((t) => t.id === activeId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeId]);

  const smoothScrollTo = (targetPosition: number, duration: number = 500) => {
    const startPosition = window.scrollY || document.documentElement.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;
    const ease = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };
    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
      else window.scrollTo(0, targetPosition);
    };
    requestAnimationFrame(animation);
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 85;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      smoothScrollTo(elementPosition - offset, 600);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  if (activeId === null || !activeTopic) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
        {/* Header */}
        <Navbar />

        {/* Hero */}
        <section className="pt-20 pb-16 md:pt-20 md:pb-24">
          <div className="container mx-auto px-6 text-center">
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight"
            >
              Belajar <span className="text-slate-500 dark:text-slate-400">JavaScript</span>
              <br />secara interaktif.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed"
            >
              15 modul, latihan langsung di browser, dan kuis untuk menguji pemahamanmu. Tanpa iklan, tanpa ribet.
            </motion.p>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex items-center justify-center gap-5"
            >
              <a href="#kurikulum" onClick={(e) => handleAnchorClick(e, "kurikulum")}
                className="text-lg font-medium text-white bg-slate-600 dark:bg-slate-500 px-7 py-3 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-400 transition-colors">
                Mulai Belajar
              </a>
              <a href="/quiz" className="text-lg font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                Ikuti Kuis
              </a>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="border-y border-slate-200 dark:border-slate-800"
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200 dark:divide-slate-800">
              {[
                { val: "15", label: "Modul" },
                { val: "30+", label: "Latihan" },
                { val: "100%", label: "Interaktif" },
                { val: "Gratis", label: "Tanpa Iklan" },
              ].map((s, i) => (
                <div key={i} className="py-10 text-center">
                  <p className="text-4xl font-semibold text-slate-900 dark:text-white">{s.val}</p>
                  <p className="text-base text-slate-400 dark:text-slate-500 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <section id="fitur" className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl font-medium text-slate-900 dark:text-white">Mengapa LearnJS?</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 mt-3">Dirancang agar belajar JavaScript terasa mudah dan tidak membosankan.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800">
              {[
                { icon: Code, title: "Editor Kode", desc: "Tulis kode langsung di browser." },
                { icon: Repeat, title: "Visualisasi", desc: "Lihat alur eksekusi kode." },
                { icon: BookOpen, title: "Kurikulum", desc: "15 modul dari dasar ke lanjut." },
                { icon: Zap, title: "Kuis", desc: "Uji pemahamanmu secara langsung." },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white dark:bg-slate-950 p-7 shadow-sm"
                >
                  <f.icon className="h-6 w-6 text-slate-500 dark:text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-base text-slate-500 dark:text-slate-400 mt-1.5">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section id="kurikulum" className="py-24 md:py-32 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl font-medium text-slate-900 dark:text-white">Modul JavaScript</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 mt-3">Pilih topik untuk mulai belajar.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800">
              {topics.map((t, i) => {
                const Icon = t.icon;
                return (
                  <motion.button
                    key={t.id}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                    onClick={() => setActiveId(t.id)}
                    className="group bg-white dark:bg-slate-950 p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", t.color)}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg font-medium text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                        {t.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  // ─── Active Topic View ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[60]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-[70] flex flex-col transition-transform duration-200 ease-out shadow-xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-lg font-medium text-slate-900 dark:text-white">Modul</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <button onClick={() => { setActiveId(null); setIsSidebarOpen(false); }}
            className="w-full text-left px-5 py-3 text-base font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
            ← Beranda
          </button>
          <div className="my-1 border-t border-slate-100 dark:border-slate-900" />
          {topics.map((t, idx) => {
            const Icon = t.icon;
            const isActive = t.id === activeId;
            const isDone   = idx < activeIdx;
            return (
              <button
                key={t.id}
                onClick={() => { setActiveId(t.id); setIsSidebarOpen(false); }}
                className={cn(
                  "w-full text-left px-5 py-3 text-base font-medium flex items-center gap-3 transition-colors cursor-pointer",
                  isActive
                    ? "text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900"
                    : isDone
                    ? "text-slate-400 dark:text-slate-500"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                )}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <Icon className="h-4 w-4 flex-shrink-0" />}
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer" aria-label="Buka menu">
              <Menu className="h-5 w-5" />
            </button>
            <button onClick={() => setActiveId(null)} className="flex items-center gap-2 text-left cursor-pointer">
              <Code className="h-5 w-5 text-slate-500" />
              <span className="text-lg font-semibold text-slate-900 dark:text-white">LearnJS</span>
            </button>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button onClick={() => setActiveId(null)} className="hidden lg:block text-base text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
              Beranda
            </button>
            <span className="hidden lg:block text-sm text-slate-300 dark:text-slate-600 font-mono">
              {activeIdx + 1}/{topics.length}
            </span>
            <Link href="/quiz" className="hidden lg:inline-flex text-base font-medium text-slate-600 dark:text-slate-400 hover:underline">Kuis</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Topic header - centered */}
      <div className="py-12 md:py-16 text-center">
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2.5 mb-5"
          >
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", activeTopic.color)}>
              <activeTopic.icon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-base text-slate-400 dark:text-slate-500">Topik {activeIdx + 1} dari {topics.length}</span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-medium text-slate-900 dark:text-white"
          >
            {activeTopic.label}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto"
          >
            Pahami konsep dengan penjelasan lengkap, contoh interaktif, dan latihan soal.
          </motion.p>
        </div>
      </div>

      {/* Topic Content */}
      <TopicPage data={activeTopic.data} />

      {/* Nav footer */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-5">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button
              onClick={() => { activeIdx > 0 ? setActiveId(topics[activeIdx - 1].id) : setActiveId(null); }}
              className="text-base text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer">
              {activeIdx === 0 ? "← Beranda" : "← Sebelumnya"}
            </button>
            <div className="hidden lg:flex items-center gap-2">
              {topics.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={cn("rounded-full transition-all cursor-pointer",
                    t.id === activeId ? "w-6 h-2 bg-slate-500"
                    : i < activeIdx ? "w-2 h-2 bg-slate-400"
                    : "w-2 h-2 bg-slate-200 dark:bg-slate-700"
                  )} title={t.label} />
              ))}
            </div>
            <button
              onClick={() => { activeIdx < topics.length - 1 ? setActiveId(topics[activeIdx + 1].id) : setActiveId(null); }}
              className="text-base font-medium text-slate-600 dark:text-slate-400 hover:underline transition-colors cursor-pointer">
              {activeIdx === topics.length - 1 ? "Selesai" : "Selanjutnya →"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
