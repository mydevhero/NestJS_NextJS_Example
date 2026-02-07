# NestJS NextJS Example

* Un'applicazione Full-Stack per quiz di logica, progettata con un'architettura moderna che bilancia sicurezza, prestazioni SEO (SSR) e interattività (CSR).
* Considerala come una **base** utile per studiare e iniziare a sviluppare app **NestJS** e **NextJS**

---

## Avvio Rapido

### Prerequisiti
- Node.js 24+ & pnpm (npm install -g pnpm)
- Docker & Docker Compose

### Installazione
```bash
# Clone repository
git clone https://github.com/mydevhero/NestJS_NextJS_Example.git
cd NestJS_NextJS_Example
```

### Setup
```bash
./setup.sh
```

### Avvio backend (NestJS) e frontend (NextJS)

Nella root del progetto

```bash
pnpm dev
```

### Demo

Anche se è solo un esempio, c'è una demo live che puoi vedere su [https://nestjs-nextjs-example.it](https://nestjs-nextjs-example.it)

---

## Cosa è stato implementato in questo esempio

- [x] REST API utilizzando NestJS
- [x] TypeScript inside
- [x] Database in un container
- [x] PostgreSQL con Prisma ORM
- [x] validazione e "Type-safe" con DTO
- [x] Frontend moderno con NextJS
- [x] Completo sistema di quiz (CRUD)
- [x] Classifica utenti
- [x] Statistiche per ogni risposta
- [x] Autenticazione semplificata utente
- [x] Documentazione API con Swagger
- [x] Suite di test unitari e test end to end

---

## Note architetturali

### 1. Architettura del Backend ("NestJS, OpenAPI, DTO, class-validator e TypeScript" = "robustezza")

Ho scelto **NestJS** come framework backend.

* **Perché:** A differenza di Express puro, NestJS impone una struttura a controller, service e moduli (*Separation of Concerns*) che rende il codice testabile e manutenibile, oltretutto offre una piattaforma consolidata ed efficiente.
* **Modularità Enterprise:** Ogni risorsa (Quiz, User, Answer) è incapsulata in un modulo autonomo con i propri Controller, Service e Provider.
* **Documentazione Automatica (Swagger):** Negli esempi ho integrato **OpenAPI (Swagger)**, integrati dalla propria una documentazione interattiva.
* **Contratti Dati (DTO & Validation):** Non esiste scambio dati che non sia validato. Utilizzo `class-validator` e `class-transformer` per garantire che i payload in ingresso siano coerenti, trasformando gli errori di validazione in risposte HTTP 400 automatiche.
* **TypeScript:** Ogni parte del codice ha una sua tipizzazione, evidenziando 'sviste e errori' prima dell'esecuzione dei codici

### 2. Data Integrity & Persistence (Prisma ORM)

Per l'interazione con il database ho scelto **Prisma**.

* *Perché:* È un ORM *Type-safe*. Se cambiamo il nome di una colonna nel database, TypeScript ci segnalerà l'errore in tutto il codice backend.
* **Relational Mapping:** Ho gestito relazioni complesse (Utente -> Risposta -> Quiz) per permettere il calcolo in tempo reale della classifica (Leaderboard) senza appesantire il database.

### 3. Strategia di Rendering: Next.js

Ho sfruttato la natura ibrida di Next.js per massimizzare sia le performance che l'esperienza utente.

* **SSR (Server-Side Rendering) per i dati pubblici:** Pagine come la *Classifica* e il *Dettaglio Quiz* vengono generate sul server.
* *Perché:* Questo permette di servire HTML pronto all'uso, migliorando il **First Contentful Paint (FCP)** e garantendo l'indicizzazione SEO dei contenuti.
* **CSR (Client-Side Rendering) per l'interattività:** Le card dei quiz utilizzano `'use client'` per gestire lo stato locale complesso (selezione opzioni, timer, feedback dinamico).
* **Hydration e Streaming:** L'uso dei Server Components permette di ridurre drasticamente il bundle JavaScript inviato al client, caricando solo ciò che è necessario per l'interazione.

### 4. DevOps e Infrastruttura: Docker & Automation

Il progetto è stato concepito per essere "zero-config" grazie all'uso di **Docker** e dello script di setup.

* **Dockerization:** Il db in sviluppo è testato in un container, ma è possibile far lavorare l'intera infrastruttura con Docker.
* *Perché:* Garantisce l'uniformità degli ambienti. Lo sviluppatore A e lo sviluppatore B lavorano esattamente sulla stessa versione di Node, database e dipendenze, eliminando il problema del "sul mio computer funziona".
* **Script di setup (`setup.sh`):** Gestisce il ciclo di vita iniziale del progetto.
  + Crea le directory del backend e del frontend usando i comandi nativi di NestJS e NextJS.
  + Installa le dipendenze e genera il client Prisma.
  + Eseue le migrazioni del database e il seeding dei dati iniziali.
  + Copiando nelle i file specifici per questa applicazione nelle rispettive posizioni.

