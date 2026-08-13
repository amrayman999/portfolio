import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUpload, FiX, FiLoader } from 'react-icons/fi';
import { uploadFile } from '../api/client';

export function ImageUploader({ value, onChange, label }) {
  const { t } = useTranslation();
  const inputRef = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (error) {
      setErr(error.message || 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-soft bg-soft shrink-0 flex items-center justify-center">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <FiUpload className="text-muted" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="px-3 py-2 rounded-lg border border-soft bg-card text-sm font-medium hover:text-brand-500 transition-colors inline-flex items-center gap-1.5"
            >
              {busy ? <FiLoader className="animate-spin" /> : <FiUpload />} {t('dash.upload')}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 rounded-lg border border-soft bg-card text-sm text-red-500 hover:border-red-400 transition-colors"
              >
                <FiX />
              </button>
            )}
          </div>
          {value && (
            <p className="text-xs text-muted truncate max-w-[260px]">{value}</p>
          )}
          {err && <p className="text-xs text-red-500">{err}</p>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*,application/pdf" hidden onChange={pick} />
    </div>
  );
}

export function MultiImageUploader({ value = [], onChange, label }) {
  const { t } = useTranslation();
  const inputRef = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setErr('');
    try {
      const urls = [];
      for (const f of files) urls.push(await uploadFile(f));
      onChange([...value, ...urls]);
    } catch (error) {
      setErr(error.message || 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {value.map((url, i) => (
          <div key={i} className="relative group">
            <img src={url} alt="" className="w-20 h-20 rounded-xl object-cover border border-soft" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute -top-2 -end-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiX size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="w-20 h-20 rounded-xl border-2 border-dashed border-soft text-muted flex flex-col items-center justify-center gap-1 hover:border-brand-500 hover:text-brand-500 transition-colors text-xs"
        >
          {busy ? <FiLoader className="animate-spin" /> : <FiUpload />}
          {t('dash.upload')}
        </button>
      </div>
      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={pick} />
    </div>
  );
}