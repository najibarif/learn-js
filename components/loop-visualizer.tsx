"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoopVisualizerProps {
  maxIterations: number;
  label: string;
  speed?: number;
}

export function LoopVisualizer({ maxIterations, label, speed = 500 }: LoopVisualizerProps) {
  const [currentIteration, setCurrentIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && currentIteration < maxIterations) {
      intervalRef.current = setTimeout(() => {
        setOutput((prev) => [...prev, `${label} ${currentIteration + 1}`]);
        setCurrentIteration((prev) => prev + 1);
      }, speed);
    } else if (currentIteration >= maxIterations) {
      setIsRunning(false);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isRunning, currentIteration, maxIterations, label, speed]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setCurrentIteration(0);
    setOutput([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            disabled={currentIteration >= maxIterations}
            size="sm"
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Jalankan
          </Button>
        ) : (
          <Button onClick={handlePause} size="sm" variant="secondary" className="gap-2">
            <Pause className="h-4 w-4" />
            Jeda
          </Button>
        )}
        <Button onClick={handleReset} size="sm" variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Iterasi:</span>
        <div className="flex gap-1">
          {Array.from({ length: maxIterations }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-8 rounded-md flex items-center justify-center text-sm font-mono transition-all duration-300",
                i < currentIteration
                  ? "bg-primary text-primary-foreground scale-105"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-foreground/5 rounded-lg p-4 min-h-[100px] font-mono text-sm">
        <div className="text-muted-foreground mb-2">Output:</div>
        {output.length === 0 ? (
          <span className="text-muted-foreground/50 italic">
            Tekan &quot;Jalankan&quot; untuk memulai...
          </span>
        ) : (
          output.map((line, i) => (
            <div key={i} className="text-accent animate-in fade-in slide-in-from-left-2 duration-300">
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
