import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiLoader, FiUser, FiLock, FiDatabase } from 'react-icons/fi';
import { useApp } from '../context';
import api from '../api/client';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, login } = useApp();
  const [form, setForm] = useState({ name: '', email: '', current: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (user) setForm((p) => ({ ...p, name: user.name || '', email: user.email || '' }));
  }, [user]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.current) payload.current_password = form.current;
      if (form.password) payload.new_password = form.password;
      const res = await api.put('/admin/settings', payload);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToast(t('dash.saved'));
      setForm((p) => ({ ...p, current: '', password: '' }));
    } catch (err) {
      flash(err?.response?.data?.message || t('dash.error'));
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl bg-soft border border-soft focus:border-brand-500 focus:outline-none transition-colors';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">{t('dash.settings')}</h1>
        <p className="text-muted text-sm mt-1">{t('dash.settingsHint')}</p>
      </div>

      <form onSubmit={save} className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">{t('auth.name')}</label>
          <div className="relative">
            <FiUser className="absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputCls + ' ps-11'} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
          <div className="relative">
            <FiUser className="absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
            <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className={inputCls + ' ps-11'} />
          </div>
        </div>

        <div className="border-t border-soft pt-5">
          <p className="flex items-center gap-2 font-semibold text-sm mb-1"><FiLock /> {t('auth.password')}</p>
          <p className="text-xs text-muted mb-4">{t('dash.passwordHint')}</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.current')}</label>
              <input type="password" value={form.current} onChange={(e) => setForm((p) => ({ ...p, current: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.newPassword')}</label>
              <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold disabled:opacity-60">
            {busy ? <FiLoader className="animate-spin" /> : <FiCheck />} {t('dash.save')}
          </button>
        </div>
      </form>

      <div className="card p-6">
        <p className="flex items-center gap-2 font-semibold text-sm mb-2"><FiDatabase /> {t('dash.dbInfo')}</p>
        <p className="text-sm text-muted leading-relaxed">{t('dash.dbHint')}</p>
      </div>

      {toast && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl glass border border-soft shadow-xl text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  );
}