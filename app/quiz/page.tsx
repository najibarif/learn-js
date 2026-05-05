"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, User, Key, Play } from 'lucide-react';
import Link from 'next/link';

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
      // TRICK: Unlock audio context for the session
      const silentAudio = new Audio('https://raw.githubusercontent.com/anars/blank-audio/master/10-seconds-of-silence.mp3');
      silentAudio.play().catch(() => {});

      const res = await fetch('/api/quiz/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinCode, studentName })
      });
      const data = await res.json();
      
      if (data.success) {
        // Save attemptId + quizId to sessionStorage
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
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
      {/* Absolute Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white/50">
        <Link href="/" className="font-black text-xl text-white tracking-tight hover:text-white/80 transition-colors">
          LearnJS <span className="font-normal text-indigo-300">Quiz</span>
        </Link>
      </header>

      {/* Join Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-50 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative text-center mb-8">
            <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/30 transform rotate-3">
              <Play className="w-10 h-10 ml-1" />
            </div>
            <h1 className="text-2xl font-black text-slate-800">Siap untuk Bermain?</h1>
            <p className="text-slate-500 mt-2 text-sm">Masukkan kode join dari guru Anda.</p>
          </div>

          <form onSubmit={handleJoin} className="relative space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl border border-red-100 text-center">
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
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-mono font-bold tracking-widest text-center text-lg text-indigo-600 uppercase placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
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
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all font-bold text-center text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 mt-4 transition-all hover:scale-[1.02] active:scale-95"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "GABUNG KUIS"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
