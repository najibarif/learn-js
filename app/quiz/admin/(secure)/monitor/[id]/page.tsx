"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Users, ArrowLeft, Loader2, Play, Flame, BarChart, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AdminMonitorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [quizInfo, setQuizInfo] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/quiz/${resolvedParams.id}/leaderboard`);
      const data = await res.json();
      if (data.success) {
        setAttempts(data.attempts);
      }
      
      // Update quiz info to check status
      const qRes = await fetch(`/api/quiz/${resolvedParams.id}`);
      const qData = await qRes.json();
      if (qData.success) setQuizInfo(qData.quiz);
      
    } catch (err) {
      console.error("Failed to fetch live leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [resolvedParams.id]);

  const startQuiz = async () => {
    setIsStarting(true);
    try {
       const res = await fetch(`/api/quiz/${resolvedParams.id}/start`, { method: 'POST' });
       if (res.ok) {
         setQuizInfo({ ...quizInfo, status: 'live' });
       }
    } catch (err) {
       alert("Gagal memulai kuis.");
    } finally {
       setIsStarting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-12 h-12 animate-spin text-indigo-500" /></div>;

  const sortedAttempts = [...attempts].sort((a,b) => b.totalScore - a.totalScore);
  const top3 = sortedAttempts.slice(0, 3);
  const rest = sortedAttempts.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
           <div className="flex items-center gap-4">
              <Link href="/quiz/admin" className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                 <ArrowLeft className="w-6 h-6 text-slate-500" />
              </Link>
              <div>
                 <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    BATTLE MONITOR 
                    {quizInfo?.status === 'waiting' ? (
                      <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase">Lobby</span>
                    ) : (
                      <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full animate-pulse uppercase">Live</span>
                    )}
                 </h1>
                 <p className="text-slate-500 font-bold">{quizInfo?.title} • JOIN CODE: <span className="text-indigo-600 text-2xl font-black ml-1">{quizInfo?.joinCode}</span></p>
              </div>
           </div>
           
           <div className="flex gap-4">
              {quizInfo?.status === 'waiting' && attempts.length > 0 && (
                <Button 
                  onClick={startQuiz} 
                  disabled={isStarting}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-10 h-14 rounded-2xl shadow-xl shadow-emerald-500/20 gap-3 text-lg animate-bounce"
                >
                  {isStarting ? <Loader2 className="animate-spin" /> : <Play className="fill-current" />}
                  MULAI KUIS SEKARANG
                </Button>
              )}
              <div className="bg-white dark:bg-slate-900 px-8 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                 <Users className="text-indigo-500 w-8 h-8" />
                 <div className="leading-tight">
                    <p className="text-3xl font-black">{attempts.length}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Siswa</p>
                 </div>
              </div>
           </div>
        </header>

        <div className="space-y-4">
          <AnimatePresence>
            {attempts.length === 0 ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-100">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                    <BarChart className="w-20 h-20 text-slate-100 mx-auto mb-6" />
                  </motion.div>
                  <p className="text-slate-300 font-black text-2xl">Bagikan Kode Kuis untuk Memulai!</p>
                  <p className="text-slate-400 mt-2 font-medium">Satu per satu siswa akan muncul di sini.</p>
               </motion.div>
            ) : (
              <div className="space-y-8 w-full max-w-4xl mx-auto">
                {/* Podium (Top 3) */}
                {top3.length > 0 && (
                  <div className="bg-slate-950 rounded-[4rem] p-6 md:p-12 shadow-[0_0_100px_-20px_rgba(79,70,229,0.3)] border-4 border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/10 pointer-events-none" />
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
                    
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 text-center flex items-center justify-center gap-3 mb-24 relative z-10">
                      <Medal className="w-8 h-8 text-indigo-500" /> LIVE LEADERBOARD
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-end justify-center min-h-[250px] relative z-10">
                      
                      {/* Rank 2 */}
                      {top3[1] && (
                        <motion.div layout key={top3[1].id} className="flex flex-col items-center order-2 md:order-1">
                          <div className="w-20 h-20 rounded-full border-4 border-slate-300 dark:border-slate-500 bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-2xl shadow-lg mb-4 overflow-hidden relative">
                            {top3[1].avatar ? <img src={top3[1].avatar} alt={top3[1].studentName} className="w-full h-full object-contain p-1" /> : "2"}
                            {top3[1].avatar && <div className="absolute -bottom-1 -right-1 bg-slate-500 text-white text-[10px] font-black px-2 py-0.5 rounded-tl-lg rounded-br-lg">2</div>}
                          </div>
                          <p className="font-bold text-slate-700 dark:text-slate-200 truncate w-full text-center text-xl">{top3[1].studentName}</p>
                          <p className="font-black text-indigo-600 dark:text-indigo-400 text-xl">{top3[1].totalScore}</p>
                          <div className="w-full h-32 bg-gradient-to-b from-slate-400/30 to-slate-600/10 rounded-t-2xl mt-4 hidden md:block border-t-4 border-slate-400/40 shadow-[0_-20px_40px_-15px_rgba(148,163,184,0.1)]" />
                        </motion.div>
                      )}

                      {/* Rank 1 */}
                      {top3[0] && (
                        <motion.div layout key={top3[0].id} className="flex flex-col items-center order-1 md:order-2 -mt-12 relative z-10">
                          <motion.div 
                            animate={{ rotate: [-5, 5, -5] }} 
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-12 text-yellow-400"
                          >
                            <Trophy className="w-12 h-12 fill-current drop-shadow-xl" />
                          </motion.div>
                          <div className="w-28 h-28 rounded-full border-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/40 flex items-center justify-center font-bold text-yellow-600 dark:text-yellow-400 text-3xl shadow-2xl shadow-yellow-500/40 mb-4 overflow-hidden relative">
                            {top3[0].avatar ? <img src={top3[0].avatar} alt={top3[0].studentName} className="w-full h-full object-contain p-1" /> : "1"}
                            {top3[0].avatar && <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-[12px] font-black px-2.5 py-0.5 rounded-tl-lg rounded-br-lg">1</div>}
                          </div>
                          <p className="font-black text-2xl text-slate-800 dark:text-slate-100 truncate w-full text-center">{top3[0].studentName}</p>
                          <p className="font-black text-indigo-600 dark:text-indigo-400 text-3xl drop-shadow-sm">{top3[0].totalScore}</p>
                          <div className="w-full h-40 bg-gradient-to-b from-yellow-500/30 to-amber-600/10 border-t-4 border-yellow-400 dark:border-yellow-500/60 rounded-t-2xl mt-4 hidden md:block relative overflow-hidden shadow-[0_-20px_50px_-15px_rgba(234,179,8,0.2)]">
                             <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-400/20" />
                          </div>
                        </motion.div>
                      )}

                      {/* Rank 3 */}
                      {top3[2] && (
                        <motion.div layout key={top3[2].id} className="flex flex-col items-center order-3 md:order-3">
                          <div className="w-16 h-16 rounded-full border-4 border-amber-600/50 bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center font-bold text-amber-700 dark:text-amber-500 text-xl shadow-md mb-4 overflow-hidden relative">
                            {top3[2].avatar ? <img src={top3[2].avatar} alt={top3[2].studentName} className="w-full h-full object-contain p-1" /> : "3"}
                            {top3[2].avatar && <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-tl-lg rounded-br-lg">3</div>}
                          </div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center text-lg">{top3[2].studentName}</p>
                          <p className="font-black text-indigo-600 dark:text-indigo-400 text-lg">{top3[2].totalScore}</p>
                          <div className="w-full h-20 bg-gradient-to-b from-amber-600/30 to-amber-900/10 rounded-t-2xl mt-4 hidden md:block border-t-4 border-amber-600/50 shadow-[0_-20px_40px_-15px_rgba(217,119,6,0.1)]" />
                        </motion.div>
                      )}

                    </div>
                  </div>
                )}

                {/* Rest of the Leaderboard */}
                {rest.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border-4 border-slate-100 dark:border-slate-800 overflow-hidden">
                    <AnimatePresence>
                      {rest.map((stu, idx) => (
                        <motion.div 
                          key={stu.id} 
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-5 px-8 border-b-2 border-slate-50 last:border-0 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                        >
                          <div className="flex items-center gap-6">
                            <span className="w-10 text-center font-black text-slate-300 text-xl">{idx + 4}</span>
                            {stu.avatar ? (
                               <div className="w-14 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-sm">
                                 <img src={stu.avatar} alt={stu.studentName} className="w-full h-full object-contain p-1" />
                               </div>
                            ) : (
                               <div className="w-14 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-sm opacity-50">
                                 <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${stu.studentName}`} alt={stu.studentName} className="w-full h-full object-contain p-1" />
                               </div>
                            )}
                            <div>
                              <div className="font-black text-slate-700 dark:text-slate-300 text-xl uppercase tracking-tight">
                                {stu.studentName}
                              </div>
                              {stu.streak > 0 && (
                                <div className="flex items-center gap-1 mt-1 text-orange-500 font-bold text-[10px] uppercase tracking-wider">
                                   <Flame className="w-3 h-3 fill-current" /> {stu.streak} Streak
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="font-black text-slate-800 dark:text-slate-200 text-2xl">
                            {stu.totalScore.toLocaleString()}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
