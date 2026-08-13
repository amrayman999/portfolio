# Software Engineer Portfolio — Full-Stack Website

A professional, fully-dynamic portfolio website with a **React frontend**, a **Node.js/Express backend**, and a **MySQL database**. It ships with **English + Arabic (RTL)** support, **light/dark modes**, an animated **3D software-engineering hero scene**, an image **slideshow**, and a complete **admin dashboard** — built as a **separate standalone app** so it can be developed, built, and deployed independently. The design uses a **navy / blue palette** with a navy-toned dark theme.

---

## ✨ Features

### Public site
- **Hero section** with an animated **3D scene** (energy core, orbit rings, floating code particles) + **slideshow** of your photos/highlights.
- **About** — bio (EN/AR), stats, education, languages, hobbies, downloadable resume.
- **Projects** — cover image, gallery, tech stack, GitHub/live links, categories, featured flag.
- **Experience** — timeline with company, role, location, dates, "current" badge.
- **Skills** — categorized skill bars with proficiency %, icons.
- **Certificates** — issuer, credential URL, issue/expiry dates.
- **Trophies & Awards** — year, issuer, image.
- **Participations** — events, hackathons, conferences with role, location, link.
- **Services**, **Testimonials**, **Blog** (markdown posts), **Social links**.
- **Contact form** that saves messages into the database.
- **English / Arabic** (full RTL flip) and **light / dark mode** — both toggleable from the navbar.

### Admin dashboard — **standalone app** on port **5174**
- Secure **JWT login** (default admin auto-created on first run).
- Data-driven **CRUD pages** for every content type: slides, projects, experiences, trophies, certificates, participations, skills, education, services, testimonials, blog posts, social links.
- **Image upload** (single + multi-gallery) directly from the dashboard.
- **Profile/About editor**, **contact messages inbox** (mark read / delete), and **change password**.
- Overview page with live content counts.
- Runs separately from the public site; the public navbar links to it in a new tab.

---

## 🏗 Architecture

```
Portfolio/
├── backend/                 # Node.js + Express + MySQL API (port 5000)
│   ├── src/
│   │   ├── config/          # db pool, collection/table definitions, schema builder
│   │   ├── routes/          # auth, public API, admin CRUD API
│   │   ├── middleware/      # JWT auth, multer uploads
│   │   ├── utils/           # field (de)serialization helpers
│   │   ├── seed.js          # creates admin user + sample content
│   │   └── server.js        # app entry — auto-creates tables on startup
│   ├── uploads/             # uploaded images (auto-generated seed images live here)
│   ├── database.sql         # generated schema (alternative to auto-create)
│   └── scripts/             # schema/image generators + unit test
├── frontend/                # PUBLIC site — React + Vite + Tailwind + i18next + Three.js (port 5173)
│   └── src/
│       ├── api/             # axios client for the public API
│       ├── context/         # global state (site data, theme, language)
│       ├── components/      # navbar, footer, 3D hero, slideshow, cards...
│       ├── pages/           # public pages
│       └── i18n.js          # re-exports shared/i18n
├── dashboard/               # ADMIN app — React + Vite + Tailwind (port 5174)
│   └── src/
│       ├── api/             # axios client with JWT interceptor + upload helper
│       ├── context/         # auth, theme, language state
│       ├── components/      # dynamic form, image uploaders
│       ├── pages/           # login, layout, overview, CRUD, about, messages, settings
│       ├── config.js        # dashboard-side mirror of the collection definitions
│       └── i18n.js          # re-exports shared/i18n
└── shared/                  # single-source-of-truth shared code
    └── i18n.js              # EN / AR translations used by BOTH apps
```

**Data model** — every content type is described once in `backend/src/config/collections.js` (fields, types, locales, ordering). The same definition drives table auto-creation, the generic CRUD API, and the dashboard forms, so adding a new field is a one-line change. All bilingual text is stored as `*_en` / `*_ar` columns. Translations live in one file — `shared/i18n.js` — imported by both the public site and the dashboard (their Vite configs alias `i18next`/`react-i18next` into their own `node_modules` so the shared file resolves correctly at build time).

