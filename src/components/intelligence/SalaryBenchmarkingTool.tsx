"use client";

import { useState, useEffect } from 'react';

const cities = ['San Francisco Bay Area', 'New York City', 'Austin, TX'];
const roles = ['Software Engineer', 'Data Scientist', 'Product Manager'];
const experienceLevels = ['Fresher', 'Experienced'];

interface SalaryData {
    min: number;
    max: number;
    avg: number;
}

export function SalaryBenchmarkingTool() {
  const [city, setCity] = useState(cities[0]);
  const [role, setRole] = useState(roles[0]);
  const [experience, setExperience] = useState(experienceLevels[0]);
  const [salary, setSalary] = useState<SalaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSalaryData() {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/intelligence/salary?city=${encodeURIComponent(city)}&role=${encodeURIComponent(role)}&experience=${encodeURIComponent(experience)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch salary data');
            }
            const data = await response.json();
            if (data.min && data.max && data.avg) {
                 setSalary(data);
            } else {
                 setSalary(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setSalary(null);
        } finally {
            setLoading(false);
        }
    }

    fetchSalaryData();
  }, [city, role, experience]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Salary Benchmarking</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select value={city} onChange={(e) => setCity(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={experience} onChange={(e) => setExperience(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          {experienceLevels.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">Error: {error}</div>
      ) : salary ? (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Minimum</p>
            <p className="text-2xl font-bold text-green-600">${salary.min.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Average</p>
            <p className="text-2xl font-bold text-indigo-600">${salary.avg.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Maximum</p>
            <p className="text-2xl font-bold text-red-600">${salary.max.toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No data available for the selected criteria.</p>
        </div>
      )}
    </div>
  );
}