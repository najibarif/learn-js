"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, X } from 'lucide-react';

interface MatchQuestionProps {
  question: any;
  onAnswer: (answer: any) => void;
  onUpdate: (data: any) => void;
  hideText?: boolean;
}

export default function MatchQuestion({ question, onAnswer, onUpdate, hideText }: MatchQuestionProps) {
  const leftItems = useMemo(() => {
    const items = (question.metadata?.items || []).filter((i: any) => i.side === 'left');
    return [...items].sort(() => Math.random() - 0.5);
  }, [question.id]);

  const rightItems = useMemo(() => {
    const items = (question.metadata?.items || []).filter((i: any) => i.side === 'right');
    return [...items].sort(() => Math.random() - 0.5);
  }, [question.id]);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Array<{ leftId: string, rightId: string }>>([]);

  const handleLeftClick = (id: string) => {
    // If already matched, remove it
    if (matches.some(m => m.leftId === id)) {
      const newMatches = matches.filter(m => m.leftId !== id);
      setMatches(newMatches);
      onUpdate({ dynamicAnswer: newMatches });
      return;
    }
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (!selectedLeft) return;
    
    const newMatches = [...matches.filter(m => m.rightId !== id), { leftId: selectedLeft, rightId: id }];
    setMatches(newMatches);
    setSelectedLeft(null);
    onUpdate({ dynamicAnswer: newMatches });
  };

  const COLORS = [
    { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-300' },
    { bg: 'bg-rose-500', border: 'border-rose-400', text: 'text-rose-300' },
    { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-300' },
    { bg: 'bg-sky-500', border: 'border-sky-400', text: 'text-sky-300' },
    { bg: 'bg-fuchsia-500', border: 'border-fuchsia-400', text: 'text-fuchsia-300' },
    { bg: 'bg-indigo-500', border: 'border-indigo-400', text: 'text-indigo-300' },
  ];

  return (
    <div className="w-full flex flex-col gap-10">
      
      <div className="flex gap-2 md:gap-10 justify-center">
        {/* Left Column */}
        <div className="flex flex-col gap-3 flex-1 max-w-[250px]">
          {leftItems.map((item: any) => {
            const matchIndex = matches.findIndex(m => m.leftId === item.id);
            const match = matchIndex !== -1;
            const isSelected = selectedLeft === item.id;
            const color = match ? COLORS[matchIndex % COLORS.length] : null;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 5 }}
                onClick={() => handleLeftClick(item.id)}
                className={`min-h-[3.5rem] md:min-h-[4rem] h-auto py-3 px-4 md:px-6 rounded-2xl md:rounded-3xl font-black flex items-center justify-between border-2 md:border-4 transition-all text-sm md:text-lg shadow-xl ${
                  match && color
                    ? `${color.bg} ${color.border} text-white` 
                    : isSelected 
                      ? 'bg-white border-white text-indigo-600 scale-105 ring-4 ring-white/50' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <span className="text-left leading-tight break-words">{item.text}</span>
                {match && <Link2 className="w-5 h-5 opacity-80 shrink-0 ml-2" />}
              </motion.button>
            );
          })}
        </div>

        {/* Connections Indicator */}
        <div className="flex flex-col justify-center text-white/20">
           <Link2 className="w-10 h-10 md:w-12 md:h-12" />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3 flex-1 max-w-[250px]">
          {rightItems.map((item: any) => {
            const matchIndex = matches.findIndex(m => m.rightId === item.id);
            const match = matchIndex !== -1;
            const color = match ? COLORS[matchIndex % COLORS.length] : null;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: -5 }}
                onClick={() => handleRightClick(item.id)}
                className={`min-h-[3.5rem] md:min-h-[4rem] h-auto py-3 px-4 md:px-6 rounded-2xl md:rounded-3xl font-black flex items-center justify-between border-2 md:border-4 transition-all text-sm md:text-lg shadow-xl ${
                  match && color
                    ? `${color.bg} ${color.border} text-white` 
                    : selectedLeft 
                      ? 'bg-white/5 border-white/10 text-white border-dashed animate-pulse ring-2 ring-white/20 hover:bg-white/20' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <span className="text-left leading-tight break-words">{item.text}</span>
                {match && <Link2 className="w-5 h-5 opacity-80 shrink-0 ml-2" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Summary View */}
      {matches.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {matches.map((m, idx) => {
            const color = COLORS[idx % COLORS.length];
            return (
              <div key={idx} className={`px-4 py-2 rounded-2xl text-[10px] md:text-xs font-black text-white flex items-center gap-2 border-2 ${color.bg} ${color.border} shadow-lg`}>
                <span className="max-w-[120px] line-clamp-2 leading-tight text-left">{leftItems.find((li: any) => li.id === m.leftId)?.text}</span> 
                <Link2 className="w-3 h-3 md:w-4 md:h-4 opacity-80 shrink-0" /> 
                <span className="max-w-[120px] line-clamp-2 leading-tight text-left">{rightItems.find((ri: any) => ri.id === m.rightId)?.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