---

## 🚀 Getting started

### Prerequisites
- **Node.js** 18+ (tested on 24)
- **MySQL** 8.0+ running locally (see [MySQL notes](#mysql-setup))

### 1) Backend

```bash
cd backend
npm install

# configure database credentials
copy .env.example .env        # Windows:  Copy-Item .env.example .env
```

Edit `backend/.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db
JWT_SECRET=a_long_random_secret
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=admin123      # change after first login
```

Start it:

```bash
npm start                    # or: npm run dev
```

On startup the backend **creates the database tables automatically** (if missing) and **seeds an admin user + sample content**. You should see:

```
Database tables ready.
Backend API running on http://localhost:5000
```

### 2) Public frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — the dev server proxies `/api` and `/uploads` to the backend on port 5000.

### 3) Admin dashboard (standalone app)

```bash
cd dashboard
npm install
npm run dev
```

Open **http://localhost:5174/dashboard** and sign in with the credentials from your `.env`
(defaults: `admin@portfolio.com` / `admin123`). Then replace the sample content with your own.
The public site's "Dashboard" button links here in a new tab (override with `VITE_DASHBOARD_URL` in `frontend/.env`).

---

## 🔒 MySQL setup

The backend tries to auto-create everything. Two options:

**Option A — automatic (recommended):** just make sure MySQL is running and the credentials in `.env` are correct, then start the backend. Tables, admin user, and sample data are created for you.

**Option B — manual import:**
```bash
mysql -u root -p < backend/database.sql
mysql -u root -p portfolio_db < backend/database.sql  # if DB already created
```

If the DB is unreachable the backend still starts but prints a clear error and the data endpoints return 500 until MySQL is up.

---

## 📖 API reference (summary)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST   | `/api/auth/login` | Admin login → JWT |
| GET    | `/api/auth/me` | Current user |
| PUT    | `/api/auth/password` | Change password |
| GET    | `/api/public/site` | **All** public content in one call (used by the frontend) |
| GET    | `/api/public/:key` | One collection (`projects`, `skills`, `slides`…) |
| POST   | `/api/public/contact` | Save a contact message |
| GET    | `/api/admin/:key` | List items *(auth)* |
| POST   | `/api/admin/:key` | Create item *(auth)* |
| PUT    | `/api/admin/:key/:id` | Update item *(auth)* |
| DELETE | `/api/admin/:key/:id` | Delete item *(auth)* |
| GET/PUT| `/api/admin/about` | Read / update profile *(auth)* |
| POST   | `/api/admin/upload` | Upload a file → `{ url }` *(auth)* |
| GET    | `/api/admin/stats` | Content counts + unread messages *(auth)* |

---

## 🛠 Production build

```bash
# public site
cd frontend
npm run build                # outputs static site to frontend/dist
npm run preview              # serve locally to test the production build

# admin dashboard
cd ../dashboard
npm run build                # outputs static site to dashboard/dist
npm run preview
```

For production, serve `frontend/dist` and `dashboard/dist` behind any static host/nginx and point the API at the backend. Uploaded files are served by the backend under `/uploads`.

---

## ✅ Tests / checks

```bash
# Backend logic unit test (no DB needed)
node backend/scripts/test-unit.js

# Backend syntax check
cd backend && node --check src/server.js

# Public frontend production build (catches compile errors)
cd frontend && npm run build

# Admin dashboard production build
cd dashboard && npm run build
```

---

## 📦 Extending

- **Add a new content type** (e.g. "publications"): add its definition to `backend/src/config/collections.js` and `dashboard/src/config.js`. Tables, API and dashboard UI are generated automatically.
- **Add a field** to an existing type: add one line to both config files — done.
- **Translations:** edit `shared/i18n.js` (all UI strings are covered in EN + AR and shared by both apps).
- **Seed images** are generated SVGs in `backend/uploads/` — replace them from the dashboard's upload fields, or add your own slides in **Dashboard → Slideshow Images**.
