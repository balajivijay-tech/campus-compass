"use client";

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IndustryDistributionProps {
  data: {
    labels: string[];
    data: number[];
  };
}

export function IndustryDistribution({ data: chartData }: IndustryDistributionProps) {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: '# of Jobs',
        data: chartData.data,
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Top Hiring Industries',
        },
      },
    };

  return <Doughnut data={data} options={options} />;
}