import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, L } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import ProjectCard from '../components/ProjectCard';
import { EmptyState } from '../components/ui';
import Reveal from '../components/Reveal';

export default function Projects() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const projects = data?.projects || [];
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );

  const filtered = category === 'All' ? projects : projects.filter((p) => p.category === category);

  return (
    <div>
      <PageHeader title={t('nav.projects')} subtitle={t('home.projectsText')} />

      <section className="max-w-6xl mx-auto px-5 pb-20">
        {categories.length > 1 && (
          <Reveal>
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                    category === c
                      ? 'btn-primary border-transparent'
                      : 'border-soft bg-card text-muted hover:text-brand-500'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}