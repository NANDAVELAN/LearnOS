import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

export default function Flashcard({ front, back, onRate }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="max-w-md mx-auto">
      <div
        onClick={() => setFlipped(!flipped)}
        className="cursor-pointer bg-white rounded-2xl border border-slate-200 shadow-md p-8 min-h-[220px] flex flex-col justify-between transition-all hover:shadow-lg"
      >
        <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase">
          <span>{flipped ? 'Answer' : 'Question'}</span>
          <RotateCw className="w-4 h-4 text-slate-400" />
        </div>
        <div className="my-auto text-center py-4">
          <p className="text-lg font-medium text-slate-800">
            {flipped ? back : front}
          </p>
        </div>
        <p className="text-center text-xs text-slate-400">Click card to flip</p>
      </div>

      {flipped && (
        <div className="flex justify-center space-x-3 mt-4">
          <button
            onClick={() => onRate && onRate(1)}
            className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-sm font-semibold border border-rose-200 transition-colors"
          >
            Hard (1d)
          </button>
          <button
            onClick={() => onRate && onRate(2)}
            className="px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-semibold border border-amber-200 transition-colors"
          >
            Good (3d)
          </button>
          <button
            onClick={() => onRate && onRate(3)}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-semibold border border-emerald-200 transition-colors"
          >
            Easy (7d)
          </button>
        </div>
      )}
    </div>
  );
}

