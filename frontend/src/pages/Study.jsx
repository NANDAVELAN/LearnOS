import React, { useState } from 'react';
import { GraduationCap, Sparkles, Send } from 'lucide-react';
import StudyTimer from '../components/StudyTimer';
import AttentionIndicator from '../components/AttentionIndicator';

export default function Study() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Active Study Session</h2>
          <p className="text-sm text-slate-500 mt-1">
            Focus with the study timer, AI tutor grounding, and privacy-preserving attention signals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StudyTimer initialMinutes={25} />
        <AttentionIndicator
          enabled={cameraEnabled}
          state="FOCUSED"
          score={0.88}
          onToggle={() => setCameraEnabled(!cameraEnabled)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 mb-2">
            <GraduationCap className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">AI Study Partner (Phase 2)</span>
          </div>
          <p className="text-sm text-slate-600">
            Ask any question about your course materials. In Phase 2, the RAG retriever will fetch the most relevant textbook chunks and cite the exact pages.
          </p>
        </div>

        <div className="mt-8 flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a concept question (e.g. Explain PCA simply)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
          />
          <button
            onClick={() => {
              if (message) {
                alert('Tutor query submitted! Phase 2 will execute the full RAG pipeline.');
                setMessage('');
              }
            }}
            className="p-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors shadow-md shadow-sky-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

