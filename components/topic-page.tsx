"use client";

import { useState, useEffect } from "react";
import { InteractiveCodeEditor } from "@/components/interactive-code-editor";
import { ExerciseCard } from "@/components/exercise-card";
import { Lightbulb, Code, GraduationCap, ChevronRight, Play, RotateCcw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Type definitions ──────────────────────────────────────────────────────────

export type AppColor = "cyan" | "yellow" | "green" | "blue" | "purple" | "pink" | "orange" | "teal" | "rose" | "indigo" | "emerald" | "amber" | "sky" | "fuchsia" | "slate" | "red" | "violet" | "white";

export interface StructurePart {
  num: number;
  code: string;        // e.g. "let i = 1"
  badge: string;       // e.g. "(Inisialisasi)"
  description: string; // e.g. "Mulai dari angka berapa?"
  note: string;
  color: AppColor;
}

export interface FlowStep {
  label: string;
  color: AppColor;
}

export interface ConceptData {
  question: string;
  explanation: string;           // supports basic HTML like <strong>
  analogy?: {
    title: string;
    intro: string;
    bullets: string[];
  };
  structure?: {
    title: string;
    code: string;
    parts: StructurePart[];
  };
  flow?: {
    title: string;
    steps: FlowStep[];
  };
}

export interface ExampleNote {
  bold: string;
  text: string;
  color: AppColor;
}

export interface ExampleData {
  number: number;
  title: string;
  subtitle: string;
  code: string;
  note?: ExampleNote;
  circleColor: string; // e.g. "bg-blue-600"
}

export interface TipsData {
  whenTitle: string;
  when: string[];
  avoidTitle: string;
  avoid: string[];
  operators?: { code: string; meaning: string }[];
  operatorsTitle?: string;
}

export interface ExerciseData {
  number: number;
  title: string;
  description: string;
  task: string;
  initialCode: string;
  expectedOutputs: string[];
}

export interface TopicData {
  id: string;
  label: string;
  accentColor: string;      // e.g. "blue"
  gradientFrom: string;     // e.g. "from-blue-50"
  gradientTo: string;       // e.g. "to-indigo-50"
  darkGradientFrom: string; // e.g. "dark:from-blue-950/40"
  darkGradientTo: string;   // e.g. "dark:to-indigo-950/40"
  iconBg: string;           // e.g. "bg-blue-600"
  examplesSubtitle?: string;
  concept: ConceptData;
  examples: ExampleData[];
  tips?: TipsData;
  exercises: ExerciseData[];
}

// ─── Color maps ────────────────────────────────────────────────────────────────

const partColors: Record<AppColor, {
  bg: string; border: string; numBg: string; numText: string; dotBg: string;
}> = {
  cyan:   { bg: "bg-cyan-50 dark:bg-cyan-950/30",     border: "border-cyan-200 dark:border-cyan-800",     numBg: "bg-cyan-500",   numText: "text-white",       dotBg: "bg-cyan-500"   },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800", numBg: "bg-yellow-500", numText: "text-white",       dotBg: "bg-yellow-500" },
  green:  { bg: "bg-green-50 dark:bg-green-950/30",   border: "border-green-200 dark:border-green-800",   numBg: "bg-green-500",  numText: "text-white",       dotBg: "bg-green-500"  },
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/30",     border: "border-blue-200 dark:border-blue-800",     numBg: "bg-blue-500",   numText: "text-white",       dotBg: "bg-blue-500"   },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", numBg: "bg-purple-500", numText: "text-white",       dotBg: "bg-purple-500" },
  pink:   { bg: "bg-pink-50 dark:bg-pink-950/30",     border: "border-pink-200 dark:border-pink-800",     numBg: "bg-pink-500",   numText: "text-white",       dotBg: "bg-pink-500"   },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", numBg: "bg-orange-500", numText: "text-white",       dotBg: "bg-orange-500" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/30",     border: "border-teal-200 dark:border-teal-800",     numBg: "bg-teal-500",   numText: "text-white",       dotBg: "bg-teal-500"   },
  rose:   { bg: "bg-rose-50 dark:bg-rose-950/30",     border: "border-rose-200 dark:border-rose-800",     numBg: "bg-rose-500",   numText: "text-white",       dotBg: "bg-rose-500"   },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800", numBg: "bg-indigo-500", numText: "text-white",       dotBg: "bg-indigo-500" },
  emerald:{ bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", numBg: "bg-emerald-500", numText: "text-white",  dotBg: "bg-emerald-500" },
  amber:  { bg: "bg-amber-50 dark:bg-amber-950/30",   border: "border-amber-200 dark:border-amber-800",   numBg: "bg-amber-500",  numText: "text-white",       dotBg: "bg-amber-500"  },
  sky:    { bg: "bg-sky-50 dark:bg-sky-950/30",       border: "border-sky-200 dark:border-sky-800",       numBg: "bg-sky-500",    numText: "text-white",       dotBg: "bg-sky-500"    },
  fuchsia:{ bg: "bg-fuchsia-50 dark:bg-fuchsia-950/30", border: "border-fuchsia-200 dark:border-fuchsia-800", numBg: "bg-fuchsia-500", numText: "text-white",  dotBg: "bg-fuchsia-500" },
  slate:  { bg: "bg-slate-50 dark:bg-slate-950/30",   border: "border-slate-200 dark:border-slate-800",   numBg: "bg-slate-500",  numText: "text-white",       dotBg: "bg-slate-500"  },
  red:    { bg: "bg-red-50 dark:bg-red-950/30",       border: "border-red-200 dark:border-red-800",       numBg: "bg-red-500",    numText: "text-white",       dotBg: "bg-red-500"    },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800", numBg: "bg-violet-500", numText: "text-white",       dotBg: "bg-violet-500" },
  white:  { bg: "bg-white dark:bg-slate-800",         border: "border-slate-200 dark:border-slate-700",   numBg: "bg-slate-200 dark:bg-slate-700", numText: "text-slate-900 dark:text-white", dotBg: "bg-slate-500" },
};

