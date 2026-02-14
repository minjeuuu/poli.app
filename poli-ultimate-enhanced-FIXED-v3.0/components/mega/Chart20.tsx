import React from 'react';
import { TrendingUp } from 'lucide-react';

export const Chart20: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <div className="flex items-center gap-2 mb-4">
      <TrendingUp className="w-5 h-5 text-blue-600" />
      <h3 className="font-bold">Chart Type 20</h3>
    </div>
    <div className="h-64 flex items-center justify-center text-gray-500">
      Advanced Chart 20 - {data.length} data points
    </div>
  </div>
);
