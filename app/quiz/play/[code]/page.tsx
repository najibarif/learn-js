"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/components/Quiz/AudioProvider';
import QuestionRenderer from '@/components/Quiz/QuestionRenderer';
import { Button } from '@/components/ui/button';
import { Loader2, Timer, Trophy, Star, ArrowRight, Zap, Users, CheckCircle2, Flame, XCircle, Medal, Circle, Square, CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import CodeBlock from '@/components/Quiz/CodeBlock';

const OPTION_COLORS = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];

const AVATAR_LIST = [
  { name: 'Felix', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix' },
  { name: 'Aneka', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka' },
  { name: 'Cali', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Cali' },
  { name: 'Jasper', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jasper' },
  { name: 'Pepper', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Pepper' },
  { name: 'Milo', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo' },
  { name: 'Toby', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Toby' },
  { name: 'Luna', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna' },
];

export default function QuizPlayerPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const audio = useAudio();
  
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_LIST[0].url);

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [interactiveData, setInteractiveData] = useState<any>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isShowingPollResults, setIsShowingPollResults] = useState(false);
  
  const [isLobby, setIsLobby] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [lobbyStats, setLobbyStats] = useState({ readyCount: 0, totalCount: 0 });

  const [resultAnalysis, setResultAnalysis] = useState<any>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [flashEffect, setFlashEffect] = useState<'correct' | 'wrong' | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  // Track whether questions have been shuffled already for this session
  const questionsShuffled = { current: false };

  // Seeded shuffle — each user (by attemptId) gets their own consistent order
  const shuffleForUser = (arr: any[], seed: string): any[] => {
    const result = [...arr];
    // Simple numeric seed from attemptId characters
    let s = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    for (let i = result.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      const j = Math.abs(s) % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  // Trigger Confetti and Music when finished
  useEffect(() => {
    if (isFinished && attemptId) {
      audio.playSound('levelup');
      audio.stopBgMusic();
      
      // Redirect directly to my-result page, bypassing the modal
      router.push(`/quiz/my-result/${attemptId}`);
    }
  }, [isFinished, attemptId, router]);

  // Polling Lobby - Only while in lobby
  useEffect(() => {
    const savedAttempt = sessionStorage.getItem('quiz_attempt_id');
    setAttemptId(savedAttempt);

    const checkStatus = async () => {
      // Stop polling if we've already started the game locally or it's finished
      if (isFinished || (!isLobby && isReady)) return;

      try {
        const res = await fetch(`/api/quiz/join?code=${resolvedParams.code}`);
        const data = await res.json();
        if (data.success) {
          setQuiz(data.quiz);
          // Shuffle questions per user (only once, seeded by attemptId)
          if (!questionsShuffled.current && data.questions?.length > 0) {
            const seed = savedAttempt || 'default';
            const shuffled = shuffleForUser(data.questions, seed);
            setQuestions(shuffled);
            questionsShuffled.current = true;
          } else if (!questionsShuffled.current) {
            setQuestions(data.questions);
          }
          setLobbyStats(data.lobbyStats);
          
          if (data.quiz.status === 'live' && isLobby && isReady) {
            setIsLobby(false);
            audio.playBgMusic();
            setTimeLeft(data.questions[0]?.timeLimit || 30);
          }
        }
      } catch (err) {}
      if (loading) setLoading(false);
    };

    checkStatus();
    // Only set interval if we are in lobby
    let interval: any;
    if (isLobby) {
      interval = setInterval(checkStatus, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resolvedParams.code, isLobby, isReady, isFinished]);

  const handleSetReady = async () => {
    try {
      audio.playBgMusic();
      await fetch('/api/ready', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, isReady: true, avatar: selectedAvatar })
      });
      setIsReady(true);
      audio.playSound('click');
    } catch (err) {
      alert("Gagal merubah status kesiapan.");
    }
  };

  // Timer
  useEffect(() => {
    if (loading || isFinished || timeLeft <= 0 || error || isShowingPollResults || isLobby) {
      if (timeLeft === 0 && !isFinished && !error && !isShowingPollResults && !isLobby) handleAnswer(null);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    if (timeLeft <= 10) audio.playSound('tick');
    return () => clearInterval(timer);
  }, [timeLeft, loading, isFinished, error, isShowingPollResults, isLobby]);

  const currentQ = questions[currentIdx];

  const handleSelect = (id: string) => {
    if (isAnswering) return;
    audio.playSound('click');
    if (currentQ.type === 'multi_select') {
      setSelectedAnswers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setSelectedAnswers([id]);
      setTimeout(() => {
        handleAnswer({ optionId: id });
      }, 500);
    }
  };

  const handleInteractiveUpdate = (data: any) => setInteractiveData(data);

  const [milestoneText, setMilestoneText] = useState<string | null>(null);

  const handleNextQuestion = () => {
    const nextIdx = currentIdx + 1;
    
    // Milestone Check
    const progress = (nextIdx / questions.length) * 100;
    if (progress === 50) setMilestoneText("SETENGAH JALAN LAGI! 💪");
    else if (progress === 75) setMilestoneText("SEBENTAR LAGI JUARA! 🏁");

    if (nextIdx < questions.length) {
      setCurrentIdx(nextIdx);
      setTimeLeft(questions[nextIdx].timeLimit);
      setSelectedAnswers([]);
      setInteractiveData(null);
      setIsShowingPollResults(false);
    } else {
      setIsFinished(true);
    }
  };

  // Auto-clear milestone text
  useEffect(() => {
    if (milestoneText) {
      const timer = setTimeout(() => setMilestoneText(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [milestoneText]);

  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const [floatingPoints, setFloatingPoints] = useState<number | null>(null);

  const handleAnswer = async (answerData: any) => {
    if (isAnswering && currentQ.type !== 'multi_select') return;
    setIsAnswering(true);
    
    const isPoll = currentQ.type === 'poll';
    const timeSpent = currentQ.timeLimit - timeLeft;
    
    try {
      const res = await fetch('/api/quiz/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          quizId: quiz.id,
          questionId: currentQ.id,
          optionId: answerData?.optionId || null,
          dynamicAnswer: interactiveData?.dynamicAnswer || answerData?.dynamicAnswer || (currentQ.type === 'multi_select' ? selectedAnswers : null),
          timeSpent
        })
      });
      const data = await res.json();
      if (isPoll) {
        const updatedQuestions = [...questions];
        updatedQuestions[currentIdx].metadata = { ...updatedQuestions[currentIdx].metadata, pollResults: data.latestPollResults };
        setQuestions(updatedQuestions);
        setIsShowingPollResults(true);
        return;
      }
      
      // Determine Feedback Taunt
      if (data.isCorrect) { 
        audio.playSound('correct'); 
        setFlashEffect('correct');
        const pointsAdded = data.newScore - score;
        setFloatingPoints(pointsAdded);
        setScore(data.newScore); 
        setStreak(data.streak); 

        // Cool feedback logic
        if (timeSpent < 3) setFeedbackText("KECEPATAN CAHAYA! ⚡");
        else if (data.streak >= 10) setFeedbackText("ULTRASONIC MODE! 🌌");
        else if (data.streak >= 5) setFeedbackText("TIDAK TERKENDALI! 💎");
        else {
           const phrases = ["MANTAP! 🔥", "GOKIIL! ✨", "JENIUS! 🧠", "LUAR BIASA! 🌟", "TEPAT SEKALI! ✅"];
           setFeedbackText(phrases[Math.floor(Math.random() * phrases.length)]);
        }
      } else { 
        audio.playSound('wrong'); 
        setFlashEffect('wrong');
        setIsShaking(true);
        setStreak(0); 
        const wrongPhrases = ["SAYANG SEKALI! 📚", "HAMPIR BENAR! 😮", "AYO FOKUS! 💪", "TETAP SEMANGAT! 🌈"];
        setFeedbackText(wrongPhrases[Math.floor(Math.random() * wrongPhrases.length)]);
      }

      setTimeout(() => {
         setFlashEffect(null);
         setFeedbackText(null);
         setIsShaking(false);
         setFloatingPoints(null);
         
         handleNextQuestion();
         // Cooldown of 500ms before allowing next click to prevent double-tap bugs
         setTimeout(() => setIsAnswering(false), 500);
      }, 1500);

    } catch (err) { 
      setError("Gagal mengirim jawaban."); 
      setIsAnswering(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-500"><Loader2 className="animate-spin w-12 h-12" /></div>;

  if (isLobby) {
    return (
      <div className="min-h-screen bg-slate-600 flex items-center justify-center p-6 relative overflow-hidden">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[4rem] shadow-2xl max-w-2xl w-full p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">{quiz?.title}</h1>
            <div className="flex items-center justify-center gap-3 text-slate-500 font-bold mb-8">
              <Users className="w-5 h-5 text-indigo-500" />
              <span>{lobbyStats.readyCount} dari {lobbyStats.totalCount} Siswa Siap</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
             <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[2.5rem] border-2 border-slate-100 flex flex-col gap-4 shadow-sm">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                   <Zap className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                   <h3 className="font-black text-slate-800 text-lg italic uppercase tracking-tight">Bonus Cepat</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">Makin <span className="font-bold text-slate-600">cepat jawabnya</span>, makin melimpah poin tambahannya!</p>
                </div>
             </div>

             <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[2.5rem] border-2 border-slate-100 flex flex-col gap-4 shadow-sm">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                   <Trophy className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                   <h3 className="font-black text-slate-800 text-lg italic uppercase tracking-tight">Menang Terus</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">Jawab benar berturut-turut buat <span className="font-bold text-slate-600">lipat gandakan</span> skormu!</p>
                </div>
             </div>

             <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[2.5rem] border-2 border-slate-100 flex flex-col gap-4 shadow-sm">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                   <Star className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                   <h3 className="font-black text-slate-800 text-lg italic uppercase tracking-tight">Poin Pasti</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">Setiap jawaban benar pasti dapet <span className="font-bold text-slate-600">poin besar</span> sebagai modalmu.</p>
                </div>
             </div>

             <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[2.5rem] border-2 border-slate-100 flex flex-col gap-4 shadow-sm">
                <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center">
                   <Flame className="w-8 h-8 text-rose-500" />
                </div>
                <div>
                   <h3 className="font-black text-slate-800 text-lg italic uppercase tracking-tight">Aman & Santai</h3>
                   <p className="text-sm text-slate-500 leading-relaxed">Jangan takut salah! Jawaban salah <span className="font-bold text-slate-500">nggak akan ngurangin</span> skormu.</p>
                </div>
             </div>
          </div>
          {isReady ? (
            <div className="text-center py-8">
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10" /></div>
               <h2 className="text-2xl font-black text-slate-800 mb-6 italic">Kamu Sudah Siap!</h2>
               <div className="w-32 h-32 mx-auto mb-6 bg-slate-50 rounded-full p-2 border-4 border-slate-600"><img src={selectedAvatar} alt="Avatar" className="w-full h-full object-contain" /></div>
               <p className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Menunggu Admin Memulai...</p>
            </div>
          ) : (
             <div className="space-y-10">
                <div>
                   <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 text-center">Pilih Karaktermu</p>
                   <div className="grid grid-cols-4 gap-6">
                      {AVATAR_LIST.map(ava => (
                        <button key={ava.name} onClick={() => setSelectedAvatar(ava.url)} className={`aspect-square p-2 rounded-[2rem] transition-all flex items-center justify-center ${selectedAvatar === ava.url ? 'bg-slate-600 shadow-xl scale-110' : 'bg-slate-100'}`}><img src={ava.url} alt={ava.name} className="w-full h-full object-contain" /></button>
                      ))}
                   </div>
                </div>
                 <button onClick={handleSetReady} className="w-full h-20 rounded-[2.5rem] bg-slate-600 border-b-8 border-slate-700 text-white font-black text-2xl flex items-center justify-center gap-4 transition-all hover:scale-105 active:translate-y-2 active:border-b-0 shadow-xl shadow-slate-600/30">MULAI BERTANDING! <ArrowRight className="w-8 h-8" /></button>
             </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center">
        <div className="max-w-4xl w-full">
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[3rem] p-10 text-center shadow-2xl mb-8 relative">
              <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full p-1 border-4 border-slate-200"><img src={selectedAvatar} alt="Avatar" className="w-full h-full object-contain" /></div>
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h1 className="text-5xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">KERJA BAGUS!</h1>
              <div className="grid grid-cols-2 gap-4 my-8">
                 <div className="bg-slate-50 p-6 rounded-3xl"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Poin</p><p className="text-3xl font-black text-slate-600">{score}</p></div>
                  <div className="bg-slate-50 p-6 rounded-3xl"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Akurasi</p><p className="text-3xl font-black text-slate-600">{resultAnalysis?.accuracy || 0}%</p></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                 <Button 
                   onClick={() => router.push(`/quiz/my-result/${attemptId}`)} 
                    className="flex-1 h-14 bg-slate-600 hover:bg-slate-500 text-white font-black text-base rounded-2xl gap-2"
                 >
                   Lihat Hasil Saya
                 </Button>
                 <Button 
                   onClick={() => router.push('/quiz')} 
                   className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-base rounded-2xl"
                 >
                   Kembali ke Menu
                 </Button>
              </div>
           </motion.div>
           {resultAnalysis?.leaderboard && (
             <div className="bg-slate-600 rounded-[3rem] p-8 shadow-2xl mb-12 text-white">
                <div className="flex items-center gap-4 mb-8"><Trophy className="w-8 h-8 text-amber-300"/><h2 className="text-2xl font-black uppercase italic">Leaderboard Teratas</h2></div>
                <div className="space-y-3">
                   {resultAnalysis.leaderboard.map((player: any, pIdx: number) => (
                      <div key={pIdx} className={`flex items-center justify-between p-4 rounded-[1.5rem] ${player.isCurrent ? 'bg-white text-slate-600 scale-[1.02]' : 'bg-white/10'}`}>
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-sm shrink-0">{pIdx + 1}</div>
                           <div className="w-10 h-10 bg-white/20 rounded-xl p-1 shrink-0 overflow-hidden">
                              <img 
                                src={player.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${player.name}`} 
                                alt="Avatar" 
                                className="w-full h-full object-contain" 
                              />
                           </div>
                           <span className="font-bold truncate max-w-[120px]">{player.name}</span>
                        </div>
                        <div className="font-black text-lg bg-black/20 px-4 py-1 rounded-xl">{player.score}</div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      animate={isShaking ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.3 } } : {}}
      className={`min-h-screen transition-all duration-300 flex flex-col items-center relative overflow-hidden ${
        flashEffect === 'correct' ? 'bg-emerald-600' : 
        flashEffect === 'wrong' ? 'bg-rose-600' : 
        timeLeft <= 10 ? 'animate-[pulse_1s_infinite] bg-black border-x-[20px] border-red-500/10' : 'bg-black'
      }`}
    >
      {/* Centered Live Feedback Overlay */}
      <AnimatePresence>
         {(feedbackText || milestoneText) && (
            <motion.div 
               key={feedbackText || milestoneText}
               initial={{ scale: 0.5, opacity: 0, y: 50, rotate: -10 }}
               animate={{ scale: 1.2, opacity: 1, y: 0, rotate: 5 }}
               exit={{ scale: 2, opacity: 0, y: -100 }}
               className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            >
               <h2 
                 className={`text-5xl md:text-8xl font-black italic tracking-tighter text-center px-6 leading-none select-none ${milestoneText ? 'text-yellow-400' : streak >= 10 ? 'text-cyan-300' : 'text-white'}`}
                 style={{ 
                   WebkitTextStroke: '2px rgba(0,0,0,0.5)',
                   textShadow: '0 20px 80px rgba(0,0,0,0.9), 0 10px 20px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.5)'
                 }}
               >
                  {feedbackText || milestoneText}
               </h2>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Decorative background elements & High-Streak Aura */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000 ${streak >= 10 ? 'bg-cyan-500' : 'bg-slate-500'}`} />
         <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000 ${streak >= 10 ? 'bg-teal-500' : 'bg-slate-400'}`} />
         
         {streak >= 5 && (
            <motion.div 
               animate={{ opacity: [0.1, 0.4, 0.1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className={`absolute inset-0 mix-blend-overlay ${streak >= 10 ? 'bg-gradient-to-t from-cyan-500/20 to-transparent' : 'bg-gradient-to-t from-yellow-500/10 to-transparent'}`}
            />
         )}
      </div>

      <div className="w-full max-w-7xl p-2 md:p-6 flex justify-between items-center z-10 gap-1 md:gap-2">
         <div className="flex items-center gap-1 md:gap-6 min-w-0">
            {/* New Integrated Player Card at Top */}
            <div className="bg-white/10 backdrop-blur-xl p-2 md:p-3 pl-2 md:pl-3 pr-3 md:pr-6 rounded-xl md:rounded-[2rem] border border-white/20 flex items-center gap-2 md:gap-4 shadow-2xl shrink-0">
               <div className="relative">
                  <motion.div 
                     key={score}
                     animate={{ scale: [1, 1.1, 1], filter: flashEffect === 'wrong' ? 'grayscale(100%)' : 'grayscale(0%)' }}
                     className={`w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl p-1 shadow-lg overflow-hidden border-2 transition-all ${
                        streak >= 10 ? 'border-cyan-400' :
                        flashEffect === 'correct' ? 'border-yellow-400' : 
                        'border-white/10'
                     }`}
                  >
                     <img src={selectedAvatar} alt="Player" className="w-full h-full object-contain" />
                  </motion.div>
                  <AnimatePresence>
                     {floatingPoints && (
                        <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -30 }} exit={{ opacity: 0 }} className="absolute -top-2 -right-2 z-50 text-xl font-black text-emerald-400">+{floatingPoints}</motion.div>
                     )}
                  </AnimatePresence>
               </div>
               <div>
                  <p className="text-[7px] md:text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Skor</p>
                  <div className="flex items-center gap-1 md:gap-2">
                     <span className="text-lg md:text-2xl font-black text-white tracking-tighter leading-none">{score}</span>
                     <div className={`w-1 h-1 md:w-2 md:h-2 rounded-full animate-pulse ${streak >= 10 ? 'bg-cyan-400' : streak >= 3 ? 'bg-orange-500' : 'bg-emerald-400'}`} />
                  </div>
               </div>
            </div>

            <div className="hidden md:flex bg-white px-6 py-4 rounded-[2rem] font-black items-center gap-4 shadow-xl">
               <span className="text-slate-400 text-sm">SOAL {currentIdx + 1}/{questions.length}</span>
                   <div className={`w-24 md:w-32 h-3 rounded-full overflow-hidden transition-all duration-500 ${streak >= 10 ? 'bg-cyan-200' : streak >= 3 ? 'bg-orange-200' : 'bg-slate-100'}`}>
                   <motion.div 
                     className={`h-full ${streak >= 10 ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : streak >= 3 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-slate-600'}`} 
                    initial={{ width: 0 }} 
                    animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} 
                    transition={{ type: "spring", stiffness: 50 }} 
                  />
               </div>
            </div>
            
            <AnimatePresence>
               {streak > 1 && (
                  <motion.div 
                    initial={{ scale: 0, x: -10, opacity: 0 }} 
                    animate={{ scale: 1, x: 0, opacity: 1 }} 
                    exit={{ scale: 0, opacity: 0 }} 
                    className={`text-white px-2 md:px-5 py-1.5 md:py-3 rounded-lg md:rounded-2xl font-black shadow-2xl flex items-center gap-1 md:gap-2 border-b-2 md:border-b-4 shrink-0 ${
                      streak >= 10 ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-blue-800' :
                      streak >= 5 ? 'bg-gradient-to-r from-yellow-500 to-amber-600 border-amber-800' : 
                      'bg-gradient-to-r from-orange-600 to-yellow-500 border-orange-800'
                    }`}
                  >
                     <Flame className={`w-3 h-3 md:w-5 md:h-5 fill-white animate-pulse`} />
                     <span className="text-[10px] md:text-base leading-none whitespace-nowrap">
                        <span className="hidden sm:inline">
                           {streak >= 10 ? 'ULTRASONIC ' : streak >= 5 ? 'DIVINE ' : ''}
                        </span>
                        {streak} <span className="hidden sm:inline">STREAK!</span>
                     </span>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
         <div className={`px-3 md:px-8 py-2 md:py-5 rounded-lg md:rounded-[2rem] font-black text-base md:text-2xl shadow-xl transition-all flex items-center gap-1.5 md:gap-3 shrink-0 ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-800'}`}>
            <Timer className="w-4 h-4 md:w-6 md:h-6" /> {timeLeft}s
         </div>
      </div>

      <main className="flex-1 w-full max-w-4xl p-6 flex flex-col justify-center relative z-10">
        <div className="flex justify-center mb-6">
           <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-3 text-white/60">
              <div className={`w-2 h-2 rounded-full animate-pulse ${streak >= 10 ? 'bg-cyan-400' : 'bg-slate-400'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                 {currentQ.type === 'mcq' && "Pilih satu jawaban terbaik"}
                 {currentQ.type === 'boolean' && "Pilih Benar atau Salah"}
                 {currentQ.type === 'multi_select' && "Pilih semua yang benar, lalu klik Kirim"}
                 {currentQ.type === 'fill_in_the_blank' && "Ketik jawaban pada kotak di bawah"}
                 {currentQ.type === 'drag_drop' && "Tarik kartu ke kotak yang tersedia"}
                 {currentQ.type === 'match' && "Klik item kiri, lalu klik pasangannya"}
                 {currentQ.type === 'poll' && "Pilih salah satu untuk voting"}
              </span>
           </div>
        </div>

        <motion.div 
          key={currentIdx}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* New Optimized Logic: Prioritize dedicated code field, then markdown, then regex fallback */}
          {(() => {
            const hasDedicatedCode = !!currentQ.code;
            const hasMarkdownCode = currentQ.text.includes('```');
            const hasRegexCode = /let |const |var |console\.log|function |struct |if \(|for \(/.test(currentQ.text);
            
            // If it's a dedicated code question or detected as code, but NOT a special interactive type like D&D
            if ((hasDedicatedCode || hasMarkdownCode || hasRegexCode) && !['fill_in_the_blank', 'drag_drop'].includes(currentQ.type)) {
              let questionText = currentQ.text;
              let codeContent = currentQ.code || "";

              if (!hasDedicatedCode) {
                if (hasMarkdownCode) {
                  const parts = currentQ.text.split('```');
                  questionText = parts[0];
                  codeContent = parts[1].replace(/^javascript\n|^js\n/, '');
                } else {
                  const splitIdx = currentQ.text.search(/let |const |var |console\.log|function |struct |if \(|for \(/);
                  questionText = currentQ.text.substring(0, splitIdx);
                  codeContent = currentQ.text.substring(splitIdx);
                }
              }

              return (
                <div className="text-center mb-12">
                   <h1 className="text-2xl md:text-4xl font-black text-white mb-8 italic opacity-90 max-w-3xl mx-auto leading-tight">
                      {questionText}
                   </h1>
                   {codeContent && (
                     <div className="w-full max-w-2xl mx-auto text-left shadow-2xl rounded-3xl overflow-hidden border border-white/5">
                        <CodeBlock code={codeContent} />
                     </div>
                   )}
                </div>
              );
            }

            // Default Text-only Question (excluding interactive types that handle their own rendering)
            if (!['fill_in_the_blank', 'drag_drop'].includes(currentQ.type)) {
              return (
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-tight italic">{currentQ.text}</h1>
                </div>
              );
            }
            
            return null;
          })()}

          <QuestionRenderer 
             question={currentQ} 
             onUpdate={handleInteractiveUpdate} 
             onAnswer={data => handleAnswer(currentQ.type === 'poll' ? { optionId: data } : data)} 
             totalParticipants={lobbyStats.totalCount}
          />
        </motion.div>
        
        {(currentQ.type === 'mcq' || currentQ.type === 'boolean' || currentQ.type === 'multi_select') && (
          <div className="grid grid-cols-2 gap-3 md:gap-6 mt-6">
            {currentQ.options.map((opt: any, idx: number) => (
              <button 
                key={opt.id} 
                onClick={() => handleSelect(opt.id)} 
                className={`p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] text-white text-lg md:text-2xl font-black text-left transition-all flex items-center gap-4 ${selectedAnswers.includes(opt.id) ? 'ring-4 md:ring-8 ring-white scale-95' : 'opacity-60 hover:opacity-100 hover:scale-[1.02]'}`} 
                style={{ 
                  backgroundColor: currentQ.type === 'boolean' 
                    ? (opt.text.toLowerCase().includes('benar') || opt.text.toLowerCase().includes('true') ? '#10b981' : '#ef4444') 
                    : OPTION_COLORS[idx % 6] 
                }}
              >
                {currentQ.type === 'multi_select' && (
                  <div className="shrink-0">
                    {selectedAnswers.includes(opt.id) ? <CheckSquare className="w-6 h-6 md:w-8 md:h-8" /> : <Square className="w-6 h-6 md:w-8 md:h-8 opacity-40" />}
                  </div>
                )}
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
        )}

        {(() => {
           let canSubmit = false;
           const type = currentQ.type;
           const data = interactiveData?.dynamicAnswer;
           if (isShowingPollResults) canSubmit = true;
           else if (type === 'multi_select') canSubmit = selectedAnswers.length > 0;
           else if (type === 'fill_in_the_blank') canSubmit = Array.isArray(data) && data.every((v:any) => v && v.toString().trim() !== "") && data.length === (((currentQ.text || "") + (currentQ.code || "")).match(/___/g) || []).length;
           else if (type === 'drag_drop') canSubmit = Array.isArray(data) && data.length === (((currentQ.text || "") + (currentQ.code || "")).match(/___/g) || []).length;
           else if (type === 'match') canSubmit = Array.isArray(data) && data.length === (currentQ.metadata?.pairs?.length || 0);
           if (!isShowingPollResults && !['multi_select', 'fill_in_the_blank', 'drag_drop', 'match'].includes(type)) return null;
           return (
            <button disabled={!canSubmit} onClick={() => isShowingPollResults ? handleNextQuestion() : handleAnswer(null)} className={`mt-6 md:mt-10 w-full h-16 md:h-20 rounded-2xl md:rounded-3xl text-white font-black text-lg md:text-2xl transition-all shadow-xl ${canSubmit ? 'bg-slate-600 border-b-4 md:border-b-8 border-slate-700 hover:bg-slate-700 active:translate-y-1 md:active:translate-y-2 active:border-b-0 shadow-slate-600/30' : 'bg-slate-800 opacity-50 cursor-not-allowed'}`}>
              {isShowingPollResults ? "LANJUTKAN" : "KIRIM JAWABAN"}
            </button>
           );
        })()}
      </main>
    </motion.div>
  );
}
