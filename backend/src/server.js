const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { pool, ensureDatabase } = require('./config/db');
const { buildTableSQL, buildFixedTables } = require('./config/schema');
const { seedAll } = require('./seed');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const { UPLOAD_DIR } = require('./middleware/upload');

async function initDatabase() {
  const { query } = require('./config/db');
  await ensureDatabase();
  const fixed = buildFixedTables();
  for (const sql of fixed) await query(sql);
  const { collections } = require('./config/collections');
  for (const key of Object.keys(collections)) {
    await query(buildTableSQL(collections[key]));
  }
  await seedAll(query);
  console.log('Database tables ready.');
}

/**
 * Generate the sample SVGs the seeded content points at. Render/cloud deploys
 * don't ship backend/uploads (gitignored), so create them at startup.
 */
function ensureSeedImages() {
  try {
    require('../scripts/generate-seed-images');
  } catch (err) {
    console.error('Could not generate seed images:', err.message);
  }
}

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(',') || true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// Serve the built frontend + dashboard from the same origin (single-service deploy).
// The dashboard SPA lives under /dashboard, the public SPA at the root.
const FRONTEND_DIST = path.join(__dirname, '..', '..', 'frontend', 'dist');
const DASHBOARD_DIST = path.join(__dirname, '..', '..', 'dashboard', 'dist');

app.use('/dashboard', express.static(DASHBOARD_DIST));
app.get('/dashboard/*', (req, res) => {
  res.sendFile(path.join(DASHBOARD_DIST, 'index.html'));
});

app.use(express.static(FRONTEND_DIST));
app.get('*', (req, res, next) => {
  if (!req.path.startsWith('/api')) res.sendFile(path.join(FRONTEND_DIST, 'index.html'), () => next());
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  ensureSeedImages();
  try {
    await initDatabase();
  } catch (err) {
    console.error('\n[DB ERROR] Could not connect to / initialise MySQL.');
    console.error('Make sure MySQL is running and the credentials in backend/.env are correct.');
    console.error('You can import backend/database.sql manually, or fix the connection and restart.\n');
    console.error(String(err.message || err).slice(0, 500));
  }
  app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
  });
}

start();

module.exports = app;