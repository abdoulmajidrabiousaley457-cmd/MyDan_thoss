import React from 'react';
import {
  X,
  Briefcase,
  FileText,
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
  BookOpen
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { CABINET_INFO } from '../data/cabinetData';

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

  if (!isOpen) return null;

  const navItems = [
    { id: 'portfolio', label: 'Cabinet & Portfolio Télétravail', icon: Briefcase },
    { id: 'cv_builder', label: 'Studio CV & Exemples Prêts', icon: FileText },
    { id: 'currency', label: 'Convertisseur de Devises Mondiales', icon: ArrowRightLeft },
    { id: 'library', label: 'Bibliothèque Numérique Pro', icon: BookOpen },
    { id: 'remote_devis', label: 'Simulateur Devis & Recrutement', icon: Laptop },
    { id: 'subscription', label: 'Abonnements & Outils Carrière', icon: Sparkles },
    { id: 'profile', label: 'Mon Espace & Profil', icon: User },
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-black text-white text-base shadow-md">
              RS
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight leading-snug">Cabinet Rabiou Saley</h2>
              <p className="text-[11px] text-emerald-300">Data Science & Agents IA</p>
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
              Assistance & Cabinet
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
                <span>Centre de Notifications</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSecurity();
                }}
                className="w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Sécurité & Charte NDA</span>
              </button>
            </div>
          </div>

          {/* External links */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              Liens Officiels
            </span>
            <a
              href={CABINET_INFO.portfolioOfficialUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Portfolio Studio AI</span>
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
