import React from 'react';
import { Zap, Star, TrendingUp, Award } from 'lucide-react';

export const QuickActions = () => (
  <div className="grid grid-cols-4 gap-2">
    {[
      { icon: Zap, label: 'Quick Search', color: 'bg-yellow-500' },
      { icon: Star, label: 'Favorites', color: 'bg-blue-500' },
      { icon: TrendingUp, label: 'Trending', color: 'bg-green-500' },
      { icon: Award, label: 'Achievements', color: 'bg-purple-500' }
    ].map(({ icon: Icon, label, color }) => (
      <button key={label} className={`${color} text-white p-3 rounded-lg flex flex-col items-center gap-1`}>
        <Icon className="w-5 h-5" />
        <span className="text-xs">{label}</span>
      </button>
    ))}
  </div>
);
