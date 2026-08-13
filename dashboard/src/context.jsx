import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from './api/client';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));

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

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <DashboardContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        theme,
        toggleTheme,
        user,
        token,
        login,
        logout,
        isAuthed: !!token,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useApp = () => useContext(DashboardContext);

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