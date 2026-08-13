import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiExternalLink } from 'react-icons/fi';
import { useApp, L } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { Tag, formatDate, EmptyState } from '../components/ui';

export default function Participations() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const participations = data?.participations || [];

  return (
    <div>
      <PageHeader title={t('nav.participations')} subtitle={t('home.participationsText')} />

      <section className="max-w-6xl mx-auto px-5 pb-20">
        {participations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {participations.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card overflow-hidden h-full flex flex-col">
                  {p.image && (
                    <img src={p.image} alt={L(p.title, lang)} loading="lazy" className="w-full h-44 object-cover" />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      {p.event_type ? <Tag>{p.event_type}</Tag> : <span />}
                      {p.date && <span className="text-xs text-muted">{formatDate(p.date, lang)}</span>}
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-1">{L(p.title, lang)}</h3>
                    {L(p.role, lang) && (
                      <p className="text-sm text-brand-600 dark:text-brand-300 font-medium mb-2">{L(p.role, lang)}</p>
                    )}
                    {L(p.description, lang) && (
                      <p className="text-muted text-sm leading-relaxed flex-1">{L(p.description, lang)}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      {L(p.location, lang) && (
                        <span className="text-xs text-muted inline-flex items-center gap-1">
                          <FiMapPin /> {L(p.location, lang)}
                        </span>
                      )}
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-300 hover:gap-2 transition-all"
                        >
                          {t('common.learnMore')} <FiExternalLink />
                        </a>
                      )}
                    </div>
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