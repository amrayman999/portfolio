import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { FiArrowLeft } from 'react-icons/fi';
import { useApp, L } from '../context/AppContext';
import { Tag, formatDate } from '../components/ui';

export default function Post() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data, lang } = useApp();
  const posts = data?.posts || [];
  const post = posts.find((p) => String(p.id) === String(id));
  const related = posts.filter((p) => p.id !== post?.id).slice(0, 3);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="pt-32 pb-20 px-5">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-muted hover:text-brand-500 transition-colors mb-6">
          <FiArrowLeft className="rtl:rotate-180" /> {t('nav.blog')}
        </Link>

        {post.category && <Tag className="mb-3">{post.category}</Tag>}
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl mb-3">{L(post.title, lang)}</h1>
        <div className="flex items-center gap-3 text-sm text-muted mb-8">
          <span>{formatDate(post.created_at, lang)}</span>
          <span>·</span>
          <span>{L(post.excerpt, lang) ? Math.max(1, Math.round(L(post.content, lang).split(/\s+/).length / 200)) : 1} {t('blogPage.readTime')}</span>
        </div>

        {post.image && (
          <img src={post.image} alt={L(post.title, lang)} className="w-full rounded-2xl mb-8 object-cover aspect-[16/9]" />
        )}

        <article className="prose-portfolio">
          <ReactMarkdown>{L(post.content, lang) || ''}</ReactMarkdown>
        </article>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading font-bold text-xl mb-4">{t('blogPage.related')}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.id}`} className="card p-4 hover:border-brand-500/40 transition-colors">
                  <p className="font-semibold text-sm leading-snug">{L(r.title, lang)}</p>
                  <p className="text-xs text-muted mt-1">{formatDate(r.created_at, lang)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}