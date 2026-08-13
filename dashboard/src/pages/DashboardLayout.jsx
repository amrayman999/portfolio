import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiLayout, FiUser, FiMail, FiSettings, FiLogOut, FiSun, FiMoon,
  FiImage, FiBriefcase, FiCode, FiAward, FiUsers, FiFileText, FiShare2,
  FiMonitor, FiStar, FiBookOpen, FiTool, FiMessageCircle, FiArrowLeft, FiExternalLink,
} from 'react-icons/fi';
import { useApp } from '../context';
import { COLLECTIONS } from '../config';

const ICONS = {
  images: FiImage,
  briefcase: FiBriefcase,
  code: FiCode,
  award: FiAward,
  users: FiUsers,
  file: FiFileText,
  share: FiShare2,
  building: FiMonitor,
  trophy: FiStar,
  graduation: FiBookOpen,
  wrench: FiTool,
  quote: FiMessageCircle,
};

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { lang, theme, toggleTheme, toggleLang, user, logout } = useApp();

  const base = [
    { to: '/dashboard', end: true, icon: FiLayout, label: t('dash.home') },
    { to: '/dashboard/about', icon: FiUser, label: t('dash.profile') },
    { to: '/dashboard/messages', icon: FiMail, label: t('dash.messages') },
  ];

  const navItems = Object.keys(COLLECTIONS).map((key) => ({
    to: `/dashboard/${key}`,
    icon: ICONS[key] || FiBriefcase,
    label: COLLECTIONS[key].label[lang] || COLLECTIONS[key].label.en,
  }));

  const bottom = [{ to: '/dashboard/settings', icon: FiSettings, label: t('dash.settings') }];

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/20'
        : 'text-muted hover:text-brand-500 hover:bg-brand-500/5 border border-transparent'
    }`;

  return (
    <div className="min-h-screen bg-soft flex">
      <aside className="hidden lg:flex w-72 flex-col border-e border-soft bg-card sticky top-0 h-screen">
        <div className="p-5 flex items-center gap-3 border-b border-soft">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-800 to-brand-600 flex items-center justify-center text-white font-bold">
            {(user?.name || 'A').charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="font-heading font-bold truncate">{user?.name}</p>
            <p className="text-xs text-muted truncate">{t('dash.loginAs')}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 dashboard-scroll">
          {base.map((item, i) => (
            <NavLink key={i} to={item.to} end={item.end} className={linkCls}>
              <item.icon /> {item.label}
            </NavLink>
          ))}
          <p className="px-3 pt-4 pb-1 text-[11px] uppercase tracking-widest text-muted font-semibold">
            {t('dash.home')}
          </p>
          {navItems.map((item, i) => (
            <NavLink key={i} to={item.to} className={linkCls}>
              <item.icon /> {item.label}
            </NavLink>
          ))}
          {bottom.map((item, i) => (
            <NavLink key={i} to={item.to} className={linkCls}>
              <item.icon /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-soft space-y-1">
          <a
            href={import.meta.env.VITE_SITE_URL || 'http://localhost:5173'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-brand-500 transition-colors"
          >
            <FiArrowLeft className="rtl:rotate-180" /> {t('dash.back')}
            <FiExternalLink className="ms-auto" size={14} />
          </a>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors">
            <FiLogOut /> {t('auth.logout')}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 glass border-b border-soft px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href={import.meta.env.VITE_SITE_URL || 'http://localhost:5173'}
              target="_blank"
              rel="noreferrer"
              className="lg:hidden p-2 rounded-lg border border-soft text-muted"
            >
              <FiArrowLeft className="rtl:rotate-180" />
            </a>
            <h1 className="font-heading font-bold">{t('dash.title')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-soft bg-card text-muted hover:text-brand-500 transition-colors">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <button onClick={toggleLang} className="px-3 py-2 rounded-xl border border-soft bg-card text-muted hover:text-brand-500 font-semibold text-sm transition-colors">
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            <button onClick={logout} className="lg:hidden p-2.5 rounded-xl border border-soft bg-card text-red-500">
              <FiLogOut />
            </button>
          </div>
        </header>

        <div className="lg:hidden flex gap-1.5 overflow-x-auto px-4 py-2 border-b border-soft">
          {[...base, ...navItems, ...bottom].map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `shrink-0 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/20'
                    : 'bg-card text-muted border border-soft'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}