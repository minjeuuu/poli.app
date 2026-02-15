import React from 'react';

export const ProgressTracker = ({ current, total }: { current: number; total: number }) => {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  return (
    <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
      <div
        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};
