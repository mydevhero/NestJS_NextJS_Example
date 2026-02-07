// Aggiunto dallo script setup.sh

'use client'

// frontend/src/app/login/page.tsx
'use client'

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginPage() {
  // 2. Cambiato in useActionState.
  // 'isPending' ci dice se la Server Action sta lavorando.
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Quiz Logic</h1>
          <p className="text-slate-500 mt-2">Inserisci il tuo nickname per iniziare</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nickname</label>
            <input
              name="nickname"
              type="text"
              required
              disabled={isPending} // Disabilitiamo l'input durante il caricamento
              placeholder="Esempio: Alice"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {state?.error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending} // Evitiamo click multipli
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Entrata in corso...' : 'Entra nel Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
