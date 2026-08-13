const { buildTableSQL, buildFixedTables } = require('../src/config/schema');
const { collections } = require('../src/config/collections');
const { prepareBody, serializeRow, serializeAbout } = require('../src/utils/helpers');
const assert = require('assert');

const sql = buildTableSQL(collections.projects);
assert(sql.includes('CREATE TABLE IF NOT EXISTS `projects`'));
assert(sql.includes('`title_en` VARCHAR(255) NOT NULL'));
assert(sql.includes('`tech_stack` TEXT NULL'));
assert(sql.includes('`gallery` JSON NULL'));
console.log('schema OK for all tables:', Object.keys(collections).length, 'collections');
buildFixedTables().forEach((s) => assert(s.includes('CREATE TABLE IF NOT EXISTS')));

const body = prepareBody(collections.projects, {
  title: { en: 'Hello', ar: 'مرحبا' },
  tech_stack: ['React', 'Node'],
  featured: true,
  gallery: ['/uploads/a.png'],
});
assert(body.title_en === 'Hello');
assert(body.title_ar === 'مرحبا');
assert(body.tech_stack === '["React","Node"]');
assert(body.featured === 1);
assert(body.gallery === '["/uploads/a.png"]');
console.log('prepareBody OK');

const row = serializeRow(collections.projects, {
  id: 1,
  title_en: 'Hello',
  title_ar: 'مرحبا',
  tech_stack: '["React"]',
  gallery: '["/u.png"]',
  featured: 1,
});
assert(row.title.en === 'Hello');
assert(row.title.ar === 'مرحبا');
assert(Array.isArray(row.tech_stack) && row.tech_stack[0] === 'React');
assert(row.featured === 1);
console.log('serializeRow OK');

const about = serializeAbout({
  id: 1,
  first_name: 'John',
  title_en: 'Engineer',
  title_ar: 'مهندس',
  bio_en: 'Bio EN',
  bio_ar: 'السيرة',
  years_experience: 5,
});
assert(about.title.en === 'Engineer' && about.title.ar === 'مهندس');
assert(about.bio.en === 'Bio EN');
assert(about.years_experience === 5);
assert(about.title_en === undefined);
console.log('serializeAbout OK');
console.log('ALL BACKEND UNIT CHECKS PASSED');
