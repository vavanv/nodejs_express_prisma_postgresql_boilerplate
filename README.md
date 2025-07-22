# Node.js Express Prisma PostgreSQL Boilerplate API

A scalable, production-ready RESTful API built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 🚀 Features

- User and Post CRUD operations
- Health check endpoint
- Modular, scalable Prisma schema
- API documentation (Swagger)
- Security, logging, and rate limiting middleware
- TypeScript for type safety
- Database seeding for development/testing

---

## 🏗️ Architecture Overview

- **Layered Structure:** Separation of concerns between controllers, services, routes, middleware, and utilities.
- **Prisma ORM:** Modular data models (per-entity) are merged into a unified schema for maintainability and team collaboration.
- **OpenAPI (Swagger):** API documentation is auto-generated from YAML files and available at `/api-docs`.
- **Security:** Helmet, CORS, and rate limiting are enabled by default.
- **Logging:** Winston provides structured logging to both console and files; HTTP logs via Morgan.
- **Testing:** Jest and Supertest for unit and integration tests.
- **Error Handling:** Centralized error middleware and business logic error mapping.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL database

### Installation

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Copy `.env.example` to `.env` and update values as needed:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
   PORT=3000
   NODE_ENV=development
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```
4. **Merge Prisma models and run migrations:**
   ```bash
   npm run db:migrate
   ```
5. **(Optional) Seed the database:**
   ```bash
   npm run db:seed
   ```
6. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📚 API Documentation

- **Swagger UI:** [http://localhost:3000/api/v1-docs](http://localhost:3000/api/v1-docs)
- **YAML Source:** See `src/docs/` for OpenAPI definitions.

---

## 🌱 Database Seeding

To populate the database with sample users and posts for development or testing, run:

```bash
npx ts-node src/prisma/seed.ts
```

This will create example users and posts as defined in `src/prisma/seed.ts`.

---

## 🔗 Key Endpoints

### Health Check

- `GET /health` — Returns API status and uptime.

### Users

- `GET /api/v1/users` — List all users (with their posts)
- `POST /api/v1/users` — Create a new user
- `GET /api/v1/users/{id}` — Get user by ID
- `PUT /api/v1/users/{id}` — Update user
- `DELETE /api/v1/users/{id}` — Delete user
- `GET /api/v1/users/{id}/posts` — Get posts for a user

### Posts

- `GET /api/v1/posts` — List all posts (with their authors)
- `POST /api/v1/posts` — Create a new post
- `GET /api/v1/posts/published` — List published posts
- `GET /api/v1/posts/search?query=...` — Search posts
- `GET /api/v1/posts/{id}` — Get post by ID
- `PUT /api/v1/posts/{id}` — Update post
- `DELETE /api/v1/posts/{id}` — Delete post
- `PATCH /api/v1/posts/{id}/publish` — Publish post
- `PATCH /api/v1/posts/{id}/unpublish` — Unpublish post
- `GET /api/v1/posts/author/{authorId}` — Get posts by author
- `GET /api/v1/posts/author/{authorId}/published` — Get published posts by author

---

## 📦 Scripts

- `npm run dev` — Start server in development mode
- `npm run build` — Compile TypeScript
- `npm start` — Run compiled server
- `npm run db:migrate` — Merge models and run Prisma migrations
- `npm run db:seed` — Seed the database with sample data
- `npm run db:studio` — Open Prisma Studio (GUI for DB)
- `npm run lint` — Run ESLint
- `npm run lint:fix` — Auto-fix lint issues

---

## 🧪 Testing

- **Run all tests:**
  ```bash
  npm test
  ```
- **Test files:** Located in `src/_test_/` and `src/routes/_test_/`
- **API path for tests:** All test requests must use the `/api/v1/` prefix (e.g., `/api/v1/users`, `/api/v1/posts`).
- **Coverage:** Add more tests for controllers/services as needed.

---

## 📁 Project Structure

```text
src/
  controllers/   # Request handlers
  routes/        # Express route definitions
  services/      # Business logic
  middleware/    # Express middleware
  utils/         # Utility functions
  lib/           # Logger, Prisma client, etc.
  docs/          # OpenAPI YAML files
  _test_/        # Jest/Supertest tests
prisma/
  models/        # Modular Prisma models
  schema.prisma  # Merged Prisma schema
  migrations/    # Prisma migrations
```

---

## ➕ Extending the Application

- **Add a new model:** Create a `.prisma` file in `prisma/models/`, then run `npm run prisma:merge` and migrate.
- **Add a new endpoint:** Create a controller, service, and route, then document in `src/docs/`.
- **Update API docs:** Edit the relevant YAML file in `src/docs/`.

---

## 📝 License

MIT
