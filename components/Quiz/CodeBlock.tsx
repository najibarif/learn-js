"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#1e1e1e]">
      {/* VS Code Header */}
      <div className="bg-[#252526] px-4 py-2 flex items-center gap-2 border-b border-black/20">
         <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
         </div>
         <div className="bg-[#1e1e1e] px-4 py-1.5 rounded-t-lg border-t border-x border-white/5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Untitled-1</span>
         </div>
      </div>
      
      {/* Code Content */}
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
