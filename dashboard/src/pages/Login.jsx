import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiLock, FiMail, FiLoader, FiArrowLeft } from 'react-icons/fi';
import { useApp } from '../context';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(t('auth.invalid'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-soft relative overflow-hidden">
      <div className="absolute -top-32 -start-32 w-[500px] h-[500px] rounded-full bg-brand-500/20 blur-3xl animate-blob" />
      <div className="absolute -bottom-32 -end-32 w-[500px] h-[500px] rounded-full bg-brand-700/15 blur-3xl animate-blob" style={{ animationDelay: '-6s' }} />

      <div className="w-full max-w-md card p-8 relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-800 to-brand-600 flex items-center justify-center text-white text-2xl mb-4">
            <FiLock />
          </div>
          <h1 className="font-heading font-bold text-2xl">{t('auth.title')}</h1>
          <p className="text-muted text-sm mt-1">{t('auth.subtitle')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
            <div className="relative">
              <FiMail className="absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ps-11 pe-4 py-3 rounded-xl bg-soft border border-soft focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('auth.password')}</label>
            <div className="relative">
              <FiLock className="absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ps-11 pe-4 py-3 rounded-xl bg-soft border border-soft focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl btn-primary font-semibold disabled:opacity-60"
          >
            {busy && <FiLoader className="animate-spin" />}
            {t('auth.login')}
          </button>
        </form>

        <button onClick={() => navigate('/')} className="mt-6 w-full text-sm text-muted hover:text-brand-500 transition-colors inline-flex items-center justify-center gap-1">
          <FiArrowLeft className="rtl:rotate-180" /> {t('dash.back')}
        </button>
      </div>
    </div>
  );
}