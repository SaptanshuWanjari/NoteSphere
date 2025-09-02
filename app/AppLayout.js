"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
const Navbar = dynamic(() => import('./components/Navbar'), { ssr: false });

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const showNavbar = mounted && !["/", "/login", "/register"].includes(pathname);
  return (
    <div className="min-h-screen m-4 sm:m-6 lg:m-8 flex flex-col md:flex-row">
      {showNavbar && (
        <div className="w-full md:w-72 md:mr-8 mb-4 md:mb-0">
          <Navbar />
        </div>
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
