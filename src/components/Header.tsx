import React, { useState } from 'react';
import { Menu, Bell, Globe, Sparkles, Smartphone, Download, ExternalLink } from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { useI18n } from '../i18n/I18nContext';
import { AppLanguage } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenDevis?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDrawer,
  onOpenNotifications,
  onOpenProfile,
  onOpenDevis
}) => {
  const { unreadCount, profile, firebaseUser } = useUserProfile();
  const { language, setLanguage, t } = useI18n();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { isInstallable, install, isInstalled } = usePWAInstall();

  const languages: { code: AppLanguage; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white shadow-lg sticky top-0 z-30 border-b border-emerald-800/40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Drawer toggle + Brand Logo & Title */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={onOpenDrawer}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-emerald-300" />
          </button>

          <div className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer" onClick={onOpenProfile}>
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-400/50 shadow-md bg-slate-950 shrink-0">
              <img src="/app-logo.png" alt="Danthoss Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-extrabold text-base tracking-tight">
                  Danthoss
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t('cabinetBadge', 'Cabinet IA')}
                </span>
              </div>
              <span className="text-emerald-300/80 text-[11px] leading-tight font-medium hidden sm:inline">
                {t('cabinetAuthor', 'Rabiou Saley • Data Science & Télétravail')}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Remote availability badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{t('remoteAvailable', 'Disponible Télétravail International (Full Remote)')}</span>
        </div>

        {/* Right: Actions, Language & Notifications */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Direct Download ZIP button */}
          <a
            href="/api/download-zip"
            download="my-danthoss-app.zip"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-slate-700 transition-colors shadow-xs"
            title="Télécharger l'application au format ZIP"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>ZIP</span>
          </a>

          {/* Quick Install Mobile Button if installable */}
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              className="px-2.5 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm transition-all cursor-pointer animate-pulse"
              title={t('installPhone', 'Installer sur mon téléphone')}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('installPhone', 'Installer')}</span>
            </button>
          )}

          {/* User Profile Chip */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
            title={t('myProfile', 'Mon profil et compte')}
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
              {firebaseUser?.photoURL ? (
                <img src={firebaseUser.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                profile.name?.slice(0, 1).toUpperCase() || 'U'
              )}
            </div>
            <span className="font-semibold max-w-[100px] truncate hidden md:inline">
              {firebaseUser?.displayName?.split(' ')[0] || profile.name?.split(' ')[0] || t('myProfile', 'Profil')}
            </span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center space-x-1 cursor-pointer"
              aria-label={t('language', 'Langue')}
            >
              <Globe className="w-4 h-4 text-emerald-200" />
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-36 bg-white text-slate-800 rounded-2xl shadow-2xl py-1.5 z-50 border border-slate-100 text-xs font-medium animate-in fade-in zoom-in-95 duration-100">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-emerald-50 cursor-pointer ${
                      language === l.code ? 'font-bold text-emerald-700 bg-emerald-50/70' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.flag} {l.label}</span>
                    {language === l.code && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors relative cursor-pointer"
            aria-label={t('navNotifications', 'Notifications')}
          >
            <Bell className="w-5 h-5 text-emerald-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
