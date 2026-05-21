# India Accelerator — Investor Portal

A full-stack web app for India Accelerator's investor demo events.


- **Public site** — Investors browse the cohort and book 1:1 meetings via Calendly.
- **Admin portal** — Authenticated admins manage startup listings and founders.

Built with **React 18 + Vite + Tailwind**, **Node + Express**, and **Supabase** (Postgres, Auth, Storage).

---

## Project structure

```
/client       React + Vite frontend (Tailwind CSS, React Router v6)
/server       Express REST API (Supabase service-role client, multer uploads)
/supabase     SQL migration for the database schema + RLS policies
```

---

## 1. Prerequisites

- Node.js 18+ and npm
- A free [Supabase](https://supabase.com) project

---

## 2. Supabase setup

### a) Run the schema

Open your Supabase project → **SQL Editor** → New query, paste the contents of
[`supabase/migration.sql`](./supabase/migration.sql), and run it.

This creates the `startups` and `founders` tables, indexes, and the RLS policies.

### b) Create storage buckets

In **Storage**, create three **Public** buckets:

| Bucket            | Visibility |
|-------------------|------------|
| `logos`           | Public     |
| `pitch-decks`     | Public     |
| `founder-photos`  | Public     |

All writes flow through the backend with the service-role key, so no additional
storage policies are needed.

### c) Enable Email auth + create the admin user

1. **Authentication → Providers**: enable **Email**, disable public sign-ups.
2. **Authentication → Users → Invite user** — invite the admin's email and set a password.

### d) Grab your keys

You'll need these from **Project Settings → API**:

- `SUPABASE_URL` (the project URL)
- **Publishable key** `sb_publishable_*` (for the frontend — safe to expose)
- **Secret key** `sb_secret_*` (or legacy `service_role` JWT) for the backend —
  **never** ship this to the client

---

## 3. Environment variables

### `server/.env`

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service-role)
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

### `client/.env`

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # (or the legacy anon JWT)
VITE_API_BASE_URL=http://localhost:4000/api
```

> Use the new **publishable** key (`sb_publishable_*`) from
> **Project Settings → API → API Keys**. The legacy `anon` JWT also still works.

`.env.example` files are committed in both directories for reference.

---

## 4. Install & run

From the project root:

```bash
# install root + client + server deps
npm run install:all

# start client (5173) and server (4000) together
npm run dev
```

Or independently:

```bash
npm run dev:client   # http://localhost:5173
npm run dev:server   # http://localhost:4000
```

---

## 5. Using the app

- **Public site**: `http://localhost:5173`
  - `/` — Hero + featured startups
  - `/startups` — Full grid with sector/stage filters
  - `/startups/:id` — Detail page with founders + Calendly embed
- **Admin portal**:
  - `/admin/login` — Sign in with the admin user you invited in Supabase
  - `/admin/dashboard` — Manage startups (toggle visibility, edit, delete)
  - `/admin/startups/new` and `/admin/startups/:id/edit` — Create/edit startup + dynamic founders

---

## 6. API reference

All mutating routes require a Supabase JWT in `Authorization: Bearer <token>`.

### Startups

| Method | Path                                | Auth | Description                              |
|--------|-------------------------------------|------|------------------------------------------|
| GET    | `/api/startups`                     | —    | List visible startups (public)           |
| GET    | `/api/startups/all`                 | ✅    | List all startups (admin)                |
| GET    | `/api/startups/:id`                 | —    | One startup + founders array             |
| POST   | `/api/startups`                     | ✅    | Create                                   |
| PUT    | `/api/startups/:id`                 | ✅    | Update                                   |
| DELETE | `/api/startups/:id`                 | ✅    | Delete + cascade founders                |
| PATCH  | `/api/startups/:id/visibility`      | ✅    | Toggle `is_visible`                      |

### Founders

| Method | Path                            | Auth | Description                  |
|--------|---------------------------------|------|------------------------------|
| GET    | `/api/founders/:startup_id`     | —    | List founders for a startup  |
| POST   | `/api/founders`                 | ✅    | Create                       |
| PUT    | `/api/founders/:id`             | ✅    | Update                       |
| DELETE | `/api/founders/:id`             | ✅    | Delete                       |

### Uploads (multipart/form-data, field name `file`)

| Method | Path                          | Auth | Bucket           |
|--------|-------------------------------|------|------------------|
| POST   | `/api/upload/logo`            | ✅    | `logos`          |
| POST   | `/api/upload/pitch-deck`      | ✅    | `pitch-decks`    |
| POST   | `/api/upload/founder-photo`   | ✅    | `founder-photos` |

Errors are returned as `{ "error": "message" }` with an appropriate status code.

---

## 7. Brand tokens

Tailwind config exposes the IA brand palette:

```js
ia: {
  navy: '#0a0f1e',
  orange: '#e8451e',
  card: '#111827',
}
```

The design mirrors [indiaaccelerator.co](https://indiaaccelerator.co) — deep navy
background, bright orange accent, Inter sans-serif, full-width hero sections,
card grid for startups.

---

## 8. Production build

```bash
npm run build      # builds client/dist
npm start          # runs the Express server
```

Deploy the API (`/server`) and the static client (`/client/dist`) to your host of choice.
Remember to set `CLIENT_ORIGIN` on the server to your deployed frontend URL.
