import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, L } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import SkillBar from '../components/SkillBar';
import { EmptyState } from '../components/ui';
import Reveal from '../components/Reveal';

export default function Skills() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const skills = data?.skills || [];

  const categories = [...new Set(skills.map((s) => s.category).filter(Boolean))];

  if (skills.length === 0) {
    return (
      <div>
        <PageHeader title={t('nav.skills')} subtitle={t('home.skillsText')} />
        <section className="max-w-4xl mx-auto px-5 pb-20"><EmptyState /></section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t('nav.skills')} subtitle={t('home.skillsText')} />

      <section className="max-w-6xl mx-auto px-5 pb-20 space-y-14">
        {categories.length > 0 ? (
          categories.map((c, ci) => (
            <div key={ci}>
              <Reveal>
                <h2 className="font-heading font-bold text-2xl mb-6 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
                  {c}
                </h2>
              </Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {skills
                  .filter((s) => s.category === c)
                  .map((s, i) => (
                    <SkillBar key={i} skill={s} index={i} />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((s, i) => (
              <SkillBar key={i} skill={s} index={i} />
            ))}
          </div>
        )}

        <div>
          <Reveal>
            <h2 className="font-heading font-bold text-2xl mb-6 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
              {t('home.skillsTitle')}
            </h2>
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <Reveal key={i} delay={i * 30}>
                <span className="px-3.5 py-2 rounded-xl bg-card border border-soft text-sm font-medium hover:border-brand-500/40 hover:text-brand-500 transition-colors flex items-center gap-2">
                  {s.icon && <i className={s.icon} />}
                  {L(s.name, lang)}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}