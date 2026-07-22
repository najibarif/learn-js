"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface PollQuestionProps {
  question: any;
  onAnswer: (answer: string) => void;
  totalParticipants?: number;
}

export default function PollQuestion({ question, onAnswer, totalParticipants }: PollQuestionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const choices = question.options || question.metadata?.options?.map((text: string, i: number) => ({ id: i.toString(), text })) || [];
  
  const results = question.metadata?.pollResults || {};
  const totalVotes = Object.values(results).reduce((a: any, b: any) => a + b, 0) as number;
  const divisor = (totalParticipants && totalParticipants > 0) ? totalParticipants : totalVotes;

  const handleSelect = (id: string) => {
    if (selectedId !== null) return;
    setSelectedId(id);
    onAnswer(id);
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {choices.map((opt: any) => {
        const votes = results[opt.id] || 0;
        const percentage = divisor > 0 ? Math.round((votes / divisor) * 100) : 0;
        const isSelected = selectedId === opt.id;

        return (
          <motion.button
            key={opt.id}
            whileHover={{ scale: selectedId === null ? 1.02 : 1 }}
            whileTap={{ scale: selectedId === null ? 0.98 : 1 }}
            onClick={() => handleSelect(opt.id)}
            className={`relative h-20 rounded-[2rem] overflow-hidden border-2 transition-all ${
              isSelected ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
            } ${selectedId !== null ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {selectedId !== null && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                 className="absolute inset-y-0 left-0 bg-teal-100/50 dark:bg-teal-900/30"
              />
            )}

            <div className="relative z-10 px-8 flex items-center justify-between h-full">
              <span className={`text-xl font-bold transition-all ${isSelected ? 'text-teal-800 dark:text-teal-200' : 'text-slate-700 dark:text-slate-200'}`}>
                {opt.text}
              </span>
              
              {selectedId !== null && (
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-teal-600 dark:text-teal-400">{percentage}%</span>
                  {isSelected && <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />}
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
