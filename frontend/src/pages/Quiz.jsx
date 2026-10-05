import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import QuizCard from '../components/QuizCard';

export default function Quiz() {
  const [selected, setSelected] = useState(null);

  const sampleQuestion = {
    question: "What is the primary dimensionality reduction objective of Principal Component Analysis (PCA)?",
    options: [
      "Maximize the variance of the projected data points",
      "Minimize the number of rows in the dataset",
      "Group data points into K clusters based on Euclidean distance",
      "Assign discrete class labels using a decision tree"
    ]
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Practice Quizzes & Diagnostics</h2>
        <p className="text-sm text-slate-500 mt-1">
          Evaluate your understanding with questions generated from your study materials (Phase 4).
        </p>
      </div>

      <div className="max-w-2xl">
        <QuizCard
          question={sampleQuestion.question}
          options={sampleQuestion.options}
          selectedIndex={selected}
          onSelect={(idx) => setSelected(idx)}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => alert(selected === 0 ? 'Correct! Variance is maximized.' : 'Phase 4 will provide full AI explanations & weak-topic telemetry.')}
            disabled={selected === null}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-md shadow-sky-200 transition-all"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}

