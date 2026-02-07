# NestJS NextJS Example

* A Full-Stack application for logic quizzes, designed with a modern architecture that balances security, SEO performance (SSR), and interactivity (CSR).
* Consider it as a useful **base** for studying and starting to develop **NestJS** and **NextJS** apps

---

## Quick Start

### Prerequisites
- Node.js 24+ & pnpm (npm install -g pnpm)
- Docker & Docker Compose

### Installation
```bash
# Clone repository
git clone https://github.com/mydevhero/NestJS_NextJS_Example.git
cd NestJS_NextJS_Example
```

### Setup
```bash
./setup.sh
```

### Start backend (NestJS) and frontend (NextJS)

In the project root

```bash
pnpm dev
```

### Demo

Even though it's just an example, there's a live demo you can see at [https://nestjs-nextjs-example.it](https://nestjs-nextjs-example.it)

---

## What has been implemented in this example

- [x] REST API using NestJS
- [x] TypeScript inside
- [x] Database in a container
- [x] PostgreSQL with Prisma ORM
- [x] Validation and "Type-safe" with DTO
- [x] Modern frontend with NextJS
- [x] Complete quiz system (CRUD)
- [x] User leaderboard
- [x] Statistics for each answer
- [x] Simplified user authentication
- [x] API documentation with Swagger
- [x] Unit test suite and end-to-end tests

---

## Architectural Notes

### 1. Backend Architecture ("NestJS, OpenAPI, DTO, class-validator and TypeScript" = "robustness")

I chose **NestJS** as the backend framework.

* **Why:** Unlike pure Express, NestJS enforces a structure of controllers, services, and modules (*Separation of Concerns*) that makes the code testable and maintainable, plus it offers a consolidated and efficient platform.
* **Enterprise Modularity:** Each resource (Quiz, User, Answer) is encapsulated in an autonomous module with its own Controller, Service, and Providers.
* **Automatic Documentation (Swagger):** In the examples, I integrated **OpenAPI (Swagger)**, providing interactive documentation.
* **Data Contracts (DTO & Validation):** No data exchange exists that isn't validated. I use `class-validator` and `class-transformer` to ensure incoming payloads are consistent, transforming validation errors into automatic HTTP 400 responses.
* **TypeScript:** Every part of the code has its typing, highlighting 'oversights and errors' before code execution

### 2. Data Integrity & Persistence (Prisma ORM)

For database interaction, I chose **Prisma**.

* **Why:** It's a *Type-safe* ORM. If we change a column name in the database, TypeScript will flag the error throughout the backend code.
* **Relational Mapping:** I managed complex relationships (User -> Answer -> Quiz) to allow real-time calculation of the leaderboard without burdening the database.

### 3. Rendering Strategy: Next.js

I leveraged Next.js's hybrid nature to maximize both performance and user experience.

* **SSR (Server-Side Rendering) for public data:** Pages like the *Leaderboard* and *Quiz Detail* are generated on the server.
* **Why:** This allows serving ready-to-use HTML, improving **First Contentful Paint (FCP)** and ensuring SEO indexing of content.
* **CSR (Client-Side Rendering) for interactivity:** Quiz cards use `'use client'` to manage complex local state (option selection, timer, dynamic feedback).
* **Hydration and Streaming:** The use of Server Components allows drastically reducing the JavaScript bundle sent to the client, loading only what's necessary for interaction.

### 4. DevOps and Infrastructure: Docker & Automation

The project was designed to be "zero-config" thanks to the use of **Docker** and the setup script.

* **Dockerization:** The development database is tested in a container, but it's possible to run the entire infrastructure with Docker.
* **Why:** It guarantees environment uniformity. Developer A and developer B work on exactly the same version of Node, database, and dependencies, eliminating the "works on my machine" problem.
* **Setup script (`setup.sh`):** Manages the initial project lifecycle.
  + Creates backend and frontend directories using native NestJS and NextJS commands.
  + Installs dependencies and generates the Prisma client.
  + Executes database migrations and initial data seeding.
  + Copies the specific files for this application to their respective locations.

### 5. "Reveal-on-Demand" Security Strategy

One of the main challenges of a quiz app is preventing users from cheating by inspecting the code. Instead of sending all quiz information (including explanations) when the page loads, here's how I chose to **protect the data**.

* **The Problem:** If the explanation were in the initial JSON, an experienced user could read it from network traffic via browser DevTools or from React state to find the correct answer before responding.
* **The Solution:** Quiz explanations are omitted from the initial dashboard payload and will only be received from the server **after** an answer has been saved in the database. The backend returns feedback and explanation atomically in the `POST` response.

### 6. Frontend: Hybrid Next.js 15 (SSR + CSR)

The frontend is not a simple Single Page Application (SPA), but a hybrid system.

* **Server-Side Rendering (SSR):** Used for the **Leaderboard** and **Quiz Detail**.
* **Why:** Loading speed (First Contentful Paint) and SEO. Data arrives ready from the server.

* **Client-Side Rendering (CSR):** Used for **QuizCards**.
* **Why:** To manage complex interactive states (color feedback, option selection, loading) without reloading the page, offering an "app-like" experience.

### 7. UI/UX: Responsive grid & micro-interactions

The UI was built with **Tailwind CSS**, following a minimalist but functional approach.

* **Dynamic Grid:** I implemented a compact card view with simulated radio buttons.
* **Why:** To optimize space on mobile devices and allow users to have an overview of many quizzes simultaneously.
* **Visual Identity:** The use of a "Slate & Blue" palette is typical of educational software.
* **Micro-interactions:** Simulated radio buttons and instant color feedback (Green/Red) improve user engagement without overloading cognitive load.

### 8. User Authentication

The authentication system is elementary; there are no password constraints or other authentication factors, leaving developers the freedom to design the entire system according to their needs. To access the private area, only the nicknames of fictitious users are used:

| Nickname |
|--------- |
| Alice    |
| Bob      |
| Charlie  |

### 9. Session Management: Cookie-Based auth (SSR Friendly)

Instead of using the classic `localStorage` for tokens, I opted for session management via **Cookies**, and since this is just a simple example, there are no external authentication systems or complex JWT:

* **Why:** Next.js server components (SSR) cannot access browser `localStorage`. By using Cookies, the server can read user identity during the page generation phase.
* **Result:** We can decide whether to show the "Logout" button or user data directly in the initial HTML, avoiding the annoying "flash effect" (Layout Shift) typical of traditional Single Page Applications.
* The cookie carries only the user's ID, email, and nickname.
* Using cookies allows 'Server Components' to access user data instantly during rendering, avoiding the content "jump" (layout shift) typical of apps that load data only client-side.

### 10. Technology Stack Summary

| Technology | Use | Why? |
| --- | --- | --- |
| **Package Manager** | pnpm | More strict and efficient than npm |
| **Database** | PostgreSQL | Because it's magnificent |
| **NestJS** | Backend API | Modular and enterprise-grade structure |
| **Prisma** | ORM | Type-safety and easy DB migration |
| **Swagger** | API Doc | Living documentation and simplified testing |
| **Validation** | class-validator & DTOs | Strict data contract between FE and BE |
| **Docker** | Deployment | Absolute portability across different environments |
| **Next.js** | Frontend Framework | Great performance thanks to Server Components |
| **Tailwind CSS** | Styling | Rapid UI development and consistent design system |
| **Testing** | Jest + Supertest | We verify everything works before going to production |

---

## Configuration

### Environment Variables

The following list contains the variables necessary to start the services. In development and test environments, you can use default values, while in production it's strongly recommended to set them individually and not use default values

| Name | Description | Default Value |
| --- | --- | --- |
| POSTGRES_USER | Username | user |
| POSTGRES_PASSWORD | Access password | password |
| POSTGRES_HOST | Name/IP address | localhost |
| POSTGRES_PORT | TCP port | 5432 |
| POSTGRES_DB | Database name | quiz_db |
| POSTGRES_SCHEMA | Schema | public |
| DATABASE_URL | Connection string | postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=${POSTGRES_SCHEMA} |
| NESTJS_PORT | Backend TCP port | 3001 |
| NEXTJS_PORT | Frontend TCP port | 3000 |

### Where to configure them?

* You can set them in the classic `.env` file, but in this case you need to consider applying the changes to the PostgreSQL container and updating Prisma.
* You can set them via the `bin/configure_env.sh` script, in which case you don't need to worry about anything else
* In your service provider's interface.

### How to apply them?

If you modify default values or change exported variable values in your production environment, remember to:

* Restart the database docker services if used:
  ```bash
  # Use these scripts because they also perform actions on Prisma (ORM)
   ./bin/stop_db.sh
   ./bin/start_db.sh
  ```
* Restart the backend and frontend to make changes effective.

---

## Testing & Build

### Running the test suite

**Unit Tests**
```bash
pnpm test
```

**E2E Tests**
```bash
pnpm test:e2e
```

### Production build
```bash
pnpm build
```

### What's exposed

**API**
- `GET /quiz` - List all quizzes with completion status
- `GET /quiz/:id` - Get quiz details with explanation
- `POST /quiz/:id/answer` - Submit answer to quiz
- `GET /quiz/leaderboard` - Get user rankings

**API Documentation**
Access the Swagger UI at: `http://localhost:${NESTJS_PORT}/api/docs` when the backend is running, use the NESTJS_PORT variable value for the port

**Querying the database**
Access Prisma Studio at: `http://localhost:51212` to activate it locally run
```bash
cd backend
pnpm prisma:studio
```

**Accessing the frontend**
The frontend is accessible at: `http://localhost:${NEXTJS_PORT}` use the NEXTJS_PORT variable value for the port

**Docker logs**
To monitor docker containers run the command
```bash
docker-compose logs -f
```

### Production build

```bash
# Build for production
pnpm build
```

---

## Troubleshooting

### Common Issues

1. **Database connection failed**
   ```bash
   # Check if PostgreSQL is running
   docker ps | grep ${POSTGRES_DB}

   # Reset database
   ./bin/stop_db.sh
   ./bin/start_db.sh
   ```
   Restart the backend

2. **Port already in use**
   ```bash
   # If you receive the EADDRINUSE error, it means a previous instance of NestJS is still active.
   # Use the NEXTJS_PORT or NESTJS_PORT variable value to find the PID we'll need to close the process
   lsof -i :${NEXTJS_PORT}

   # If you get a response, read the number under the PID column and close the process with this command
   kill -9 <PID>
   ```

   Or if you have an active process due to another service and can't close it, then you can specify a different port by acting on the `bin/configure_env` script

3. **Prisma Migration**
   ```bash
   bin/prisma_migrate.sh

   # Reset database
   bin/prisma_reset.sh
   ```

---

## Deployment

For the live demo accessible at [https://nestjs-nextjs-example.it](https://nestjs-nextjs-example.it) I'm using [Render](https://render.com), where the backend, frontend, and database are all running in one place in free mode.

---

## Learning Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [NextJS Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Compose](https://docs.docker.com/compose/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## License

None! I just ask you to learn while having fun ^^
