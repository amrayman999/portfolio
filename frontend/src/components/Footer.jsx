import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { useApp, L } from '../context/AppContext';

export default function Footer() {
  const { t } = useTranslation();
  const { data, lang } = useApp();
  const socials = data?.socials || [];
  const about = data?.about;

  return (
    <footer className="border-t border-soft bg-soft">
      <div className="max-w-7xl mx-auto px-5 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-heading font-bold text-lg mb-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm">
              {(about?.first_name || 'P').charAt(0)}
            </span>
            <span className="gradient-text">
              {about ? `${about.first_name} ${about.last_name}` : 'Portfolio'}
            </span>
          </div>
          <p className="text-muted text-sm leading-relaxed max-w-xs">
            {about ? L(about.bio, lang)?.slice(0, 140) + '…' : t('footer.madeWith')}
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted mb-3">
            {t('nav.home')}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              t('nav.about'),
              t('nav.projects'),
              t('nav.experience'),
              t('nav.skills'),
              t('nav.certificates'),
              t('nav.contact'),
            ].map((l, i) => (
              <Link key={i} to={['/about', '/projects', '/experience', '/skills', '/certificates', '/contact'][i]} className="text-muted hover:text-brand-500 transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted mb-3">
            {t('contactPage.follow')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {socials.length === 0 && (
              <Link to="mailto:hello@example.com" className="p-2.5 rounded-xl bg-card border border-soft text-muted hover:text-brand-500">
                <FiMail />
              </Link>
            )}
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                title={s.label}
                className="p-2.5 rounded-xl bg-card border border-soft text-muted hover:text-brand-500 hover:scale-110 transition-all"
              >
                <i className={`${s.icon || 'fa-solid fa-link'} text-lg`} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-soft">
        <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {about ? `${about.first_name} ${about.last_name}` : ''} — {t('footer.rights')}
          </p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}