'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="absolute top-6 left-0 right-0 z-50 flex justify-center px-4">

      <nav className="glass-panel px-6 py-3 rounded-full flex items-center gap-6 shadow-lg shadow-gray-200/20">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">

          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-blue-200 shadow-md">
            DL
          </div>

          <h1 className="text-sm font-bold tracking-tight text-gray-700">
            Diabetic Lens
          </h1>

        </Link>

        <div className="h-5 w-px bg-gray-300"></div>

        {/* Menu */}
        <div className="flex items-center gap-4">

          <Link
            href="/"
            className={`text-sm font-medium transition ${
              pathname === '/'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Prediksi
          </Link>

          <Link
            href="/scan"
            className={`text-sm font-medium transition ${
              pathname === '/scan'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Scan Makanan
          </Link>

        </div>

        <div className="h-5 w-px bg-gray-300"></div>

        {/* Version */}
        <span className="text-xs font-medium text-gray-400">
          v1.0
        </span>

      </nav>

    </header>
  );
}

