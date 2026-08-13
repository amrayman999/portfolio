import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiInbox } from 'react-icons/fi';

export function Tag({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20 ${className}`}
    >
      {children}
    </span>
  );
}

export function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted gap-3">
      <FiInbox className="text-4xl opacity-40" />
      <p>{t('common.noData')}</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function formatDate(date, lang) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: lang === 'ar' ? 'long' : 'short',
    ...(date.length <= 4 ? {} : { day: 'numeric' }),
  });
}