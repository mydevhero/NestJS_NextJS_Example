// Aggiunto dallo script setup.sh

'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  // Stile base comune
  const baseStyle = "px-5 py-2 rounded-full font-bold transition-all duration-200 border text-sm md:text-base";

  // Stile per il tasto attivo
  const activeStyle = "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200";

  // Stile per il tasto inattivo
  const inactiveStyle = "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50";

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/"
        className={`${baseStyle} ${pathname === '/' ? activeStyle : inactiveStyle}`}
      >
        Classifica
      </Link>

      <Link
        href="/dashboard"
        className={`${baseStyle} ${pathname.startsWith('/dashboard') || pathname.startsWith('/quiz') ? activeStyle : inactiveStyle}`}
      >
        Partecipa
      </Link>
    </div>
  );
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
