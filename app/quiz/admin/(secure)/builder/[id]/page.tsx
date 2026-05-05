"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, ArrowLeft, Clock, Loader2, CheckCircle2, LayoutGrid, Link2, Type, AlertCircle, BarChart3, Copy, Code2, Terminal } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionType } from '@/lib/db';

interface QuestionState {
  id: any;
  text: string;
  type: QuestionType;
  timeLimit: number;
  mediaUrl?: string;
  options: any[];
  explanation?: string;
  code?: string;
  metadata?: any;
}

export default function QuizBuilder({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [quizDetails, setQuizDetails] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionState[]>([]);

  useEffect(() => {
    fetch('/api/quiz/' + resolvedParams.id)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuizDetails(data.quiz);
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
          } else {
            addQuestion();
          }
        }
      })
      .catch(() => router.push('/quiz/admin'))
      .finally(() => setFetching(false));
  }, [resolvedParams.id, router]);

  const addQuestion = () => {
    const newQ: QuestionState = {
      id: crypto.randomUUID(),
      text: "",
      type: "mcq",
      timeLimit: 30,
      options: [
        { id: crypto.randomUUID(), text: "", isCorrect: true },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
      ],
      metadata: {}
    };
    setQuestions(prev => [...prev, newQ]);
  };

  const duplicateQuestion = (index: number) => {
    const q = questions[index];
    const newQ: QuestionState = {
      ...JSON.parse(JSON.stringify(q)), // Deep clone content
      id: crypto.randomUUID(), // New ID for question
    };
    // New IDs for options to avoid conflicts
    newQ.options = (newQ.options || []).map(o => ({ ...o, id: crypto.randomUUID() }));
    
    const newQs = [...questions];
    newQs.splice(index + 1, 0, newQ);
    setQuestions(newQs);
  };

  const getPlaceholder = (type: QuestionType) => {
    switch(type) {
      case 'mcq':
      case 'boolean':
      case 'multi_select': return 'Tulis pertanyaan Anda di sini...';
      case 'fill_in_the_blank': return 'Tulis kalimat dengan ___ di bagian yang ingin diisi (contoh: Ibukota Indonesia adalah ___)';
      case 'drag_drop': return 'Tulis petunjuk kode atau kalimat interaktif di sini... Gunakan ___ untuk membuat slot kosong.';
      case 'match': return 'Tulis instruksi untuk memasangkan item di sini...';
      case 'poll': return 'Tulis topik jajak pendapat atau pertanyaan diskusi di sini...';
      default: return 'Tulis soal di sini...';
    }
  };

  const updateQuestionType = (qIndex: number, type: QuestionType) => {
    const newQs = [...questions];
    newQs[qIndex].type = type;
    
    if (type === 'boolean') {
      newQs[qIndex].options = [
        { id: crypto.randomUUID(), text: "Benar", isCorrect: true },
        { id: crypto.randomUUID(), text: "Salah", isCorrect: false }
      ];
      newQs[qIndex].metadata = {};
    } else if (type === 'mcq' || type === 'multi_select') {
      // Reset back to empty multiple choices
      newQs[qIndex].options = [
        { id: crypto.randomUUID(), text: "", isCorrect: true },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
      ];
      newQs[qIndex].metadata = {};
    } else if (type === 'drag_drop') {
      const tid = "slot-0";
      newQs[qIndex].metadata = {
        items: [{ id: crypto.randomUUID(), text: "", correctTargetId: tid }],
        targets: [{ id: tid, text: "Slot 1" }] 
      };
    } else if (type === 'match') {
      const idL = crypto.randomUUID();
      const idR = crypto.randomUUID();
      newQs[qIndex].metadata = {
        items: [{ id: idL, text: "", side: "left" }, { id: idR, text: "", side: "right" }],
        pairs: [{ id: idL, right: idR }]
      };
    } else if (type === 'fill_in_the_blank') {
       const count = (newQs[qIndex].text.match(/___/g) || []).length;
       newQs[qIndex].options = Array.from({ length: Math.max(1, count) }, () => ({ id: crypto.randomUUID(), text: "", isCorrect: true }));
       newQs[qIndex].metadata = {};
    } else if (type === 'poll') {
      newQs[qIndex].options = [
        { id: crypto.randomUUID(), text: "Pilihan A" },
        { id: crypto.randomUUID(), text: "Pilihan B" }
      ];
      newQs[qIndex].metadata = {};
    } else {
      newQs[qIndex].metadata = {};
    }
    setQuestions(newQs);
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/${resolvedParams.id}/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions })
      });
      const data = await res.json();
      if (data.success) {
        setShowSuccessModal(true);
      }
    } catch (err) { alert("Gagal menyimpan kuis."); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-indigo-500 w-8 h-8"/></div>;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/quiz/admin" className="p-2 -ml-2 rounded-full hover:bg-slate-100"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-slate-800 dark:text-slate-100">{quizDetails?.title}</h1>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 font-bold px-8 shadow-lg shadow-indigo-500/20">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE QUIZ
        </Button>
      </header>

      <main className="max-w-4xl mx-auto py-10 px-4 space-y-12">
        {questions.map((q, qIndex) => {
          const gapCount = (q.text.match(/___/g) || []).length;
          
          return (
            <div key={q.id} className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">{qIndex + 1}</div>
                  <select 
                     className="bg-slate-100 dark:bg-slate-800 border-none text-sm font-black rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                     value={q.type}
                     onChange={(e) => updateQuestionType(qIndex, e.target.value as QuestionType)}
                  >
                     <option value="mcq">Multiple Choice</option>
                     <option value="boolean">True / False</option>
                     <option value="multi_select">Multi-select</option>
                     <option value="fill_in_the_blank">Fill in the Blank</option>
                     <option value="drag_drop">Drag & Drop</option>
                     <option value="match">Matching</option>
                     <option value="poll">Poll (Jajak Pendapat)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={() => duplicateQuestion(qIndex)}
                     className="text-slate-300 hover:text-indigo-600 p-2 transition-colors"
                     title="Duplikat Soal"
                   >
                     <Copy className="w-6 h-6" />
                   </button>
                   <button 
                     onClick={() => { const n = [...questions]; n.splice(qIndex, 1); setQuestions(n); }} 
                     className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                     title="Hapus Soal"
                   >
                     <Trash2 className="w-6 h-6" />
                   </button>
                </div>
              </div>

              <div className="space-y-8">
                <textarea 
                  className="w-full text-2xl md:text-3xl font-black bg-transparent border-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-700 resize-none min-h-[120px]"
                  placeholder={getPlaceholder(q.type)}
                  value={q.text}
                   onChange={(e) => {
                      const val = e.target.value;
                      const newQs = [...questions];
                      newQs[qIndex].text = val;
                      
                      const combinedText = val + (newQs[qIndex].code || "");
                      const totalCount = (combinedText.match(/___/g) || []).length;

                      // Auto-sync for Fill in the Blank
                      if (newQs[qIndex].type === 'fill_in_the_blank') {
                         if (totalCount !== newQs[qIndex].options.length) {
                            newQs[qIndex].options = Array.from({ length: Math.max(1, totalCount) }, (_, i) => 
                               newQs[qIndex].options[i] || { id: crypto.randomUUID(), text: "", isCorrect: true }
                            ).slice(0, Math.max(1, totalCount));
                         }
                      }
                      // Auto-sync for Drag & Drop targets
                      if (newQs[qIndex].type === 'drag_drop') {
                         newQs[qIndex].metadata.targets = Array.from({ length: totalCount }, (_, i) => ({ id: `slot-${i}`, text: `Slot ${i+1}` }));
                      }
                      setQuestions(newQs);
                   }}
                />

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-[0.2em]">
                    <Code2 className="w-4 h-4" /> Snippet Kode (Opsional)
                  </div>
                  <textarea 
                    className="w-full bg-slate-900 text-indigo-300 p-6 rounded-2xl font-mono text-sm border-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                    placeholder="Tulis kode di sini... (contoh: let x = 10;)"
                    value={q.code || ""}
                    onChange={(e) => {
                       const val = e.target.value;
                       const newQs = [...questions];
                       newQs[qIndex].code = val;
                       
                       const combinedText = (newQs[qIndex].text || "") + val;
                       const totalCount = (combinedText.match(/___/g) || []).length;

                       // Sync for Fill in the Blank
                       if (newQs[qIndex].type === 'fill_in_the_blank') {
                          if (totalCount !== newQs[qIndex].options.length) {
                             newQs[qIndex].options = Array.from({ length: Math.max(1, totalCount) }, (_, i) => 
                                newQs[qIndex].options[i] || { id: crypto.randomUUID(), text: "", isCorrect: true }
                             ).slice(0, Math.max(1, totalCount));
                          }
                       }
                       // Sync for Drag & Drop
                       if (newQs[qIndex].type === 'drag_drop') {
                          newQs[qIndex].metadata.targets = Array.from({ length: totalCount }, (_, i) => ({ id: `slot-${i}`, text: `Slot ${i+1}` }));
                       }
                       setQuestions(newQs);
                    }}
                  />
                </div>

                {/* Question Type Specific UIs remain the same... */}
                {/* [MCQ / Boolean UI] */}
                {(q.type === 'mcq' || q.type === 'boolean' || q.type === 'multi_select') && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, oIdx) => (
                         <div key={opt.id} className="group relative">
                            <input 
                               className={`w-full p-6 pr-14 rounded-2xl border-2 font-bold transition-all text-slate-900 dark:text-white ${opt.isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-slate-100 dark:bg-slate-950/50 dark:border-slate-800'}`}
                               placeholder={`Pilihan ${String.fromCharCode(65+oIdx)}...`}
                               value={opt.text}
                               onChange={(e) => {
                                  const newQs = [...questions];
                                  newQs[qIndex].options[oIdx].text = e.target.value;
                                  setQuestions(newQs);
                               }}
                            />
                            <button 
                               onClick={() => {
                                  const newQs = [...questions];
                                  if (q.type !== 'multi_select') {
                                     newQs[qIndex].options.forEach(o => o.isCorrect = false);
                                     newQs[qIndex].options[oIdx].isCorrect = true;
                                  } else {
                                     newQs[qIndex].options[oIdx].isCorrect = !newQs[qIndex].options[oIdx].isCorrect;
                                  }
                                  setQuestions(newQs);
                               }}
                               className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${opt.isCorrect ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-300'}`}
                            >
                               <CheckCircle2 className="w-5 h-5" />
                            </button>
                         </div>
                      ))}
                      {(q.type === 'multi_select' || q.type === 'mcq') && q.options.length < 6 && (
                         <Button 
                            variant="ghost" 
                            onClick={() => {
                               const newQs = [...questions];
                               newQs[qIndex].options.push({ id: crypto.randomUUID(), text: "", isCorrect: false });
                               setQuestions(newQs);
                            }} 
                            className="w-full h-14 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all font-black uppercase tracking-widest text-xs mt-4"
                         >
                            + TAMBAH OPSI {q.type === 'mcq' ? 'PILIHAN GANDA' : 'MULTI-SELECT'}
                         </Button>
                      )}
                   </div>
                )}

                {/* [Fill in the Blank UI] */}
                {q.type === 'fill_in_the_blank' && (
                   <div className="bg-purple-50 dark:bg-purple-950/20 p-8 rounded-[2rem] border border-purple-100">
                      <div className="flex items-center gap-3 mb-6 font-black text-purple-600 text-sm uppercase tracking-widest"><Type className="w-5 h-5"/> Kunci Jawaban ({(q.text + (q.code || "")).match(/___/g)?.length || 0} slot)</div>
                      <div className="space-y-4">
                         {q.options.map((opt, oIdx) => (
                            <div key={opt.id} className="flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                               <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-black text-xs">{oIdx + 1}</span>
                               <input 
                                  className="flex-1 bg-transparent border-none focus:ring-0 font-bold"
                                  placeholder="Tulis jawaban benar..."
                                  value={opt.text}
                                  onChange={(e) => {
                                     const newQs = [...questions];
                                     newQs[qIndex].options[oIdx].text = e.target.value;
                                     setQuestions(newQs);
                                  }}
                               />
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                {/* [Polling Opsi] */}
                {q.type === 'poll' && (
                   <div className="bg-blue-50 dark:bg-blue-950/20 p-8 rounded-[2rem] border border-blue-100">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 font-black text-blue-600 text-sm uppercase tracking-widest"><BarChart3 className="w-5 h-5"/> Pilihan Polling</div>
                        <Button 
                           variant="ghost" 
                           onClick={() => {
                                const n = [...questions];
                                n[qIndex].options.push({ id: crypto.randomUUID(), text: "" });
                                setQuestions(n);
                           }} 
                           className="text-blue-600 hover:bg-blue-100/50 font-black text-xs px-4 rounded-xl border border-blue-200 border-dashed"
                        >
                           + TAMBAH PILIHAN 
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {q.options.map((opt, oIdx) => (
                            <div key={opt.id} className="flex gap-3 items-center bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl shadow-sm group">
                               <input 
                                  className="flex-1 bg-transparent border-none focus:ring-0 font-bold"
                                  placeholder={`Jawaban ${oIdx + 1}...`}
                                  value={opt.text}
                                  onChange={(e) => {
                                     const n = [...questions];
                                     n[qIndex].options[oIdx].text = e.target.value;
                                     setQuestions(n);
                                  }}
                               />
                               <button onClick={() => {
                                  const n = [...questions];
                                  n[qIndex].options.splice(oIdx, 1);
                                  setQuestions(n);
                               }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4"/></button>
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                {/* [Drag & Drop UI - Simplified] */}
                {q.type === 'drag_drop' && (
                   <div className="bg-orange-50 dark:bg-orange-950/20 p-8 rounded-[2rem] border border-orange-100 space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-6 font-black text-orange-600 text-sm uppercase tracking-widest"><LayoutGrid className="w-5 h-5"/> Kunci Jawaban ({(q.text + (q.code || "")).match(/___/g)?.length || 0} Slot)</div>
                        <div className="space-y-4">
                           {Array.from({ length: (q.text + (q.code || "")).match(/___/g)?.length || 0 }).map((_, gIdx) => {
                              const targetId = `slot-${gIdx}`;
                              // Find item assigned to this slot
                              const item = q.metadata?.items?.find((i: any) => i.correctTargetId === targetId);
                              return (
                                <div key={targetId} className="flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                                   <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-black text-xs">{gIdx + 1}</span>
                                   <input 
                                      className="flex-1 bg-transparent border-none focus:ring-0 font-bold"
                                      placeholder="Tulis jawaban yang benar untuk slot ini..."
                                      value={item?.text || ""}
                                      onChange={(e) => {
                                         const n = [...questions];
                                         if (!n[qIndex].metadata.items) n[qIndex].metadata.items = [];
                                         const existingIdx = n[qIndex].metadata.items.findIndex((i: any) => i.correctTargetId === targetId);
                                         if (existingIdx > -1) {
                                            n[qIndex].metadata.items[existingIdx].text = e.target.value;
                                         } else {
                                            n[qIndex].metadata.items.push({ id: crypto.randomUUID(), text: e.target.value, correctTargetId: targetId });
                                         }
                                         setQuestions(n);
                                      }}
                                   />
                                </div>
                              );
                           })}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-orange-100">
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3 font-black text-slate-400 text-sm uppercase tracking-widest"><AlertCircle className="w-5 h-5"/> Item Pengecoh (Optional)</div>
                           <Button 
                              variant="ghost" 
                              onClick={() => {
                                 const n = [...questions];
                                 if (!n[qIndex].metadata.items) n[qIndex].metadata.items = [];
                                 n[qIndex].metadata.items.push({ id: crypto.randomUUID(), text: "", correctTargetId: "" });
                                 setQuestions(n);
                              }} 
                              className="text-orange-600 hover:bg-orange-100/50 font-black text-xs px-4 rounded-xl border border-orange-200 border-dashed"
                           >
                              + TAMBAH PENGECOH
                           </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {(q.metadata?.items || []).filter((i: any) => !i.correctTargetId).map((item: any, distIdx: number) => (
                              <div key={item.id} className="flex gap-3 items-center bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl shadow-sm group">
                                 <input 
                                    className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-sm text-slate-500"
                                    placeholder="Tulis jawaban salah..."
                                    value={item.text}
                                    onChange={(e) => {
                                       const n = [...questions];
                                       const idx = n[qIndex].metadata.items.findIndex((i: any) => i.id === item.id);
                                       n[qIndex].metadata.items[idx].text = e.target.value;
                                       setQuestions(n);
                                    }}
                                 />
                                 <button onClick={() => {
                                    const n = [...questions];
                                    const idx = n[qIndex].metadata.items.findIndex((i: any) => i.id === item.id);
                                    n[qIndex].metadata.items.splice(idx, 1);
                                    setQuestions(n);
                                 }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4"/></button>
                              </div>
                           ))}
                        </div>
                      </div>
                   </div>
                )}

                {/* [Match Pairs UI] */}
                {q.type === 'match' && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-8 rounded-[2rem] border border-emerald-100 space-y-4">
                     <div className="flex items-center gap-3 mb-2 font-black text-emerald-600 text-sm uppercase tracking-widest"><Link2 className="w-5 h-5"/> Daftar Pasangan</div>
                     {q.metadata?.pairs?.map((p: any, pIdx: number) => {
                        const left = q.metadata.items.find((i: any) => i.id === p.id);
                        const right = q.metadata.items.find((i: any) => i.id === p.right);
                        return (
                          <div key={pIdx} className="flex items-center gap-4">
                             <input 
                               className="flex-1 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-slate-900 dark:text-white font-bold text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                               placeholder="Item Kiri..."
                               value={left?.text} 
                               onChange={(e) => {
                                  const n = [...questions];
                                  const it = n[qIndex].metadata.items.find((i: any) => i.id === p.id);
                                  it.text = e.target.value;
                                  setQuestions(n);
                               }} 
                             />
                             <div className="bg-emerald-100 p-2 rounded-lg"><Link2 className="w-5 h-5 text-emerald-500" /></div>
                             <input 
                               className="flex-1 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-slate-900 dark:text-white font-bold text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                               placeholder="Pasangan Kanan..."
                               value={right?.text} 
                               onChange={(e) => {
                                  const n = [...questions];
                                  const it = n[qIndex].metadata.items.find((i: any) => i.id === p.right);
                                  it.text = e.target.value;
                                  setQuestions(n);
                               }} 
                             />
                          </div>
                        );
                     })}
                     <Button 
                        variant="ghost" 
                        className="w-full h-14 rounded-2xl border-2 border-dashed border-emerald-100 text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-all font-black mt-4 uppercase tracking-widest text-xs shadow-sm" 
                        onClick={() => {
                           const n = [...questions];
                           const idL = crypto.randomUUID(); const idR = crypto.randomUUID();
                           n[qIndex].metadata.items.push({ id: idL, text: "", side: "left" }, { id: idR, text: "", side: "right" });
                           n[qIndex].metadata.pairs.push({ id: idL, right: idR });
                           setQuestions(n);
                        }}
                     >
                        + TAMBAH PASANGAN
                     </Button>
                  </div>
                )}

                {/* Explanation section removed */}

                <div className="flex items-center gap-6 text-slate-400 font-bold text-sm">
                  <div className="flex items-center gap-2"><Clock className="w-5 h-5"/> 
                     <select value={q.timeLimit} onChange={(e) => { const n = [...questions]; n[qIndex].timeLimit = parseInt(e.target.value); setQuestions(n); }} className="bg-transparent border-none font-black text-slate-800 dark:text-slate-200">
                        <option value={10}>10s</option><option value={20}>20s</option><option value={30}>30s</option><option value={60}>60s</option><option value={120}>120s</option>
                     </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <Button 
           onClick={addQuestion} 
           variant="outline" 
           className="w-full h-32 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-xl font-black gap-4 uppercase tracking-widest shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 group"
        >
           <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
              <Plus className="w-8 h-8" /> 
           </div>
           TAMBAH PERTANYAAN
        </Button>
      </main>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              onClick={() => setShowSuccessModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800 text-center"
            >
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4 italic uppercase tracking-tight">Kuis Disimpan!</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                Yeay! Semua soal berhasil diperbarui. Kuis kamu siap dimainkan oleh para siswa.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => router.push('/quiz/admin')}
                  className="h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg gap-2 shadow-xl shadow-indigo-600/20"
                >
                   Ke Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setShowSuccessModal(false)}
                  className="h-14 rounded-2xl text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                   Lanjut Edit
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
