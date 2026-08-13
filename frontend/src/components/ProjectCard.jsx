import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { useApp, L } from '../context/AppContext';
import { Tag } from './ui';

export default function ProjectCard({ project, index = 0 }) {
  const { t } = useTranslation();
  const { lang } = useApp();
  const tags = project.tech_stack || [];

  return (
    <div className="card overflow-hidden flex flex-col group">
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={L(project.title, lang)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-500/40 to-brand-800/40 flex items-center justify-center text-4xl">
            💻
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          {project.featured ? (
            <Tag className="!bg-yellow-500/20 !text-yellow-600 dark:!text-yellow-300 !border-yellow-500/30">
              ★ {t('common.featured')}
            </Tag>
          ) : (
            <span />
          )}
          {project.category && <Tag>{project.category}</Tag>}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-lg mb-1">{L(project.title, lang)}</h3>
        <p className="text-muted text-sm leading-relaxed mb-3 flex-1">
          {L(project.summary, lang) || L(project.description, lang)?.slice(0, 140)}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 5).map((tg, i) => (
              <Tag key={i} className="text-[11px]">{tg}</Tag>
            ))}
            {tags.length > 5 && <Tag className="text-[11px]">+{tags.length - 5}</Tag>}
          </div>
        )}

        <div className="flex items-center gap-2 pt-3 border-t border-soft">
          <Link
            to={`/projects`}
            className="px-3.5 py-2 rounded-lg btn-primary text-sm font-semibold flex-1 text-center"
          >
            {t('common.readMore')}
          </Link>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              title={t('common.code')}
              className="p-2 rounded-lg border border-soft bg-card text-muted hover:text-brand-500 transition-colors"
            >
              <FiGithub />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              title={t('common.live')}
              className="p-2 rounded-lg border border-soft bg-card text-muted hover:text-brand-500 transition-colors"
            >
              <FiExternalLink />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}