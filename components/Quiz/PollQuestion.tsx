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
  
  // Use question.options (New Standard) or fallback to metadata.options (Legacy)
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
              isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-white'
            } ${selectedId !== null ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {/* Progress Fill (Show after voting) */}
            {selectedId !== null && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className="absolute inset-y-0 left-0 bg-indigo-100/50"
              />
            )}

            <div className="relative z-10 px-8 flex items-center justify-between h-full">
              <span className={`text-xl font-bold transition-all ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                {opt.text}
              </span>
              
              {selectedId !== null && (
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-indigo-600">{percentage}%</span>
                  {isSelected && <CheckCircle2 className="w-6 h-6 text-indigo-600" />}
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
