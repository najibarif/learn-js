"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, User, Key, Play } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function QuizJoinPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!joinCode || !studentName) {
      setError("Silakan isi Kode Kuis dan Nama Pemain.");
      return;
    }

    setLoading(true);
    try {
      const silentAudio = new Audio('https://raw.githubusercontent.com/anars/blank-audio/master/10-seconds-of-silence.mp3');
      silentAudio.play().catch(() => {});

      const res = await fetch('/api/quiz/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinCode, studentName })
      });
      const data = await res.json();
      
      if (data.success) {
        sessionStorage.setItem('quiz_attempt_id', data.attemptId);
        sessionStorage.setItem('quiz_id', data.quizId);
        router.push(`/quiz/play/${joinCode}`);
      } else {
        setError(data.error || "Gagal bergabung ke kuis. Cek kembali kode Anda.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Pastikan server berjalan.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 md:p-10 relative overflow-hidden shadow-lg">
            <div className="relative text-center mb-8">
              <div className="w-20 h-20 bg-slate-600 text-white rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Play className="w-10 h-10 ml-1" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Siap untuk Bermain?</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Masukkan kode join dari guru Anda.</p>
            </div>

            <form onSubmit={handleJoin} className="relative space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-base font-medium p-3 rounded-lg border border-red-100 dark:border-red-900 text-center">
                  {error}
                </div>
              )}
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="6 Digit Kode Kuis"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  autoComplete="off"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 focus:bg-white dark:focus:bg-slate-950 transition-all font-mono font-bold tracking-widest text-center text-lg text-slate-600 dark:text-slate-200 uppercase placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                  disabled={loading}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  autoComplete="off"
                  className="w-full h-14 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 focus:bg-white dark:focus:bg-slate-950 transition-all font-bold text-center text-slate-800 dark:text-slate-200 placeholder:text-slate-400 placeholder:font-normal"
                  disabled={loading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-bold text-lg mt-4 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "GABUNG KUIS"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
