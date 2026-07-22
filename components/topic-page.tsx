"use client";

import { useState, useEffect } from "react";
import { InteractiveCodeEditor } from "@/components/interactive-code-editor";
import { ExerciseCard } from "@/components/exercise-card";
import { Lightbulb, Code, GraduationCap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type AppColor = "cyan" | "yellow" | "green" | "blue" | "purple" | "pink" | "orange" | "teal" | "rose" | "indigo" | "emerald" | "amber" | "sky" | "fuchsia" | "slate" | "red" | "violet" | "white";

export interface StructurePart {
  num: number;
  code: string;
  badge: string;
  description: string;
  note: string;
  color: AppColor;
}

export interface FlowStep {
  label: string;
  color: AppColor;
}

export interface ConceptData {
  question: string;
  explanation: string;
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
  circleColor: string;
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
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  darkGradientFrom: string;
  darkGradientTo: string;
  iconBg: string;
  examplesSubtitle?: string;
  concept: ConceptData;
  examples: ExampleData[];
  tips?: TipsData;
  exercises: ExerciseData[];
}

const partColors: Record<AppColor, {
  bg: string; border: string; numBg: string; numText: string; dotBg: string;
}> = {
  cyan:   { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-500",  numText: "text-white", dotBg: "bg-slate-500"  },
  yellow: { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-400",  numText: "text-white", dotBg: "bg-slate-400"  },
  green:  { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-500",  numText: "text-white", dotBg: "bg-slate-500"  },
  blue:   { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-600",  numText: "text-white", dotBg: "bg-slate-600"  },
  purple: { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-500",  numText: "text-white", dotBg: "bg-slate-500"  },
  pink:   { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-400",  numText: "text-white", dotBg: "bg-slate-400"  },
  orange: { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-500",  numText: "text-white", dotBg: "bg-slate-500"  },
  teal:   { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-500",  numText: "text-white", dotBg: "bg-slate-500"  },
  rose:   { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-400",  numText: "text-white", dotBg: "bg-slate-400"  },
  indigo: { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-500",  numText: "text-white", dotBg: "bg-slate-500"  },
  emerald:{ bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-500",  numText: "text-white", dotBg: "bg-slate-500"  },
  amber:  { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-400",  numText: "text-white", dotBg: "bg-slate-400"  },
  sky:    { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-500",  numText: "text-white", dotBg: "bg-slate-500"  },
  fuchsia:{ bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-500",  numText: "text-white", dotBg: "bg-slate-500"  },
  slate:  { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-400",  numText: "text-white", dotBg: "bg-slate-400"  },
  red:    { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-500",  numText: "text-white", dotBg: "bg-slate-500"  },
  violet: { bg: "bg-slate-50 dark:bg-slate-900",   border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-400",  numText: "text-white", dotBg: "bg-slate-400"  },
  white:  { bg: "bg-white dark:bg-slate-900",       border: "border-slate-200 dark:border-slate-800", numBg: "bg-slate-300 dark:bg-slate-600", numText: "text-slate-900 dark:text-white", dotBg: "bg-slate-400" },
};

const flowColors: Record<AppColor, string> = {
  cyan:   "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  yellow: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  white:  "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  green:  "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  indigo: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  blue:   "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  purple: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  pink:   "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  teal:   "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  emerald:"bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  amber:  "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  sky:    "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  fuchsia:"bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  slate:  "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  red:    "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  violet: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  orange: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  rose:   "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

const noteColors: Record<AppColor, { bg: string; border: string; text: string; codeBg: string }> = {
  blue:   { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  purple: { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  teal:   { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  orange: { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  rose:   { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  amber:  { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  indigo: { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  green:  { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  emerald:{ bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  sky:    { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  fuchsia:{ bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  slate:  { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  red:    { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  violet: { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  cyan:   { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  yellow: { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  pink:   { bg: "bg-slate-50 dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
  white:  { bg: "bg-white dark:bg-slate-900",     border: "border-slate-200 dark:border-slate-800", text: "text-slate-600 dark:text-slate-400", codeBg: "bg-slate-100 dark:bg-slate-800" },
};

const circleColorMap: Record<string, string> = {
  "bg-blue-600":   "bg-slate-600",
  "bg-purple-600": "bg-slate-500",
  "bg-teal-600":   "bg-slate-500",
  "bg-orange-600": "bg-slate-500",
  "bg-rose-600":   "bg-slate-400",
  "bg-amber-600":  "bg-slate-400",
  "bg-emerald-600":"bg-slate-500",
  "bg-indigo-600": "bg-slate-500",
  "bg-pink-600":   "bg-slate-400",
  "bg-cyan-600":   "bg-slate-600",
  "bg-violet-600": "bg-slate-500",
  "bg-green-600":  "bg-slate-500",
};

function ConceptSection({ data, topic }: { data: ConceptData; topic: TopicData }) {
  return (
    <section className="py-12 container mx-auto px-6">
      <div className="max-w-3xl">
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-slate-500" />
              <span className="text-lg font-medium text-slate-900 dark:text-white">{data.question}</span>
            </div>
          </div>
          <div className="px-6 py-6 space-y-6">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.explanation }} />

            {data.analogy && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  💡 {data.analogy.title}
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-400">{data.analogy.intro}</p>
                <ul className="mt-2 space-y-1 text-base text-slate-500 dark:text-slate-400">
                  {data.analogy.bullets.map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.structure && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">{data.structure.title}</h3>
                <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-5 font-mono text-base overflow-x-auto">
                  <pre className="text-slate-300 whitespace-pre">{data.structure.code}</pre>
                </div>
                <div className="space-y-2">
                  {data.structure.parts.map((part) => {
                    const c = partColors[part.color];
                    return (
                      <div key={part.num} className={cn("flex items-start gap-3 p-4 rounded border", c.bg, c.border)}>
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-sm font-medium shrink-0", c.numBg, c.numText)}>
                          {part.num}
                        </div>
                        <div>
                          <span className="font-mono text-base font-medium text-slate-900 dark:text-white">{part.code}</span>
                          <span className="text-base text-slate-500 dark:text-slate-400"> → {part.description}</span>
                          <span className="text-base text-slate-400 dark:text-slate-500 italic ml-1">{part.badge}</span>
                          <p className="text-base text-slate-400 dark:text-slate-500 mt-0.5">{part.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {data.flow && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">{data.flow.title}</h3>
                <div className="flex flex-wrap items-center gap-1.5">
                  {data.flow.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className={cn("px-3 py-2 rounded text-base font-medium", flowColors[step.color])}>
                        {step.label}
                      </span>
                      {idx < data.flow!.steps.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExamplesSection({ examples, topic }: { examples: ExampleData[]; topic: TopicData }) {
  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2.5 mb-8">
            <Code className="h-5 w-5 text-slate-400" />
            <h2 className="text-xl font-medium text-slate-900 dark:text-white">Coba Sendiri</h2>
          </div>
          <div className="space-y-10">
            {examples.map((ex) => {
              const nc = ex.note ? noteColors[ex.note.color] : null;
              return (
                <div key={`${topic.id}-${ex.number}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-medium",
                      circleColorMap[ex.circleColor] || "bg-slate-500"
                    )}>
                      {ex.number}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">{ex.title}</h3>
                      <p className="text-sm text-slate-400 dark:text-slate-500">{ex.subtitle}</p>
                    </div>
                  </div>
                  <InteractiveCodeEditor key={`editor-${topic.id}-${ex.number}`} initialCode={ex.code} />
                  {ex.note && nc && (
                    <div className={cn("mt-3 p-4 rounded border text-base", nc.bg, nc.border, nc.text)}>
                      <strong>{ex.note.bold}</strong> {ex.note.text}
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

function TipsSection({ tips }: { tips: TipsData }) {
  return (
    <section className="py-12 container mx-auto px-6">
      <div className="max-w-3xl">
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-slate-500" />
              <span className="text-lg font-medium text-slate-900 dark:text-white">Tips Penting</span>
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-medium text-slate-900 dark:text-white mb-2">✅ {tips.whenTitle}</h4>
                <ul className="text-base text-slate-600 dark:text-slate-400 space-y-1">
                  {tips.when.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-base font-medium text-slate-900 dark:text-white mb-2">⚠️ {tips.avoidTitle}</h4>
                <ul className="text-base text-slate-500 dark:text-slate-400 space-y-1">
                  {tips.avoid.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: `• ${item}` }} />
                  ))}
                </ul>
              </div>
            </div>

            {tips.operators && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-base font-medium text-slate-900 dark:text-white mb-3">
                  {tips.operatorsTitle || "Referensi Cepat"}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-base">
                  {tips.operators.map((op, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-center">
                      <code className="font-medium text-slate-600 dark:text-slate-400">{op.code}</code>
                      <p className="text-slate-400 dark:text-slate-500 mt-0.5 text-sm">{op.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExercisesSection({ exercises, topicId }: { exercises: ExerciseData[]; topicId: string }) {
  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2.5 mb-8">
            <GraduationCap className="h-5 w-5 text-slate-400" />
            <h2 className="text-xl font-medium text-slate-900 dark:text-white">Latihan</h2>
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
