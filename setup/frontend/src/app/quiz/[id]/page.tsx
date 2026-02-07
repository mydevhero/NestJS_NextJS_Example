// Aggiunto dallo script setup.sh

import { apiFetch } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function QuizDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  let quizDetail;
  try {
    // Chiamata all'endpoint pubblico che hai appena mostrato
    quizDetail = await apiFetch<any>(`/quiz/${id}/public`, {
      cache: 'no-store',
    });
  } catch (error) {
    // Se il backend risponde 404, mostriamo la pagina standard di Next.js
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-3xl mx-auto py-12 px-4">
        <Link
          href="/dashboard"
          className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mb-8 inline-block"
        >
          ← Torna ai Quiz
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          {/* Header con Success Rate */}
          <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
                Statistiche Globali
              </p>
              <h1 className="text-2xl font-black">Analisi del Quiz</h1>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black block">{quizDetail.successRate}</span>
              <span className="text-blue-200 text-xs font-bold uppercase">Successo</span>
            </div>
          </div>

          {/* Contenuto */}
          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                La Domanda
              </h2>
              <p className="text-2xl font-bold text-slate-800 leading-snug">
                {quizDetail.question}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                Spiegazione Logica
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {quizDetail.explanation}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">
          ID Quiz: #{id} — Dati aggiornati in tempo reale
        </p>
      </div>
    </main>
  );
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
