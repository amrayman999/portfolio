import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, L } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { Tag, EmptyState } from '../components/ui';

export default function Trophies() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const trophies = data?.trophies || [];

  return (
    <div>
      <PageHeader title={t('nav.trophies')} subtitle={t('home.trophiesText')} />

      <section className="max-w-6xl mx-auto px-5 pb-20">
        {trophies.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trophies.map((tr, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card overflow-hidden h-full text-center">
                  <div className="relative aspect-[4/3]">
                    {tr.image ? (
                      <img src={tr.image} alt={L(tr.title, lang)} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 via-brand-500/10 to-brand-800/20 flex items-center justify-center text-6xl">🏆</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {tr.year && (
                      <span className="absolute bottom-3 inset-x-0 text-center">
                        <Tag className="!bg-white/20 !text-white !border-white/30 backdrop-blur">{tr.year}</Tag>
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-lg mb-1">{L(tr.title, lang)}</h3>
                    {tr.issuer && <p className="text-sm text-muted mb-2">{tr.issuer}</p>}
                    {L(tr.description, lang) && (
                      <p className="text-muted text-sm leading-relaxed">{L(tr.description, lang)}</p>
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