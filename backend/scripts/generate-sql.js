const fs = require('fs');
const path = require('path');
const { buildTableSQL, buildFixedTables } = require('../src/config/schema');

const banner = `-- =============================================================
-- Portfolio Database Schema (MySQL)
-- Generated automatically. You can import this with:
--   mysql -u root -p < database.sql
-- NOTE: the backend also creates these tables at startup.
-- =============================================================

CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;
`;

const sqls = [banner, ...buildFixedTables()];
const { collections } = require('../src/config/collections');
for (const key of Object.keys(collections)) {
  sqls.push(buildTableSQL(collections[key]));
}

const out = path.join(__dirname, '..', 'database.sql');
fs.writeFileSync(out, sqls.join(';\n\n') + ';\n');
console.log(`Wrote ${out}`);