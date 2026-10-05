import React from 'react';
import { BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TopicCard({ name, mastery = 0, isWeak = false, onStudy }) {
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-lg ${isWeak ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}>
          {isWeak ? <AlertTriangle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">{name}</h4>
          <p className="text-xs text-slate-500">
            {isWeak ? 'Needs reinforcement' : 'On track'} • Mastery: {Math.round(mastery * 100)}%
          </p>
        </div>
      </div>
      <button
        onClick={onStudy}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-sky-600 hover:text-white transition-colors"
      >
        Study
      </button>
    </div>
  );
}

