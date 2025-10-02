"use client";

import { useState, useEffect } from 'react';
import { BuildingOffice, MagnifyingGlass } from 'phosphor-react';
import { EmployerDetailModal } from './EmployerDetailModal';

interface Employer {
    id: string;
    name: string;
    industry: string;
    region: string;
    description: string;
    website: string;
}

export function EmployerDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);

  useEffect(() => {
    async function fetchEmployers() {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/intelligence/employers?search=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch employers');
            }
            const data = await response.json();
            setEmployers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setEmployers([]);
        } finally {
            setLoading(false);
        }
    }

    const debounceFetch = setTimeout(() => {
        fetchEmployers();
    }, 300); // Debounce search input

    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Employer Directory</h3>
      <div className="relative mb-4">
        <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search employers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">Error: {error}</div>
      ) : (
        <ul className="space-y-3">
          {employers.map(employer => (
            <li key={employer.id} onClick={() => setSelectedEmployer(employer)} className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center">
                <BuildingOffice size={24} className="text-indigo-500 mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">{employer.name}</p>
                  <p className="text-sm text-gray-600">{employer.industry} - {employer.region}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <EmployerDetailModal employer={selectedEmployer} onClose={() => setSelectedEmployer(null)} />
    </div>
  );
}