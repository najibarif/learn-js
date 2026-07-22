"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveCodeEditor } from "./interactive-code-editor";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseProps {
  number: number;
  title: string;
  description: string;
  task: string;
  initialCode: string;
  expectedOutputs: string[];
  hint?: string;
}

export function ExerciseCard({
  number,
  title,
  description,
  task,
  initialCode,
  expectedOutputs,
}: ExerciseProps) {
  const [result, setResult] = useState<"idle" | "correct" | "incorrect">("idle");

  const checkAnswer = (outputs: string[], code: string, hasError: boolean) => {
    if (hasError || code.includes("???") || outputs.some((o) => o.includes("???"))) {
      setResult("incorrect");
      return;
    }
    if (expectedOutputs.length === 0) {
      setResult("correct");
      return;
    }
    const normalizedExpected = expectedOutputs.map((o) => o.trim().toLowerCase());
    const normalizedUser = outputs.map((o) => o.trim().toLowerCase());
    const allMatch = normalizedExpected.every((exp) =>
      normalizedUser.some((user) => user.includes(exp) || exp.includes(user))
    );
    const lengthOk = normalizedUser.length >= normalizedExpected.length;
    setResult(allMatch && lengthOk ? "correct" : "incorrect");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className={cn(
        "border rounded-lg transition-all duration-300",
        result === "correct"
          ? "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
          : result === "incorrect"
          ? "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/30"
          : "border-slate-200 dark:border-slate-700"
      )}>
        <div className="p-6 pb-0">
          <div className="flex items-start gap-4">
            <motion.div
              animate={result === "correct" ? { scale: [1, 1.2, 1], rotate: [0, 360, 0] } : result === "incorrect" ? { x: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ duration: result === "correct" ? 0.6 : 0.5, type: "spring" }}
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shrink-0",
                result === "correct" ? "bg-slate-500" : result === "incorrect" ? "bg-slate-400" : "bg-slate-600"
              )}
            >
              {result === "correct" ? <CheckCircle2 className="h-5 w-5" /> : result === "incorrect" ? <XCircle className="h-5 w-5" /> : number}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-base text-slate-500 dark:text-slate-400 font-normal mt-1">{description}</p>
            </div>
          </div>
        </div>

      <div className="p-6 space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-base font-medium text-slate-700 dark:text-slate-300">
            <strong>Tugas:</strong> {task}
          </p>
        </div>

        <InteractiveCodeEditor initialCode={initialCode} onRun={checkAnswer} />

        {expectedOutputs.length > 0 && (
          <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-base font-medium text-slate-700 dark:text-slate-300 mb-2">Output yang diharapkan:</p>
            <div className="bg-slate-900 dark:bg-slate-950 rounded p-3 font-mono text-sm text-slate-300">
              {expectedOutputs.map((output, i) => <div key={i}>{output}</div>)}
            </div>
          </div>
        )}

        <AnimatePresence>
          {result === "correct" && (
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2, type: "spring" }}>
                <CheckCircle2 className="h-6 w-6 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              </motion.div>
              <div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="font-bold text-slate-900 dark:text-slate-100">Benar!</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="text-base text-slate-600 dark:text-slate-400">Kode kamu sudah benar. Lanjut ke soal berikutnya!</motion.p>
              </div>
            </motion.div>
          )}

          {result === "incorrect" && (
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center gap-3">
              <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5, type: "spring" }}>
                <XCircle className="h-6 w-6 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              </motion.div>
              <div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="font-bold text-slate-800 dark:text-slate-200">Belum Tepat</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="text-base text-slate-600 dark:text-slate-400">Coba periksa lagi kode kamu. Bandingkan outputmu dengan output yang diharapkan!</motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </motion.div>
  );
}
