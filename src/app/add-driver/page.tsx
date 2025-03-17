"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDrivers } from "../context/DriverContext";

export default function AddDriver() {
  const router = useRouter();
  const { addDriver } = useDrivers();
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    firstSeason: "",
    races: "",
    wins: ""
  });
  
  // Add validation errors state
  const [errors, setErrors] = useState({
    name: "",
    team: "",
    firstSeason: "",
    races: "",
    wins: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Driver name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    } else if (!/^[A-Za-z\s\-']+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes";
      isValid = false;
    }
    
    // Team validation
    if (!formData.team.trim()) {
      newErrors.team = "Team name is required";
      isValid = false;
    } else if (!/^[A-Za-z\s\-']+$/.test(formData.team.trim())) {
      newErrors.team = "Team can only contain letters, spaces, hyphens, and apostrophes";
      isValid = false;
    }
    
    // First season validation
    const firstSeasonValue = parseInt(formData.firstSeason);
    const currentYear = new Date().getFullYear();
    if (!formData.firstSeason) {
      newErrors.firstSeason = "First season is required";
      isValid = false;
    } else if (isNaN(firstSeasonValue)) {
      newErrors.firstSeason = "First season must be a number";
      isValid = false;
    } else if (firstSeasonValue < 1950) {
      newErrors.firstSeason = "First season cannot be before 1950";
      isValid = false;
    } else if (firstSeasonValue > currentYear) {
      newErrors.firstSeason = `First season cannot be after ${currentYear}`;
      isValid = false;
    }
    
    // Races validation
    const racesValue = parseInt(formData.races);
    if (!formData.races) {
      newErrors.races = "Number of races is required";
      isValid = false;
    } else if (isNaN(racesValue)) {
      newErrors.races = "Number of races must be a number";
      isValid = false;
    } else if (racesValue < 0) {
      newErrors.races = "Number of races cannot be negative";
      isValid = false;
    }
    
    // Wins validation
    const winsValue = parseInt(formData.wins);
    if (!formData.wins) {
      newErrors.wins = "Number of wins is required";
      isValid = false;
    } else if (isNaN(winsValue)) {
      newErrors.wins = "Number of wins must be a number";
      isValid = false;
    } else if (winsValue < 0) {
      newErrors.wins = "Number of wins cannot be negative";
      isValid = false;
    } else if (winsValue > racesValue) {
      newErrors.wins = "Number of wins cannot exceed number of races";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert string values to numbers where needed
    addDriver({
      name: formData.name.trim(),
      team: formData.team.trim(),
      firstSeason: parseInt(formData.firstSeason),
      races: parseInt(formData.races),
      wins: parseInt(formData.wins)
    });
    
    // Navigate back to the driver list
    router.push("/driver-list");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="name" className="block text-white mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className={`w-full p-2 rounded ${errors.name ? 'border-2 border-red-300' : ''}`}
            placeholder="Enter driver name"
            value={formData.name}
            onChange={handleChange}
            pattern="[A-Za-z\s\-']+"
            title="Name can only contain letters, spaces, hyphens, and apostrophes"
            required
          />
          {errors.name && <p className="text-yellow-200 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="team" className="block text-white mb-2">
            Team
          </label>
          <input
            type="text"
            id="team"
            className={`w-full p-2 rounded ${errors.team ? 'border-2 border-red-300' : ''}`}
            placeholder="Enter team name"
            value={formData.team}
            onChange={handleChange}
            pattern="[A-Za-z\s\-']+"
            title="Team can only contain letters, spaces, hyphens, and apostrophes"
            required
          />
          {errors.team && <p className="text-yellow-200 text-sm mt-1">{errors.team}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="firstSeason" className="block text-white mb-2">
            First season
          </label>
          <input
            type="number"
            id="firstSeason"
            className={`w-full p-2 rounded ${errors.firstSeason ? 'border-2 border-red-300' : ''}`}
            placeholder="Enter first season year"
            value={formData.firstSeason}
            onChange={handleChange}
            min="1950"
            max={new Date().getFullYear().toString()}
            required
          />
          {errors.firstSeason && <p className="text-yellow-200 text-sm mt-1">{errors.firstSeason}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="races" className="block text-white mb-2">
            Number of races
          </label>
          <input
            type="number"
            id="races"
            className={`w-full p-2 rounded ${errors.races ? 'border-2 border-red-300' : ''}`}
            placeholder="Enter number of races"
            value={formData.races}
            onChange={handleChange}
            min="0"
            required
          />
          {errors.races && <p className="text-yellow-200 text-sm mt-1">{errors.races}</p>}
        </div>

        <div className="mb-8">
          <label htmlFor="wins" className="block text-white mb-2">
            Number of wins
          </label>
          <input
            type="number"
            id="wins"
            className={`w-full p-2 rounded ${errors.wins ? 'border-2 border-red-300' : ''}`}
            placeholder="Enter number of wins"
            value={formData.wins}
            onChange={handleChange}
            min="0"
            required
          />
          {errors.wins && <p className="text-yellow-200 text-sm mt-1">{errors.wins}</p>}
        </div>

        <div className="flex justify-center mb-8">
          <button 
            type="submit"
            className="bg-white text-black font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors"
          >
            Add Driver
          </button>
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
      </form>
    </main>
  );
} 