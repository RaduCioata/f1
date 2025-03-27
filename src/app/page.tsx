import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/add-driver">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <h2 className="text-2xl font-bold mb-4">Add New Driver</h2>
            <p className="text-gray-600">Add a new Formula One driver to the database.</p>
          </div>
        </Link>
        <Link href="/driver-list">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <h2 className="text-2xl font-bold mb-4">View Drivers</h2>
            <p className="text-gray-600">View and manage the list of Formula One drivers.</p>
          </div>
        </Link>
        <Link href="/statistics">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <h2 className="text-2xl font-bold mb-4">View Statistics</h2>
            <p className="text-gray-600">Explore detailed statistics and charts about Formula One drivers.</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