### 5. Strategia di Sicurezza "Reveal-on-Demand"

Una delle sfide principali di un'app di quiz è impedire agli utenti di barare ispezionando il codice, invece di inviare tutte le informazioni del quiz (comprese le spiegazioni) al caricamento della pagina, ecco come ho scelto di **proteggere i dati**.

* **Il Problema:** Se la spiegazione fosse nel JSON iniziale, un utente esperto potrebbe leggerla dal traffico di rete tramite i DevTools del browser o dallo stato di React per trovare la risposta corretta prima di rispondere.
* **La Soluzione:** Le spiegazioni dei quiz sono omesse dal payload della dashboard iniziale, si riceveranno dal server solo **dopo** che è stata salvata una risposta nel database. Il backend restituisce il feedback e la spiegazione atomicamente nella risposta della `POST`.

### 6. Frontend: Next.js 15 Ibrido (SSR + CSR)

Il frontend non è una semplice Single Page Application (SPA), ma un sistema ibrido.

* **Server-Side Rendering (SSR):** Usato per la **Classifica** e il **Dettaglio Quiz**.
* *Perché:* Velocità di caricamento (First Contentful Paint) e SEO. I dati arrivano già pronti dal server.

* **Client-Side Rendering (CSR):** Usato per le **QuizCard**.
* *Perché:* Per gestire stati interattivi complessi (feedback dei colori, selezione opzioni, caricamenti) senza ricaricare la pagina, offrendo un'esperienza "app-like".

### 7. UI/UX: Responsive grid & micro-interazioni

La UI è stata costruita con **Tailwind CSS**, seguendo un approccio minimalista ma funzionale.

* **Griglia Dinamica:** Ho implementato una visualizzazione a card compatte con radio-button simulati.
* *Perché:* Per ottimizzare lo spazio su dispositivi mobili e permettere all'utente di avere una visione d'insieme su molti quiz contemporaneamente.
* **Identità Visiva:** L'uso di una palette "Slate & Blue" è tipica dei software educational.
* **Micro-interazioni:** Pulsanti radio simulati e feedback cromatici istantanei (Verde/Rosso) migliorano l'engagement dell'utente senza sovraccaricare il carico cognitivo.

### 8. Autenticazione utente

Il sistema di autenticazione è elementare, non esiste alcun vincolo legato da password né si usano altri fattori di autenticazione, lascio la libertà allo sviluppatore di pensare all'intero sistema secondo le sue esigenze. Per accedere all'area privata si usa solo il nickname degli utenti fittizi:

| Nickname |
|--------- |
| Alice    |
| Bob      |
| Charlie  |

### 9. Gestione Sessioni: Cookie-Based auth (SSR Friendly)

Invece di utilizzare il classico `localStorage` per i token, ho optato per una gestione della sessione tramite **Cookie**, inoltre essendo solo un semplice esempio non ci sono sistemi di autenticazione esterni o JWT complessi:

* *Perché:* I componenti server di Next.js (SSR) non possono accedere al `localStorage` del browser. Utilizzando i Cookie, il server può leggere l'identità dell'utente durante la fase di generazione della pagina.
* *Risultato:* Possiamo decidere se mostrare o meno il tasto "Logout" o i dati dell'utente direttamente nell'HTML iniziale, evitando il fastidioso "effetto lampeggio" (Layout Shift) tipico delle Single Page Application tradizionali.
* Il cookie trasporta solo ID, email e nickname dell'utente.
* L'utilizzo di cookie permette ai 'Server Components' di accedere ai dati dell'utente istantaneamente durante il rendering, evitando il "salto" di contenuto (layout shift) tipico delle app che caricano i dati solo lato client.

### 10. Riassunto dello stack tecnologico

| Tecnologia | Utilizzo | Perché? |
| --- | --- | --- |
| **Package Manager** | pnpm | Più rigido ed efficiente di npm |
| **Database** | PostgreSQL | Perché è magnifico |
| **NestJS** | Backend API | Struttura modulare ed enterprise-grade |
| **Prisma** | ORM | Type-safety e facilità di migrazione DB |
| **Swagger** | API Doc | Documentazione vivente e testing semplificato |
| **Validazione** | class-validator & DTOs | Contratto dati rigoroso tra FE e BE |
| **Docker** | Deployment | Portabilità assoluta tra ambienti diversi |
| **Next.js** | Frontend Framework | Ottime performance grazie a Server Components |
| **Tailwind CSS** | Styling | Sviluppo UI rapidissimo e design system coerente |
| **Testing** | Jest + Supertest | Verifichiamo che tutto sia funzionante prima di andare in produzione |

