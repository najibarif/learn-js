"use client";

import { useState, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useAudio } from './AudioProvider';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DragDropQuestionProps {
  question: any;
  onAnswer: (answer: any) => void;
  onUpdate: (data: any) => void;
  hideText?: boolean;
}

const DraggablePortal = ({ children, draggableProps, dragHandleProps, innerRef }: any) => {
  return (
    <div ref={innerRef} {...draggableProps} {...dragHandleProps}>
      {children}
    </div>
  );
};

export default function DragDropQuestion({ question, onAnswer, onUpdate }: DragDropQuestionProps) {
  const audio = useAudio();
  const targets = useMemo(() => {
    const dbTargets = question.metadata?.targets || [];
    const expectedCount = ((question.text || "") + (question.code || "")).match(/___/g)?.length || 0;
    if (dbTargets.length === expectedCount && expectedCount > 0) return dbTargets;
    if (expectedCount === 0) return dbTargets;
    return Array.from({ length: expectedCount }, (_, i) => ({ id: `slot-${i}`, text: `Slot ${i+1}` }));
  }, [question]);

  const sourceText = question.code || question.text || "";
  
  const items = useMemo(() => {
    const rawItems = question.metadata?.items || [];
    const validTargetIds = targets.map((t: any) => t.id);
    return rawItems.filter((item: any) => 
      !item.correctTargetId || validTargetIds.includes(item.correctTargetId)
    );
  }, [question.metadata?.items, targets]);

  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalNode(document.body);
  }, []);

  const isCode = useMemo(() => !!question.code || /let |const |var |console\.log|function |struct |if \(|```/.test(sourceText), [sourceText, question.code]);
  const isInline = useMemo(() => sourceText.includes('___') || sourceText.includes('[['), [sourceText]);

  const [placements, setPlacements] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = { lobby: items.map((i: any) => i.id) };
    targets.forEach((t: any) => { initial[t.id] = []; });
    return initial;
  });

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newPlacements = { ...placements };
    const sourceIds = [...newPlacements[source.droppableId]];

    if (source.droppableId === destination.droppableId) {
       const [moved] = sourceIds.splice(source.index, 1);
       sourceIds.splice(destination.index, 0, moved);
       newPlacements[source.droppableId] = sourceIds;
    } else {
       const destIds = [...newPlacements[destination.droppableId]];
       const [moved] = sourceIds.splice(source.index, 1);
       destIds.splice(destination.index, 0, moved);
       newPlacements[source.droppableId] = sourceIds;
       newPlacements[destination.droppableId] = destIds;
    }
    setPlacements(newPlacements);
    const finalAnswers: any[] = [];
    targets.forEach((t: any) => {
      newPlacements[t.id]?.forEach((itemId: string) => finalAnswers.push({ itemId, targetId: t.id }));
    });
    onUpdate({ dynamicAnswer: finalAnswers });
  };

  const handleItemClick = (itemId: string, sourceDroppableId: string) => {
    const newPlacements = { ...placements };
    
    if (sourceDroppableId === 'lobby') {
      const targetId = targets.find((t: any) => newPlacements[t.id].length === 0)?.id || targets[0]?.id;
      if (targetId) {
        newPlacements.lobby = newPlacements.lobby.filter(id => id !== itemId);
        newPlacements[targetId] = [...newPlacements[targetId], itemId];
      } else return;
    } else {
      newPlacements[sourceDroppableId] = newPlacements[sourceDroppableId].filter(id => id !== itemId);
      newPlacements.lobby = [...newPlacements.lobby, itemId];
    }
    
    setPlacements(newPlacements);
    const finalAnswers: any[] = [];
    targets.forEach((t: any) => {
      newPlacements[t.id]?.forEach((id: string) => finalAnswers.push({ itemId: id, targetId: t.id }));
    });
    onUpdate({ dynamicAnswer: finalAnswers });
    audio.playSound('click');
  };

  const renderItem = (itemId: string, index: number, isSmall: boolean = false, droppableId: string = 'lobby') => {
    const item = items.find((i: any) => i.id === itemId);
    return (
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(provided, snapshot) => {
          const content = (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={() => handleItemClick(itemId, droppableId)}
              style={{ ...provided.draggableProps.style, touchAction: 'none' }}
              className={`font-black shadow-2xl transition-all active:scale-110 whitespace-nowrap cursor-pointer select-none ${
                isSmall 
                   ? 'bg-teal-600 dark:bg-teal-500 text-white text-sm md:text-base px-3 py-2 rounded-xl' 
                   : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg md:text-xl px-4 md:px-6 py-3 md:py-4 rounded-[1.5rem] border-b-4 md:border-b-6 border-slate-200 dark:border-slate-700'
              } ${snapshot.isDragging ? 'ring-4 ring-teal-400 dark:ring-teal-500 opacity-90' : ''}`}
            >
              {item?.text}
            </div>
          );
          if (snapshot.isDragging && portalNode) return createPortal(content, portalNode);
          return content;
        }}
      </Draggable>
    );
  };

  const textIsCode = !question.code && /let |const |var |console\.log|function |struct |if \(|```/.test(question.text || "");
  const hasDedicatedCode = !!question.code;

  let targetGlobalCounter = 0;

  const renderTextParts = (text: string, isCodeFormat: boolean) => {
    if (!text) return null;
    const lines = text.split('\n');
    
    return (
      <div className={`flex flex-col gap-1 w-full ${isCodeFormat ? 'font-mono text-left items-start' : 'items-center justify-center mb-6'}`}>
        {lines.map((line: string, lineIdx: number) => {
          const parts = line.split(/(___|\[\[.*?\]\])/g);
          return (
            <div key={lineIdx} className={`flex flex-wrap items-center gap-x-0 min-h-[2rem] ${!isCodeFormat && 'justify-center text-center'}`}>
              {parts.map((part: string, idx: number) => {
                let target: any = null;
                if (part === '___') target = targets[targetGlobalCounter++];
                else if (part.startsWith('[[') && part.endsWith(']]')) {
                   const targetText = part.slice(2, -2);
                   target = targets.find((t: any) => t.text === targetText);
                }

                if (target) {
                  return (
                    <div key={target.id + idx} className="flex flex-col items-center gap-1 mx-1 min-w-[70px]">
                       <Droppable droppableId={target.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`inline-flex min-w-[70px] min-h-[45px] border-b-4 border-dashed rounded-xl align-middle transition-all shadow-inner items-center justify-center ${
                              snapshot.isDraggingOver ? 'bg-teal-500/30 border-teal-400' : 'bg-slate-800/40 border-slate-600/30'
                            }`}
                          >
                            <div className="flex flex-wrap gap-1 items-center justify-center w-full p-1">
                               {placements[target.id].map((itemId, index) => renderItem(itemId, index, true, target.id))}
                            </div>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                }
                const formattedPart = part.startsWith('```') ? part.replace(/```[a-z]*\n|```/g, '') : part;
                if (!formattedPart.trim() && isCodeFormat && parts.length > 1) return <div key={idx} className="w-4" />;
                if (!formattedPart && isCodeFormat) return null;
                
                return (
                  <span key={idx} className={`${isCodeFormat ? 'font-mono text-teal-400' : 'text-white drop-shadow-md font-black text-2xl md:text-4xl py-2 italic'}`}>
                    {formattedPart}
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full flex flex-col gap-6 items-center">
          {question.text && renderTextParts(question.text, textIsCode)}

          {(hasDedicatedCode || textIsCode) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl rounded-2xl md:rounded-[3rem] overflow-hidden border-2 md:border-4 border-slate-700/50 shadow-2xl relative bg-slate-900 dark:bg-slate-950"
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

          {!isInline && (
             <div className="grid grid-cols-1 gap-6">
               {targets.map((target: any) => (
                 <Droppable key={target.id} droppableId={target.id}>
                   {(provided, snapshot) => (
                     <div {...provided.droppableProps} ref={provided.innerRef}
                       className={`min-h-[140px] rounded-[2.5rem] border-4 border-dashed p-6 transition-all ${
                         snapshot.isDraggingOver ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-400' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
                       }`}
                     >
                       <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-4 tracking-widest">{target.text}</p>
                       <div className="flex flex-wrap gap-3">
                          {placements[target.id].map((itemId, index) => renderItem(itemId, index, true, target.id))}
                       </div>
                       {provided.placeholder}
                     </div>
                   )}
                 </Droppable>
               ))}
             </div>
          )}
        </div>

        <div className="w-full lg:w-[320px] shrink-0 sticky top-24">
          <div className="flex flex-col gap-4 md:gap-6 bg-slate-100 dark:bg-slate-800/50 backdrop-blur-2xl p-4 md:p-8 rounded-2xl md:rounded-[3.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl min-h-[150px] md:min-h-[300px]">
            <p className="text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Pilihan Jawaban</p>
            <Droppable droppableId="lobby" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-4 justify-center items-center">
                  {placements.lobby.map((itemId, index) => (
                    <div key={itemId} className="shrink-0">
                      {renderItem(itemId, index, false)}
                    </div>
                  ))}
                  {provided.placeholder}
                  {placements.lobby.length === 0 && (
                    <div className="py-20 text-center opacity-30 w-full">
                       <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase italic">Semua Terpasang!</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
            <p className="text-center text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-4">Tarik atau Klik untuk memilih</p>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
