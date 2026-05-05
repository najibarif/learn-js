"use client";

import { useState, useEffect } from "react";
import { TopicPage } from "@/components/topic-page";
import { ThemeToggle } from "@/components/theme-toggle";
import { introTopic } from "@/data/01-intro";
import { varsTopic } from "@/data/02-vars";
import { operatorsTopic } from "@/data/03-operators";
import { branchTopic } from "@/data/04-branching";
import { loopsTopic } from "@/data/05-loops";
import { functionsTopic } from "@/data/06-functions";
import { arraysTopic } from "@/data/07-arrays";
import { objectsTopic } from "@/data/08-objects";
import { stringsTopic } from "@/data/09-strings";
import { errorsTopic } from "@/data/10-errors";
import { domTopic } from "@/data/11-dom";
import { eventsTopic } from "@/data/12-events";
import { asyncTopic } from "@/data/13-async";
import { modulesTopic } from "@/data/14-modules";
import { advancedTopic } from "@/data/15-advanced";

import {
  BookOpen, Box, Calculator, GitBranch, Repeat, Zap, List, Component,
  Type, AlertTriangle, Layout, MousePointerClick, Clock, Blocks, Rocket,
  ChevronRight, CheckCircle2, Code, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Topic registry ───────────────────────────────────────────────────────────

const topics = [
  { id: "intro",     label: "1. Pengenalan",   icon: BookOpen,          color: "from-blue-500 to-cyan-500",      data: introTopic     },
  { id: "vars",      label: "2. Variabel",     icon: Box,               color: "from-violet-500 to-purple-500",  data: varsTopic      },
  { id: "operators", label: "3. Operator",     icon: Calculator,        color: "from-indigo-500 to-blue-500",    data: operatorsTopic },
  { id: "branch",    label: "4. Percabangan",  icon: GitBranch,         color: "from-amber-500 to-orange-500",   data: branchTopic    },
  { id: "loops",     label: "5. Perulangan",   icon: Repeat,            color: "from-emerald-500 to-teal-500",   data: loopsTopic     },
  { id: "functions", label: "6. Function",     icon: Zap,               color: "from-pink-500 to-rose-500",      data: functionsTopic },
  { id: "arrays",    label: "7. Array",        icon: List,              color: "from-sky-500 to-blue-500",       data: arraysTopic    },
  { id: "objects",   label: "8. Object",       icon: Component,         color: "from-rose-500 to-pink-500",      data: objectsTopic   },
  { id: "strings",   label: "9. String",       icon: Type,              color: "from-yellow-500 to-amber-500",   data: stringsTopic   },
  { id: "errors",    label: "10. Error",       icon: AlertTriangle,     color: "from-red-500 to-orange-500",     data: errorsTopic    },
  { id: "dom",       label: "11. DOM",         icon: Layout,            color: "from-violet-500 to-fuchsia-500", data: domTopic       },
  { id: "events",    label: "12. Events",      icon: MousePointerClick, color: "from-orange-500 to-amber-500",   data: eventsTopic    },
  { id: "async",     label: "13. Async",       icon: Clock,             color: "from-teal-500 to-emerald-500",   data: asyncTopic     },
  { id: "modules",   label: "14. Modules",     icon: Blocks,            color: "from-slate-500 to-gray-500",     data: modulesTopic   },
  { id: "advanced",  label: "15. Advanced",    icon: Rocket,            color: "from-indigo-500 to-blue-500",    data: advancedTopic  },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeId, setActiveId] = useState("intro");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeTopic = topics.find((t) => t.id === activeId)!;
  const activeIdx   = topics.findIndex((t) => t.id === activeId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeId]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">

      {/* ── Sidebar Overlay ───────────────────────────────────────────── */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-white dark:bg-slate-950 shadow-2xl z-[70] transform transition-transform duration-300 ease-out border-r border-slate-200 dark:border-slate-800 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">Daftar Modul</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-hide">
          {topics.map((t, idx) => {
            const Icon = t.icon;
            const isActive = t.id === activeId;
            const isDone   = idx < activeIdx;
            
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveId(t.id);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border text-left",
                  isActive
                    ? `bg-gradient-to-r ${t.color} text-white border-transparent shadow-md`
                    : isDone
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/50"
                    : "bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                {isDone
                  ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  : <Icon className="h-4 w-4 flex-shrink-0" />
                }
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Sticky Header ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3">

          {/* Brand row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Buka Menu Sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                <Code className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">LearnJS</span>
                <span className="text-slate-400 dark:text-slate-500 text-xs ml-2 hidden lg:inline">
                  Belajar JavaScript Interaktif
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono hidden sm:block">
                {activeIdx + 1}/{topics.length} Topik
              </span>
              <Link
                href="/quiz"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <Zap className="h-4 w-4" />
                <span className="inline">Kuis</span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Section for active topic ───────────────────────────────── */}
      <section className={cn("bg-gradient-to-br py-14 md:py-20", activeTopic.color.replace("from-", "from-").replace("to-", "to-"), "to-indigo-50 dark:to-slate-950")}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 text-white shadow-lg bg-gradient-to-r",
              activeTopic.color
            )}>
              <activeTopic.icon className="h-4 w-4" />
              Topik {activeIdx + 1} dari {topics.length}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 text-balance">
              Belajar{" "}
              <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", activeTopic.color)}>
                {activeTopic.label}
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 text-pretty">
              Pahami konsep dengan mudah melalui penjelasan lengkap, contoh interaktif, dan latihan soal.
            </p>
          </div>
        </div>
      </section>

      {/* ── Topic Content ────────────────────────────────────────────────── */}
      <TopicPage data={activeTopic.data} />

      {/* ── Navigation footer ───────────────────────────────────────────── */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">

            {/* Prev */}
            <button
              onClick={() => activeIdx > 0 && setActiveId(topics[activeIdx - 1].id)}
              disabled={activeIdx === 0 || undefined}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            >
              ← Sebelumnya
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {topics.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    t.id === activeId
                      ? "w-6 h-2.5 bg-violet-500"
                      : i < activeIdx
                      ? "w-2.5 h-2.5 bg-emerald-400"
                      : "w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                  )}
                  title={t.label}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => activeIdx < topics.length - 1 && setActiveId(topics[activeIdx + 1].id)}
              disabled={activeIdx === topics.length - 1 || undefined}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all shadow-md",
                "bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              Selanjutnya <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 text-center space-y-4">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
          >
            <Zap className="h-4 w-4" />
            Ikuti Kuis Interaktif
          </Link>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            LearnJS — Platform Belajar JavaScript Interaktif
          </p>
        </div>
      </footer>
    </div>
  );
}
