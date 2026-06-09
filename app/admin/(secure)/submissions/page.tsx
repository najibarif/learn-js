"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Code,
  Users,
  FileText,
  Download,
  Clock,
  ArrowLeft,
  Loader2,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Submission {
  id: string;
  groupName: string;
  members: string[];
  fileName: string;
  fileSize: number;
  filePath: string;
  submittedAt: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        // Sort by submittedAt descending (newest first)
        setSubmissions(data.sort((a: Submission, b: Submission) => 
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ));
      }
    } catch (err) {
      console.error("Gagal memuat tugas siswa:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm shadow-sm transition-colors">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/quiz"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Kembali ke Dashboard Kuis"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Code className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">LearnJS Admin</span>
            <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pengelolaan Tugas</span>
          </div>
          <div className="flex items-center gap-3">
             <Link href="/admin/quiz">
               <Button variant="ghost" className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg">
                 Kuis Admin
               </Button>
             </Link>
             <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Tugas Kelompok Masuk
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Lihat berkas pengerjaan proyek siswa, identifikasi anggota kelompok, dan unduh berkas tugas untuk evaluasi.
            </p>
          </div>

          {/* Quick Stat */}
          <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4 shrink-0 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Kumpulan</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-0.5">{submissions.length}</p>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin text-violet-500 mb-2" />
            <p className="text-sm font-medium">Memuat semua data tugas kelompok...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 transition-colors">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-600 rounded-full flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200">Belum Ada Tugas Masuk</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
              Siswa belum mengunggah tugas kelompok apapun. Link pengunggahan siswa berada di halaman utama /submissions.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">
                    <th className="py-4 px-6">Nama Kelompok</th>
                    <th className="py-4 px-6">Anggota Kelompok</th>
                    <th className="py-4 px-6">File Tugas</th>
                    <th className="py-4 px-6">Ukuran</th>
                    <th className="py-4 px-6">Waktu Kumpul</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold">
                  {submissions.map((sub) => (
                    <tr 
                      key={sub.id} 
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                    >
                      {/* Group Name */}
                      <td className="py-5 px-6 font-extrabold text-slate-900 dark:text-white">
                        {sub.groupName}
                      </td>

                      {/* Group Members Badges */}
                      <td className="py-5 px-6">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {sub.members.map((member, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              {member}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* File Name */}
                      <td className="py-5 px-6 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[150px] font-bold" title={sub.fileName}>
                            {sub.fileName}
                          </span>
                        </div>
                      </td>

                      {/* File Size */}
                      <td className="py-5 px-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {formatBytes(sub.fileSize)}
                      </td>

                      {/* Submitted Time */}
                      <td className="py-5 px-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(sub.submittedAt)}
                        </div>
                      </td>

                      {/* Download Action */}
                      <td className="py-5 px-6 text-center">
                        <a
                          href={sub.filePath}
                          download={sub.fileName}
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 hover:bg-violet-600 dark:hover:bg-violet-600 hover:text-white dark:hover:text-white transition-all shadow-sm cursor-pointer"
                          title={`Unduh file ${sub.fileName}`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors mt-20 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-xs font-normal">
          &copy; {new Date().getFullYear()} LearnJS. Panel Pengelolaan Tugas Kelompok Admin.
        </p>
      </footer>
    </div>
  );
}
