// Aggiunto dallo script setup.sh

import { prisma } from '../lib/prisma'

async function main() {
    console.log('Inizio seeding.');

    // 1. Definisce gli utenti
    const users = [
        { email: 'alice@example.com', nickname: 'Alice' },
        { email: 'bob@example.com', nickname: 'Bob' },
        { email: 'charlie@example.com', nickname: 'Charlie' },
    ];

    // 2. Aggiunge gli utenti al db
    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: u,
        });
    }

    // 3. Definisce i quiz
    const quizzes = [
        {
            question: 'Un contadino ha 17 pecore. Tutte tranne 9 scappano. Quante rimangono?',
            options: ['9', '8', '17', '0'],
            // correctAnswer: '9',
            correctAnswer: 0,
            explanation: 'Se tutte tranne 9 scappano, allora 9 restano nel recinto.',
        },
        {
            question: 'Alcuni mesi hanno 30 giorni, altri 31. Quanti ne hanno 28?',
            options: ['1', '12', '2', 'Solo febbraio'],
            // correctAnswer: '12',
            correctAnswer: 1,
            explanation: 'Tutti i mesi hanno almeno 28 giorni.',
        },
        {
            question: 'Quanti animali di ogni specie Mosè portò sull\'arca?',
            options: ['2', '1', 'Nessuno', 'Non era Mosè'],
            // correctAnswer: 'Non era Mosè',
            correctAnswer: 3,
            explanation: 'Fu Noè, non Mosè.',
        },
        {
            question: 'Se impieghi 5 minuti per tagliare 5 tronchi, quanto impieghi per tagliarne 100?',
            options: ['100', '50', '105', '100 minuti'],
            // correctAnswer: '100',
            correctAnswer: 0,
            explanation: 'Ogni tronco richiede 1 minuto.',
        },
        {
            question: 'Quale parola è sempre scritta in modo errato nel dizionario?',
            options: ['Errato', 'Sbagliato', 'Mai', 'Corretto'],
            // correctAnswer: 'Errato',
            correctAnswer: 0,
            explanation: 'La parola "errato" è letteralmente scritta come "errato".',
        },
        {
            question: 'Un aereo si schianta sul confine tra Italia e Francia. Dove seppelliscono i sopravvissuti?',
            options: ['Francia', 'Italia', 'Entrambi', 'Da nessuna parte'],
            // correctAnswer: 'Da nessuna parte',
            correctAnswer: 3,
            explanation: 'I sopravvissuti non si seppelliscono.',
        },
        {
            question: 'Se un treno elettrico va verso sud e tira vento da nord, dove va il fumo?',
            options: ['Sud', 'Nord', 'Est', 'Da nessuna parte'],
            // correctAnswer: 'Da nessuna parte',
            correctAnswer: 3,
            explanation: 'Un treno elettrico non fa fumo.',
        },
        {
            question: 'Quante lettere ha l\'alfabeto?',
            options: ['21', '26', '11', 'Quante ne servono'],
            // correctAnswer: '11',
            correctAnswer: 2,
            explanation: 'La frase "l\'alfabeto" ha 11 lettere.',
        },
        {
            question: 'Puoi sollevare un elefante con una sola mano?',
            options: ['Sì', 'No', 'Solo da piccolo', 'Nessuno ha mani così forti'],
            // correctAnswer: 'Nessuno ha mani così forti',
            correctAnswer: 3,
            explanation: 'Nessuno ha una sola mano così forte.',
        },
        {
            question: 'Cosa pesa di più: un chilo di ferro o un chilo di piume?',
            options: ['Ferro', 'Piume', 'Sono uguali', 'Dipende'],
            // correctAnswer: 'Sono uguali',
            correctAnswer: 2,
            explanation: 'Entrambi pesano un chilo.',
        },
    ];

    // 4. Aggiunge i quiz al db
    for (const q of quizzes) {
        await prisma.quiz.create({ data: q });
    }

    console.log('Seeding terminato.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
