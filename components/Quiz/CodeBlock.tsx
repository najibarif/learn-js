"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-900 dark:bg-slate-950">
      <div className="bg-slate-800 dark:bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-black/20">
         <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-slate-600" />
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <div className="w-3 h-3 rounded-full bg-slate-400" />
         </div>
         <div className="bg-slate-900 dark:bg-slate-950 px-4 py-1.5 rounded-t-lg border-t border-x border-slate-700/50">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Untitled-1</span>
         </div>
      </div>
      
      <div className="p-4 text-lg">
        <SyntaxHighlighter 
          language={language} 
          style={vscDarkPlus}
          customStyle={{ 
            background: 'transparent',
            padding: 0,
            margin: 0,
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
