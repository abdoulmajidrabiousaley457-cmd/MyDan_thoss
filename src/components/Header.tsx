import React, { useState } from 'react';
import { Menu, Bell, Globe, Sparkles, Smartphone, Download, ExternalLink, FolderLock, LogOut, ShieldAlert } from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { useI18n } from '../i18n/I18nContext';
import { AppLanguage } from '../types';
import { usePWAInstall, openInstallModal } from '../hooks/usePWAInstall';

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
  const { unreadCount, profile, firebaseUser, logout, isAdmin } = useUserProfile();
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
          {/* Super Admin Badge Button */}
          {isAdmin && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'admin_dashboard' }))}
              className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md border border-amber-300 transition-all cursor-pointer animate-pulse"
              title="Tableau de Bord Administrateur (UID: zbc5lYSgQ9bIcKipYER68wbI1Er1)"
            >
              <ShieldAlert className="w-3.5 h-3.5 fill-slate-950 text-amber-500" />
              <span>ADMIN</span>
            </button>
          )}

          {/* Quick Client Vault button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'client_vault' }))}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Accéder au Coffre-fort Clients (Client Vault)"
          >
            <FolderLock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Client Vault</span>
          </button>

          {/* Install Mobile / PWA Button */}
          {!isInstalled && (
            <button
              onClick={async () => {
                if (isInstallable) {
                  await install();
                } else {
                  openInstallModal();
                }
              }}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
              title={t('installPhone', "Télécharger / Installer l'Application")}
            >
              <Download className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
              <span>{t('installPhone', "Installer l'App")}</span>
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

          {/* Quick Logout Button */}
          {firebaseUser && (
            <button
              onClick={logout}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 hover:text-rose-300 border border-slate-700 text-xs text-rose-400 font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title={t('logout', 'Déconnexion')}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('logout', 'Déconnexion')}</span>
            </button>
          )}

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
