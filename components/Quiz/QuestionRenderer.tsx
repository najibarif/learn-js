"use client";

import PollQuestion from './PollQuestion';
import DragDropQuestion from './DragDropQuestion';
import MatchQuestion from './MatchQuestion';
import FillInBlankQuestion from './FillInBlankQuestion';
import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed } from 'lucide-react';

interface QuestionRendererProps {
  question: any;
  onAnswer: (answer: any) => void;
  onUpdate: (data: any) => void;
  currentAnswer?: any;
  hideText?: boolean;
  totalParticipants?: number;
}

export default function QuestionRenderer({ question, onAnswer, onUpdate, currentAnswer, hideText, totalParticipants }: QuestionRendererProps) {
  // Check if it's an advanced type
  if (question.type === 'poll') return <PollQuestion question={question} onAnswer={onAnswer} totalParticipants={totalParticipants} />;
  if (question.type === 'drag_drop') return <DragDropQuestion question={question} onAnswer={onAnswer} onUpdate={onUpdate} hideText={hideText} />;
  if (question.type === 'match') return <MatchQuestion question={question} onAnswer={onAnswer} onUpdate={onUpdate} hideText={hideText} />;
  if (question.type === 'fill_in_the_blank') return <FillInBlankQuestion question={question} onAnswer={onAnswer} onUpdate={onUpdate} hideText={hideText} />;

  // Default / Placeholder for not-yet-implemented advanced types
  const isLegacy = ['mcq', 'boolean', 'multi_select'].includes(question.type);
  if (!isLegacy) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200">
         <CircleDashed className="w-12 h-12 text-slate-300 animate-spin mb-4" />
         <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Tipe Soal "{question.type}" Belum Tersedia</p>
      </div>
    );
  }

  // Handle Legacy UI (Standard Layouts)
  return null; // The main page will handle the standard UI
}
