const express = require('express');
const { query } = require('../config/db');
const { collections } = require('../config/collections');
const { prepareBody, serializeRow, toBool } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();
router.use(requireAuth);

// ------------------------------------------------ Upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ------------------------------------------------ About (single row)
router.get('/about', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM about WHERE id = 1');
    if (rows.length === 0) return res.status(404).json({ message: 'About not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load about' });
  }
});

router.put('/about', async (req, res) => {
  try {
    const allowed = new Set([
      'first_name', 'last_name', 'title_en', 'title_ar', 'bio_en', 'bio_ar',
      'headline_en', 'headline_ar', 'location_en', 'location_ar', 'email',
      'phone', 'resume_url', 'avatar', 'avatar_alt_en', 'avatar_alt_ar',
      'years_experience', 'projects_completed', 'clients_served', 'certification_count',
      'available_for_hire', 'languages_en', 'languages_ar', 'hobbies_en', 'hobbies_ar',
    ]);
    const data = {};
    for (const key of allowed) {
      if (key in req.body) data[key] = req.body[key];
    }
    if ('available_for_hire' in data) data.available_for_hire = toBool(data.available_for_hire) ? 1 : 0;
    for (const n of ['years_experience', 'projects_completed', 'clients_served', 'certification_count']) {
      if (n in data) data[n] = Number(data[n]) || 0;
    }
    const existing = await query('SELECT id FROM about WHERE id = 1');
    if (existing.length === 0) {
      const cols = Object.keys(data);
      await query(
        `INSERT INTO about (id, ${cols.map((c) => `\`${c}\``).join(',')}) VALUES (1, ${cols.map(() => '?').join(',')})`,
        Object.values(data)
      );
    } else {
      const cols = Object.keys(data);
      if (cols.length) {
        await query(
          `UPDATE about SET ${cols.map((c) => `\`${c}\` = ?`).join(', ')} WHERE id = 1`,
          Object.values(data)
        );
      }
    }
    const rows = await query('SELECT * FROM about WHERE id = 1');
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save about' });
  }
});

// ------------------------------------------------ Generic CRUD
function getCollection(key) {
  return collections[key] || null;
}

router.get('/collections', (req, res) => {
  const summary = {};
  for (const key of Object.keys(collections)) {
    const c = collections[key];
    summary[key] = {
      label: c.label,
      icon: c.icon,
      readOnly: !!c.readOnly,
      public: !!c.public,
    };
  }
  res.json(summary);
});

router.get('/stats', async (req, res) => {
  try {
    const counts = {};
    for (const key of Object.keys(collections)) {
      const c = collections[key];
      const rows = await query(`SELECT COUNT(*) as c FROM \`${c.table}\``);
      counts[key] = rows[0].c;
    }
    const unread = await query('SELECT COUNT(*) as c FROM contact_messages WHERE is_read = 0');
    counts.unread_messages = unread[0].c;
    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load stats' });
  }
});

router.get('/:key', async (req, res) => {
  const coll = getCollection(req.params.key);
  if (!coll) return res.status(404).json({ message: 'Unknown collection' });
  try {
    const orderBy = `${coll.sortBy || 'id'} ${coll.sortDir || 'ASC'}`;
    const rows = await query(`SELECT * FROM \`${coll.table}\` ORDER BY ${orderBy}`);
    res.json(rows.map((r) => serializeRow(coll, r)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load data' });
  }
});

router.post('/:key', async (req, res) => {
  const coll = getCollection(req.params.key);
  if (!coll) return res.status(404).json({ message: 'Unknown collection' });
  if (coll.readOnly) return res.status(403).json({ message: 'This collection is read-only' });
  try {
    const data = prepareBody(coll, req.body);
    const cols = Object.keys(data);
    if (cols.length === 0) return res.status(400).json({ message: 'No valid fields provided' });
    const result = await query(
      `INSERT INTO \`${coll.table}\` (${cols.map((c) => `\`${c}\``).join(',')}) VALUES (${cols.map(() => '?').join(',')})`,
      Object.values(data)
    );
    const rows = await query(`SELECT * FROM \`${coll.table}\` WHERE id = ?`, [result.insertId]);
    res.status(201).json(serializeRow(coll, rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create item' });
  }
});

router.put('/:key/:id', async (req, res) => {
  const coll = getCollection(req.params.key);
  if (!coll) return res.status(404).json({ message: 'Unknown collection' });
  if (coll.readOnly) {
    // read-only collections only allow the is_read toggle
    if ('is_read' in req.body) {
      await query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [toBool(req.body.is_read) ? 1 : 0, req.params.id]);
      const rows = await query('SELECT * FROM contact_messages WHERE id = ?', [req.params.id]);
      return res.json(serializeRow(coll, rows[0]));
    }
    return res.status(403).json({ message: 'This collection is read-only' });
  }
  try {
    const data = prepareBody(coll, req.body);
    const cols = Object.keys(data);
    if (cols.length === 0) return res.status(400).json({ message: 'No valid fields provided' });
    await query(
      `UPDATE \`${coll.table}\` SET ${cols.map((c) => `\`${c}\` = ?`).join(', ')} WHERE id = ?`,
      [...Object.values(data), req.params.id]
    );
    const rows = await query(`SELECT * FROM \`${coll.table}\` WHERE id = ?`, [req.params.id]);
    res.json(serializeRow(coll, rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update item' });
  }
});

router.delete('/:key/:id', async (req, res) => {
  const coll = getCollection(req.params.key);
  if (!coll) return res.status(404).json({ message: 'Unknown collection' });
  try {
    await query(`DELETE FROM \`${coll.table}\` WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

module.exports = router;