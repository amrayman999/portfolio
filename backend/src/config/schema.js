const { collections } = require('./collections');

const SQL_TYPES = {
  string: 'VARCHAR(255)',
  text: 'VARCHAR(255)',
  textarea: 'TEXT',
  number: 'INT NULL',
  date: 'DATE NULL',
  boolean: 'TINYINT(1) NOT NULL DEFAULT 0',
  image: 'VARCHAR(500) NULL',
  images: 'JSON NULL',
  select: 'VARCHAR(100) NULL',
  tags: 'TEXT NULL',
  email: 'VARCHAR(255) NULL',
  url: 'VARCHAR(1000) NULL',
};

function columnName(f) {
  return f.locale ? `${f.name}_${f.locale}` : f.name;
}

/**
 * Generate the table definition for a collection based on its field list.
 */
function buildTableSQL(coll) {
  const lines = ['id INT AUTO_INCREMENT PRIMARY KEY'];
  for (const f of coll.fields) {
    const name = columnName(f);
    let sql = `\`${name}\` ${SQL_TYPES[f.type]}`;
    if (!f.optional && f.type !== 'number' && f.type !== 'boolean') {
      sql += ' NOT NULL';
    }
    lines.push(sql);
  }
  lines.push('`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP');
  lines.push('`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
  return `CREATE TABLE IF NOT EXISTS \`${coll.table}\` (\n  ${lines.join(',\n  ')}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;
}

/**
 * Fixed tables not driven by the collection config.
 */
function buildFixedTables() {
  return [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'admin',
      avatar VARCHAR(500) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS about (
      id INT PRIMARY KEY DEFAULT 1,
      first_name VARCHAR(100) NOT NULL DEFAULT '',
      last_name VARCHAR(100) NOT NULL DEFAULT '',
      title_en VARCHAR(200) NOT NULL DEFAULT '',
      title_ar VARCHAR(200) NOT NULL DEFAULT '',
      bio_en TEXT,
      bio_ar TEXT,
      headline_en VARCHAR(300) DEFAULT '',
      headline_ar VARCHAR(300) DEFAULT '',
      location_en VARCHAR(200) DEFAULT '',
      location_ar VARCHAR(200) DEFAULT '',
      email VARCHAR(255) DEFAULT '',
      phone VARCHAR(100) DEFAULT '',
      resume_url VARCHAR(1000) DEFAULT '',
      avatar VARCHAR(500) DEFAULT '',
      avatar_alt_en VARCHAR(200) DEFAULT '',
      avatar_alt_ar VARCHAR(200) DEFAULT '',
      years_experience INT DEFAULT 0,
      projects_completed INT DEFAULT 0,
      clients_served INT DEFAULT 0,
      certification_count INT DEFAULT 0,
      available_for_hire TINYINT(1) NOT NULL DEFAULT 1,
      languages_en TEXT,
      languages_ar TEXT,
      hobbies_en TEXT,
      hobbies_ar TEXT,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  ];
}

module.exports = { buildTableSQL, buildFixedTables, columnName };