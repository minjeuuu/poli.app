import React from 'react';

export const ProgressTracker = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: \`\${(current / total) * 100}%\` }}
    />
  </div>
);
