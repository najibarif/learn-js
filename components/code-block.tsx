"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Copy, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  editable?: boolean;
  onCodeChange?: (code: string) => void;
}

export function CodeBlock({
  code,
  language = "javascript",
  className,
  editable = true,
  onCodeChange,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [currentCode, setCurrentCode] = useState(code);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    onCodeChange?.(newCode);
  };

  const resetCode = () => {
    setCurrentCode(code);
    setOutput([]);
    onCodeChange?.(code);
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);

    const logs: string[] = [];
    const originalConsoleLog = console.log;

    // Override console.log to capture output
    console.log = (...args) => {
      logs.push(args.map((arg) => String(arg)).join(" "));
    };

    try {
      // Create a safe execution context
      const executeCode = new Function(currentCode);
      executeCode();
      setOutput(logs.length > 0 ? logs : ["(Tidak ada output)"]);
    } catch (error) {
      setOutput([`Error: ${error instanceof Error ? error.message : "Unknown error"}`]);
    } finally {
      // Restore original console.log
      console.log = originalConsoleLog;
      setIsRunning(false);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [currentCode]);

  return (
    <div className={cn("relative group rounded-lg overflow-hidden border", className)}>
      {/* Header */}
      <div className="flex items-center justify-between bg-foreground/10 px-4 py-2 text-sm">
        <span className="text-muted-foreground font-mono">{language}</span>
        <div className="flex items-center gap-2">
          {editable && (
            <button
              onClick={resetCode}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Reset kode"
              title="Reset ke kode awal"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={copyToClipboard}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Salin kode"
          >
            {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="bg-foreground/5 p-4">
        {editable ? (
          <textarea
            ref={textareaRef}
            value={currentCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full bg-transparent text-sm font-mono text-foreground resize-none focus:outline-none min-h-[120px] leading-relaxed"
            spellCheck={false}
          />
        ) : (
          <pre className="overflow-x-auto">
            <code className="text-sm font-mono text-foreground">{currentCode}</code>
          </pre>
        )}
      </div>

      {/* Run Button */}
      {editable && (
        <div className="border-t bg-muted/30 px-4 py-3">
          <Button
            onClick={runCode}
            disabled={isRunning}
            size="sm"
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Menjalankan..." : "Jalankan Kode"}
          </Button>
        </div>
      )}

      {/* Output Console */}
      {output.length > 0 && (
        <div className="border-t bg-card">
          <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
            Output:
          </div>
          <div className="p-4 font-mono text-sm max-h-48 overflow-y-auto">
            {output.map((line, index) => (
              <div
                key={index}
                className={cn(
                  "py-0.5",
                  line.startsWith("Error:") ? "text-destructive" : "text-accent"
                )}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
