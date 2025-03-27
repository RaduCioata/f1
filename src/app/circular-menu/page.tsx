"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CircularMenu() {
  const [activeInfo, setActiveInfo] = useState<number | null>(null);

  // Menu items data
  const menuItems = [
    { id: 1, name: "Home", color: "bg-blue-500", icon: "🏠", info: "Return to the home page" },
    { id: 2, name: "Add", color: "bg-green-500", icon: "➕", info: "Add a new driver to the database" },
    { id: 3, name: "List", color: "bg-yellow-500", icon: "📋", info: "View all drivers in the database" },
    { id: 4, name: "Stats", color: "bg-purple-500", icon: "📊", info: "See driver statistics" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="relative h-[500px] w-[500px]">
        {/* Main navigation container */}
        <div className="menu-container group">
          {/* Main button (always visible) */}
          <div className="main-button absolute left-1/2 top-1/2 z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-all duration-300 hover:scale-110">
            <span className="text-2xl">F1</span>
          </div>
          
          {/* Menu items (visible on hover) */}
          {menuItems.map((item, index) => {
            // Calculate position based on index
            const angle = (index * (360 / menuItems.length)) * (Math.PI / 180);
            const radius = 120; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <React.Fragment key={item.id}>
                {/* Menu item */}
                <div
                  className={`menu-item absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full ${item.color} text-white opacity-0 shadow-md transition-all duration-500 group-hover:opacity-100 hover:scale-110`}
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    transitionDelay: `${index * 0.1}s`,
                  }}
                  onMouseEnter={() => setActiveInfo(item.id)}
                  onMouseLeave={() => setActiveInfo(null)}
                >
                  <span className="text-xl">{item.icon}</span>
                </div>
                
                {/* Info circle (visible when hovering the menu item) */}
                {activeInfo === item.id && (
                  <div
                    className="info-circle absolute flex h-24 w-24 animate-fadeIn items-center justify-center rounded-full bg-white p-3 text-center text-sm text-gray-800 shadow-lg"
                    style={{
                      left: `calc(50% + ${x * 1.5}px)`,
                      top: `calc(50% + ${y * 1.5}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="mt-1 text-xs">{item.info}</div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <div className="absolute bottom-8 left-8">
        <Link href="/">
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </main>
  );
} 