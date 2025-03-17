import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600">
      <div className="flex flex-col items-center justify-center gap-6">
        <Link href="/add-driver">
          <button className="bg-white text-black font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
            Add Driver
          </button>
        </Link>
        
        <Link href="/driver-list">
          <button className="bg-white text-black font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
            Driver List
          </button>
        </Link>
      </div>
    </main>
  );
}