---

## Configurazione

### Variabili d'ambiente

La lista che segue è l'elenco delle variabili necessarie per avviare i servizi. In ambiente di sviluppo e test puoi usare i valori di default, mentre in produzione è fortemente consigliato impostarle singolarmente e non utilizzare i valori di default

| Nome | Descrizione | Valore di default |
| --- | --- | --- |
| POSTGRES_USER | Nome utente | user |
| POSTGRES_PASSWORD | Passowrd di accessp | password |
| POSTGRES_HOST | Indirizzo Nome/IP |  localhost |
| POSTGRES_PORT | Porta TCP | 5432 |
| POSTGRES_DB | Nome del database | quiz_db |
| POSTGRES_SCHEMA | Schema | public |
| DATABASE_URL | Stringa di connessione | postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=${POSTGRES_SCHEMA} |
| NESTJS_PORT | Porta TCP del backend | 3001 |
| NEXTJS_PORT | Porta TCP del frontend | 3000 |

### Dove si configurano?

* Puoi settarle nel più classico `.env`, ma in questo caso devi considerare di applicare le modifiche all'eventuale container per PostgreSQL e dell'aggiornamento di Prisma.
* Puoi impostarle tramite lo script `bin/configure_env.sh`, in questo caso non ti devi preoccupare di altro
* Nell'interfaccia del tuo fornitore di servizi.

### Come si applicano?

Se modifichi i valori di default o modifichi i valori delle variabili esportate nel proprio ambiente di produzione, ricorda di:

* Riavviare i servizi docker del database eventualmente utilizzati:
  ```bash
  # Usa questi script perché fanno delle azioni anche nei confronti di Prisma (ORM)
   ./bin/stop_db.sh
   ./bin/start_db.sh
  ```
* Riavviare il backend e il frontend per rendere effettive le modifiche.

---

## Test & Build

### Lancio della suite di test

**Unit Tests**
```bash
pnpm test
```

**E2E Tests**
```bash
pnpm test:e2e
```

### Build per la produzione
```bash
pnpm build
```

### Cosa si espone

**API**
- `GET /quiz` - List all quizzes with completion status
- `GET /quiz/:id` - Get quiz details with explanation
- `POST /quiz/:id/answer` - Submit answer to quiz
- `GET /quiz/leaderboard` - Get user rankings

**Documentazione API**
Acceddi alal UI di Swagger a: `http://localhost:${NESTJS_PORT}/api/docs` quando il backend è attivo, usa il valore della porta della variabile NESTJS_PORT

**Interrogare il database**
Accedi a Prisma Studio a: `http://localhost:51212` per attivarlo in locale lancia
```bash
cd backend
pnpm prisma:studio
```

**Accedere al frontend**
Il frontend è raggiungibile a: `http://localhost:${NEXTJS_PORT}` usa il valore della porta della variabile NEXTJS_PORT

**Log di docker**
Per monitorare i container docker lancia il comando
```bash
docker-compose logs -f
```

### Build per la produzione

```bash
# Build for production
pnpm build
```

---

## Troubleshooting

### Common Issues

1. **Database connection failed**
   ```bash
   # Controlla se PostgreSQL è avviato
   docker ps | grep ${POSTGRES_DB}

   # Reset database
   ./bin/stop_db.sh
   ./bin/start_db.sh
   ```
   Riavvia il backend

1. **Port already in use**
   ```bash
   # Se ricevi l'errore EADDRINUSE, significa che un'istanza precedente di NestJS è ancora attiva.
   # Usa il valore della variabile NEXTJS_PORT o NESTJS_PORT per trovare il PID che ci servirà per chiudere il processo
   lsof -i :${NEXTJS_PORT}

   # Se ottieni una risposta, leggi il numero sotto alla colonna PID e chiudi il processo con questo comando
   kill -9 <PID>
   ```

   Oppure se hai un processo attivo dovuto ad un altro servizio e non puoi chiuderlo, allora puoi specifica una porta differente agendo nello script `bin/configure_env`

1. **Migrazione Prisma**
   ```bash
   bin/prisma_migrate.sh

   # Reset database
   bin/prisma_reset.sh
   ```

---

## Deploy

Per la demo live raggiungibile all'indirizzo [https://nestjs-nextjs-example.it](https://nestjs-nextjs-example.it) sto usando [Render](https://render.com), lì è eseguito il backend, il frontend e il database, tutto in un posto solo in modalità free.

---

## Risorse per imparare

- [Documentazione NestJS](https://docs.nestjs.com/)
- [Documentazione NextJS](https://nextjs.org/docs)
- [Documentazione Prisma](https://www.prisma.io/docs/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Manuale TypeScript](https://www.typescriptlang.org/docs/)

---

## Licenza

Nessuna! Ti chiedo solo di imparare divertendoti ^^
