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

function highlightCode(code: string): string {
  const tokens: string[] = [];
  const placeholder = (content: string) => {
    tokens.push(content);
    return `__TOKEN_${tokens.length - 1}__`;
  };

  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments - muted slate
  highlighted = highlighted.replace(
    /(\/\/.*$)/gm,
    (match) => placeholder(`<span style="color:#64748b;font-style:italic">${match}</span>`)
  );

  // Strings - dusty blue
  highlighted = highlighted.replace(
    /("(?:[^"\\]|\\.)*")/g,
    (match) => placeholder(`<span style="color:#64748b">${match}</span>`)
  );
  highlighted = highlighted.replace(
    /('(?:[^'\\]|\\.)*')/g,
    (match) => placeholder(`<span style="color:#64748b">${match}</span>`)
  );
  highlighted = highlighted.replace(
    /(`(?:[^`\\]|\\.)*`)/g,
    (match) => placeholder(`<span style="color:#64748b">${match}</span>`)
  );

  // console.log - slate + blue-gray
  highlighted = highlighted.replace(
    /\b(console)\.(log)\b/g,
    (_, c, l) => placeholder(`<span style="color:#94a3b8">${c}</span>.<span style="color:#7c8fa4">${l}</span>`)
  );

  // Keywords - bold slate
  const keywords = ['for', 'while', 'do', 'if', 'else', 'return', 'break', 'continue', 'function', 'const', 'let', 'var', 'new', 'true', 'false', 'null', 'undefined'];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(
      regex,
      (match) => placeholder(`<span style="color:#64748b;font-weight:600">${match}</span>`)
    );
  });

  // Numbers - dusty blue
  highlighted = highlighted.replace(
    /(?<!__TOKEN_)\b(\d+\.?\d*)\b(?!__)/g,
    (match) => placeholder(`<span style="color:#7c8fa4">${match}</span>`)
  );

  // Built-in methods - slate
  highlighted = highlighted.replace(
    /\b(length|push|pop|shift|unshift|slice|splice|map|filter|reduce|forEach)\b/g,
    (match) => placeholder(`<span style="color:#64748b">${match}</span>`)
  );

  // Operators - slate
  highlighted = highlighted.replace(
    /(\+\+|--|&lt;=|&gt;=|===|!==|==|!=|&lt;|&gt;|&amp;&amp;|\|\||\+=|-=|\*=|\/=|\!)/g,
    (match) => placeholder(`<span style="color:#94a3b8">${match}</span>`)
  );

  // Brackets - light slate
  highlighted = highlighted.replace(
    /([{}[\]()])/g,
    (match) => placeholder(`<span style="color:#cbd5e1">${match}</span>`)
  );

  // Semicolons
  highlighted = highlighted.replace(
    /(?<!&[a-zA-Z]+)(;)/g,
    (match) => placeholder(`<span style="color:#94a3b8">${match}</span>`)
  );

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
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  };

  const stopExecution = () => {
    setIsRunning(false);
    setIsPaused(false);
    pausedRef.current = false;
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  };

  const togglePause = () => {
    if (isPaused) {
      pausedRef.current = false;
      setIsPaused(false);
      animateOutputs(currentStep);
    } else {
      pausedRef.current = true;
      setIsPaused(true);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    }
  };

  const animateOutputs = useCallback((startIndex: number) => {
    if (startIndex >= outputsRef.current.length) {
      setIsRunning(false);
      setIsPaused(false);
      return;
    }
    if (pausedRef.current) return;

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

    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

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

      if (onRun) onRun(collectedOutputs.map(o => o.text), currentCode, false);
      
      outputsRef.current = collectedOutputs;
      animateOutputs(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsRunning(false);
      if (onRun) onRun(collectedOutputs.map(o => o.text), currentCode, true);
    } finally {
      console.log = originalConsoleLog;
    }
  };

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const totalSteps = outputsRef.current.length;

  return (
    <div className={cn("relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900", className)}>
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-3 text-base border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-500" />
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
            <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-sm ml-2">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetCode}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Reset kode" title="Reset ke kode awal">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={copyToClipboard}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Salin kode">
            {copied ? <Check className="h-4 w-4 text-slate-600" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="relative bg-slate-900 dark:bg-slate-950 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 dark:bg-slate-900 border-r border-slate-700 dark:border-slate-800 flex flex-col pt-4 text-right pr-3 select-none pointer-events-none z-10">
          {currentCode.split('\n').map((_, i) => (
            <div key={i} className="text-sm text-slate-500 font-mono leading-6 h-6">{i + 1}</div>
          ))}
        </div>

        <div className="relative ml-12">
          <div ref={highlightRef}
            className="absolute inset-0 p-4 font-mono text-base leading-6 whitespace-pre-wrap break-all overflow-hidden pointer-events-none text-slate-300"
            style={{ minHeight: '160px' }}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: highlightCode(currentCode) + '\n' }}
          />
          <textarea ref={textareaRef} value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            onScroll={syncScroll}
            className="relative w-full bg-transparent text-base font-mono resize-none focus:outline-none leading-6 p-4 text-transparent caret-white selection:bg-slate-500/30 z-20"
            style={{ minHeight: '160px', caretColor: 'white' }}
            spellCheck={false} disabled={isRunning}
          />
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-2">
        {!isRunning ? (
          <Button onClick={runCode} size="sm" className="gap-2 bg-slate-600 dark:bg-slate-500 hover:bg-slate-700 dark:hover:bg-slate-400 text-white">
            <Play className="h-4 w-4" />
            Jalankan Kode
          </Button>
        ) : (
          <>
            <Button onClick={togglePause} size="sm" variant="secondary" className="gap-2">
              {isPaused ? (<><Play className="h-4 w-4" />Lanjutkan</>) : (<><Pause className="h-4 w-4" />Jeda</>)}
            </Button>
            <Button onClick={stopExecution} size="sm" variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />Stop
            </Button>
          </>
        )}
        {isRunning && totalSteps > 0 && (
          <span className="text-base text-slate-500 dark:text-slate-400 ml-auto font-mono">
            Iterasi {currentStep}/{totalSteps}
          </span>
        )}
      </div>

      {(outputs.length > 0 || error) && (
        <div className="border-t border-slate-200 dark:border-slate-700">
          {totalSteps > 0 && totalSteps <= 20 && (
            <div className="px-6 py-7 border-b border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
              <div className="text-base font-black text-white flex items-center gap-2 mb-5 tracking-wide uppercase relative z-10">
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 text-sm">⚙️</div>
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
                          animate={{ opacity: isPassed ? 1 : 0.3, scale: isActive ? 1.05 : 1, y: isActive ? -2 : 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={cn(
                            "px-4 py-2 rounded-lg font-mono text-sm font-bold border transition-all duration-300 relative",
                            isActive 
                              ? "bg-slate-600 border-slate-400 text-white" 
                              : isPassed 
                                ? "bg-slate-800 border-slate-700 text-slate-300" 
                                : "bg-slate-800/50 border-slate-700/50 text-slate-500"
                          )}
                        >
                          {output.text || `Langkah ${i+1}`}
                        </motion.div>
                        {i < totalSteps - 1 && (
                          <motion.div animate={{ scale: isPassed ? 1.2 : 1, opacity: isPassed ? 1 : 0.3 }}>
                            <ChevronRight className={cn("h-5 w-5 transition-colors", isPassed ? "text-slate-400" : "text-slate-600")} />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {totalSteps > 20 && (
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Progress: {currentStep}/{totalSteps} iterasi
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-slate-500 dark:bg-slate-400 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
              </div>
            </div>
          )}

          <div className="bg-slate-900 dark:bg-slate-950">
            <div className="px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
              Output Console
            </div>
            <div className="p-4 font-mono text-base max-h-64 overflow-y-auto">
              {error ? (
                <div className="text-slate-400">{error}</div>
              ) : (
                outputs.map((output, index) => (
                  <div key={index} className="py-1 animate-in fade-in slide-in-from-left-2 duration-200 flex items-start gap-2">
                    <span className="text-slate-500 select-none">[{index + 1}]</span>
                    <span className="text-slate-400 dark:text-slate-300">{output.text}</span>
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
