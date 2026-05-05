"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CreateQuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/quiz/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      
      const data = await res.json();
      if (data.success && data.quiz) {
        router.push(`/quiz/admin/builder/${data.quiz.id}`);
      } else {
        alert(data.error || 'Failed to create quiz');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        <Link href="/quiz/admin" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          KEMBALI KE DASHBOARD
        </Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl shadow-indigo-500/5">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Kuis Baru</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Berikan nama dan deskripsi untuk sesi kuis interaktif Anda.</p>
          
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-bold text-slate-700 dark:text-slate-300">Judul Kuis <span className="text-red-500">*</span></label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Ujian Tengah Semester JS"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-bold text-slate-700 dark:text-slate-300">Deskripsi (Opsional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Berikan instruksi tambahan atau penjelasan singkat tentang kuis ini."
                rows={3}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md shadow-indigo-500/20 transition-all"
              disabled={loading || !title.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Mempersiapkan...
                </>
              ) : (
                "Lanjut Buat Soal →"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
