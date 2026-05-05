"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Loader2, Users, CheckCircle2, XCircle, 
  Clock, BarChart3, ChevronDown, ChevronRight, Search 
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDetailedResults({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`/api/quiz/admin/results/${quizId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setData(data);
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;
  }

  const results = data?.results || [];
  const filteredResults = results.filter((r: any) => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-6">
            <Link href="/quiz/admin">
               <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-100 dark:border-slate-800">
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
               </div>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analisis Hasil</h1>
              <p className="text-indigo-600 font-bold mt-1 uppercase text-xs tracking-widest">{data?.quiz?.title}</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama siswa..."
              className="w-full pl-12 pr-4 h-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-500"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">Total Peserta</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{results.length}</p>
              </div>
           </div>
           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-500"><CheckCircle2 className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">Rata-rata Skor</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white">
                  {results.length ? Math.round(results.reduce((a:any, b:any) => a + b.totalScore, 0) / results.length) : 0}
                </p>
              </div>
           </div>
        </div>

        {/* Student List */}
        <div className="space-y-4">
          {filteredResults.map((student: any, sIdx: number) => {
            const isExpanded = expandedStudent === student.id;
            const accuracy = Math.round((student.analysis.filter((a: any) => a.isCorrect).length / data.questions.length) * 100);

            return (
              <div key={student.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
                <div 
                  onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                  className="p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl">
                      {sIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white capitalize">{student.studentName}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-indigo-600 font-bold text-sm">{student.totalScore} PTS</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className={`text-sm font-bold ${accuracy > 70 ? 'text-emerald-500' : accuracy > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                          Akurasi {accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <div className="hidden md:flex flex-col items-end mr-4">
                        <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-black">Lihat Detail</p>
                     </div>
                     <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                        {isExpanded ? <ChevronDown className="w-6 h-6 text-slate-400" /> : <ChevronRight className="w-6 h-6 text-slate-400" />}
                     </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10"
                    >
                      <div className="p-8 space-y-4">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Detail Jawaban Siswa</p>
                        <div className="space-y-4">
                          {student.analysis.map((ans: any, qIdx: number) => (
                            <div key={qIdx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 items-start md:items-center">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${ans.isCorrect ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                {ans.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                              </div>
                              
                              <div className="flex-1">
                                <p className="text-xs font-bold text-slate-400 mb-1">Soal {qIdx + 1} • {ans.questionType.toUpperCase()}</p>
                                <p className="font-bold text-slate-800 dark:text-slate-200">{ans.questionText}</p>
                              </div>

                              <div className="flex gap-10">
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jawaban Siswa</p>
                                  <div className={`font-black text-sm ${ans.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {typeof ans.studentAnswer === 'string' ? ans.studentAnswer : JSON.stringify(ans.studentAnswer)}
                                  </div>
                                </div>
                                <div className="hidden md:block">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kunci Jawaban</p>
                                  <p className="font-bold text-sm text-slate-700 dark:text-slate-300">{ans.correctAnswer}</p>
                                </div>
                                <div className="hidden lg:block text-right">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Durasi</p>
                                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-600">
                                    <Clock className="w-3 h-3" /> {ans.timeSpent}s
                                  </div>
                                </div>
                              </div>

                              {/* Explanation section removed */}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
