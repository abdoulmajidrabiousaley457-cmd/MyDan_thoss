import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { translations } from './translations';

interface I18nContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string, fallback?: string) => string;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (k, fb) => fb || k,
  isRtl: false,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('mydanthoss_lang') as AppLanguage) || 'fr';
  });

  const isRtl = language === 'ar';

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('mydanthoss_lang', lang);
    window.dispatchEvent(new CustomEvent('language-change', { detail: lang }));
  };

  useEffect(() => {
    const handleLangChange = (e: any) => {
      if (e.detail && e.detail !== language) {
        setLanguageState(e.detail);
      }
    };
    window.addEventListener('language-change', handleLangChange);
    return () => window.removeEventListener('language-change', handleLangChange);
  }, [language]);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language] || translations.fr;
    return dict[key] ?? translations.fr[key] ?? translations.en[key] ?? fallback ?? key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
