// Aggiunto dallo script setup.sh

import { apiFetch } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default async function HomePage() {
  const leaderboard = await apiFetch<any[]>('/quiz/leaderboard', {
    cache: 'no-store'
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Hall of Fame</span>
          <h1 className="text-5xl font-black text-slate-900 mt-2 tracking-tight">Classifica</h1>
        </div>

        {leaderboard.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            {leaderboard.map((user, index) => (
              <div
                key={user.nickname}
                className="flex items-center justify-between px-8 py-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <span className={`text-2xl font-black w-8 ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-slate-400' :
                    index === 2 ? 'text-amber-600' : 'text-slate-300'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-xl font-bold text-slate-800">{user.nickname}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600">{user._count.answers}</span>
                  <span className="ml-2 text-slate-400 font-medium italic">PT</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg">Nessuno ha ancora scalato la vetta. Inizia tu!</p>
          </div>
        )}
      </div>
    </main>
  );
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
