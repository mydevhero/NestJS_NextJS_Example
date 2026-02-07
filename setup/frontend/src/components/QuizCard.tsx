// Aggiunto dallo script setup.sh

'use client'

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

interface QuizCardProps {
  quiz: any;
  userId: number;
  index: number; // Indice per il contatore
}

export default function QuizCard({ quiz, userId, index }: QuizCardProps) {
  const [userAnswer, setUserAnswer] = useState<number | null>(
    quiz.userSelection?.selectedOption ?? null
  );

  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(
    quiz.userSelection
      ? { isCorrect: quiz.userSelection.isCorrect, explanation: quiz.explanation }
      : null
  );

  const isReadonly = userAnswer !== null;

  async function handleAnswer(optionIndex: number) {
    if (isReadonly) return;
    try {
      const result = await apiFetch<any>(`/quiz/${quiz.id}/answer`, {
        method: 'POST',
        body: JSON.stringify({ userId, answer: optionIndex }),
      });
      setUserAnswer(optionIndex);
      setFeedback({ isCorrect: result.isCorrect, explanation: result.explanation });
    } catch (err) {
      alert("Errore nell'invio della risposta");
    }
  }

  return (
    <div className={`relative flex flex-col h-full p-5 rounded-2xl border-2 transition-all duration-300 ${
      isReadonly
        ? (feedback?.isCorrect ? 'border-green-100 bg-green-50/20' : 'border-red-100 bg-red-50/20')
        : 'border-slate-100 bg-white hover:border-blue-200 shadow-sm'
    }`}>
      {/* Badge Numero Quiz */}
      <div className="absolute -top-3 left-4 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
        {index + 1}
      </div>

      <div className="mb-4 mt-2">
        <h3 className="text-base font-bold text-slate-800 leading-tight line-clamp-2" title={quiz.question}>
          {quiz.question}
        </h3>
      </div>

      <div className="grid gap-2 mb-4 flex-grow">
        {quiz.options.map((option: string, i: number) => {
          const isSelected = userAnswer === i;
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={isReadonly}
              className={`group flex items-center gap-3 px-3 py-2 rounded-xl border text-sm transition-all ${
                isSelected
                  ? (feedback?.isCorrect ? 'bg-green-600 border-green-600 text-white' : 'bg-red-600 border-red-600 text-white')
                  : isReadonly
                    ? 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {/* Simil-Radio Button */}
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isSelected ? 'border-white' : 'border-slate-300 group-hover:border-blue-400'
              }`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="leading-tight">{option}</span>
            </button>
          );
        })}
      </div>

      {isReadonly && feedback && (
        <div className="space-y-3">
          <div className={`p-3 rounded-xl text-xs ${feedback.isCorrect ? 'text-green-800 bg-green-100/50' : 'text-red-800 bg-red-100/50'}`}>
             <p className="font-bold mb-1">{feedback.isCorrect ? '✨ Ottimo!' : '❌ Ops!'}</p>
             <p className="opacity-90 leading-normal">{feedback.explanation}</p>
          </div>

          <div className="flex justify-end">
            <Link
              href={`/quiz/${quiz.id}`}
              className="text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              Statistiche Globali 📊
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
