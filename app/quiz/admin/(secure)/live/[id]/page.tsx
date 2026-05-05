"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Play, ArrowLeft, CheckCircle2, Circle, Trophy, Star } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLiveDashboard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // We reuse the join GET logic mostly but we might need a specific admin view
        // For now, let's use a general fetch for quiz details
        const res = await fetch(`/api/quiz/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success) {
          setQuiz(data.quiz);
          
          // Poll for attempts
          const attRes = await fetch(`/api/quiz/${resolvedParams.id}/leaderboard`);
          const attData = await attRes.json();
          if (attData.success) {
            setAttempts(attData.attempts);
          }
        }
      } catch (err) {}
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [resolvedParams.id]);

  const handleStartGame = async () => {
    setStarting(true);
    try {
      await fetch(`/api/quiz/${resolvedParams.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'live' })
      });
      // Stay on dashboard to monitor progress
    } catch (err) {
      alert("Gagal memulai kuis.");
    } finally {
      setStarting(false);
    }
  };

  const handleEndGame = async () => {
    if (!confirm("Akhiri kuis untuk semua siswa?")) return;
    await fetch(`/api/quiz/${resolvedParams.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'finished' })
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white"><Loader2 className="animate-spin w-10 h-10" /></div>;

  const readyCount = attempts.filter(a => a.isReady).length;
  const isAllReady = attempts.length > 0 && readyCount === attempts.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/quiz/admin" className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft /></Link>
          <div>
            <h1 className="text-xl font-bold">{quiz?.title}</h1>
            <div className="flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${quiz?.status === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
               <p className="text-xs font-bold uppercase text-slate-400 tracking-widest">{quiz?.status || 'Waiting'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {quiz?.status !== 'live' ? (
             <Button 
               onClick={handleStartGame} 
               disabled={starting}
               className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 rounded-xl font-black gap-2 shadow-xl shadow-indigo-500/20"
             >
               {starting ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5" />} MULAI SEKARANG
             </Button>
          ) : (
             <div className="flex items-center gap-3">
               <Link href={`/quiz/admin/monitor/${resolvedParams.id}`} target="_blank">
                  <Button className="h-12 px-6 rounded-xl font-black flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 border-none transition-all hover:scale-105 active:scale-95">
                    <Trophy className="w-5 h-5" /> PAPAN PERINGKAT
                 </Button>
               </Link>
               <Button onClick={handleEndGame} variant="destructive" className="h-12 px-8 rounded-xl font-black shadow-lg">AKHIRI KUIS</Button>
             </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Card */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
              <h3 className="text-slate-400 font-black text-xs uppercase tracking-widest mb-6">Stats Live</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-4xl font-black text-slate-800 dark:text-white">{attempts.length}</p>
                    <p className="text-sm font-bold text-slate-400">Total Siswa Join</p>
                 </div>
                 <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-2xl font-black text-indigo-600">{readyCount}</p>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-tight">Siswa Sudah Klik Siap</p>
                 </div>
                 {isAllReady && (
                   <div className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm">Semua siswa sudah siap!</span>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-slate-500 font-black text-xs uppercase tracking-widest mb-4">Kode Join</h3>
                 <p className="text-6xl font-black tracking-tighter">{quiz?.joinCode}</p>
              </div>
              <Users className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 opacity-10" />
           </div>
        </div>

        {/* Students List */}
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-8 border border-slate-100 min-h-[500px]">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-800 dark:text-white">Daftar Peserta</h2>
                 <div className="bg-slate-100 px-4 py-1 rounded-full text-xs font-black text-slate-400 uppercase tracking-widest">{attempts.length} Peserta</div>
              </div>

               {attempts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                   <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
                   </div>
                   <p className="text-slate-400 font-bold">Menunggu siswa masuk...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {attempts.map((att, index) => (
                      <LeaderboardItem 
                        key={att.id} 
                        att={att} 
                        index={index} 
                        quizStatus={quiz.status} 
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}

function LeaderboardItem({ att, index, quizStatus }: { att: any, index: number, quizStatus: string }) {
  const [prevRank, setPrevRank] = useState(index);
  const [showOvertake, setShowOvertake] = useState(false);

  useEffect(() => {
    if (index < prevRank) {
      setShowOvertake(true);
      const timer = setTimeout(() => setShowOvertake(false), 2500);
      return () => clearTimeout(timer);
    }
    setPrevRank(index);
  }, [index, prevRank]);

  return (
    <motion.div 
      layout
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ 
        layout: { type: "spring", stiffness: 350, damping: 30 },
        scale: { duration: 0.2 },
        opacity: { duration: 0.2 }
      }}
      className={`relative p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all duration-500 ${
        att.isReady 
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900 shadow-xl shadow-emerald-500/5' 
          : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 opacity-60'
      }`}
    >
      <div className="flex items-center gap-6 relative z-10">
         <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center font-black text-xl shadow-lg relative overflow-hidden ${att.isReady ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
            {att.avatar ? (
              <img src={att.avatar} alt={att.studentName} className="w-full h-full object-contain" />
            ) : (
              <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${att.studentName}`} alt={att.studentName} className="w-full h-full object-contain opacity-50" />
            )}
         </div>
         <div>
            <p className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">{att.studentName}</p>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{att.isReady ? 'READY' : 'WAITING'}</p>
         </div>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <AnimatePresence>
          {showOvertake && (
            <motion.div 
              initial={{ scale: 0, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-orange-500 text-white px-4 py-2 rounded-full font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              🚀 NAIK PERINGKAT!
            </motion.div>
          )}
        </AnimatePresence>

        {att.isReady && <CheckCircle2 className="text-emerald-500 w-8 h-8" />}
        
        {quizStatus === 'live' && (
           <div className="text-right min-w-[120px]">
              <div className="flex items-center justify-end gap-2 text-indigo-600 dark:text-indigo-400 font-black">
                 <motion.span 
                   key={att.totalScore}
                   initial={{ scale: 1.5, y: -10 }}
                   animate={{ scale: 1, y: 0 }}
                   className="text-3xl"
                 >
                   {att.totalScore.toLocaleString()}
                 </motion.span>
                 <span className="text-xs mt-2 uppercase tracking-tighter">pts</span>
              </div>
              <div className="flex gap-1 justify-end mt-1">
                 {Array.from({ length: Math.min(3, att.streak) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                    </motion.div>
                 ))}
              </div>
           </div>
        )}
      </div>
    </motion.div>
  );
}
