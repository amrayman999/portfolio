import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiLoader, FiImage, FiSearch } from 'react-icons/fi';
import { useApp, L } from '../context';
import { COLLECTIONS } from '../config';
import { pickColumns } from '../util';
import DynamicForm from '../components/DynamicForm';
import api from '../api/client';

export default function CrudPage() {
  const { lang } = useApp();
  const { t } = useTranslation();
  const { collection: key } = useParams();
  const navigate = useNavigate();

  const coll = COLLECTIONS[key];
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [toast, setToast] = useState('');

  const per = 10;
  const title = coll?.label?.[lang] || coll?.label?.en || '';

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const params = { page, per, q: q || undefined };
      const res = await api.get(`/admin/${key}`, { params });
      const list = res.data || [];
      setRows(list);
      setTotal(list.length);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }, [key, page, q]);

  useEffect(() => {
    if (!coll) return;
    load();
  }, [coll, load]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const save = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/${key}/${editing.id}`, payload);
        flash(t('dash.saved'));
      } else {
        await api.post(`/admin/${key}`, payload);
        flash(t('dash.created'));
      }
      setEditing(null);
      setCreating(false);
      load();
    } catch (e) {
      flash(e?.response?.data?.message || t('dash.error'));
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/admin/${key}/${id}`);
      flash(t('dash.deleted'));
      load();
    } catch (e) {
      flash(e?.response?.data?.message || t('dash.error'));
    } finally {
      setDeleting(null);
    }
  };

  if (!coll) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">{t('dash.notFound')}</p>
        <Link to="/dashboard" className="text-brand-500 font-medium mt-2 inline-block">{t('dash.home')}</Link>
      </div>
    );
  }

  const cols = pickColumns(coll);
  const pages = Math.max(1, Math.ceil(total / per));
  const paged = rows.slice((page - 1) * per, page * per);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl">{title}</h1>
          <p className="text-muted text-sm">{total} {t('dash.records')}</p>
        </div>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-semibold"
        >
          <FiPlus /> {t('dash.add')}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-soft flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder={t('dash.search')}
              className="w-full ps-10 pe-3 py-2 rounded-xl bg-soft border border-soft focus:border-brand-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {busy ? (
          <div className="flex items-center justify-center py-24">
            <FiLoader className="animate-spin text-brand-500 text-2xl" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-24 text-muted">
            <FiImage className="mx-auto text-4xl mb-3 opacity-40" />
            <p>{t('dash.empty')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-soft text-start">
                  {cols.map((c, i) => (
                    <th key={i} className="text-start px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <tr key={row.id} className="border-b border-soft last:border-0 hover:bg-soft/50">
                    {cols.map((c, i) => {
                      if (c.type === 'image') {
                        return (
                          <td key={i} className="px-4 py-3">
                            {row[c.field] ? (
                              <img src={row[c.field]} alt="" className="w-12 h-12 rounded-lg object-cover border border-soft" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-soft flex items-center justify-center text-muted"><FiImage /></div>
                            )}
                          </td>
                        );
                      }
                      if (c.type === 'bool') {
                        return (
                          <td key={i} className="px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${row[c.field] ? 'bg-green-500/15 text-green-600' : 'bg-slate-400/15 text-muted'}`}>
                              {row[c.field] ? 'On' : 'Off'}
                            </span>
                          </td>
                        );
                      }
                      const val = row[c.field];
                      const label = c.field.endsWith('_en') || c.field.endsWith('_ar')
                        ? val
                        : typeof val === 'object' && val ? L(val, lang) : val;
                      return (
                        <td key={i} className="px-4 py-3 max-w-xs">
                          <span className="truncate block">{String(label ?? '')}</span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => { setEditing(row); setCreating(false); }}
                          className="p-2 rounded-lg border border-soft text-muted hover:text-brand-500 hover:border-brand-500/40 transition-colors"
                          title={t('dash.edit')}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => del(row.id)}
                          disabled={deleting === row.id}
                          className="p-2 rounded-lg border border-soft text-muted hover:text-red-500 hover:border-red-500/40 transition-colors"
                          title={t('dash.delete')}
                        >
                          {deleting === row.id ? <FiLoader className="animate-spin" size={14} /> : <FiTrash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-soft">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-lg border border-soft disabled:opacity-40 text-muted hover:text-brand-500"
            >
              <FiChevronLeft className="rtl:rotate-180" />
            </button>
            <span className="text-sm text-muted">
              {page} / {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg border border-soft disabled:opacity-40 text-muted hover:text-brand-500"
            >
              <FiChevronRight className="rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card w-full max-w-2xl my-8 p-6" dir={coll.fields.some((f) => f.locale === 'ar') ? 'ltr' : undefined}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl">
                {editing ? t('dash.edit') : t('dash.add')} — {title}
              </h2>
              <button onClick={() => { setEditing(null); setCreating(false); }} className="p-2 rounded-lg border border-soft text-muted hover:text-brand-500">
                <FiChevronRight className="rtl:rotate-180 rotate-0" />
              </button>
            </div>
            <DynamicForm coll={coll} initial={editing} onSubmit={save} onCancel={() => { setEditing(null); setCreating(false); }} busy={saving} />
          </div>
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