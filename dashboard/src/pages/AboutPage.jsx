import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiLoader, FiSave } from 'react-icons/fi';
import { useApp, L } from '../context';
import api from '../api/client';
import { ImageUploader } from '../components/ImageUploader';

const FIELDS = [
  { name: 'first_name', type: 'string', label: 'First Name' },
  { name: 'last_name', type: 'string', label: 'Last Name' },
  { name: 'title', type: 'string', locale: 'en', label: 'Job Title' },
  { name: 'title', type: 'string', locale: 'ar', label: 'المسمى الوظيفي' },
  { name: 'headline', type: 'textarea', locale: 'en', label: 'Tagline' },
  { name: 'headline', type: 'textarea', locale: 'ar', label: 'النبذة' },
  { name: 'bio', type: 'textarea', locale: 'en', label: 'Bio' },
  { name: 'bio', type: 'textarea', locale: 'ar', label: 'السيرة الذاتية' },
  { name: 'location', type: 'string', locale: 'en', label: 'Location' },
  { name: 'location', type: 'string', locale: 'ar', label: 'الموقع' },
  { name: 'email', type: 'email', label: 'Email' },
  { name: 'phone', type: 'string', label: 'Phone' },
  { name: 'avatar', type: 'image', label: 'Avatar' },
  { name: 'resume_url', type: 'url', label: 'Resume URL' },
];

export default function AboutPage() {
  const { t } = useTranslation();
  const { lang } = useApp();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl bg-soft border border-soft focus:border-brand-500 focus:outline-none transition-colors';

  const load = async () => {
    try {
      const res = await api.get('/admin/about');
      setForm(res.data || {});
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const setLocale = (base, locale, value) =>
    setForm((p) => ({ ...p, [base]: { ...(p[base] || {}), [locale]: value } }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      for (const f of FIELDS) {
        if (f.locale) payload[`${f.name}_${f.locale}`] = form[f.name]?.[f.locale] ?? '';
        else payload[f.name] = form[f.name] ?? '';
      }
      await api.put('/admin/about', payload);
      flash(t('dash.saved'));
    } catch (e) {
      flash(e?.response?.data?.message || t('dash.error'));
    } finally {
      setSaving(false);
    }
  };

  if (busy) {
    return (
      <div className="flex items-center justify-center py-24">
        <FiLoader className="animate-spin text-brand-500 text-3xl" />
      </div>
    );
  }

  const groups = [];
  const seen = new Set();
  for (const f of FIELDS) {
    if (f.locale) {
      if (seen.has(f.name)) continue;
      seen.add(f.name);
      const pair = FIELDS.filter((x) => x.name === f.name);
      groups.push({
        isLocale: true,
        base: f.name,
        en: pair.find((x) => x.locale === 'en'),
        ar: pair.find((x) => x.locale === 'ar'),
      });
    } else {
      groups.push({ isLocale: false, field: f });
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl">{t('dash.profile')}</h1>
        <p className="text-muted text-sm mt-1">{t('dash.profileHint')}</p>
      </div>

      <form onSubmit={save} className="card p-6 space-y-5">
        {groups.map((g, i) => {
          if (g.isLocale) {
            return (
              <div key={i} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {g.en.label} <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-300">EN</span>
                  </label>
                  {g.en.type === 'textarea' ? (
                    <textarea rows={3} className={inputCls} value={form[g.base]?.en || ''} onChange={(e) => setLocale(g.base, 'en', e.target.value)} />
                  ) : (
                    <input className={inputCls} value={form[g.base]?.en || ''} onChange={(e) => setLocale(g.base, 'en', e.target.value)} />
                  )}
                </div>
                <div dir="rtl">
                  <label className="block text-sm font-medium mb-2">
                    {g.ar.label} <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-300">AR</span>
                  </label>
                  {g.ar.type === 'textarea' ? (
                    <textarea rows={3} className={inputCls} value={form[g.base]?.ar || ''} onChange={(e) => setLocale(g.base, 'ar', e.target.value)} />
                  ) : (
                    <input className={inputCls} value={form[g.base]?.ar || ''} onChange={(e) => setLocale(g.base, 'ar', e.target.value)} />
                  )}
                </div>
              </div>
            );
          }
          const f = g.field;
          return (
            <div key={i}>
              <label className="block text-sm font-medium mb-2">{f.label}</label>
              {f.type === 'image' ? (
                <ImageUploader value={form[f.name] || ''} onChange={(v) => set(f.name, v)} label={f.label} />
              ) : (
                <input type={f.type === 'email' ? 'email' : 'text'} dir={f.type === 'email' || f.type === 'url' ? 'ltr' : undefined} className={inputCls} value={form[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} />
              )}
            </div>
          );
        })}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold disabled:opacity-60">
            {saving ? <FiLoader className="animate-spin" /> : <FiSave />} {t('dash.save')}
          </button>
        </div>
      </form>

      {toast && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl glass border border-soft shadow-xl text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  );
}