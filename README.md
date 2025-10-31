# Demo Contacts App

A minimal full-stack contacts manager with:

- **Backend:** Node.js + Express + PostgreSQL
- **Frontend:** React (Vite)

It lets you add, edit, and delete contacts with name, email, and phone fields.

## Prerequisites

- Node.js 18+
- PostgreSQL 13+

## Getting Started

Clone the repository (or open the provided workspace) and install dependencies.

```bash
npm install --prefix server
npm install --prefix client
```

### Configure the database connection

1. Create a PostgreSQL database, e.g.
   ```bash
   createdb demoapp
   ```
2. Copy the sample environment file and update the connection string:
   ```bash
   cp server/.env.example server/.env
   ```
   Set `DATABASE_URL` to your connection string, for example:
   ```
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/demoapp
   ```

### Run database migrations

```bash
npm run migrate --prefix server
```

This creates the `contacts` table and a trigger to keep `updated_at` in sync.

### Start the servers

In one terminal (backend):

```bash
npm run dev --prefix server
```

In another terminal (frontend):

```bash
npm run dev --prefix client
```

The API runs at `http://localhost:4000` and Vite serves the React app at `http://localhost:5173`. Vite proxies `/api` to the backend during development.

## Scripts Reference

Backend (`server`):

- `npm run dev` – start Express with hot reload (nodemon)
- `npm start` – start Express without nodemon
- `npm run migrate` – apply SQL migrations in `server/sql/init.sql`

Frontend (`client`):

- `npm run dev` – start Vite dev server
- `npm run build` – build production assets
- `npm run preview` – preview the production build

## Deployment Prep

- Commit `server/.env.example` only; keep any real `.env` files out of git (covered by `.gitignore` alongside `*.pem`, `*.db`, `node_modules/`, etc.).
- Populate GitHub → Settings → Secrets → Actions with:
  - `SSH_HOST` – your EC2 public IP or hostname
  - `SSH_USER` – e.g. `ubuntu`
  - `SSH_KEY` – contents of your EC2 `.pem`
  - `DATABASE_URL` – production Postgres connection string
  - `APP_PORT` (optional) – defaults to `4000` if unset
- Rotate secrets whenever you redeploy or replace keys; never bake them into images or commits.

## Docker (API Only)

The `server/Dockerfile` packages just the Express API so you can host the React front end separately (e.g., Vercel/Netlify) and ship the backend to EC2.

```bash
# Build the image
docker build -t demoapp-api ./server

# Run locally with required environment variables
docker run -p 4000:4000 -e DATABASE_URL=postgres://... demoapp-api
```

Run `npm run migrate --prefix server` (or execute the SQL in `server/sql`) against your production database before starting the container.

## API Overview

All routes are prefixed with `/api`.

| Method | Route           | Description                |
| ------ | --------------- | -------------------------- |
| GET    | `/contacts`     | List all contacts          |
| POST   | `/contacts`     | Create a new contact       |
| PUT    | `/contacts/:id` | Update an existing contact |
| DELETE | `/contacts/:id` | Delete a contact           |

Each contact has the shape:

```json
{
  "id": 1,
  "name": "Your Name",
  "email": "example@example.com",
  "phone": "+977 9812345678"
}
```

Error responses include a `message` field describing the issue. Email addresses are unique per contact.

## Project Structure

```
.
├── client/            # React front-end (Vite)
├── server/            # Express backend + PostgreSQL
│   ├── scripts/       # Database migration helper
│   ├── sql/           # SQL migrations
│   └── src/           # Application source
└── package.json       # Root scripts/workspaces
```

## Next Steps

- Add authentication if you need user-specific contacts.
- Deploy the backend (e.g., Render, Railway) and host the frontend (e.g., Netlify).
- Extend the UI with search/filtering or pagination for larger contact lists.
