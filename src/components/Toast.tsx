import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-8 z-50 max-w-sm sm:max-w-md bg-[#1a1c19] text-[#fafaf4] px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 border border-white/10">
      <div className="flex items-center gap-2.5">
        <CheckCircle2 className="w-5 h-5 text-[#a3f69c] shrink-0" />
        <span className="text-xs font-medium leading-snug">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
