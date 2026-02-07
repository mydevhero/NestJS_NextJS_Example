// Aggiunto dallo script setup.sh

const BASE_URL = 'http://localhost:3001/api';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  // Configurazioni di default (es. JSON)
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    // Gestione errore centralizzata
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || 'Qualcosa è andato storto';
    throw new Error(message);
  }

  return response.json();
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
