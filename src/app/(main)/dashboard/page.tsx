"use client";

import { useEffect, useState } from 'react';
import { HiringVelocityTrendline } from '@/components/dashboard/HiringVelocityTrendline';
import { IndustryDistribution } from '@/components/dashboard/IndustryDistribution';
import { ExperienceLevelAnalysis } from '@/components/dashboard/ExperienceLevelAnalysis';
import { TopRoles } from '@/components/dashboard/TopRoles';
import { TopEmployers } from '@/components/dashboard/TopEmployers';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';

interface DashboardStats {
  hiringVelocity: { labels: string[]; data: number[] };
  industryDistribution: { labels: string[]; data: number[] };
  experienceLevel: { labels: string[]; data: number[] };
  topRoles: { title: string; openings: number }[];
  topEmployers: { name: string; openings: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState('San Francisco Bay Area');
  const [timeframe, setTimeframe] = useState('12m');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const response = await fetch(`/api/dashboard/stats?region=${region}&timeframe=${timeframe}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [region, timeframe]);

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="space-y-6">
      <DashboardFilters onRegionChange={handleRegionChange} onTimeframeChange={handleTimeframeChange} />

      {loading && <div className="text-center p-8">Loading dashboard...</div>}
      {error && <div className="text-center p-8 text-red-500">Error: {error}</div>}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-4 bg-white rounded-lg shadow-md">
              <HiringVelocityTrendline data={stats.hiringVelocity} />
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <IndustryDistribution data={stats.industryDistribution} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-4 bg-white rounded-lg shadow-md">
              <ExperienceLevelAnalysis data={stats.experienceLevel} />
            </div>
            <div className="md:col-span-1">
              <TopRoles data={stats.topRoles} />
            </div>
            <div className="md:col-span-1">
              <TopEmployers data={stats.topEmployers} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}