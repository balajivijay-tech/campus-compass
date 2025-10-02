"use client";

import { BuildingOffice } from 'phosphor-react';

interface TopEmployersProps {
  data: {
    name: string;
    openings: number;
  }[];
}

export function TopEmployers({ data }: TopEmployersProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Employers</h3>
      <ul>
        {data.map((employer, index) => (
          <li key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center">
              <BuildingOffice size={20} className="text-indigo-500 mr-3" />
              <span className="text-gray-700">{employer.name}</span>
            </div>
            <span className="font-medium text-gray-900">{employer.openings}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}