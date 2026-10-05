import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export default function StudyTimer({ initialMinutes = 25, onTimerEnd }) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      if (onTimerEnd) onTimerEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onTimerEnd]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setSecondsLeft(initialMinutes * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Study Timer</span>
          <div className="text-2xl font-bold text-slate-800 tracking-tight">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggle}
          className={`p-2 rounded-lg text-white font-medium ${
            isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-sky-600 hover:bg-sky-700'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

