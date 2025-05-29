"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditDriver() {
  const router = useRouter();
  const params = useParams();
  const driverId = params.id as string;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationality: "",
    dateOfBirth: "",
    driverNumber: "",
    teamId: ""
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const { driver, teams } = await getData(driverId);
        if (driver) {
          setFormData({
            firstName: driver.firstName || "",
            lastName: driver.lastName || "",
            nationality: driver.nationality || "",
            dateOfBirth: driver.dateOfBirth ? driver.dateOfBirth.slice(0, 10) : "",
            driverNumber: driver.driverNumber?.toString() || "",
            teamId: driver.team?.id?.toString() || ""
          });
          setTeams(teams);
        }
      } catch (err) {
        setError("Failed to load driver or teams");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [driverId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await updateDriver(driverId, formData);
      if (res) {
        router.push("/driver-list");
      }
    } catch (err) {
      setError("Failed to update driver");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
        <h1 className="text-2xl font-bold mb-6 text-white">Edit Driver</h1>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 my-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label htmlFor="firstName" className="block text-white mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                className="w-full p-2 rounded"
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
                {teams.map((team: any) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-100 mb-4"
            >
              Update Driver
            </button>
            <Link href="/driver-list" className="block text-center text-white mt-4 underline">
              Back to Driver List
            </Link>
          </>
        )}
      </form>
    </main>
  );
}

const getData = async (driverId: string) => {
  try {
    const [driverRes, teamsRes] = await Promise.all([
      fetch(`/api/drivers/${driverId}`, { cache: 'no-store' }),
      fetch("/api/teams", { cache: 'no-store' })
    ]);
    
    if (!driverRes.ok || !teamsRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const driver = await driverRes.json();
    const teams = await teamsRes.json();
    return { driver, teams };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { driver: null, teams: [] };
  }
};

const updateDriver = async (driverId: string, data: any) => {
  try {
    const res = await fetch(`/api/drivers/${driverId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        driverNumber: parseInt(data.driverNumber),
        teamId: parseInt(data.teamId)
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Failed to update driver');
    }

    return await res.json();
  } catch (error) {
    console.error('Error updating driver:', error);
    return null;
  }
}; 