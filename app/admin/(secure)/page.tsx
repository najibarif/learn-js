"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Code,
  Zap,
  FolderOpen,
  ArrowRight,
  ShieldAlert,
  ArrowLeft
} from "lucide-react";

export default function AdminPortalPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm shadow-sm transition-colors">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Kembali ke Beranda Utama"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Code className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">LearnJS Admin</span>
            <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Portal Utama</span>
          </div>
          <div className="flex items-center gap-3">
             <ThemeToggle />
             <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
             <Button 
               variant="outline" 
               onClick={async () => {
                 await fetch('/api/quiz/admin/logout', { method: 'POST' });
                 window.location.href = '/admin/login';
               }}
               className="text-slate-500 border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl px-4 h-9 text-xs font-bold transition-all"
             >
               SIGN OUT
             </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
        {/* Intro */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-650 dark:text-violet-400 border border-violet-100 dark:border-violet-900/50">
            <ShieldAlert className="h-4 w-4 text-violet-500" />
            Area Akses Terbatas Guru & Admin
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Selamat Datang di Portal Admin
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-medium text-sm md:text-base">
            Pilih sistem pengelolaan di bawah ini untuk memulai aktivitas administrasi pembelajaran kuis interaktif atau berkas tugas proyek siswa.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-8 pt-4">
          {/* Card 1: Quiz Management */}
          <Link href="/admin/quiz" className="group">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500/30 dark:hover:border-violet-500/30 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between h-[250px] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500" />
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                    Pengelolaan Kuis
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-normal">
                    Buat kuis baru, kelola soal latihan interaktif, pantau peringkat leaderboard secara real-time, dan unduh rekap nilai siswa.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">
                <span>MASUK PENGELOLAAN KUIS</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: Submissions Management */}
          <Link href="/admin/submissions" className="group">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500/30 dark:hover:border-violet-500/30 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between h-[250px] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 to-purple-500" />
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                    Pengelolaan Tugas
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-normal">
                    Buat folder proyek tugas kelompok, monitor berkas coding HTML/CSS/JS yang diunggah siswa, dan unduh berkas tugas untuk evaluasi.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-purple-500 transition-colors">
                <span>MASUK PENGELOLAAN TUGAS</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
