import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiLoader, FiBriefcase, FiCode, FiAward, FiUsers, FiImage,
  FiFileText, FiShare2, FiBookOpen, FiTool, FiStar, FiMessageCircle,
  FiChevronRight, FiChevronLeft, FiRefreshCw, FiMail, FiUser, FiSettings, FiLayers,
} from 'react-icons/fi';
import { useApp } from '../context';
import { COLLECTIONS } from '../config';
import api from '../api/client';

const ICONS = {
  images: FiImage,
  projects: FiBriefcase,
  experiences: FiTool,
  trophies: FiStar,
  certificates: FiAward,
  participations: FiUsers,
  skills: FiCode,
  educations: FiBookOpen,
  services: FiTool,
  testimonials: FiMessageCircle,
  posts: FiFileText,
  socials: FiShare2,
};

export default function DashboardHome() {
  const { t } = useTranslation();
  const { lang } = useApp();
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(true);

  const load = async () => {
    setBusy(true);
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { load(); }, []);

  const quick = [
    { to: '/dashboard/about', icon: FiUser, label: t('dash.profile'), hint: t('dash.profileHint') },
    { to: '/dashboard/messages', icon: FiMail, label: t('dash.messages'), hint: t('dash.messagesHint') },
    { to: '/dashboard/settings', icon: FiSettings, label: t('dash.settings'), hint: t('dash.settingsHint') },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl">{t('dash.welcome')}</h1>
          <p className="text-muted text-sm mt-1">{t('dash.welcomeSub')}</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-soft bg-card text-sm font-semibold text-muted hover:text-brand-500 transition-colors"
        >
          <FiRefreshCw className={busy ? 'animate-spin' : ''} /> {t('dash.refresh')}
        </button>
      </div>

      {busy && !stats ? (
        <div className="flex items-center justify-center py-24">
          <FiLoader className="animate-spin text-brand-500 text-3xl" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {stats &&
            Object.entries(stats).map(([k, v]) => (
              <div key={k} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center">
                    {(() => { const Icon = ICONS[k] || FiLayers; return <Icon />; })()}
                  </span>
                  <span className="text-2xl font-bold font-heading">{v}</span>
                </div>
                <p className="text-sm text-muted">
                  {COLLECTIONS[k]?.label?.[lang] || COLLECTIONS[k]?.label?.en || k}
                </p>
              </div>
            ))}
        </div>
      )}

      <div>
        <h2 className="font-heading font-bold text-lg mb-4">{t('dash.quickLinks')}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quick.map((item, i) => (
            <Link key={i} to={item.to} className="card p-5 group hover:border-brand-500/40 transition-colors">
              <div className="flex items-start justify-between">
                <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-800 to-brand-600 text-white flex items-center justify-center">
                  <item.icon />
                </span>
                <FiChevronRight className="rtl:rotate-180 text-muted group-hover:text-brand-500 group-hover:translate-x-0 -translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold mt-4">{item.label}</h3>
              <p className="text-sm text-muted mt-1">{item.hint}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg mb-4">{t('dash.collections')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(COLLECTIONS).map(([k, c]) => {
            const Icon = ICONS[k] || FiLayers;
            return (
              <Link key={k} to={`/dashboard/${k}`} className="card p-4 flex items-center gap-3 hover:border-brand-500/40 transition-colors group">
                <span className="w-10 h-10 rounded-xl bg-soft text-brand-600 dark:text-brand-300 flex items-center justify-center group-hover:bg-brand-500/10 transition-colors">
                  <Icon />
                </span>
                <span className="text-sm font-medium">{c.label?.[lang] || c.label?.en}</span>
                <FiChevronRight className="rtl:rotate-180 ms-auto text-muted" size={14} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}