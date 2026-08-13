const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { signToken, requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const rows = await query('SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load user' });
  }
});

router.put('/password', requireAuth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const rows = await query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });
    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    const hash = await bcrypt.hash(new_password, 10);
    await query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password' });
  }
});

router.post('/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    await query('UPDATE users SET avatar = ? WHERE id = ?', [url, req.user.id]);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;