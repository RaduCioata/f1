'use client';

import { useState } from 'react';
import Link from 'next/link';
import RealTimeCharts from '../components/RealTimeCharts';
import DriverDataDisplay from '../components/DriverDataDisplay';

export default function Dashboard() {
  const [showHeaderInfo, setShowHeaderInfo] = useState(true);
  
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Formula One Dashboard</h1>
              {showHeaderInfo && (
                <p className="mt-2 text-red-100 max-w-2xl">
                  Real-time statistics and updates from the world of Formula One racing.
                  All data is displayed in real-time through WebSocket connections.
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link 
                href="/" 
                className="bg-white text-red-600 hover:bg-red-100 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/debug" 
                className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Debug
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Toggle Header Info button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowHeaderInfo(!showHeaderInfo)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showHeaderInfo ? 'Hide' : 'Show'} Header Info
          </button>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Charts - Takes up 2/3 of the screen on large displays */}
          <div className="lg:col-span-2">
            <RealTimeCharts />
          </div>
          
          {/* Sidebar - Takes up 1/3 of the screen on large displays */}
          <div className="space-y-6">
            {/* Driver Data Display */}
            <DriverDataDisplay />
            
            {/* Connection Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">About Real-time Data</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This dashboard displays Formula One statistics in real-time using Socket.IO WebSockets.
                The data updates automatically every few seconds without requiring page refreshes.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                <h3 className="font-medium mb-2">How It Works:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>A custom Socket.IO server sends data updates every 5 seconds</li>
                  <li>The client connects to the server via WebSockets</li>
                  <li>Charts update automatically when new data arrives</li>
                  <li>No manual refreshing required</li>
                </ul>
              </div>
            </div>
            
            {/* Resources Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">Resources</h2>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://socket.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <span>Socket.IO Documentation</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.chartjs.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <span>Chart.js Documentation</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://nextjs.org/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <span>Next.js Documentation</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 