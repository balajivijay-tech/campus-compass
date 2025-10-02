"use client";

import { ChartPie, Lightbulb, TrendUp, CheckCircle, WarningCircle } from 'phosphor-react';

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

interface AnalysisResultDisplayProps {
  result: AnalysisResult | null;
}

export function AnalysisResultDisplay({ result }: AnalysisResultDisplayProps) {
  if (!result) {
    return null;
  }

  const totalSkills = result.skillsMatch.matched.length + result.skillsMatch.missing.length;
  const matchPercentage = totalSkills > 0 ? Math.round((result.skillsMatch.matched.length / totalSkills) * 100) : 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Gap Analysis */}
        <div className="p-4 border rounded-lg">
          <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <ChartPie size={22} className="mr-2 text-indigo-500" />
            Skills Gap Analysis
          </h4>
          <div className="text-center my-4">
            <p className="text-4xl font-bold text-indigo-600">{matchPercentage}%</p>
            <p className="text-gray-600">Market Alignment</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Matched Skills</h5>
            <ul className="space-y-1">
              {result.skillsMatch.matched.map((skill, i) => (
                <li key={i} className="flex items-center text-sm text-green-700">
                  <CheckCircle size={16} className="mr-2" /> {skill}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h5 className="font-semibold mb-2">Missing Skills</h5>
            <ul className="space-y-1">
              {result.skillsMatch.missing.map((skill, i) => (
                <li key={i} className="flex items-center text-sm text-red-700">
                  <WarningCircle size={16} className="mr-2" /> {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Career Pathways & Recommendations */}
        <div>
          <div className="p-4 border rounded-lg mb-6">
            <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
              <TrendUp size={22} className="mr-2 text-indigo-500" />
              Potential Career Pathways
            </h4>
            <ul className="space-y-2">
              {result.careerPathways.map((path, i) => (
                <li key={i}>
                  <p className="font-semibold">{path.role}</p>
                  <p className="text-sm text-gray-600">{path.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3">
              <Lightbulb size={22} className="mr-2 text-indigo-500" />
              Actionable Recommendations
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {result.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}