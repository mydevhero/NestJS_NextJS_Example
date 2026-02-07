// Aggiunto dallo script setup.sh

'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';

// Aggiungiamo 'prevState' come primo argomento
export async function loginAction(prevState: any, formData: FormData) {
  // Ora formData è il secondo argomento e contiene i dati corretti
  const nickname = formData.get('nickname') as string;

  if (!nickname) return { error: 'Nickname richiesto' };

  try {
    const user = await apiFetch<{ id: number; nickname: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    });

    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify(user), {
      path: '/',
      maxAge: 60 * 60 * 24,
      httpOnly: false,
      sameSite: 'lax',
    });

  } catch (err: any) {
    // Restituiamo l'errore che verrà catturato da 'state' nel componente
    return { error: err.message };
  }

  // Il redirect deve stare fuori dal blocco try/catch per funzionare correttamente
  // con le Server Actions di Next.js
  redirect('/dashboard');
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
