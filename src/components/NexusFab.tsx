import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface NexusFabProps {
  onClick: () => void;
}

export const NexusFab: React.FC<NexusFabProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-18 right-4 z-40 flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-emerald-600 to-slate-900 text-white px-3.5 py-2.5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-emerald-400/30 print:hidden cursor-pointer"
      aria-label="Majid IA"
    >
      <div className="relative">
        <Bot className="w-5 h-5 text-white" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
        </span>
      </div>
      <span className="text-xs font-bold tracking-wide hidden sm:inline">
        Majid IA
      </span>
      <Sparkles className="w-3.5 h-3.5 text-emerald-300 group-hover:rotate-12 transition-transform" />
    </button>
  );
};
