"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Team = {
  id: number;
  name: string;
};

export default function AddDriver() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationality: "",
    dateOfBirth: "",
    driverNumber: "",
    teamId: ""
  });
  const [error, setError] = useState("");

  // Fetch teams for the dropdown
  useEffect(() => {
    fetch("/api/teams")
      .then(res => res.json())
      .then(data => setTeams(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        driverNumber: Number(formData.driverNumber),
        teamId: Number(formData.teamId)
      }),
    });
    if (res.ok) {
      router.push("/driver-list");
    } else {
      setError("Failed to add driver.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
        <div className="mb-6">
          <label htmlFor="firstName" className="block text-white mb-2">First Name</label>
          <input
            type="text"
            id="firstName"
            className="w-full p-2 rounded"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="lastName" className="block text-white mb-2">Last Name</label>
          <input
            type="text"
            id="lastName"
            className="w-full p-2 rounded"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="nationality" className="block text-white mb-2">Nationality</label>
          <input
            type="text"
            id="nationality"
            className="w-full p-2 rounded"
            placeholder="Enter nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="dateOfBirth" className="block text-white mb-2">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            className="w-full p-2 rounded"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="driverNumber" className="block text-white mb-2">Driver Number</label>
          <input
            type="number"
            id="driverNumber"
            className="w-full p-2 rounded"
            placeholder="Enter driver number"
            value={formData.driverNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="teamId" className="block text-white mb-2">Team</label>
          <select
            id="teamId"
            className="w-full p-2 rounded"
            value={formData.teamId}
            onChange={handleChange}
            required
          >
            <option value="">Select a team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-yellow-200 text-sm mt-1">{error}</p>}
        <button
          type="submit"
          className="w-full bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-100"
        >
          Add Driver
        </button>
        <Link href="/driver-list" className="block text-center text-white mt-4 underline">
          Back to Driver List
        </Link>
      </form>
    </main>
  );
} 