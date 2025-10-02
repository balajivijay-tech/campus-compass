"use client";

import { Briefcase } from 'phosphor-react';

interface TopRolesProps {
  data: {
    title: string;
    openings: number;
  }[];
}

export function TopRoles({ data }: TopRolesProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Roles</h3>
      <ul>
        {data.map((role, index) => (
          <li key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center">
              <Briefcase size={20} className="text-indigo-500 mr-3" />
              <span className="text-gray-700">{role.title}</span>
            </div>
            <span className="font-medium text-gray-900">{role.openings}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}