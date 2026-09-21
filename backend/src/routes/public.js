const express = require('express');
const { query } = require('../config/db');
const { collections } = require('../config/collections');
const { serializeRow, serializeAbout } = require('../utils/helpers');

const router = express.Router();

function isActiveField(key) {
  return key === 'slides' || key === 'projects' || key === 'posts';
}

async function loadCollection(key) {
  const coll = collections[key];
  if (!coll || !coll.public) return null;
  const orderBy = `${coll.sortBy || 'id'} ${coll.sortDir || 'ASC'}`;
  const where = isActiveField(key) ? (key === 'slides' ? 'WHERE active = 1' : 'WHERE published = 1') : '';
  const rows = await query(`SELECT * FROM \`${coll.table}\` ${where} ORDER BY ${orderBy}`);
  return rows.map((r) => serializeRow(coll, r));
}

// Single bundled endpoint used by the frontend initial load.
router.get('/site', async (req, res) => {
  try {
    const out = {};
    for (const key of Object.keys(collections)) {
      const coll = collections[key];
      if (!coll.public) continue;
      out[coll.publicKey || key] = await loadCollection(key);
    }
    const about = await query('SELECT * FROM about WHERE id = 1');
    out.about = serializeAbout(about[0] || null);
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load site data' });
  }
});

router.get('/about', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM about WHERE id = 1');
    res.json(serializeAbout(rows[0] || null));
  } catch (err) {
    res.status(500).json({ message: 'Failed to load about' });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const data = await loadCollection(key);
    if (data === null) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load data' });
  }
});

router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }
  try {
    await query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || '', message]
    );
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;