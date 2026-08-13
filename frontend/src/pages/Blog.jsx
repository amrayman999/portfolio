import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp, L } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { Tag, EmptyState, formatDate } from '../components/ui';

function readingTime(text) {
  if (!text) return 1;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function Blog() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const posts = data?.posts || [];

  return (
    <div>
      <PageHeader title={t('blogPage.title')} subtitle={t('blogPage.subtitle')} />

      <section className="max-w-6xl mx-auto px-5 pb-20">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Reveal key={i} delay={i * 60}>
                <Link to={`/blog/${post.id}`} className="card overflow-hidden block h-full group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={L(post.title, lang)}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-500/30 to-brand-800/30" />
                    )}
                    <span className="absolute bottom-3 start-3 px-2.5 py-1 rounded-lg bg-white/85 dark:bg-slate-900/85 text-xs font-semibold backdrop-blur">
                      {formatDate(post.created_at, lang)}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {post.category && <Tag>{post.category}</Tag>}
                      <span className="text-xs text-muted">
                        {readingTime(L(post.content, lang))} {t('blogPage.readTime')}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg group-hover:text-brand-500 transition-colors">
                      {L(post.title, lang)}
                    </h3>
                    {L(post.excerpt, lang) && (
                      <p className="text-muted text-sm mt-2 leading-relaxed">{L(post.excerpt, lang)}</p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}