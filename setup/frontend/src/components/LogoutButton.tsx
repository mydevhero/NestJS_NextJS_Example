'use client'

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Rimuove il cookie
    document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // 2. Forza il refresh per aggiornare lo stato del server
    router.refresh();
    // 3. Torna al login
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
    >
      Esci
    </button>
  );
}
