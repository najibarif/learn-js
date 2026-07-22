"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FillInBlankQuestionProps {
  question: any;
  onAnswer: (data: any) => void;
  onUpdate: (data: any) => void;
  hideText?: boolean;
}

export default function FillInBlankQuestion({ question, onAnswer, onUpdate }: FillInBlankQuestionProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = { ...answers, [index]: value };
    setAnswers(newAnswers);
    
    const sourceText = (question.text || "") + " " + (question.code || "");
    const targetCount = (sourceText.match(/___/g) || []).length;
    const finalArray = Array.from({ length: targetCount }, (_, i) => newAnswers[i] || "");
    
    onUpdate({ dynamicAnswer: finalArray });
  };

  const textIsCode = !question.code && /let |const |var |console\.log|function |struct |if \(|```/.test(question.text || "");
  const hasDedicatedCode = !!question.code;

  let blankGlobalIndex = 0;

  const renderTextParts = (text: string, isCodeFormat: boolean) => {
    if (!text) return null;
    const lines = text.split('\n');
    
    return (
      <div className={`flex flex-col gap-1 w-full ${isCodeFormat ? 'font-mono text-left items-start' : 'items-center justify-center mb-6'}`}>
        {lines.map((line: string, lineIdx: number) => {
          const parts = line.split(/(___)/);
          return (
            <div key={lineIdx} className={`flex flex-wrap items-center gap-x-0 min-h-[1.5rem] ${!isCodeFormat && 'justify-center text-center'}`}>
              {parts.map((part: string, i: number) => {
                if (part === "___") {
                  const currentIdx = blankGlobalIndex++;
                  return (
                    <div key={i} className="relative inline-block mx-1">
                      <input
                        type="text"
                        value={answers[currentIdx] || ""}
                        onChange={(e) => handleInputChange(currentIdx, e.target.value)}
                        placeholder="..."
                        className={`h-7 md:h-9 bg-white/10 border-b-2 border-teal-500 rounded px-2 transition-all text-center focus:outline-none focus:border-white font-bold ${isCodeFormat ? 'w-16 md:w-20 text-teal-400 text-sm' : 'w-32 md:w-48 text-teal-100 text-2xl'}`}
                      />
                    </div>
                  );
                }
                const formattedPart = part.startsWith('```') ? part.replace(/```[a-z]*\n|```/g, '') : part;
                if (!formattedPart.trim() && isCodeFormat && parts.length > 1) return <span key={i} className="inline-block w-4" />;
                if (!formattedPart && isCodeFormat) return null;
                
                return (
                  <span key={i} className={`${isCodeFormat ? '' : 'text-white drop-shadow-md text-2xl md:text-4xl font-black py-2 italic'}`}>
                    {isCodeFormat ? (
                      <SyntaxHighlighter 
                        language="javascript" 
                        style={vscDarkPlus}
                        PreTag="span"
                        CodeTag="span"
                        customStyle={{ 
                          display: 'inline', 
                          padding: 0, 
                          margin: 0, 
                          background: 'transparent',
                          fontSize: '1.1rem',
                          lineHeight: '1.5',
                          overflow: 'visible',
                          fontVariantLigatures: 'none',
                          WebkitFontFeatureSettings: '"calt" 0',
                          fontFeatureSettings: '"calt" 0'
                        }}
                      >
                        {formattedPart}
                      </SyntaxHighlighter>
                    ) : (
                      formattedPart
                    )}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {question.text && renderTextParts(question.text, textIsCode)}

      {(hasDedicatedCode || textIsCode) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl rounded-2xl md:rounded-[2.5rem] overflow-hidden border-2 md:border-4 border-slate-700/50 shadow-2xl relative bg-slate-900 dark:bg-slate-950"
        >
          <div className="bg-slate-800 dark:bg-slate-900 px-6 py-3 flex items-center justify-between border-b border-black/20">
             <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-600" />
                <div className="w-3 h-3 rounded-full bg-slate-500" />
                <div className="w-3 h-3 rounded-full bg-slate-400" />
             </div>
             <div className="bg-slate-900 dark:bg-slate-950 px-4 py-1.5 rounded-t-lg border-t border-x border-slate-700/50">
                 <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Untitled-1</span>
             </div>
             <div className="w-12" />
          </div>
          <div className="p-5 md:p-14">
            {question.code ? renderTextParts(question.code, true) : null}
          </div>
        </motion.div>
      )}
    </div>
  );
}
