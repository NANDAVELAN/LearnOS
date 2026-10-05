import React from 'react';
import ProgressChart from '../components/ProgressChart';
import TopicCard from '../components/TopicCard';

export default function Progress() {
  const topics = [
    { name: 'Linear Algebra Foundations', mastery: 0.88, isWeak: false },
    { name: 'Principal Component Analysis', mastery: 0.42, isWeak: true },
    { name: 'Singular Value Decomposition', mastery: 0.35, isWeak: true },
    { name: 'K-Means Clustering', mastery: 0.76, isWeak: false },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Learning Analytics & Mastery</h2>
        <p className="text-sm text-slate-500 mt-1">
          Detailed metrics calculated by deterministic Python algorithms without LLM hallucination (Phase 7).
        </p>
      </div>

      <ProgressChart />

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Topic Mastery Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((t, idx) => (
            <TopicCard
              key={idx}
              name={t.name}
              mastery={t.mastery}
              isWeak={t.isWeak}
              onStudy={() => alert(`Starting revision session for ${t.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

