import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';
import { useApp, L } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { Tag, formatDate, EmptyState } from '../components/ui';

export default function Certificates() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const certificates = data?.certificates || [];

  return (
    <div>
      <PageHeader title={t('nav.certificates')} subtitle={t('home.certificatesText')} />

      <section className="max-w-6xl mx-auto px-5 pb-20">
        {certificates.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((c, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {c.image ? (
                      <img src={c.image} alt={L(c.title, lang)} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-500/30 to-brand-800/30 flex items-center justify-center text-5xl">📜</div>
                    )}
                    {c.issue_date && (
                      <span className="absolute top-3 end-3 px-2.5 py-1 rounded-lg bg-white/85 dark:bg-slate-900/85 text-xs font-semibold">
                        {formatDate(c.issue_date, lang)}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-lg mb-1">{L(c.title, lang)}</h3>
                    <p className="text-brand-600 dark:text-brand-300 text-sm font-medium mb-2">{c.issuer}</p>
                    {L(c.description, lang) && (
                      <p className="text-muted text-sm leading-relaxed flex-1">{L(c.description, lang)}</p>
                    )}
                    {c.credential_url && (
                      <a
                        href={c.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-300 hover:gap-3 transition-all"
                      >
                        {t('common.viewCredential')} <FiExternalLink />
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}