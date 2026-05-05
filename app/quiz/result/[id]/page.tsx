"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Medal, ArrowLeft, Loader2, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LeaderboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState("Papan Peringkat");
  const [attempts, setAttempts] = useState<any[]>([]);
  const [myAttemptId, setMyAttemptId] = useState<string | null>(null);

  useEffect(() => {
    // Check if the viewer is a student who just finished
    const savedAttemptId = sessionStorage.getItem('quiz_attempt_id');
    setMyAttemptId(savedAttemptId);

    // Always sync quiz_id from URL so my-result page can navigate back correctly
    sessionStorage.setItem('quiz_id', resolvedParams.id);

    // Fetch quiz info (for title)
    fetch(`/api/quiz/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuizTitle(data.quiz.title);
        }
      })
      .catch(console.error);

    // Fetch leaderboard
    fetch(`/api/quiz/${resolvedParams.id}/leaderboard`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAttempts(data.attempts);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;
  }

  const myAttempt = attempts.find(a => a.id === myAttemptId);
  const top3 = attempts.slice(0, 3);
  const rest = attempts.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">

      {/* ── Sticky Top Nav ── */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Link
            href="/quiz"
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Menu</span>
          </Link>

          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Papan Peringkat</p>

          {myAttemptId && (
            <Link
              href={`/quiz/my-result/${myAttemptId}`}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4 py-2 rounded-xl transition-all text-xs shadow-lg shadow-indigo-500/20"
            >
              Lihat Hasil Saya
            </Link>
          )}
          {!myAttemptId && <div className="w-20" />}
        </div>
      </div>

      {/* Top Header */}
      <div className="bg-indigo-600 text-white pt-10 pb-24 px-6 rounded-b-[3rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-5 pattern-grid-lg" />
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
            <Trophy className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-center mb-2 tracking-tight">Papan Peringkat Akhir</h1>
          <p className="text-indigo-200 font-medium text-lg text-center">{quizTitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-16 px-4 space-y-8 relative z-20">
        
        {/* If Student just finished, show their personal score briefly */}
        {myAttempt && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border-4 border-indigo-100 dark:border-indigo-900/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full flex items-center justify-center font-black text-2xl">
                  ✓
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Skor Akhir Anda, {myAttempt.studentName}</p>
                  <div className="text-4xl font-black text-slate-800 dark:text-slate-100 mt-1">
                    {myAttempt.totalScore} <span className="text-lg text-slate-400 font-bold">PTS</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <Link href="/quiz">
                  <Button className="rounded-xl px-6 h-12 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold w-full">
                    Main Lagi
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Podium (Top 3) */}
        {top3.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center flex items-center justify-center gap-2 mb-20">
              <Medal className="w-5 h-5 text-indigo-500" /> TOKOH TERATAS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-end justify-center min-h-[200px]">
              
              {/* Rank 2 */}
              {top3[1] && (
                <div className="flex flex-col items-center order-2 md:order-1">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-2xl shadow-lg mb-4 overflow-hidden relative">
                    {top3[1].avatar ? <img src={top3[1].avatar} alt={top3[1].studentName} className="w-full h-full object-contain p-1" /> : "2"}
                    {top3[1].avatar && <div className="absolute -bottom-1 -right-1 bg-slate-400 text-white text-[8px] font-black px-1.5 py-0.5 rounded-tl-lg rounded-br-lg">2</div>}
                  </div>
                  <p className="font-bold text-slate-700 dark:text-slate-200 truncate w-full text-center">{top3[1].studentName}</p>
                  <p className="font-black text-indigo-600 dark:text-indigo-400">{top3[1].totalScore}</p>
                  <div className="w-full h-24 bg-slate-200 dark:bg-slate-800 rounded-t-xl mt-4 opacity-50 hidden md:block" />
                </div>
              )}

              {/* Rank 1 */}
              {top3[0] && (
                <div className="flex flex-col items-center order-1 md:order-2 -mt-8 relative z-10">
                  <div className="absolute -top-10 text-yellow-400">
                    <Trophy className="w-10 h-10 fill-current" />
                  </div>
                  <div className="w-20 h-20 rounded-full border-4 border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center font-bold text-yellow-600 dark:text-yellow-400 text-3xl shadow-xl shadow-yellow-500/20 mb-4 overflow-hidden relative">
                    {top3[0].avatar ? <img src={top3[0].avatar} alt={top3[0].studentName} className="w-full h-full object-contain p-1" /> : "1"}
                    {top3[0].avatar && <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-[10px] font-black px-2 py-0.5 rounded-tl-lg rounded-br-lg">1</div>}
                  </div>
                  <p className="font-black text-lg text-slate-800 dark:text-slate-100 truncate w-full text-center">{top3[0].studentName}</p>
                  <p className="font-black text-indigo-600 text-xl">{top3[0].totalScore}</p>
                  <div className="w-full h-32 bg-yellow-100/50 dark:bg-yellow-900/20 border-t-2 border-yellow-200 dark:border-yellow-700/50 rounded-t-xl mt-4 hidden md:block" />
                </div>
              )}

              {/* Rank 3 */}
              {top3[2] && (
                <div className="flex flex-col items-center order-3 md:order-3">
                  <div className="w-14 h-14 rounded-full border-4 border-amber-600/50 bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center font-bold text-amber-700 dark:text-amber-500 text-xl shadow-md mb-4 overflow-hidden relative">
                    {top3[2].avatar ? <img src={top3[2].avatar} alt={top3[2].studentName} className="w-full h-full object-contain p-1" /> : "3"}
                    {top3[2].avatar && <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-tl-lg rounded-br-lg">3</div>}
                  </div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center">{top3[2].studentName}</p>
                  <p className="font-black text-indigo-600 dark:text-indigo-400">{top3[2].totalScore}</p>
                  <div className="w-full h-16 bg-slate-100 dark:bg-slate-800/80 rounded-t-xl mt-4 opacity-50 hidden md:block" />
                </div>
              )}

            </div>
          </div>
        )}

        {/* Rest of the Leaderboard */}
        {rest.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            {rest.map((attempt, idx) => (
              <div key={attempt.id} className="flex items-center justify-between p-4 px-6 border-b border-slate-50 last:border-0 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-8 text-center font-bold text-slate-400">{idx + 4}</span>
                  {attempt.avatar && (
                     <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                       <img src={attempt.avatar} alt={attempt.studentName} className="w-full h-full object-contain p-0.5" />
                     </div>
                  )}
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    {attempt.studentName}
                    {attempt.id === myAttemptId && <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">KAMU</span>}
                  </div>
                </div>
                <div className="font-black text-slate-800 dark:text-slate-200">
                  {attempt.totalScore}
                </div>
              </div>
            ))}
          </div>
        )}

        {attempts.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-500">Belum ada peserta</h3>
            <p className="text-slate-400">Jadilah yang pertama untuk menyelesaikan kuis ini!</p>
          </div>
        )}


      </div>
    </div>
  );
}
