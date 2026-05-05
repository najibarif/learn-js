"use client";

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, Home, Trophy, Target, Zap,
  Clock, ChevronDown, ChevronUp, BookOpen, Loader2, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import CodeBlock from '@/components/Quiz/CodeBlock';

const TYPE_LABEL: Record<string, string> = {
  mcq: 'Pilihan Ganda',
  boolean: 'Benar / Salah',
  multi_select: 'Pilihan Jamak',
  fill_in_the_blank: 'Isi Titik-Titik',
  drag_drop: 'Susun Urutan',
  match: 'Cocokkan',
  poll: 'Opini',
};

function QuestionCard({ result, index }: { result: any; index: number }) {
  const [open, setOpen] = useState(false);
  const isPoll = result.questionType === 'poll';

  // Determine card style
  const cardStyle = !result.isAnswered
    ? 'border-slate-700 bg-slate-800/60'
    : isPoll
    ? 'border-slate-600 bg-slate-800/60'
    : result.isCorrect
    ? 'border-emerald-700/60 bg-emerald-900/20'
    : 'border-red-800/60 bg-red-900/20';

  // Status icon
  const StatusIcon = !result.isAnswered
    ? () => (
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-slate-400" />
        </div>
      )
    : isPoll
    ? () => (
        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5 text-slate-300" />
        </div>
      )
    : result.isCorrect
    ? () => <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
    : () => <XCircle className="w-10 h-10 text-red-400 shrink-0" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`rounded-2xl border-2 overflow-hidden ${cardStyle}`}
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <StatusIcon />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Soal {result.questionNumber}
            </span>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
              {TYPE_LABEL[result.questionType] ?? result.questionType}
            </span>
            {isPoll && (
              <span className="text-[10px] bg-slate-600/80 text-slate-400 px-2 py-0.5 rounded-full font-semibold italic">
                tidak dinilai
              </span>
            )}
          </div>
          <p className="font-semibold text-white text-sm line-clamp-2 leading-snug">
            {result.questionText}
          </p>
          {result.code && (
            <div className="mt-2 text-left shadow-lg rounded-xl overflow-hidden border border-white/5 pointer-events-none">
               <CodeBlock code={result.code} />
            </div>
          )}
        </div>

        <div className="shrink-0 text-slate-500">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-3 border-t border-white/5 pt-4">
              {/* Submitted answer */}
              <div className="rounded-xl bg-slate-900 p-4 border border-slate-700">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  Jawaban Kamu
                </p>
                {!result.isAnswered ? (
                  <p className="text-slate-500 italic text-sm">Tidak dijawab</p>
                ) : isPoll ? (
                  <p className="text-slate-300 text-sm font-semibold">
                    {result.submittedAnswer || 'Sudah dijawab'}
                  </p>
                ) : (
                  <p className={`font-bold text-sm ${result.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.submittedAnswer || '(tidak ada teks jawaban)'}
                  </p>
                )}
              </div>

              {/* Correct answer — only for non-poll wrong answers */}
              {!isPoll && !result.isCorrect && result.isAnswered && (
                <div className="rounded-xl bg-emerald-950/50 p-4 border border-emerald-800/60">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">
                    Jawaban Benar
                  </p>
                  <p className="font-bold text-sm text-emerald-300">
                    {result.correctAnswer || '—'}
                  </p>
                </div>
              )}

              {/* Explanation */}
              {result.explanation && (
                <div className="rounded-xl bg-indigo-950/50 p-4 border border-indigo-800/60">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">
                    Penjelasan
                  </p>
                  <p className="text-sm text-indigo-200 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MyResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const quizId = sessionStorage.getItem('quiz_id');
    if (!quizId) {
      setError('Sesi tidak ditemukan. Silakan ikuti kuis terlebih dahulu.');
      setLoading(false);
      return;
    }

    fetch(`/api/quiz/${quizId}/my-result?attemptId=${attemptId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setData(d);
        else setError(d.error ?? 'Gagal memuat hasil.');
      })
      .catch(() => setError('Gagal memuat hasil. Periksa koneksi Anda.'))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
          <p className="text-slate-500 font-medium text-sm">Memuat hasil...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4 p-8 text-center">
        <XCircle className="w-16 h-16 text-red-400" />
        <p className="text-xl font-bold text-white">{error ?? 'Terjadi kesalahan.'}</p>
        <Link href="/quiz" className="text-indigo-400 underline font-semibold text-sm">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const { quiz, attempt, results, summary } = data;

  const accuracyColor =
    summary.accuracy >= 80 ? 'text-emerald-400' :
    summary.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400';

  const statsCards = [
    { icon: CheckCircle2, label: 'Benar', value: summary.correct, color: 'text-emerald-400', ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/10' },
    { icon: XCircle, label: 'Salah', value: summary.incorrect, color: 'text-red-400', ring: 'ring-red-500/30', bg: 'bg-red-500/10' },
    { icon: Target, label: 'Akurasi', value: `${summary.accuracy}%`, color: accuracyColor, ring: 'ring-indigo-500/30', bg: 'bg-indigo-500/10' },
    { icon: Zap, label: 'Streak', value: attempt.streak, color: 'text-yellow-400', ring: 'ring-yellow-500/30', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Sticky Top Nav ── */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <Link
            href="/quiz"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Beranda</span>
          </Link>

          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Hasil Kuis</p>

          <Link
            href={`/quiz/result/${quiz.id}`}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4 py-2 rounded-xl transition-all text-xs shadow-lg shadow-indigo-500/20"
          >
            Papan Peringkat
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="bg-gradient-to-b from-indigo-900 to-slate-950 pt-12 pb-10 px-4">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4"
          >
            {attempt.avatar ? (
              <div className="w-20 h-20 rounded-[1.5rem] bg-white/10 p-1 border-4 border-white/20 shadow-2xl">
                <img src={attempt.avatar} alt={attempt.studentName} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                {attempt.studentName.charAt(0).toUpperCase()}
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-black text-white tracking-tight"
          >
            {attempt.studentName}
          </motion.h1>
          <p className="text-indigo-300 text-sm font-medium mt-1 mb-6">{quiz.title}</p>

          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl px-12 py-6 border border-white/15 shadow-xl w-full max-w-xs"
          >
            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Skor</p>
            <p className="text-5xl font-black text-white leading-none">{attempt.totalScore.toLocaleString()}</p>
            <p className="text-indigo-400 text-xs font-semibold mt-1">poin</p>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-xl mx-auto px-4 pb-24">

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {statsCards.map(({ icon: Icon, label, value, color, ring, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`rounded-2xl ring-1 ${ring} ${bg} p-3 flex flex-col items-center gap-1.5`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <p className={`text-xl font-black leading-none ${color}`}>{value}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider text-center">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest">Rincian Jawaban</h2>
          <span className="ml-auto text-[10px] bg-slate-800 text-slate-500 px-2.5 py-1 rounded-full font-bold">
            {summary.total} Soal
          </span>
        </div>

        {/* Question cards */}
        <div className="flex flex-col gap-2.5">
          {results.map((result: any, i: number) => (
            <QuestionCard key={result.questionId} result={result} index={i} />
          ))}
        </div>

        {/* bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
