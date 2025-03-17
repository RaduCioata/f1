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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600 p-4">
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
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDrivers.map((driver, index) => (
                <tr key={driver.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{driver.name}</td>
                  <td className="p-3">{driver.team}</td>
                  <td className="p-3">{driver.firstSeason}</td>
                  <td className="p-3">{driver.races}</td>
                  <td className="p-3">{driver.wins}</td>
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