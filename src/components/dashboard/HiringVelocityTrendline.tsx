"use client";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HiringVelocityTrendlineProps {
  data: {
    labels: string[];
    data: number[];
  };
}

export function HiringVelocityTrendline({ data: chartData }: HiringVelocityTrendlineProps) {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Hiring Velocity',
        data: chartData.data,
        fill: false,
        backgroundColor: 'rgb(79, 70, 229)',
        borderColor: 'rgba(79, 70, 229, 0.2)',
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
        text: 'Hiring Velocity Trend',
      },
    },
  };

  return <Line options={options} data={data} />;
}