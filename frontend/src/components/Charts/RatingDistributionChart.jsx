import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const RatingDistributionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => `${item.rating} Stars`),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red for 1 star
          'rgba(245, 158, 11, 0.8)',  // Orange for 2 stars
          'rgba(59, 130, 246, 0.8)',  // Blue for 3 stars
          'rgba(34, 197, 94, 0.8)',   // Green for 4 stars
          'rgba(16, 185, 129, 0.8)',  // Emerald for 5 stars
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default RatingDistributionChart;
