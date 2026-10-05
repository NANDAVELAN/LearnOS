import React from 'react';
import Flashcard from '../components/Flashcard';

export default function Flashcards() {
  const sampleCard = {
    front: "What is the key difference between covariance and correlation?",
    back: "Covariance indicates the direction of the linear relationship between variables, whereas correlation normalizes covariance into a scale from -1 to +1 to measure strength."
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Spaced Review Flashcards</h2>
        <p className="text-sm text-slate-500 mt-1">
          Weak topics and missed quiz concepts automatically convert into active recall flashcards (Phase 6).
        </p>
      </div>

      <Flashcard
        front={sampleCard.front}
        back={sampleCard.back}
        onRate={(rating) => alert(`Rated difficulty ${rating}. Interval calculated via deterministic scheduler.`)}
      />
    </div>
  );
}

