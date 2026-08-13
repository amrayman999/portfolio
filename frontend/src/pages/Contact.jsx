import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { useApp, L } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import api from '../api/client';

export default function Contact() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const about = data?.about;
  const socials = data?.socials || [];

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.post('/public/contact', form);
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('idle');
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const info = [
    { icon: <FiMail />, label: t('contactPage.email'), value: about?.email },
    { icon: <FiPhone />, label: 'Phone', value: about?.phone },
    { icon: <FiMapPin />, label: t('contactPage.info'), value: about ? L(about.location, lang) : '' },
  ];

  return (
    <div>
      <PageHeader title={t('contactPage.title')} subtitle={t('contactPage.subtitle')} />

      <section className="max-w-6xl mx-auto px-5 pb-20 grid lg:grid-cols-5 gap-10">
        <Reveal className="lg:col-span-2">
          <div className="card p-8 h-full">
            <h3 className="font-heading font-bold text-xl mb-6">{t('contactPage.info')}</h3>
            <div className="space-y-5 mb-8">
              {info.map((it, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="w-11 h-11 shrink-0 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-300 text-lg">
                    {it.icon}
                  </span>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wide">{it.label}</p>
                    <p className="font-medium">{it.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {socials.length > 0 && (
              <>
                <h4 className="font-heading font-semibold mb-3">{t('contactPage.follow')}</h4>
                <div className="flex flex-wrap gap-2">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      title={s.label}
                      className="w-11 h-11 rounded-xl bg-card border border-soft flex items-center justify-center text-muted hover:text-brand-500 hover:scale-110 transition-all"
                    >
                      <i className={`${s.icon || 'fa-solid fa-link'}`} />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-3">
          <form onSubmit={submit} className="card p-8 space-y-5">
            {status === 'sent' && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300">
                <FiCheckCircle className="text-xl" /> {t('common.sent')}
              </div>
            )}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{error}</div>
            )}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">{t('contactPage.name')} *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-soft border border-soft focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('contactPage.email')} *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-soft border border-soft focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('contactPage.subject')}</label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-soft border border-soft focus:border-brand-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('contactPage.message')} *</label>
              <textarea
                required
                rows="5"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-soft border border-soft focus:border-brand-500 focus:outline-none transition-colors resize-y"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-primary font-semibold disabled:opacity-60"
            >
              <FiSend /> {status === 'sending' ? t('common.sending') : t('contactPage.send')}
            </button>
          </form>
        </Reveal>
      </section>
    </div>
  );
}