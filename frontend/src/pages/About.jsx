import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiMapPin, FiDownload, FiGlobe } from 'react-icons/fi';
import { useApp, L } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { Tag, formatDate } from '../components/ui';

export default function About() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const about = data?.about;
  const education = data?.educations || [];

  if (!about) return null;

  const info = [
    { icon: <FiMail />, label: t('contactPage.email'), value: about.email, href: `mailto:${about.email}` },
    { icon: <FiPhone />, label: 'Phone', value: about.phone, href: `tel:${about.phone}` },
    { icon: <FiMapPin />, label: t('contactPage.info'), value: L(about.location, lang) },
  ];

  const splitList = (v) =>
    String(L(v, lang) || '').split(',').map((s) => s.trim()).filter(Boolean);
  const languages = splitList(about.languages);
  const hobbies = splitList(about.hobbies);

  return (
    <div>
      <PageHeader title={t('aboutPage.title')} subtitle={L(about.headline, lang)} />

      <section className="max-w-6xl mx-auto px-5 pb-20 grid lg:grid-cols-3 gap-10">
        <Reveal>
          <div className="card p-6 sticky top-24">
            {about.avatar ? (
              <img src={about.avatar} alt={`${about.first_name} ${about.last_name}`} className="w-full aspect-square rounded-2xl object-cover mb-5" />
            ) : (
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-7xl text-white font-heading font-extrabold mb-5">
                {(about.first_name || 'A').charAt(0)}
              </div>
            )}
            <h2 className="font-heading font-bold text-2xl">
              {about.first_name} {about.last_name}
            </h2>
            <p className="text-brand-600 dark:text-brand-300 font-medium mb-4">{L(about.title, lang)}</p>

            <div className="space-y-3 text-sm">
              {info.map((it, i) => (
                <div key={i} className="flex items-center gap-3 text-muted">
                  <span className="text-brand-500">{it.icon}</span>
                  {it.href ? (
                    <a href={it.href} className="hover:text-brand-500 transition-colors truncate">{it.value}</a>
                  ) : (
                    <span className="truncate">{it.value}</span>
                  )}
                </div>
              ))}
              {about.resume_url && (
                <a href={about.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg btn-primary text-sm font-semibold w-full justify-center mt-2">
                  <FiDownload /> {t('aboutPage.downloadResume')}
                </a>
              )}
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-2 space-y-12">
          <Reveal>
            <div>
              <h3 className="font-heading font-bold text-xl mb-3">📖 {t('aboutPage.title')}</h3>
              <p className="text-muted leading-relaxed text-lg whitespace-pre-line">{L(about.bio, lang)}</p>
            </div>
          </Reveal>

          {languages.length > 0 && (
            <Reveal>
              <div>
                <h3 className="font-heading font-bold text-xl mb-3">🌐 {t('aboutPage.languages')}</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l, i) => <Tag key={i}>{l}</Tag>)}
                </div>
              </div>
            </Reveal>
          )}

          {hobbies.length > 0 && (
            <Reveal>
              <div>
                <h3 className="font-heading font-bold text-xl mb-3">🎯 {t('aboutPage.hobbies')}</h3>
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((h, i) => <Tag key={i}>{h}</Tag>)}
                </div>
              </div>
            </Reveal>
          )}

          {education.length > 0 && (
            <Reveal>
              <div>
                <h3 className="font-heading font-bold text-xl mb-5">🎓 {t('aboutPage.education')}</h3>
                <div className="space-y-6">
                  {education.map((e, i) => (
                    <div key={i} className="relative ps-6 border-s-2 border-brand-500/30 pb-1">
                      <span className="absolute -start-[7px] top-1 w-3 h-3 rounded-full bg-brand-500" />
                      <h4 className="font-heading font-bold">{L(e.degree, lang)}</h4>
                      <p className="text-brand-600 dark:text-brand-300 font-medium text-sm">{e.institution}</p>
                      {L(e.field, lang) && <p className="text-muted text-sm">{L(e.field, lang)}</p>}
                      {(e.start_date || e.end_date) && (
                        <p className="text-xs text-muted mt-1">
                          {formatDate(e.start_date, lang)} — {e.end_date ? formatDate(e.end_date, lang) : t('common.present')}
                        </p>
                      )}
                      {L(e.description, lang) && <p className="text-muted text-sm mt-2">{L(e.description, lang)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}