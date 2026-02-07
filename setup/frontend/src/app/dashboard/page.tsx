// Aggiunto dallo script setup.sh

import Navbar from '@/components/Navbar';
import QuizCard from '@/components/QuizCard';
import { apiFetch } from '@/lib/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('user_session');
  if (!session) redirect('/login');

  const user = JSON.parse(session.value);

  // Recuperiamo i quiz e le risposte dell'utente
  // Nota: ho immaginato un endpoint che restituisce i quiz arricchiti con lo stato della risposta
  const quizzes = await apiFetch<any[]>(`/quiz?userId=${user.id}`, { cache: 'no-store' });

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">I tuoi Quiz</h2>
          <p className="text-slate-500 mt-2">Metti alla prova la tua logica. Ogni risposta corretta vale 1 punto.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {quizzes.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              userId={user.id}
              index={index}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
