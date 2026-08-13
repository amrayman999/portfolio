import { uploadFile } from './api/client';

export function apiToForm(coll, row) {
  const form = {};
  for (const f of coll.fields) {
    if (f.locale) {
      form[f.name] = {
        ...(form[f.name] || {}),
        [f.locale]: row ? row[`${f.name}_${f.locale}`] ?? '' : '',
      };
    } else {
      let v = row ? row[f.name] : undefined;
      if (v === undefined || v === null) {
        v = f.type === 'boolean' ? false : f.type === 'tags' || f.type === 'images' ? [] : '';
      }
      form[f.name] = v;
    }
  }
  return form;
}

export function formToApi(coll, form) {
  const payload = {};
  for (const f of coll.fields) {
    if (f.locale) {
      payload[f.name] = payload[f.name] || {};
      payload[f.name][f.locale] = form[f.name]?.[f.locale] ?? '';
    } else {
      payload[f.name] = form[f.name] ?? '';
    }
  }
  return payload;
}

export function pickColumns(coll) {
  const cols = [];
  const imgField = coll.fields.find((f) => f.type === 'image');
  if (imgField) cols.push({ type: 'image', field: imgField.name });
  const localeString = coll.fields.filter((f) => f.locale === 'en' && ['string', 'textarea'].includes(f.type)).slice(0, 2);
  localeString.forEach((f) => cols.push({ type: 'text', field: f.name, label: f.label }));
  const plain = coll.fields.find((f) => !f.locale && (f.type === 'select' || f.type === 'string' || f.type === 'number'));
  if (plain && cols.filter((c) => c.field !== plain.name).length) cols.push({ type: 'text', field: plain.name, label: plain.label });
  const bool = coll.fields.filter((f) => f.type === 'boolean');
  bool.forEach((f) => cols.push({ type: 'bool', field: f.name, label: f.label }));
  return cols;
}

export async function uploadOne(file) {
  return uploadFile(file);
}
