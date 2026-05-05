"use client";

import { useState, useRef } from "react";
import { Play, RotateCcw, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeLine {
  code: string;
  explanation: string;
  visual?: React.ReactNode;
}

interface LineVisualizerProps {
  lines: CodeLine[];
  title?: string;
}

export function LineVisualizer({ lines, title }: LineVisualizerProps) {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [played, setPlayed] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playAll = () => {
    if (isPlaying) return;
    setPlayed(new Set());
    setActiveLine(null);
    setIsPlaying(true);
    let i = 0;
    const step = () => {
      if (i >= lines.length) {
        setIsPlaying(false);
        setActiveLine(null);
        return;
      }
      setActiveLine(i);
      setPlayed((prev) => new Set([...prev, i]));
      i++;
      timeoutRef.current = setTimeout(step, 900);
    };
    step();
  };

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    setActiveLine(null);
    setPlayed(new Set());
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {title && (
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Eye className="h-4 w-4" />
            {title}
          </div>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              title="Reset"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={playAll}
              disabled={isPlaying}
              className="flex items-center gap-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            >
              <Play className="h-3 w-3" />
              {isPlaying ? "Berjalan..." : "Putar Semua"}
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {lines.map((line, i) => (
          <div
            key={i}
            onClick={() => {
              setActiveLine(activeLine === i ? null : i);
              setPlayed((prev) => new Set([...prev, i]));
            }}
            className={cn(
              "flex gap-0 cursor-pointer group transition-all duration-300",
              activeLine === i
                ? "bg-violet-50 border-l-4 border-l-violet-500"
                : played.has(i)
                ? "bg-emerald-50/50 border-l-4 border-l-emerald-400"
                : "border-l-4 border-l-transparent hover:bg-slate-50"
            )}
          >
            {/* Line number */}
            <div
              className={cn(
                "w-10 flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold py-3 transition-colors",
                activeLine === i
                  ? "text-violet-600 bg-violet-100"
                  : played.has(i)
                  ? "text-emerald-600"
                  : "text-slate-400"
              )}
            >
              {i + 1}
            </div>

            {/* Code */}
            <div className="flex-1 min-w-0 px-3 py-3">
              <code
                className={cn(
                  "text-sm font-mono block transition-colors",
                  activeLine === i ? "text-violet-900" : "text-slate-700"
                )}
              >
                {line.code}
              </code>

              {/* Explanation - only show when active */}
              {activeLine === i && (
                <div className="mt-2 flex items-start gap-2 animate-in slide-in-from-top-1 duration-200">
                  <ChevronRight className="h-4 w-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-violet-700 font-medium">
                      {line.explanation}
                    </p>
                    {line.visual && (
                      <div className="mt-2">{line.visual}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Played indicator when not active */}
              {played.has(i) && activeLine !== i && (
                <p className="text-xs text-emerald-600 mt-1">
                  ✓ {line.explanation}
                </p>
              )}
            </div>

            {/* Arrow indicator */}
            <div
              className={cn(
                "w-8 flex items-center justify-center transition-all",
                activeLine === i ? "opacity-100" : "opacity-0 group-hover:opacity-40"
              )}
            >
              <ChevronRight className="h-4 w-4 text-violet-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
        👆 Klik baris kode untuk melihat penjelasannya
      </div>
    </div>
  );
}
