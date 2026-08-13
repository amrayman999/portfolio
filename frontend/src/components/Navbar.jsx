import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { t } = useTranslation();
  const { theme, toggleTheme, lang, toggleLang, data } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const name = data?.about
    ? `${data.about.first_name || ''} ${data.about.last_name || ''}`.trim()
    : 'Portfolio';

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/projects', label: t('nav.projects') },
    { to: '/experience', label: t('nav.experience') },
    { to: '/skills', label: t('nav.skills') },
    { to: '/certificates', label: t('nav.certificates') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'glass shadow-lg shadow-black/5' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg" onClick={() => setOpen(false)}>
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white">
            {name.charAt(0).toUpperCase()}
          </span>
          <span className="gradient-text">{name}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-300 bg-brand-500/10'
                    : 'text-muted hover:text-brand-600 dark:hover:text-brand-300'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl border border-soft bg-card text-muted hover:text-brand-500 transition-colors"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button
            onClick={toggleLang}
            className="px-3 py-2 rounded-xl border border-soft bg-card text-muted hover:text-brand-500 font-semibold text-sm transition-colors"
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="lg:hidden p-2.5 rounded-xl border border-soft bg-card text-muted"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden px-5 pb-4 flex flex-col gap-1 glass">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-300 bg-brand-500/10'
                    : 'text-muted hover:text-brand-600'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}