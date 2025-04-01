"use client";

import { useDrivers } from "../context/DriverContext";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartData,
  ChartOptions,
  RadialLinearScale,
  RadarController,
} from 'chart.js';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import Link from "next/link";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  RadarController
);

interface ChartDataState {
  teamDistribution: ChartData<'pie'>;
  winDistribution: ChartData<'bar'>;
  experienceTrend: ChartData<'line'>;
  driverComparison: ChartData<'radar'>;
}

export default function Statistics() {
  const { drivers } = useDrivers();
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartDataState>({
    teamDistribution: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
      }],
    },
    winDistribution: {
      labels: [],
      datasets: [{
        label: 'Wins',
        data: [],
        backgroundColor: '#FF6384',
      }],
    },
    experienceTrend: {
      labels: [],
      datasets: [{
        label: 'Average Races',
        data: [],
        borderColor: '#36A2EB',
        tension: 0.1,
      }],
    },
    driverComparison: {
      labels: ['Wins', 'Races', 'Win Rate (%)'],
      datasets: [],
    },
  });

  const handleDriverSelection = (driverId: string) => {
    setSelectedDrivers(prev => {
      if (prev.includes(driverId)) {
        return prev.filter(id => id !== driverId);
      } else {
        return [...prev, driverId];
      }
    });
  };

  useEffect(() => {
    // Update chart data whenever drivers or selection changes
    const updateChartData = () => {
      // Get filtered drivers based on selection
      const filteredDrivers = selectedDrivers.length > 0
        ? drivers.filter(driver => selectedDrivers.includes(driver.id))
        : drivers;

      // Team Distribution Chart (now shows selected drivers or all if none selected)
      const teamCounts = filteredDrivers.reduce((acc, driver) => {
        acc[driver.team] = (acc[driver.team] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const teamLabels = Object.keys(teamCounts);
      const teamData = Object.values(teamCounts);

      // Win Distribution Chart (show selected drivers or top 10 if none selected)
      const sortedByWins = [...filteredDrivers].sort((a, b) => b.wins - a.wins).slice(0, 10);
      const winLabels = sortedByWins.map(driver => driver.name);
      const winData = sortedByWins.map(driver => driver.wins);

      // Experience Trend Chart (show selected drivers or all if none selected)
      const seasonGroups = filteredDrivers.reduce((acc, driver) => {
        acc[driver.firstSeason] = (acc[driver.firstSeason] || 0) + driver.races;
        return acc;
      }, {} as Record<number, number>);

      const seasonLabels = Object.keys(seasonGroups).sort();
      const seasonData = seasonLabels.map(season => {
        const driversInSeason = filteredDrivers.filter(d => d.firstSeason === parseInt(season)).length;
        return seasonGroups[parseInt(season)] / driversInSeason;
      });

      // Driver Comparison Chart (for selected drivers)
      const comparisonDatasets = selectedDrivers
        .map((driverId, index) => {
          const driver = drivers.find(d => d.id === driverId);
          if (!driver) return undefined;

          const winRate = (driver.wins / driver.races) * 100;
          
          return {
            label: driver.name,
            data: [driver.wins, driver.races, winRate],
            borderColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
            ][index % 5] as string,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ][index % 5] as string,
          };
        })
        .filter((dataset): dataset is NonNullable<typeof dataset> => dataset !== undefined);

      setChartData({
        teamDistribution: {
          labels: teamLabels,
          datasets: [{
            data: teamData,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
            ],
          }],
        },
        winDistribution: {
          labels: winLabels,
          datasets: [{
            label: 'Wins',
            data: winData,
            backgroundColor: '#FF6384',
          }],
        },
        experienceTrend: {
          labels: seasonLabels,
          datasets: [{
            label: 'Average Races',
            data: seasonData,
            borderColor: '#36A2EB',
            tension: 0.1,
          }],
        },
        driverComparison: {
          labels: ['Wins', 'Races', 'Win Rate (%)'],
          datasets: comparisonDatasets,
        },
      });
    };

    updateChartData();
  }, [drivers, selectedDrivers]);

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Drivers per Team',
      },
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Wins Distribution',
      },
    },
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Races by First Season',
      },
    },
  };

  const radarOptions: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Driver Statistics Comparison',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
      },
    },
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600 p-4">
      <div className="w-full max-w-5xl rounded-xl bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Driver Statistics</h1>
          <Link
            href="/driver-list"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Driver List
          </Link>
        </div>

        {/* Driver Selection */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Select Drivers to Compare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map(driver => (
              <div key={driver.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`driver-${driver.id}`}
                  checked={selectedDrivers.includes(driver.id)}
                  onChange={() => handleDriverSelection(driver.id)}
                  className="h-4 w-4 text-red-600"
                />
                <label htmlFor={`driver-${driver.id}`} className="text-gray-700">
                  {driver.name} ({driver.team})
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team Distribution Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Team Distribution</h2>
            <div className="h-[300px]">
              <Pie
                data={chartData.teamDistribution}
                options={pieOptions}
              />
            </div>
          </div>

          {/* Win Distribution Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Top 10 Drivers by Wins</h2>
            <div className="h-[300px]">
              <Bar
                data={chartData.winDistribution}
                options={barOptions}
              />
            </div>
          </div>

          {/* Experience Trend Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Experience Trend</h2>
            <div className="h-[300px]">
              <Line
                data={chartData.experienceTrend}
                options={lineOptions}
              />
            </div>
          </div>

          {/* Driver Comparison Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Driver Comparison</h2>
            <div className="h-[300px]">
              {selectedDrivers.length > 0 ? (
                <Radar
                  data={chartData.driverComparison}
                  options={radarOptions}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select drivers above to see comparison
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Total Drivers</h3>
            <p className="text-3xl font-bold text-red-600">{drivers.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Total Races</h3>
            <p className="text-3xl font-bold text-red-600">
              {drivers.reduce((sum, driver) => sum + driver.races, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Total Wins</h3>
            <p className="text-3xl font-bold text-red-600">
              {drivers.reduce((sum, driver) => sum + driver.wins, 0)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 