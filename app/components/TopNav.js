"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { LuClipboardPen } from "react-icons/lu";

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  
  return (
    <header className="w-full mb-6">
      <nav className="bg-white rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between">
          <Link prefetch={false} href="/" className="flex items-center gap-2">
            <span className="bg-black text-white p-2 rounded-xl inline-flex"><LuClipboardPen size={24} /></span>
            <span className="text-xl font-semibold text-black">NoteSphere</span>
          </Link>
          <div className="hidden sm:flex items-center gap-3">
            {session ? (
              // Show Dashboard for authenticated users
              <Link prefetch={false} href="/user" className="btn-click px-4 py-2 rounded-md bg-[#f3f6fd] border border-[#eee] text-black hover:bg-white transition">Dashboard</Link>
            ) : (
              // Show Home for unauthenticated users
              <Link prefetch={false} href="/" className="btn-click px-4 py-2 rounded-md bg-[#f3f6fd] border border-[#eee] text-black hover:bg-white transition">Home</Link>
            )}
            
            {!session && (
              <>
                <Link prefetch={false} href="/login" className="btn-click px-4 py-2 rounded-md bg-[#f3f6fd] border border-[#eee] text-black hover:bg-white transition">Sign in</Link>
                <Link prefetch={false} href="/register" className="btn-click px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition active:translate-y-1 active:scale-95">Create account</Link>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden btn-click px-3 py-2 rounded-md bg-[#f3f6fd] border border-[#eee] text-black hover:bg-white transition"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            Menu
          </button>
        </div>
        {open && (
          <div id="mobile-menu" className="mt-3 grid gap-2 sm:hidden">
            {session ? (
              // Show Dashboard for authenticated users
              <Link prefetch={false} href="/user" className="px-4 py-2 rounded-md bg-[#f3f6fd] border border-[#eee] text-black hover:bg-white transition">Dashboard</Link>
            ) : (
              // Show Home for unauthenticated users
              <Link prefetch={false} href="/" className="px-4 py-2 rounded-md bg-[#f3f6fd] border border-[#eee] text-black hover:bg-white transition">Home</Link>
            )}
            
            {!session && (
              <>
                <Link prefetch={false} href="/login" className="px-4 py-2 rounded-md bg-[#f3f6fd] border border-[#eee] text-black hover:bg-white transition">Sign in</Link>
                <Link prefetch={false} href="/register" className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition">Create account</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
