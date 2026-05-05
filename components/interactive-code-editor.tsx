"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Check, Copy, Play, RotateCcw, Pause, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveCodeEditorProps {
  initialCode: string;
  language?: string;
  className?: string;
  onRun?: (outputs: string[], code: string, hasError: boolean) => void;
}

interface LoopOutput {
  text: string;
  timestamp: number;
}

// Simple JavaScript syntax highlighter with dark theme colors
function highlightCode(code: string): string {
  // Use placeholder tokens to avoid regex conflicts
  const tokens: string[] = [];
  const placeholder = (content: string) => {
    tokens.push(content);
    return `__TOKEN_${tokens.length - 1}__`;
  };

  // Escape HTML first
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments (single line) - green - tokenize first
  highlighted = highlighted.replace(
    /(\/\/.*$)/gm,
    (match) => placeholder(`<span style="color:#4ade80;font-style:italic">${match}</span>`)
  );

  // Strings (double quotes) - orange/amber
  highlighted = highlighted.replace(
    /("(?:[^"\\]|\\.)*")/g,
    (match) => placeholder(`<span style="color:#fcd34d">${match}</span>`)
  );

  // Strings (single quotes) - orange/amber
  highlighted = highlighted.replace(
    /('(?:[^'\\]|\\.)*')/g,
    (match) => placeholder(`<span style="color:#fcd34d">${match}</span>`)
  );

  // Template literals - orange/amber
  highlighted = highlighted.replace(
    /(`(?:[^`\\]|\\.)*`)/g,
    (match) => placeholder(`<span style="color:#fcd34d">${match}</span>`)
  );

  // console.log - cyan and yellow (before keywords to avoid conflicts)
  highlighted = highlighted.replace(
    /\b(console)\.(log)\b/g,
    (_, c, l) => placeholder(`<span style="color:#67e8f9">${c}</span>.<span style="color:#fde047">${l}</span>`)
  );

  // Keywords - pink/magenta
  const keywords = ['for', 'while', 'do', 'if', 'else', 'return', 'break', 'continue', 'function', 'const', 'let', 'var', 'new', 'true', 'false', 'null', 'undefined'];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(
      regex,
      (match) => placeholder(`<span style="color:#f472b6;font-weight:600">${match}</span>`)
    );
  });

  // Numbers - light blue (only match numbers not inside tokens)
  highlighted = highlighted.replace(
    /(?<!__TOKEN_)\b(\d+\.?\d*)\b(?!__)/g,
    (match) => placeholder(`<span style="color:#7dd3fc">${match}</span>`)
  );

  // Built-in objects and methods - yellow
  highlighted = highlighted.replace(
    /\b(length|push|pop|shift|unshift|slice|splice|map|filter|reduce|forEach)\b/g,
    (match) => placeholder(`<span style="color:#fde047">${match}</span>`)
  );

  // Operators - rose/red
  highlighted = highlighted.replace(
    /(\+\+|--|&lt;=|&gt;=|===|!==|==|!=|&lt;|&gt;|&amp;&amp;|\|\||\+=|-=|\*=|\/=|\!)/g,
    (match) => placeholder(`<span style="color:#fb7185">${match}</span>`)
  );

  // Brackets and parentheses - purple
  highlighted = highlighted.replace(
    /([{}[\]()])/g,
    (match) => placeholder(`<span style="color:#c4b5fd">${match}</span>`)
  );

  // Semicolons - lighter gray (avoid matching HTML entities)
  highlighted = highlighted.replace(
    /(?<!&[a-zA-Z]+)(;)/g,
    (match) => placeholder(`<span style="color:#94a3b8">${match}</span>`)
  );

  // Restore all tokens
  tokens.forEach((token, index) => {
    highlighted = highlighted.replace(`__TOKEN_${index}__`, token);
  });

  return highlighted;
}

export function InteractiveCodeEditor({
  initialCode,
  language = "javascript",
  className,
  onRun,
}: InteractiveCodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [outputs, setOutputs] = useState<LoopOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const outputsRef = useRef<LoopOutput[]>([]);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    setCurrentCode(initialCode);
  }, [initialCode]);

  // Sync scroll between textarea and highlight layer
  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    setCurrentCode(initialCode);
    setOutputs([]);
    setCurrentStep(0);
    setError(null);
    setIsRunning(false);
    setIsPaused(false);
    pausedRef.current = false;
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  };

  const stopExecution = () => {
    setIsRunning(false);
    setIsPaused(false);
    pausedRef.current = false;
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  };

  const togglePause = () => {
    if (isPaused) {
      pausedRef.current = false;
      setIsPaused(false);
      animateOutputs(currentStep);
    } else {
      pausedRef.current = true;
      setIsPaused(true);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    }
  };

  const animateOutputs = useCallback((startIndex: number) => {
    if (startIndex >= outputsRef.current.length) {
      setIsRunning(false);
      setIsPaused(false);
      return;
    }

    if (pausedRef.current) {
      return;
    }

    animationTimeoutRef.current = setTimeout(() => {
      if (pausedRef.current) return;
      
      setCurrentStep(startIndex + 1);
      setOutputs(outputsRef.current.slice(0, startIndex + 1));
      animateOutputs(startIndex + 1);
    }, 1200);
  }, []);

  const runCode = () => {
    setIsRunning(true);
    setIsPaused(false);
    pausedRef.current = false;
    setOutputs([]);
    setCurrentStep(0);
    setError(null);

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    const collectedOutputs: LoopOutput[] = [];
    const originalConsoleLog = console.log;

    console.log = (...args) => {
      collectedOutputs.push({
        text: args.map((arg) => String(arg)).join(" "),
        timestamp: Date.now(),
      });
    };

    try {
      const maxIterations = 1000;
      
      const wrappedCode = `
        let __iterCount = 0;
        const __maxIter = ${maxIterations};
        const __checkIter = () => {
          if (++__iterCount > __maxIter) {
            throw new Error("Loop melebihi batas maksimum (${maxIterations} iterasi). Mungkin infinite loop?");
          }
        };
        ${currentCode.replace(/\b(console\.log)/g, '__checkIter(); $1')}
      `;

      const executeCode = new Function(wrappedCode);
      executeCode();

      if (collectedOutputs.length === 0) {
        collectedOutputs.push({ text: "(Tidak ada output)", timestamp: Date.now() });
      }

      // Call onRun callback with outputs (Success)
      if (onRun) {
        onRun(collectedOutputs.map(o => o.text), currentCode, false);
      }
      
      outputsRef.current = collectedOutputs;
      animateOutputs(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsRunning(false);
      
      // Call onRun callback with error flag true
      if (onRun) {
        onRun(collectedOutputs.map(o => o.text), currentCode, true);
      }
    } finally {
      console.log = originalConsoleLog;
    }
  };

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const totalSteps = outputsRef.current.length;

  return (
    <div className={cn("relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-xs ml-2">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetCode}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Reset kode"
            title="Reset ke kode awal"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={copyToClipboard}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Salin kode"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Code Editor with Syntax Highlighting */}
      <div className="relative bg-slate-900 dark:bg-slate-950 overflow-hidden">
        {/* Line numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 dark:bg-slate-900 border-r border-slate-700 dark:border-slate-800 flex flex-col pt-4 text-right pr-3 select-none pointer-events-none z-10">
          {currentCode.split('\n').map((_, i) => (
            <div key={i} className="text-xs text-slate-500 font-mono leading-6 h-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Container for overlapping elements */}
        <div className="relative ml-12">
          {/* Highlighted code layer (visible, behind textarea) */}
          <div
            ref={highlightRef}
            className="absolute inset-0 p-4 font-mono text-sm leading-6 whitespace-pre-wrap break-all overflow-hidden pointer-events-none text-slate-300"
            style={{ minHeight: '160px' }}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: highlightCode(currentCode) + '\n' }}
          />

          {/* Transparent textarea for editing (on top for interaction) */}
          <textarea
            ref={textareaRef}
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            onScroll={syncScroll}
            className="relative w-full bg-transparent text-sm font-mono resize-none focus:outline-none leading-6 p-4 text-transparent caret-white selection:bg-blue-500/40 z-20"
            style={{ minHeight: '160px', caretColor: 'white' }}
            spellCheck={false}
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">
        {!isRunning ? (
          <Button onClick={runCode} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Play className="h-4 w-4" />
            Jalankan Kode
          </Button>
        ) : (
          <>
            <Button onClick={togglePause} size="sm" variant="secondary" className="gap-2">
              {isPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  Lanjutkan
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  Jeda
                </>
              )}
            </Button>
            <Button onClick={stopExecution} size="sm" variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Stop
            </Button>
          </>
        )}
        
        {isRunning && totalSteps > 0 && (
          <span className="text-sm text-slate-500 dark:text-slate-400 ml-auto font-mono">
            Iterasi {currentStep}/{totalSteps}
          </span>
        )}
      </div>

      {/* Visualization & Output */}
      {(outputs.length > 0 || error) && (
        <div className="border-t border-slate-200 dark:border-slate-700">
          {/* Visualisasi Animasi */}
          {totalSteps > 0 && totalSteps <= 20 && (
            <div className="px-5 py-6 border-b border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              <div className="text-sm font-black text-white flex items-center gap-2 mb-4 tracking-wide uppercase relative z-10">
                <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">
                   ⚙️
                </div>
                Visualisasi Alur Eksekusi
              </div>
              
              <div className="flex flex-wrap items-center gap-3 relative z-10">
                <AnimatePresence>
                  {outputsRef.current.map((output, i) => {
                    const isActive = i === currentStep - 1;
                    const isPassed = i < currentStep;
                    
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: isPassed ? 1 : 0.3, 
                            scale: isActive ? 1.05 : 1,
                            y: isActive ? -2 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "px-4 py-2 rounded-xl font-mono text-xs font-bold border transition-all duration-300 relative",
                            isActive 
                              ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] ring-2 ring-indigo-500/50" 
                              : isPassed 
                                ? "bg-slate-800 border-slate-700 text-slate-300" 
                                : "bg-slate-800/50 border-slate-700/50 text-slate-500"
                          )}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="codeFlowHighlight"
                              className="absolute inset-0 bg-white/20 rounded-xl pointer-events-none"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                          {output.text || `Langkah ${i+1}`}
                        </motion.div>

                        {i < totalSteps - 1 && (
                          <motion.div
                            animate={{
                              scale: isPassed ? 1.2 : 1,
                              opacity: isPassed ? 1 : 0.3
                            }}
                          >
                            <ChevronRight className={cn(
                              "h-5 w-5 transition-colors",
                              isPassed ? "text-indigo-400" : "text-slate-600"
                            )} />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Progress bar for many iterations */}
          {totalSteps > 20 && (
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Progress: {currentStep}/{totalSteps} iterasi
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Output Console */}
          <div className="bg-slate-900 dark:bg-slate-950">
            <div className="px-4 py-2 text-xs font-semibold text-slate-400 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Output Console
            </div>
            <div className="p-4 font-mono text-sm max-h-64 overflow-y-auto">
              {error ? (
                <div className="text-red-400">{error}</div>
              ) : (
                outputs.map((output, index) => (
                  <div
                    key={index}
                    className="py-1 animate-in fade-in slide-in-from-left-2 duration-200 flex items-start gap-2"
                  >
                    <span className="text-slate-500 select-none">[{index + 1}]</span>
                    <span className="text-emerald-400">{output.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
