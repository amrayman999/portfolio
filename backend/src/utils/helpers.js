const { columnName } = require('../config/schema');

/**
 * JSON-ish field types that are stored as text/json but served as arrays.
 */
const JSON_FIELDS = ['tags', 'images'];

function toBool(v) {
  return v === true || v === 1 || v === '1' || v === 'true';
}

function normalizeValue(type, value) {
  if (value === null || value === undefined || value === '') return null;
  if (type === 'boolean') return toBool(value) ? 1 : 0;
  if (type === 'number') {
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }
  if (JSON_FIELDS.includes(type)) {
    if (Array.isArray(value)) return JSON.stringify(value);
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed);
    } catch (e) {
      if (typeof value === 'string') {
        return JSON.stringify(value.split(',').map((s) => s.trim()).filter(Boolean));
      }
      return JSON.stringify([]);
    }
  }
  return typeof value === 'string' ? value : String(value);
}

/**
 * Filter + normalize an incoming request body to only the collection fields.
 */
function prepareBody(coll, body) {
  const result = {};
  for (const f of coll.fields) {
    if (!(f.name in body)) continue;
    const name = columnName(f);
    const value = f.locale ? body[f.name][f.locale] : body[f.name];
    const normalized = normalizeValue(f.type, f.locale ? value : value);
    if (f.locale) {
      result[name] = normalized;
    } else {
      result[f.name] = normalized;
    }
  }
  return result;
}

/**
 * Convert stored rows back into a frontend-friendly shape: arrays parsed,
 * en/ar pairs merged.
 */
function serializeRow(coll, row) {
  if (!row) return row;
  const out = { ...row };
  // group fields by base name to build { _en, _ar }
  const grouped = {};
  for (const f of coll.fields) {
    const name = columnName(f);
    if (!(name in row)) continue;
    if (JSON_FIELDS.includes(f.type)) {
      try {
        const parsed = JSON.parse(row[name] || '[]');
        out[name] = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        out[name] = row[name] ? String(row[name]).split(',').map((s) => s.trim()).filter(Boolean) : [];
      }
      continue;
    }
    if (f.locale) {
      grouped[f.name] = grouped[f.name] || {};
      grouped[f.name][f.locale] = row[name];
    }
  }
  for (const key of Object.keys(grouped)) {
    out[key] = grouped[key];
  }
  return out;
}

const ABOUT_LOCALIZED = ['title', 'headline', 'bio', 'location', 'avatar_alt', 'languages', 'hobbies'];

/**
 * Convert a raw about row (flat `*_en`/`*_ar` columns) into the nested
 * `{ en, ar }` shape used by the frontend L() helper. Flat fields stay as-is.
 */
function serializeAbout(row) {
  if (!row) return row;
  const out = { ...row };
  for (const field of ABOUT_LOCALIZED) {
    if (`${field}_en` in row || `${field}_ar` in row) {
      out[field] = { en: row[`${field}_en`] || '', ar: row[`${field}_ar`] || '' };
      delete out[`${field}_en`];
      delete out[`${field}_ar`];
    }
  }
  return out;
}

module.exports = { prepareBody, serializeRow, serializeAbout, normalizeValue, toBool };