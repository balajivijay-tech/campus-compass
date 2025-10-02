"use client";

import { X } from 'phosphor-react';

interface Employer {
  id: string;
  name: string;
  industry: string;
  region: string;
  description: string;
  website: string;
}

interface EmployerDetailModalProps {
  employer: Employer | null;
  onClose: () => void;
}

export function EmployerDetailModal({ employer, onClose }: EmployerDetailModalProps) {
  if (!employer) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{employer.name}</h2>
        <p className="text-sm text-gray-500 mb-4">{employer.industry} - {employer.region}</p>
        <p className="text-gray-700 mb-4">{employer.description}</p>
        <a
          href={employer.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Visit Website
        </a>
      </div>
    </div>
  );
}