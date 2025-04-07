'use client';

import { useState, useEffect } from 'react';
import { useSocket, ChartDataUpdate, DriverUpdate } from '../hooks/useSocket';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Maximum number of data points to display
const MAX_DATA_POINTS = 20;

export default function RealTimeCharts() {
  const { isConnected, chartData, connectionError, driverUpdate } = useSocket();
  
  // State for historical data
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [totalRaces, setTotalRaces] = useState<number[]>([]);
  const [totalWins, setTotalWins] = useState<number[]>([]);
  const [teamWins, setTeamWins] = useState<{[team: string]: number}>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Update chart data when new data is received
  useEffect(() => {
    if (chartData) {
      // Format timestamp as HH:MM:SS
      const timestamp = new Date(chartData.timestamp);
      const timeString = timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      // Update time series data (keeping a maximum number of points)
      setTimestamps(prev => {
        const updated = [...prev, timeString];
        return updated.slice(-MAX_DATA_POINTS);
      });
      
      setTotalRaces(prev => {
        const updated = [...prev, chartData.totalRaces];
        return updated.slice(-MAX_DATA_POINTS);
      });
      
      setTotalWins(prev => {
        const updated = [...prev, chartData.totalWins];
        return updated.slice(-MAX_DATA_POINTS);
      });
      
      // Update team wins data
      setTeamWins(chartData.teamWins);
      
      // Update last update time
      setLastUpdate(new Date(chartData.timestamp));
    }
  }, [chartData]);
  
  // Line chart data
  const lineChartData: ChartData<'line'> = {
    labels: timestamps,
    datasets: [
      {
        label: 'Total Races',
        data: totalRaces,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Total Wins',
        data: totalWins,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      }
    ],
  };
  
  // Bar chart data
  const barChartData: ChartData<'bar'> = {
    labels: Object.keys(teamWins),
    datasets: [
      {
        label: 'Wins by Team',
        data: Object.values(teamWins),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'F1 Statistics Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    }
  };
  
  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Wins by Team',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };
  
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Real-Time F1 Statistics</h2>
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      {connectionError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {connectionError}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <div className="h-64">
            <Line 
              data={lineChartData}
              options={lineChartOptions}
            />
          </div>
        </div>
        
        {/* Bar Chart */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <div className="h-64">
            <Bar 
              data={barChartData}
              options={barChartOptions}
            />
          </div>
        </div>
      </div>
      
      {/* Last Update */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {lastUpdate ? (
          <p>Last updated: {lastUpdate.toLocaleString()}</p>
        ) : (
          <p>Waiting for data updates...</p>
        )}
      </div>
    </div>
  );
} 