import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export const Widget30: React.FC = () => {
  const [active, setActive] = useState(false);
  return (
    <div 
      onClick={() => setActive(!active)}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
      }`}
    >
      <Sparkles className="w-6 h-6 mb-2" />
      <h4 className="font-semibold">Widget 30</h4>
      <p className="text-sm opacity-75">Interactive feature 30</p>
    </div>
  );
};
