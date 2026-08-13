import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail, FiTrash2, FiLoader, FiInbox, FiRefreshCw } from 'react-icons/fi';
import { useApp } from '../context';
import api from '../api/client';

export default function MessagesPage() {
  const { t } = useTranslation();
  const { lang } = useApp();
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const res = await api.get('/admin/messages');
      setRows(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const del = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/admin/messages/${id}`);
      flash(t('dash.deleted'));
      load();
    } catch (e) {
      flash(e?.response?.data?.message || t('dash.error'));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl">{t('dash.messages')}</h1>
          <p className="text-muted text-sm">{rows.length} {t('dash.records')}</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-soft bg-card text-sm font-semibold text-muted hover:text-brand-500 transition-colors">
          <FiRefreshCw className={busy ? 'animate-spin' : ''} /> {t('dash.refresh')}
        </button>
      </div>

      {busy ? (
        <div className="flex items-center justify-center py-24">
          <FiLoader className="animate-spin text-brand-500 text-3xl" />
        </div>
      ) : rows.length === 0 ? (
        <div className="card text-center py-24 text-muted">
          <FiInbox className="mx-auto text-4xl mb-3 opacity-40" />
          <p>{t('dash.empty')}</p>
        </div>
      ) : (
        <div className="card divide-y divide-soft">
          {rows.map((m) => (
            <div key={m.id} className="p-5 flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-800 to-brand-600 text-white flex items-center justify-center font-bold shrink-0">
                    {(m.name || '?').charAt(0)}
                  </span>
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <a href={`mailto:${m.email}`} className="text-sm text-brand-500 dark:text-brand-300 inline-flex items-center gap-1">
                      <FiMail size={12} /> {m.email}
                    </a>
                  </div>
                  <span className="ms-auto text-xs text-muted">
                    {new Date(m.created_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB')}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </div>
              <button
                onClick={() => del(m.id)}
                disabled={deleting === m.id}
                className="shrink-0 p-2.5 rounded-xl border border-soft text-muted hover:text-red-500 hover:border-red-500/40 transition-colors self-start"
              >
                {deleting === m.id ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
              </button>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl glass border border-soft shadow-xl text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  );
}