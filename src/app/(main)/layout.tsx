import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-indigo-600">Uni-Verse</h1>
        </div>
        <nav className="mt-5">
          <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
            Dashboard
          </Link>
          <Link href="/intelligence" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
            Intelligence Hub
          </Link>
          <Link href="/curriculum" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
            Curriculum Analyzer
          </Link>
        </nav>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="p-4 bg-white border-b">
          <h2 className="text-lg font-semibold">Welcome</h2>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}