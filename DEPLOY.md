# Deployment Guide (100% Free, 2 Services)

This guide deploys the **entire project** — backend API, public site, and admin
dashboard — using only **2 free services**:

| Service | Runs | URL |
|---------|------|-----|
| **TiDB Cloud** | MySQL-compatible database | n/a (internal) |
| **Render** | Backend API **+ public site + dashboard** (one Node service) | `https://portfolio-yourname.onrender.com` |

**Total cost: $0. Total services: 2.**

Everything is served from **one URL**, so there are no CORS issues, no extra
`VITE_API_URL` config, and no Vercel setup at all.

---

## How it works

The Express backend in `backend/src/server.js` not only serves `/api/*`, but also:

- the **public site** from `frontend/dist` at the root (`/`)
- the **admin dashboard** from `dashboard/dist` at `/dashboard`

Your final URLs look like:
- Public site: `https://portfolio-yourname.onrender.com`
- Admin dashboard: `https://portfolio-yourname.onrender.com/dashboard`
- API health: `https://portfolio-yourname.onrender.com/api/health`

---

## Prerequisites

- A GitHub account (you already have one — repo at `github.com/amrayman999/portfolio`)
- That's it. No credit card needed.

---

## Step 1 — Create the Database (TiDB Cloud, ~5 min)

1. Go to **https://tidbcloud.com** → **Sign up** (free, no credit card).
2. Click **Create Cluster** → **Serverless Tier** (free, 5 GB).
3. Pick a region near you → **Create** → wait for **Available** (~1–2 min).
4. Click your cluster → **Connect** → **Connect with a connection string**.
5. It looks like this (your values differ):
   ```
   mysql://root.abc123cluster:s3cr3tP4ss@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl-mode=VERIFY_IDENTITY
   ```
   **Save the password** (shown once).
6. Open the **SQL Editor** and run:
   ```sql
   CREATE DATABASE IF NOT EXISTS portfolio_db;
   ```
7. Write down these values for Step 2:
   - `DB_HOST` = between `@` and `:` → `gateway01.xxx.tidbcloud.com`
   - `DB_PORT` = `4000`
   - `DB_USER` = between `mysql://` and `:` → `root.abc123cluster`
   - `DB_PASSWORD` = the saved password

---

## Step 2 — Deploy Everything to Render (~5 min)

1. Go to **https://render.com** → **Sign up** (free).
2. Click **New** → **Blueprint** → connect GitHub → choose the **portfolio** repo.
3. Render reads `render.yaml` and creates **one service: `portfolio`** (free plan).
4. Open the service → **Environment** tab → fill in:

   | Variable | Your value |
   |----------|-----------|
   | `DB_HOST` | *(from Step 1.7)* |
   | `DB_PORT` | `4000` |
   | `DB_USER` | *(from Step 1.7)* |
   | `DB_PASSWORD` | *(your TiDB password)* |
   | `DB_NAME` | `portfolio_db` |
   | `DB_SSL` | `true` |
   | `JWT_SECRET` | *(auto-generated, can leave alone)* |
   | `ADMIN_NAME` | `Admin` (default) |
   | `ADMIN_EMAIL` | `admin@portfolio.com` |
   | `ADMIN_PASSWORD` | *(pick a password, min 8 chars)* |
   | `FRONTEND_ORIGIN` | *(leave empty — same-origin only)* |

5. Click **Save Changes** → **Deploy latest commit**.
6. The first deploy builds the backend + both frontends (~3 min).
7. When done, open:
   - `https://portfolio-yourname.onrender.com/api/health` → `{"status":"ok"}`
   - `https://portfolio-yourname.onrender.com` → public site
   - `https://portfolio-yourname.onrender.com/dashboard` → admin login

   > First request after idle can take 30–50 s (free tier sleeps). Be patient.

**Your URL is `https://portfolio-yourname.onrender.com`** — save it, that's your whole app.

---

## Login

Dashboard login = the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in Render env.

---

## Updates After Code Changes

```bash
git add -A
git commit -m "change"
git push origin main
```

Render auto-deploys on push (blueprint has `autoDeploy: true`). After the build,
your live site updates.

> Hot tip: since only Render rebuilds, `frontend/.env` and `dashboard/.env`
> `VITE_API_URL` are unused in production — the site calls `/api` on the same
> origin automatically.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `/api/health` 404/500 | Render **Logs** tab. Usually wrong `DB_*` env var. |
| Site loads, no content | DB connection failing — check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_SSL=true`. |
| Dashboard: "Invalid email or password" | Check `ADMIN_EMAIL` / `ADMIN_PASSWORD`. |
| Images don't load | They're served by the backend at `/uploads/...` — same origin, should just work. Check public site's image URLs. |
| `/dashboard` shows the wrong page | Make sure you're hitting `/dashboard` (not `/`). |
| First request slow | Normal — free tier sleeps after ~15 min idle. |

---

## URLs Summary

| What | URL |
|------|-----|
| GitHub repo | `https://github.com/amrayman999/portfolio` |
| Database | TiDB Cloud console |
| **Your app** | `https://portfolio-yourname.onrender.com` |
| Public site | `https://portfolio-yourname.onrender.com` |
| Admin dashboard | `https://portfolio-yourname.onrender.com/dashboard` |
| API health | `https://portfolio-yourname.onrender.com/api/health` |