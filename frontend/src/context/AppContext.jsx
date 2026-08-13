import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(i18n.language || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const refresh = useCallback(async () => {
    try {
      const res = await api.get('/public/site');
      setData(res.data);
    } catch (e) {
      console.error('Failed to load site data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const toggleLang = () => setLang((l) => (l === 'en' ? 'ar' : 'en'));

  return (
    <AppContext.Provider
      value={{
        data,
        loading,
        refresh,
        lang,
        setLang,
        toggleLang,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

/**
 * Helper: pick a localized value from an object of the shape { en, ar }.
 */
export function L(value, lang) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value[lang] || value.en || value.ar || '';
  }
  return value;
}
