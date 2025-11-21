import React from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Monitor, Globe, Palette } from 'lucide-react';
import { ThemeMode, LanguageCode } from '../types';

export const Settings: React.FC = () => {
  const { theme, setTheme, language, setLanguage, t } = useApp();

  const ThemeButton: React.FC<{ mode: ThemeMode; icon: React.ReactNode; label: string }> = ({ mode, icon, label }) => (
    <button
      onClick={() => setTheme(mode)}
      className={`flex items-center justify-center flex-col p-4 rounded-xl border transition-all ${
        theme === mode
          ? 'border-primary-light bg-green-50 dark:bg-green-900/20 text-primary-light dark:text-primary-dark'
          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const LangButton: React.FC<{ code: LanguageCode; label: string; flag: string }> = ({ code, label, flag }) => (
    <button
      onClick={() => setLanguage(code)}
      className={`flex items-center justify-between p-4 rounded-xl border transition-all w-full ${
        language === code
          ? 'border-primary-light bg-green-50 dark:bg-green-900/20 text-primary-light dark:text-primary-dark'
          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <span className="text-2xl me-3">{flag}</span>
      <span className="text-sm font-medium flex-1 text-start">{label}</span>
      {language === code && <div className="w-2 h-2 rounded-full bg-primary-light"></div>}
    </button>
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t('settings')}</h2>

      {/* Theme Section */}
      <section className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center mb-6 text-gray-800 dark:text-gray-200">
            <Palette className="w-5 h-5 me-2" />
            <h3 className="text-lg font-semibold">{t('theme')}</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ThemeButton mode="light" icon={<Sun className="w-6 h-6" />} label={t('light_theme')} />
          <ThemeButton mode="dark" icon={<Moon className="w-6 h-6" />} label={t('dark_theme')} />
          <ThemeButton mode="system" icon={<Monitor className="w-6 h-6" />} label={t('system_theme')} />
        </div>
      </section>

      {/* Language Section */}
      <section className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center mb-6 text-gray-800 dark:text-gray-200">
            <Globe className="w-5 h-5 me-2" />
            <h3 className="text-lg font-semibold">{t('language')}</h3>
        </div>
        <div className="space-y-3">
          <LangButton code="en" label="English" flag="🇺🇸" />
          <LangButton code="ar" label="العربية" flag="🇸🇦" />
          <LangButton code="fr" label="Français" flag="🇫🇷" />
        </div>
      </section>
    </div>
  );
};
