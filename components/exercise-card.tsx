"use client";

import { useState } from "react";
import { InteractiveCodeEditor } from "./interactive-code-editor";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    // 1. If code had a syntax/runtime error, or if user hasn't replaced "???"
    if (hasError || code.includes("???") || outputs.some((o) => o.includes("???"))) {
      setResult("incorrect");
      return;
    }

    // 2. If no expected outputs, mark as correct since they wrote valid code and changed "???"
    if (expectedOutputs.length === 0) {
      setResult("correct");
      return;
    }

    // 3. Otherwise, check against expected outputs
    const normalizedExpected = expectedOutputs.map((o) => o.trim().toLowerCase());
    const normalizedUser = outputs.map((o) => o.trim().toLowerCase());

    const allMatch = normalizedExpected.every((exp) =>
      normalizedUser.some((user) => user.includes(exp) || exp.includes(user))
    );
    const lengthOk = normalizedUser.length >= normalizedExpected.length;

    setResult(allMatch && lengthOk ? "correct" : "incorrect");
  };

  return (
    <Card
      className={cn(
        "border-2 transition-colors",
        result === "correct"
          ? "border-green-400 dark:border-green-600 bg-green-50/50 dark:bg-green-950/20"
          : result === "incorrect"
          ? "border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-950/20"
          : "border-slate-200 dark:border-slate-700"
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0",
              result === "correct"
                ? "bg-green-500"
                : result === "incorrect"
                ? "bg-red-500"
                : "bg-blue-600"
            )}
          >
            {result === "correct" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : result === "incorrect" ? (
              <XCircle className="h-5 w-5" />
            ) : (
              number
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-1">{description}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Task */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
            <strong>Tugas:</strong> {task}
          </p>
        </div>

        {/* Code Editor */}
        <InteractiveCodeEditor initialCode={initialCode} onRun={checkAnswer} />

        {/* Expected Output */}
        {expectedOutputs.length > 0 && (
          <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Output yang diharapkan:
            </p>
            <div className="bg-slate-900 dark:bg-slate-950 rounded p-3 font-mono text-sm text-slate-300">
              {expectedOutputs.map((output, i) => (
                <div key={i}>{output}</div>
              ))}
            </div>
          </div>
        )}

        {/* Result Message */}
        {result === "correct" && (
          <div className="p-4 bg-green-100 dark:bg-green-950/40 rounded-lg border border-green-300 dark:border-green-700 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-800 dark:text-green-300">Benar! 🎉</p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Kode kamu sudah benar. Lanjut ke soal berikutnya!
              </p>
            </div>
          </div>
        )}

        {result === "incorrect" && (
          <div className="p-4 bg-red-100 dark:bg-red-950/40 rounded-lg border border-red-300 dark:border-red-700 flex items-center gap-3">
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-800 dark:text-red-300">Belum Tepat</p>
              <p className="text-sm text-red-700 dark:text-red-400">
                Coba periksa lagi kode kamu. Bandingkan outputmu dengan output yang diharapkan!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
