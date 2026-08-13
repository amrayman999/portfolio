import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, L } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { Tag, formatDate, EmptyState } from '../components/ui';

export default function Experience() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const experiences = data?.experiences || [];

  return (
    <div>
      <PageHeader title={t('nav.experience')} subtitle={t('home.experienceText')} />

      <section className="max-w-4xl mx-auto px-5 pb-20">
        {experiences.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative">
            <div className="absolute start-5 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/60 via-brand-500/30 to-transparent" />
            <div className="space-y-10">
              {experiences.map((exp, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="relative ps-16">
                    <span className="absolute start-0 top-0 w-11 h-11 rounded-2xl bg-brand-500/15 border border-brand-500/40 flex items-center justify-center">
                      {exp.company_logo ? (
                        <img src={exp.company_logo} alt={exp.company} className="w-7 h-7 rounded-lg object-contain" />
                      ) : (
                        <span className="text-brand-500 font-bold text-sm">{(exp.company || 'B').charAt(0)}</span>
                      )}
                    </span>
                    <div className="card p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-heading font-bold text-xl">{L(exp.role, lang)}</h3>
                          <p className="text-brand-600 dark:text-brand-300 font-medium">
                            {exp.company}
                            {exp.location ? ` · ${L(exp.location, lang)}` : ''}
                          </p>
                        </div>
                        <Tag>
                          {formatDate(exp.start_date, lang)} — {exp.current ? t('common.present') : formatDate(exp.end_date, lang)}
                        </Tag>
                      </div>
                      <p className="text-muted leading-relaxed mt-3">{L(exp.description, lang)}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}