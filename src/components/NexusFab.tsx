import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface NexusFabProps {
  onClick: () => void;
}

export const NexusFab: React.FC<NexusFabProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] lg:bottom-6 right-3 sm:right-5 z-40 flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-emerald-600 via-slate-900 to-indigo-900 text-white px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-emerald-400/40 print:hidden cursor-pointer touch-manipulation"
      aria-label="Majid AI - Propulsé par Gemini AI"
      title="Majid AI • Propulsé par Google Gemini"
    >
      <div className="relative">
        <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shadow-inner">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs font-black tracking-wide text-white">
          Majid AI
        </span>
        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 hidden xs:inline">
          Gemini
        </span>
      </div>

      <Sparkles className="w-3.5 h-3.5 text-indigo-300 group-hover:rotate-12 transition-transform" />
    </button>
  );
};
