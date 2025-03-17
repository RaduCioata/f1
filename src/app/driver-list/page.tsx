"use client";

import Link from "next/link";
import { useDrivers } from "../context/DriverContext";
import { useState } from "react";
import { Driver } from "../context/DriverContext";

type SortField = 'name' | 'team' | 'firstSeason' | 'races' | 'wins';
type SortDirection = 'asc' | 'desc';

export default function DriverList() {
  const { drivers } = useDrivers();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showStats, setShowStats] = useState(false);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // If clicking the same field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new field, set it as sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDrivers = [...drivers].sort((a, b) => {
    // Helper function to handle string comparison
    const compareStrings = (strA: string, strB: string) => {
      return strA.localeCompare(strB);
    };

    // Helper function to handle number comparison
    const compareNumbers = (numA: number, numB: number) => {
      return numA - numB;
    };

    let result = 0;
    
    // Sort based on the selected field
    switch (sortField) {
      case 'name':
        result = compareStrings(a.name, b.name);
        break;
      case 'team':
        result = compareStrings(a.team, b.team);
        break;
      case 'firstSeason':
        result = compareNumbers(a.firstSeason, b.firstSeason);
        break;
      case 'races':
        result = compareNumbers(a.races, b.races);
        break;
      case 'wins':
        result = compareNumbers(a.wins, b.wins);
        break;
      default:
        result = 0;
    }

    // Reverse the result if sorting in descending order
    return sortDirection === 'asc' ? result : -result;
  });

  // Helper function to render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  // Calculate statistics
  const calculateStats = () => {
    if (drivers.length === 0) return null;

    // Total drivers
    const totalDrivers = drivers.length;
    
    // Total races across all drivers
    const totalRaces = drivers.reduce((sum, driver) => sum + driver.races, 0);
    
    // Total wins across all drivers
    const totalWins = drivers.reduce((sum, driver) => sum + driver.wins, 0);
    
    // Average win percentage
    const avgWinPercentage = totalRaces > 0 
      ? ((totalWins / totalRaces) * 100).toFixed(2) 
      : "0.00";
    
    // Most experienced driver (most races)
    const mostExperiencedDriver = [...drivers].sort((a, b) => b.races - a.races)[0];
    
    // Most successful driver (most wins)
    const mostSuccessfulDriver = [...drivers].sort((a, b) => b.wins - a.wins)[0];
    
    // Most successful driver by win percentage (min 10 races)
    const driversWithEnoughRaces = drivers.filter(driver => driver.races >= 10);
    const mostSuccessfulByPercentage = driversWithEnoughRaces.length > 0
      ? [...driversWithEnoughRaces].sort((a, b) => 
          (b.wins / b.races) - (a.wins / a.races)
        )[0]
      : null;
    
    // Newest driver (most recent first season)
    const newestDriver = [...drivers].sort((a, b) => b.firstSeason - a.firstSeason)[0];
    
    // Veteran driver (earliest first season)
    const veteranDriver = [...drivers].sort((a, b) => a.firstSeason - b.firstSeason)[0];
    
    // Teams count
    const uniqueTeams = new Set(drivers.map(driver => driver.team)).size;
    
    return {
      totalDrivers,
      totalRaces,
      totalWins,
      avgWinPercentage,
      mostExperiencedDriver,
      mostSuccessfulDriver,
      mostSuccessfulByPercentage,
      newestDriver,
      veteranDriver,
      uniqueTeams
    };
  };

  const stats = calculateStats();

  // Find average values for highlighting
  const getAverageValues = () => {
    if (drivers.length === 0) return null;
    
    const avgRaces = drivers.reduce((sum, driver) => sum + driver.races, 0) / drivers.length;
    const avgWins = drivers.reduce((sum, driver) => sum + driver.wins, 0) / drivers.length;
    
    // Calculate average win percentage
    let avgWinPercentage = 0;
    const driversWithRaces = drivers.filter(driver => driver.races > 0);
    if (driversWithRaces.length > 0) {
      avgWinPercentage = driversWithRaces.reduce((sum, driver) => sum + (driver.wins / driver.races), 0) / driversWithRaces.length;
    }
    
    return {
      avgRaces,
      avgWins,
      avgWinPercentage
    };
  };

  const averages = getAverageValues();

  // Helper function to determine cell background color
  const getCellHighlight = (driver: Driver, field: 'races' | 'wins' | 'winPercentage') => {
    if (!stats || !averages || drivers.length < 3) return '';
    
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // For races field
    if (field === 'races') {
      if (driver.id === stats.mostExperiencedDriver?.id) {
        return 'bg-green-100 font-bold'; // Most races
      } else if (driver.firstSeason === currentYear) {
        return 'bg-yellow-100'; // Rookie (first season is current year)
      }
    }
    
    // For wins field
    if (field === 'wins') {
      if (driver.id === stats.mostSuccessfulDriver?.id) {
        return 'bg-green-100 font-bold'; // Most wins
      } else if (driver.wins === 0) {
        return 'bg-red-100'; // No wins
      } else if (driver.wins > averages.avgWins) {
        return 'bg-blue-100'; // Above average wins
      }
    }
    
    // For win percentage field
    if (field === 'winPercentage') {
      const winPercentage = driver.races > 0 ? (driver.wins / driver.races) : 0;
      
      if (stats.mostSuccessfulByPercentage && driver.id === stats.mostSuccessfulByPercentage.id) {
        return 'bg-green-100 font-bold'; // Best win percentage
      } else if (winPercentage === 0) {
        return 'bg-red-100'; // No wins
      } else if (winPercentage > averages.avgWinPercentage) {
        return 'bg-blue-100'; // Above average win percentage
      }
    }
    
    return '';
  };

  // Helper function to get tooltip text
  const getTooltip = (driver: Driver, field: 'races' | 'wins' | 'winPercentage') => {
    if (!stats || !averages) return '';
    
    // Get current year
    const currentYear = new Date().getFullYear();
    
    if (field === 'races') {
      if (driver.id === stats.mostExperiencedDriver?.id) {
        return 'Most experienced driver';
      } else if (driver.firstSeason === currentYear) {
        return 'Rookie (less than 1 full year)';
      }
    }
    
    if (field === 'wins') {
      if (driver.id === stats.mostSuccessfulDriver?.id) {
        return 'Most wins';
      } else if (driver.wins === 0) {
        return 'No wins yet';
      } else if (driver.wins > averages.avgWins) {
        return 'Above average wins';
      }
    }
    
    if (field === 'winPercentage') {
      const winPercentage = driver.races > 0 ? (driver.wins / driver.races) : 0;
      
      if (stats.mostSuccessfulByPercentage && driver.id === stats.mostSuccessfulByPercentage.id) {
        return 'Best win percentage';
      } else if (winPercentage === 0) {
        return 'No wins yet';
      } else if (winPercentage > averages.avgWinPercentage) {
        return 'Above average win percentage';
      }
    }
    
    return '';
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600 p-4">
      {drivers.length > 0 && (
        <div className="w-full max-w-2xl mb-6">
          <button 
            onClick={() => setShowStats(!showStats)}
            className="bg-white text-black font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors mb-4"
          >
            {showStats ? 'Hide Statistics' : 'Show Statistics'}
          </button>
          
          {showStats && stats && (
            <div className="bg-white rounded-md p-4 mb-4 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-center">Driver Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="font-semibold text-gray-700">General Stats</h3>
                  <ul className="mt-2">
                    <li>Total Drivers: <span className="font-medium">{stats.totalDrivers}</span></li>
                    <li>Total Teams: <span className="font-medium">{stats.uniqueTeams}</span></li>
                    <li>Total Races: <span className="font-medium">{stats.totalRaces}</span></li>
                    <li>Total Wins: <span className="font-medium">{stats.totalWins}</span></li>
                    <li>Average Win %: <span className="font-medium">{stats.avgWinPercentage}%</span></li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="font-semibold text-gray-700">Driver Records</h3>
                  <ul className="mt-2">
                    <li>Most Experienced: <span className="font-medium">{stats.mostExperiencedDriver?.name}</span> ({stats.mostExperiencedDriver?.races} races)</li>
                    <li>Most Wins: <span className="font-medium">{stats.mostSuccessfulDriver?.name}</span> ({stats.mostSuccessfulDriver?.wins} wins)</li>
                    {stats.mostSuccessfulByPercentage && (
                      <li>Best Win %: <span className="font-medium">{stats.mostSuccessfulByPercentage?.name}</span> ({((stats.mostSuccessfulByPercentage.wins / stats.mostSuccessfulByPercentage.races) * 100).toFixed(2)}%)</li>
                    )}
                    <li>Newest Driver: <span className="font-medium">{stats.newestDriver?.name}</span> (since {stats.newestDriver?.firstSeason})</li>
                    <li>Veteran Driver: <span className="font-medium">{stats.veteranDriver?.name}</span> (since {stats.veteranDriver?.firstSeason})</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-gray-700">Color Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 mr-2"></div>
                    <span className="text-sm">Best performance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-100 mr-2"></div>
                    <span className="text-sm">Above average</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-100 mr-2"></div>
                    <span className="text-sm">Rookie (less than 1 full year)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-100 mr-2"></div>
                    <span className="text-sm">No wins</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="w-full max-w-2xl bg-white rounded-md overflow-hidden">
        {drivers.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">#</th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Driver {renderSortIndicator('name')}
                </th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('team')}
                >
                  Team {renderSortIndicator('team')}
                </th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('firstSeason')}
                >
                  First Season {renderSortIndicator('firstSeason')}
                </th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('races')}
                >
                  Races {renderSortIndicator('races')}
                </th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('wins')}
                >
                  Wins {renderSortIndicator('wins')}
                </th>
                <th 
                  className="p-3 text-left"
                >
                  Win %
                </th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDrivers.map((driver, index) => (
                <tr key={driver.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{driver.name}</td>
                  <td className="p-3">{driver.team}</td>
                  <td className={`p-3 ${driver.id === stats?.veteranDriver?.id ? 'bg-green-100 font-bold' : ''} ${driver.id === stats?.newestDriver?.id ? 'bg-blue-100 font-bold' : ''}`} title={driver.id === stats?.veteranDriver?.id ? 'Veteran driver' : driver.id === stats?.newestDriver?.id ? 'Newest driver' : ''}>
                    {driver.firstSeason}
                  </td>
                  <td className={`p-3 ${getCellHighlight(driver, 'races')}`} title={getTooltip(driver, 'races')}>
                    {driver.races}
                  </td>
                  <td className={`p-3 ${getCellHighlight(driver, 'wins')}`} title={getTooltip(driver, 'wins')}>
                    {driver.wins}
                  </td>
                  <td className={`p-3 ${getCellHighlight(driver, 'winPercentage')}`} title={getTooltip(driver, 'winPercentage')}>
                    {driver.races > 0 
                      ? ((driver.wins / driver.races) * 100).toFixed(2) + '%'
                      : '0.00%'
                    }
                  </td>
                  <td className="p-3 text-center">
                    <Link href={`/edit-driver/${driver.id}`}>
                      <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors">
                        Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center">
            <p>No drivers added yet. Add your first driver!</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-8">
        <Link href="/">
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </Link>
      </div>
    </main>
  );
} 