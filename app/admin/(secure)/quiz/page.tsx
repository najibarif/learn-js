"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PlusCircle, Settings, Users, PlayCircle, BarChart3, Trash2, Loader2, Copy, Pencil, ArrowLeft, Code } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

interface Quiz {
  id: string;
  title: string;
  description: string;
  joinCode: string;
  isActive: boolean;
  createdAt: string;
}

interface QuizWithStats extends Quiz {
  questionCount: number;
  attemptCount: number;
}

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState<QuizWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz/admin/list');
      const data = await res.json();
      if (data.success) setQuizzes(data.quizzes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleCopy = async (id: string) => {
    try {
      const res = await fetch(`/api/quiz/${id}/copy`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchQuizzes(); // Refresh list
      } else {
        alert("Gagal menyalin kuis.");
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    }
  };

  const handleEdit = async (quiz: Quiz) => {
    const newTitle = prompt("Masukkan judul kuis baru:", quiz.title);
    if (!newTitle || newTitle === quiz.title) return;

    try {
      const res = await fetch(`/api/quiz/${quiz.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });
      const data = await res.json();
      if (data.success) {
        fetchQuizzes(); // Refresh list
      }
    } catch (err) {
      alert("Gagal memperbarui judul.");
    }
  };

  const handleDelete = async (quizId: string, title: string) => {
    if (!confirm(`Hapus kuis "${title}"? Semua soal dan data peserta akan ikut terhapus.`)) return;

    setDeletingId(quizId);
    try {
      const res = await fetch(`/api/quiz/${quizId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setQuizzes(prev => prev.filter(q => q.id !== quizId));
      } else {
        alert(data.error || 'Gagal menghapus kuis.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setDeletingId(null);
    }
  };

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
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pengelolaan Kuis</span>
          </div>
          <div className="flex items-center gap-3">
             <Link href="/admin/submissions">
                <Button variant="ghost" className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg">
                  Tugas Admin
                </Button>
             </Link>
             <ThemeToggle />
             <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
             <Button 
               variant="outline" 
               onClick={async () => {
                 await fetch('/api/quiz/admin/logout', { method: 'POST' });
                 window.location.href = '/admin/quiz/login';
               }}
               className="text-slate-500 border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl px-4 h-9 text-xs font-bold transition-all"
             >
               SIGN OUT
             </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Quiz Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">Kelola kuis, lihat hasil, dan pantau aktivitas siswa.</p>
          </div>
          <Link href="/admin/quiz/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-xl h-11 px-6 shadow-md shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-xs font-bold">
              <PlusCircle className="h-4 w-4" />
              BUAT KUIS BARU
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum ada Kuis</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Anda belum membuat kuis apa pun. Mulai buat kuis pertama Anda sekarang juga menggunakan tombol di pojok kanan atas!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/quiz/builder/${quiz.id}`} className="text-slate-300 hover:text-indigo-600 transition-colors" title="Edit Soal & Kuis">
                        <Pencil className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleCopy(quiz.id)}
                        className="text-slate-300 hover:text-blue-500 transition-colors"
                        title="Salin kuis"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id, quiz.title)}
                        disabled={deletingId === quiz.id}
                        className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Hapus kuis"
                      >
                        {deletingId === quiz.id
                          ? <Loader2 className="h-5 w-5 animate-spin" />
                          : <Trash2 className="h-5 w-5" />
                        }
                      </button>
                    </div>
                  </div>
                  <h3 
                    onClick={() => handleEdit(quiz)}
                    className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
                    title="Klik untuk ubah nama kuis"
                  >
                    {quiz.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                    {quiz.description || 'Tidak ada deskripsi'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mt-auto">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <PlayCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Soal</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">{quiz.questionCount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Peserta</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">{quiz.attemptCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Join Code</p>
                      <p className="font-mono font-black tracking-[0.2em] text-indigo-600 dark:text-indigo-400 text-xl leading-none">
                        {quiz.joinCode}
                      </p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Status</p>
                       <p className="text-xs font-bold text-emerald-500">Siap Mulai</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/admin/quiz/live/${quiz.id}`} className="flex-[2]">
                      <Button className="w-full rounded-2xl h-12 bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 font-black shadow-lg shadow-emerald-500/20 transition-all">
                        <PlayCircle className="w-5 h-5 mr-2" /> LOBBY & MULAI
                      </Button>
                    </Link>
                    <Link href={`/admin/quiz/results/${quiz.id}`} className="flex-1">
                      <Button variant="ghost" className="w-full rounded-2xl h-12 border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 bg-white shadow-sm">
                        Hasil
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
