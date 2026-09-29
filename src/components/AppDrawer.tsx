import React from 'react';
import {
  X,
  Briefcase,
  LayoutGrid,
  Sparkles,
  Laptop,
  User,
  Bot,
  ShieldCheck,
  Bell,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  ExternalLink,
  ArrowRightLeft,
  BookOpen,
  Smartphone,
  Download
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { useI18n } from '../i18n/I18nContext';
import { CABINET_INFO } from '../data/cabinetData';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNexus: () => void;
  onOpenSecurity: () => void;
  onOpenNotifications: () => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenNexus,
  onOpenSecurity,
  onOpenNotifications,
}) => {
  const { profile } = useUserProfile();
  const { t } = useI18n();
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  const navItems = [
    { id: 'portfolio', label: t('navCabinet', 'Cabinet & Portfolio Télétravail'), icon: Briefcase },
    { id: 'cv_builder', label: t('navPortfolios', 'Portfolios, Projets & CV'), icon: LayoutGrid },
    { id: 'currency', label: t('navCurrencies', 'Convertisseur de Devises Mondiales'), icon: ArrowRightLeft },
    { id: 'library', label: t('navLibrary', 'Bibliothèque Numérique Pro'), icon: BookOpen },
    { id: 'remote_devis', label: t('navDevis', 'Simulateur Devis & Recrutement'), icon: Laptop },
    { id: 'subscription', label: t('navSubscriptions', 'Abonnements & Outils Carrière'), icon: Sparkles },
    { id: 'profile', label: t('navProfile', 'Mon Espace & Profil'), icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 flex print:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-full bg-white text-slate-900 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-emerald-400/60 shadow-md bg-slate-950 shrink-0">
              <img src="/app-logo.png" alt="Danthoss Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight leading-snug">Danthoss IA</h2>
              <p className="text-[11px] text-emerald-300">Cabinet Rabiou Saley</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-slate-900">{profile.name}</div>
              <div className="text-[11px] text-slate-500 truncate max-w-[170px]">{profile.email}</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {profile.tier === 'vip_cabinet' ? 'VIP Cabinet 👑' : profile.tier === 'pro' ? 'Pro ⭐' : 'Découverte'}
            </span>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Top Highlights: Official Live Portfolio & Hosted AI Agent */}
          <div className="space-y-2">
            <a
              href="https://mon-portfolio-fin-ten.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md hover:from-emerald-500 hover:to-teal-600 transition-all text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-200" />
                <span>Mon Portfolio Officiel (Vercel)</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
            </a>

            <a
              href="https://omni-studio-abdoul.ai.studio"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-900 text-emerald-300 border border-emerald-500/40 shadow-sm hover:bg-slate-800 transition-all text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Mon Agent IA (Omni Studio)</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>

          {/* Main Navigation */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              Navigation & Outils
            </span>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assistant & Services IA */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              Assistance & Téléchargement
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenNexus();
                }}
                className="w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200/60"
              >
                <Bot className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="flex-1 text-left">Majid IA - Assistant Virtuel</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenNotifications();
                }}
                className="w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{t('navNotifications', 'Centre de Notifications')}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSecurity();
                }}
                className="w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{t('navSecurity', 'Sécurité & Charte NDA')}</span>
              </button>

              <button
                onClick={async () => {
                  onClose();
                  if (isInstallable) {
                    await install();
                  } else {
                    onSelectTab('profile');
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200 transition-colors cursor-pointer border border-emerald-300/60"
              >
                <span className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Smartphone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{isInstalled ? 'Application Installée ✓' : t('installPhone', 'Installer sur mon portable')}</span>
                </span>
                <Download className="w-3.5 h-3.5 text-emerald-700" />
              </button>
            </div>
          </div>

          {/* External links & Socials */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              Contact Direct & Liens Clés
            </span>

            {/* Direct Official Portfolio */}
            <a
              href="https://mon-portfolio-fin-ten.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-emerald-700 hover:bg-emerald-50 transition-colors font-bold"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Portfolio Officiel (Vercel)</span>
              </span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </a>

            {/* Omni Studio Agent */}
            <a
              href="https://omni-studio-abdoul.ai.studio"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium"
            >
              <span className="flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>Agent Omni Studio Hébergé</span>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* WhatsApp Direct */}
            <a
              href={CABINET_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>WhatsApp : {CABINET_INFO.phone}</span>
              </span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </a>

            {/* X / Twitter */}
            <a
              href={CABINET_INFO.twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2 font-medium">
                <span className="font-bold text-slate-800">𝕏</span>
                <span>Twitter (@RabiousaleyM)</span>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* LinkedIn */}
            <a
              href={CABINET_INFO.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:text-sky-700 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2 font-medium">
                <span className="font-bold text-sky-700">in</span>
                <span>LinkedIn Pro</span>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* GitHub */}
            <a
              href={CABINET_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2 font-medium">
                <span className="font-bold text-slate-700">GH</span>
                <span>GitHub Repositories</span>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 space-y-1">
          <div className="font-semibold text-slate-700">Cabinet d'Expertise Rabiou Saley</div>
          <div>Niamey, Niger / Télétravail International</div>
          <div className="text-[10px] text-emerald-700 font-medium">✓ Disponible immédiatement en Full Remote</div>
        </div>
      </div>
    </div>
  );
};
