import React from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AttentionIndicator({
  enabled = false,
  state = 'FOCUSED',
  score = 0.85,
  onToggle
}) {
  const getBadge = () => {
    switch (state) {
      case 'FOCUSED':
        return { label: 'Focused', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'POSSIBLY_DISTRACTED':
        return { label: 'Distracted', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'FATIGUE_SIGNAL':
        return { label: 'Fatigue Signal', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Standby', color: 'bg-slate-50 text-slate-600 border-slate-200' };
    }
  };

  const badge = getBadge();

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-lg ${enabled ? 'bg-sky-50 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
          {enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700">Privacy Attention Signal</span>
            <span className="flex items-center text-[10px] text-emerald-600 font-medium">
              <ShieldCheck className="w-3 h-3 mr-0.5" /> Local Only
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {enabled ? `Estimated focus: ${Math.round(score * 100)}%` : 'Camera monitoring is disabled'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {enabled && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
            {badge.label}
          </span>
        )}
        <button
          onClick={onToggle}
          className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          {enabled ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  );
}

