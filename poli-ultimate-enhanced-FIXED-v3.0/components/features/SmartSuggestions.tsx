import React from 'react';
import { Lightbulb } from 'lucide-react';

export const SmartSuggestions = ({ topic }: { topic: string }) => (
  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      <Lightbulb className="w-5 h-5 text-blue-600" />
      <h3 className="font-semibold">Smart Suggestions</h3>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Based on "{topic}", you might also be interested in related topics.
    </p>
  </div>
);
