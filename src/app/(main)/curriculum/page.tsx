"use client";

import { useState } from 'react';
import { CurriculumInput } from '@/components/curriculum/CurriculumInput';
import { AnalysisResultDisplay } from '@/components/curriculum/AnalysisResultDisplay';

interface AnalysisResult {
  skillsMatch: {
    matched: string[];
    missing: string[];
  };
  careerPathways: {
    role: string;
    description: string;
  }[];
  recommendations: string[];
}

export default function Curriculum() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/curriculum/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed. Please try again.');
      }

      const analysisResult = await response.json();
      setResult(analysisResult);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Curriculum Analyzer</h1>
      <CurriculumInput onAnalyze={handleAnalyze} loading={loading} />
      {error && <div className="text-center p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>}
      {result && <AnalysisResultDisplay result={result} />}
    </div>
  );
}