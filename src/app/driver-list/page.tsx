"use client";

import Link from "next/link";
import { useDrivers } from "../context/DriverContext";
import { useState, useEffect } from "react";
import { Driver } from "../context/DriverContext";
import PopulateButton from "./PopulateButton";

type SortField = 'name' | 'team' | 'firstSeason' | 'races' | 'wins';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export default function DriverList() {
  const { drivers, loading, error, fetchDrivers } = useDrivers();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showStats, setShowStats] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Load drivers with current sort on component mount and sort changes
  useEffect(() => {
    fetchDrivers(undefined, {
      sortBy: sortField,
      sortOrder: sortDirection
    });
  }, [sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // If clicking the same field, toggle direction
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
    } else {
      // If clicking a new field, set it as sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
    
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(drivers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDrivers = drivers.slice(startIndex, endIndex);

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
      <div className="w-full max-w-5xl rounded-xl bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">F1 Drivers</h1>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Back to Home
            </Link>
            <button
              onClick={() => setShowStats(!showStats)}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {showStats ? "Hide Stats" : "Show Stats"}
            </button>
            <Link
              href="/add-driver"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add Driver
            </Link>
          </div>
        </div>

        {/* Populate Button - Prominently displayed */}
        <div className="mb-6">
          <PopulateButton />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32 mt-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4 mt-4">
            {error}
            <button
              onClick={() => fetchDrivers(undefined, { sortBy: sortField, sortOrder: sortDirection })}
              className="ml-2 text-blue-500 underline"
            >
              Try Again
            </button>
          </div>
        ) : drivers.length === 0 ? (
          <div className="text-center p-4 mt-4">
            <p className="text-xl">No drivers found.</p>
            <p className="mt-2">
              <Link href="/add-driver" className="text-blue-600 hover:underline">
                Add your first driver
              </Link>
            </p>
          </div>
        ) : (
          <>
            {showStats && stats && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg mt-4">
                <h2 className="text-xl font-semibold mb-3">Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">Total Drivers: <span className="font-normal">{stats.totalDrivers}</span></p>
                    <p className="font-medium">Total Races: <span className="font-normal">{stats.totalRaces}</span></p>
                    <p className="font-medium">Total Wins: <span className="font-normal">{stats.totalWins}</span></p>
                  </div>
                  <div>
                    <p className="font-medium">Win Rate: <span className="font-normal">{stats.avgWinPercentage}%</span></p>
                    <p className="font-medium">Teams: <span className="font-normal">{stats.uniqueTeams}</span></p>
                  </div>
                  <div>
                    <p className="font-medium">Most Wins: <span className="font-normal">{stats.mostSuccessfulDriver?.name} ({stats.mostSuccessfulDriver?.wins})</span></p>
                    <p className="font-medium">Most Races: <span className="font-normal">{stats.mostExperiencedDriver?.name} ({stats.mostExperiencedDriver?.races})</span></p>
                    <p className="font-medium">Best Win %: <span className="font-normal">
                      {stats.mostSuccessfulByPercentage ? 
                        `${stats.mostSuccessfulByPercentage.name} (${((stats.mostSuccessfulByPercentage.wins / stats.mostSuccessfulByPercentage.races) * 100).toFixed(1)}%)` : 
                        'N/A'}
                    </span></p>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort('name')}>
                      Driver {renderSortIndicator('name')}
                    </th>
                    <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort('team')}>
                      Team {renderSortIndicator('team')}
                    </th>
                    <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort('firstSeason')}>
                      First Season {renderSortIndicator('firstSeason')}
                    </th>
                    <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort('races')}>
                      Races {renderSortIndicator('races')}
                    </th>
                    <th className="py-3 px-4 text-left cursor-pointer" onClick={() => handleSort('wins')}>
                      Wins {renderSortIndicator('wins')}
                    </th>
                    <th className="py-3 px-4 text-left">Win %</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDrivers.map((driver) => {
                    const winPercentage = driver.races > 0 
                      ? ((driver.wins / driver.races) * 100).toFixed(1) 
                      : "0.0";
                      
                    return (
                      <tr key={driver.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{driver.name}</td>
                        <td className="py-3 px-4">{driver.team}</td>
                        <td className="py-3 px-4">{driver.firstSeason}</td>
                        <td 
                          className={`py-3 px-4 ${getCellHighlight(driver, 'races')}`}
                          title={getTooltip(driver, 'races')}
                        >
                          {driver.races}
                        </td>
                        <td 
                          className={`py-3 px-4 ${getCellHighlight(driver, 'wins')}`}
                          title={getTooltip(driver, 'wins')}
                        >
                          {driver.wins}
                        </td>
                        <td 
                          className={`py-3 px-4 ${getCellHighlight(driver, 'winPercentage')}`}
                          title={getTooltip(driver, 'winPercentage')}
                        >
                          {winPercentage}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Link
                            href={`/edit-driver/${driver.id}`}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border ${
                      currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    &lt;
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded border ${
                      currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
} 