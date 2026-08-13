import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSave, FiX } from 'react-icons/fi';
import { ImageUploader, MultiImageUploader } from './ImageUploader';
import { apiToForm, formToApi } from '../util';

function LocaleLabel({ baseLabel, locale }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {baseLabel}
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-300">
        {locale === 'en' ? 'EN' : 'AR'}
      </span>
    </span>
  );
}

export default function DynamicForm({ coll, initial, onSubmit, onCancel, busy }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(() => apiToForm(coll, initial));
  const [error, setError] = useState('');

  const groups = useMemo(() => {
    const out = [];
    const seen = new Set();
    for (const f of coll.fields) {
      if (f.locale) {
        if (seen.has(f.name)) continue;
        seen.add(f.name);
        const pair = coll.fields.filter((x) => x.name === f.name);
        out.push({
          isLocale: true,
          base: f.name,
          en: pair.find((x) => x.locale === 'en'),
          ar: pair.find((x) => x.locale === 'ar'),
        });
      } else {
        out.push({ isLocale: false, field: f });
      }
    }
    return out;
  }, [coll]);

  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const setLocale = (base, locale, value) =>
    setForm((p) => ({ ...p, [base]: { ...(p[base] || {}), [locale]: value } }));

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl bg-soft border border-soft focus:border-brand-500 focus:outline-none transition-colors';

  const submit = (e) => {
    e.preventDefault();
    for (const f of coll.fields) {
      if (f.required) {
        const v = f.locale ? form[f.name]?.[f.locale] : form[f.name];
        if (f.type === 'boolean') continue;
        if (Array.isArray(v)) {
          if (v.length === 0) return setError(`${f.label || f.name} is required`);
        } else if (v === undefined || v === null || String(v).trim() === '') {
          return setError(`${f.label || f.name} is required`);
        }
      }
    }
    setError('');
    onSubmit(formToApi(coll, form));
  };

  const renderSingle = (f, value, onChange) => {
    switch (f.type) {
      case 'textarea':
        return <textarea rows={3} className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
      case 'number':
        return <input type="number" className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
      case 'date':
        return <input type="date" className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
      case 'select':
        return (
          <select className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)}>
            <option value="">—</option>
            {(f.options || []).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button
              type="button"
              role="switch"
              aria-checked={!!value}
              onClick={() => onChange(!value)}
              className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? 'start-[22px]' : 'start-0.5'}`}
              />
            </button>
            <span className="text-sm text-muted">{value ? 'On' : 'Off'}</span>
          </label>
        );
      case 'tags':
        return (
          <input
            className={inputCls}
            value={(value || []).join(', ')}
            placeholder="tag1, tag2, tag3"
            onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        );
      case 'image':
        return <ImageUploader value={value || ''} onChange={onChange} label={f.label} />;
      case 'images':
        return <MultiImageUploader value={value || []} onChange={onChange} label={f.label} />;
      case 'url':
        return <input type="url" dir="ltr" className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
      case 'email':
        return <input type="email" dir="ltr" className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
      default:
        return <input className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{error}</div>
      )}

      {groups.map((g, i) => {
        if (g.isLocale) {
          return (
            <div key={i} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <LocaleLabel baseLabel={g.en.label} locale="en" />
                </label>
                {renderSingle(g.en, form[g.base]?.en, (v) => setLocale(g.base, 'en', v))}
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium mb-2">
                  <LocaleLabel baseLabel={g.ar.label} locale="ar" />
                </label>
                {renderSingle(g.ar, form[g.base]?.ar, (v) => setLocale(g.base, 'ar', v))}
              </div>
            </div>
          );
        }
        const f = g.field;
        return (
          <div key={i}>
            <label className="block text-sm font-medium mb-2">{f.label}</label>
            {renderSingle(f, form[f.name], (v) => set(f.name, v))}
          </div>
        );
      })}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold disabled:opacity-60"
        >
          <FiSave /> {t('dash.save')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-soft bg-card text-sm font-semibold text-muted hover:text-brand-500 transition-colors"
        >
          <FiX /> {t('dash.cancel')}
        </button>
      </div>
    </form>
  );
}