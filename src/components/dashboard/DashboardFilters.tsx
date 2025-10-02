"use client";

import { MapPin, Calendar } from 'phosphor-react';

interface DashboardFiltersProps {
  onRegionChange: (region: string) => void;
  onTimeframeChange: (timeframe: string) => void;
}

export function DashboardFilters({ onRegionChange, onTimeframeChange }: DashboardFiltersProps) {
  const regions = ['San Francisco Bay Area', 'New York City', 'Austin, TX'];
  const timeframes = ['3m', '6m', '12m'];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <MapPin size={20} className="text-gray-500 mr-2" />
          <select
            onChange={(e) => onRegionChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Calendar size={20} className="text-gray-500 mr-2" />
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => onTimeframeChange(timeframe)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {timeframe.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}