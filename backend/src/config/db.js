const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'portfolio_db';

const sslOption =
  process.env.DB_SSL === 'true' || process.env.DB_SSL === '1'
    ? { ssl: { rejectUnauthorized: false } }
    : {};

const baseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  dateStrings: true,
  ...sslOption,
};

/**
 * Create the database if it does not exist yet.
 */
async function ensureDatabase() {
  const conn = await mysql.createConnection({ ...baseConfig, database: undefined });
  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`Database "${DB_NAME}" ready.`);
  } finally {
    await conn.end();
  }
}

const pool = mysql.createPool({ ...baseConfig, database: DB_NAME });

async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { pool, query, ensureDatabase };
