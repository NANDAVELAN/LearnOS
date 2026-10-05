import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function QuizCard({ question, options = [], selectedIndex, onSelect }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-2 text-sky-600 mb-3">
        <HelpCircle className="w-5 h-5" />
        <span className="text-xs font-semibold uppercase tracking-wider">Practice Question</span>
      </div>
      <p className="text-slate-800 font-medium mb-4 text-base">{question}</p>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect && onSelect(idx)}
            className={`w-full text-left p-3 rounded-lg border text-sm font-medium transition-all ${
              selectedIndex === idx
                ? 'border-sky-500 bg-sky-50 text-sky-900'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="inline-block w-6 text-slate-400 font-semibold">{String.fromCharCode(65 + idx)}.</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