const flowColors: Record<AppColor, string> = {
  cyan:   "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700",
  white:  "bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600",
  green:  "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700",
  indigo: "bg-indigo-200 text-indigo-800 border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-700",
  blue:   "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700",
  purple: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700",
  pink:   "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/50 dark:text-pink-200 dark:border-pink-700",
  teal:   "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/50 dark:text-teal-200 dark:border-teal-700",
  emerald:"bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700",
  amber:  "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700",
  sky:    "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/50 dark:text-sky-200 dark:border-sky-700",
  fuchsia:"bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/50 dark:text-fuchsia-200 dark:border-fuchsia-700",
  slate:  "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/50 dark:text-slate-200 dark:border-slate-700",
  red:    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700",
  violet: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/50 dark:text-violet-200 dark:border-violet-700",
  orange: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700",
  rose:   "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/50 dark:text-rose-200 dark:border-rose-700",
};

const noteColors: Record<AppColor, { bg: string; border: string; text: string; codeBg: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/40",     border: "border-blue-200 dark:border-blue-800",     text: "text-blue-800 dark:text-blue-200",   codeBg: "bg-blue-100 dark:bg-blue-900"   },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/40", border: "border-purple-200 dark:border-purple-800", text: "text-purple-800 dark:text-purple-200", codeBg: "bg-purple-100 dark:bg-purple-900" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/40",     border: "border-teal-200 dark:border-teal-800",     text: "text-teal-800 dark:text-teal-200",   codeBg: "bg-teal-100 dark:bg-teal-900"   },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/40", border: "border-orange-200 dark:border-orange-800", text: "text-orange-800 dark:text-orange-200", codeBg: "bg-orange-100 dark:bg-orange-900" },
  rose:   { bg: "bg-rose-50 dark:bg-rose-950/40",     border: "border-rose-200 dark:border-rose-800",     text: "text-rose-800 dark:text-rose-200",   codeBg: "bg-rose-100 dark:bg-rose-900"   },
  amber:  { bg: "bg-amber-50 dark:bg-amber-950/40",   border: "border-amber-200 dark:border-amber-800",   text: "text-amber-800 dark:text-amber-200", codeBg: "bg-amber-100 dark:bg-amber-900" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/40", border: "border-indigo-200 dark:border-indigo-800", text: "text-indigo-800 dark:text-indigo-200", codeBg: "bg-indigo-100 dark:bg-indigo-900" },
  green:  { bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-800 dark:text-emerald-200", codeBg: "bg-emerald-100 dark:bg-emerald-900" },
  emerald:{ bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-800 dark:text-emerald-200", codeBg: "bg-emerald-100 dark:bg-emerald-900" },
  sky:    { bg: "bg-sky-50 dark:bg-sky-950/40",       border: "border-sky-200 dark:border-sky-800",       text: "text-sky-800 dark:text-sky-200",     codeBg: "bg-sky-100 dark:bg-sky-900"     },
  fuchsia:{ bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40", border: "border-fuchsia-200 dark:border-fuchsia-800", text: "text-fuchsia-800 dark:text-fuchsia-200", codeBg: "bg-fuchsia-100 dark:bg-fuchsia-900" },
  slate:  { bg: "bg-slate-50 dark:bg-slate-950/40",   border: "border-slate-200 dark:border-slate-800",   text: "text-slate-800 dark:text-slate-200", codeBg: "bg-slate-100 dark:bg-slate-900" },
  red:    { bg: "bg-red-50 dark:bg-red-950/40",       border: "border-red-200 dark:border-red-800",       text: "text-red-800 dark:text-red-200",     codeBg: "bg-red-100 dark:bg-red-900"     },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/40", border: "border-violet-200 dark:border-violet-800", text: "text-violet-800 dark:text-violet-200", codeBg: "bg-violet-100 dark:bg-violet-900" },
  cyan:   { bg: "bg-cyan-50 dark:bg-cyan-950/40",     border: "border-cyan-200 dark:border-cyan-800",     text: "text-cyan-800 dark:text-cyan-200",   codeBg: "bg-cyan-100 dark:bg-cyan-900"   },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-950/40", border: "border-yellow-200 dark:border-yellow-800", text: "text-yellow-800 dark:text-yellow-200", codeBg: "bg-yellow-100 dark:bg-yellow-900" },
  pink:   { bg: "bg-pink-50 dark:bg-pink-950/40",     border: "border-pink-200 dark:border-pink-800",     text: "text-pink-800 dark:text-pink-200",   codeBg: "bg-pink-100 dark:bg-pink-900"   },
  white:  { bg: "bg-white dark:bg-slate-800",         border: "border-slate-200 dark:border-slate-700",   text: "text-slate-700 dark:text-slate-200", codeBg: "bg-slate-100 dark:bg-slate-900" },
};

const circleColorMap: Record<string, string> = {
  "bg-blue-600":   "bg-blue-600",
  "bg-purple-600": "bg-purple-600",
  "bg-teal-600":   "bg-teal-600",
  "bg-orange-600": "bg-orange-600",
  "bg-rose-600":   "bg-rose-600",
  "bg-amber-600":  "bg-amber-600",
  "bg-emerald-600":"bg-emerald-600",
  "bg-indigo-600": "bg-indigo-600",
  "bg-pink-600":   "bg-pink-600",
  "bg-cyan-600":   "bg-cyan-600",
  "bg-violet-600": "bg-violet-600",
  "bg-green-600":  "bg-green-600",
};

// ─── Concept Section ───────────────────────────────────────────────────────────

function ConceptSection({ data, topic }: { data: ConceptData; topic: TopicData }) {
  return (
    <section className="py-12 md:py-16 container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <Card className={cn(
          "border-2 shadow-lg",
          `border-${topic.accentColor}-200 dark:border-${topic.accentColor}-800`
        )}>
          <CardHeader className={cn(
            "bg-gradient-to-r",
            topic.gradientFrom, topic.gradientTo,
            topic.darkGradientFrom, topic.darkGradientTo
          )}>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className={cn("p-2 rounded-lg text-white", topic.iconBg)}>
                <Lightbulb className="h-5 w-5" />
              </div>
              <span className="text-slate-900 dark:text-white">{data.question}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">

            {/* Main explanation */}
            <p
              className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: data.explanation }}
            />

            {/* Analogy */}
            {data.analogy && (
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span> {data.analogy.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">{data.analogy.intro}</p>
                <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                  {data.analogy.bullets.map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Structure */}
            {data.structure && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">{data.structure.title}</h3>
                <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm mb-4 overflow-x-auto">
                  <pre className="text-slate-300 whitespace-pre">{data.structure.code}</pre>
                </div>
                <div className="space-y-3">
                  {data.structure.parts.map((part) => {
                    const c = partColors[part.color];
                    return (
                      <div key={part.num} className={cn("flex items-start gap-3 p-3 rounded-lg border", c.bg, c.border)}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0", c.numBg, c.numText)}>
                          {part.num}
                        </div>
                        <div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white font-mono">{part.code}</span>
                            <span className="text-slate-600 dark:text-slate-300"> → {part.description} </span>
                            <span className="text-slate-500 dark:text-slate-400 italic">{part.badge}</span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{part.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Execution Flow */}
            {data.flow && (
              <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-5 border border-indigo-200 dark:border-indigo-800">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">{data.flow.title}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {data.flow.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className={cn("px-3 py-2 rounded-lg border font-medium text-sm", flowColors[step.color])}>
                        {step.label}
                      </span>
                      {idx < data.flow!.steps.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ─── Examples Section ──────────────────────────────────────────────────────────

function ExamplesSection({ examples, topic }: { examples: ExampleData[]; topic: TopicData }) {
  return (
    <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Coba Sendiri!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {topic.examplesSubtitle || 'Edit kode di bawah, lalu tekan "Jalankan Kode" untuk melihat hasilnya'}
              </p>
            </div>
          </div>

          <div className="space-y-10">
            {examples.map((ex) => {
              const nc = ex.note ? noteColors[ex.note.color] : null;
              return (
                <div key={`${topic.id}-${ex.number}`}>
                  {/* Example header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full text-white flex items-center justify-center font-bold",
                      circleColorMap[ex.circleColor] || "bg-blue-600"
                    )}>
                      {ex.number}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{ex.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{ex.subtitle}</p>
                    </div>
                  </div>

                  <InteractiveCodeEditor
                    key={`editor-${topic.id}-${ex.number}`}
                    initialCode={ex.code}
                  />

                  {/* Note */}
                  {ex.note && nc && (
                    <div className={cn("mt-3 p-4 rounded-lg border", nc.bg, nc.border)}>
                      <p className={cn("text-sm", nc.text)}>
                        <strong>{ex.note.bold}</strong> {ex.note.text}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tips Section ──────────────────────────────────────────────────────────────

function TipsSection({ tips }: { tips: TipsData }) {
  return (
    <section className="py-12 md:py-16 container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-emerald-600 text-white">
                <Lightbulb className="h-5 w-5" />
              </div>
              <span className="text-slate-900 dark:text-white">Tips Penting</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Do's */}
              <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-3 flex items-center gap-2">
                  <span className="text-xl">✅</span> {tips.whenTitle}
                </h4>
                <ul className="text-sm text-emerald-800 dark:text-emerald-300 space-y-2">
                  {tips.when.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>

              {/* Don'ts */}
              <div className="p-5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <h4 className="font-bold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                  <span className="text-xl">⚠️</span> {tips.avoidTitle}
                </h4>
                <ul className="text-sm text-red-800 dark:text-red-300 space-y-2">
                  {tips.avoid.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: `• ${item}` }} />
                  ))}
                </ul>
              </div>
            </div>

            {/* Operator table */}
            {tips.operators && (
              <div className="mt-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">
                  {tips.operatorsTitle || "Referensi Cepat:"}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {tips.operators.map((op, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                      <code className="font-bold text-blue-600 dark:text-blue-400">{op.code}</code>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs">{op.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ─── Exercises Section ─────────────────────────────────────────────────────────

function ExercisesSection({ exercises, topicId }: { exercises: ExerciseData[]; topicId: string }) {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/20 dark:via-slate-950 dark:to-blue-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Latihan</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Uji pemahamanmu dengan mengisi bagian yang kosong
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {exercises.map((ex) => (
              <ExerciseCard
                key={`exercise-${topicId}-${ex.number}`}
                number={ex.number}
                title={ex.title}
                description={ex.description}
                task={ex.task}
                initialCode={ex.initialCode}
                expectedOutputs={ex.expectedOutputs}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main TopicPage export ─────────────────────────────────────────────────────

export function TopicPage({ data }: { data: TopicData }) {
  return (
    <div>
      <ConceptSection data={data.concept} topic={data} />
      <ExamplesSection examples={data.examples} topic={data} />
      {data.tips && <TipsSection tips={data.tips} />}
      <ExercisesSection exercises={data.exercises} topicId={data.id} />
    </div>
  );
}
