import React from 'react';
import {
  ShieldCheck,
  Bell,
  Globe,
  HelpCircle,
  ChevronRight,
  Sparkles,
  User,
  CheckCircle,
  FileText,
  Laptop,
  Mail,
  Phone,
  ExternalLink,
  ArrowRightLeft,
  BookOpen
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { CABINET_INFO } from '../data/cabinetData';

interface ProfileScreenProps {
  onOpenSecurity: () => void;
  onOpenNotifications: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenSecurity,
  onOpenNotifications,
  onNavigateTab,
}) => {
  const { profile, activeLanguage, setLanguage } = useUserProfile();

  const switchLanguage = () => {
    if (activeLanguage === 'fr') setLanguage('en');
    else if (activeLanguage === 'en') setLanguage('ar');
    else setLanguage('fr');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-emerald-800/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 ring-4 ring-emerald-500/20 flex items-center justify-center text-2xl font-black text-white shadow-inner">
              RS
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h2 className="text-xl md:text-2xl font-extrabold text-white">{profile.name}</h2>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{profile.role}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  {profile.tier === 'vip_cabinet' ? 'VIP Cabinet 👑' : profile.tier === 'pro' ? 'Abonné Plan Pro ⭐' : 'Plan Découverte'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                  🟢 Remote Ready
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('subscription')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Gérer mon Abonnement
          </button>
        </div>

        {/* Quick Contact & Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{profile.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{profile.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{profile.country}</span>
          </div>
        </div>
      </div>

      {/* Account Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CV & Carrière */}
        <div
          onClick={() => onNavigateTab('cv_builder')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Studio CV & Lettre de Motivation</h3>
              <p className="text-xs text-slate-500">4 modèles professionnels certifiés ATS</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Devis Télétravail */}
        <div
          onClick={() => onNavigateTab('remote_devis')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Simulateur Devis Télétravail</h3>
              <p className="text-xs text-slate-500">Estimer et commander une mission IA</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Convertisseur de Devises */}
        <div
          onClick={() => onNavigateTab('currency')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Convertisseur de Devises</h3>
              <p className="text-xs text-slate-500">XOF, EUR, USD & barèmes télétravail</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Bibliothèque Numérique Pro */}
        <div
          onClick={() => onNavigateTab('library')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Bibliothèque Numérique Pro</h3>
              <p className="text-xs text-slate-500">Livres, synthèses & guides IA à télécharger</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Abonnements */}
        <div
          onClick={() => onNavigateTab('subscription')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Abonnements & Tarifs</h3>
              <p className="text-xs text-slate-500">Plan Pro & Cercle VIP Cabinet</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Notifications */}
        <div
          onClick={onOpenNotifications}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Notifications & Alertes</h3>
              <p className="text-xs text-slate-500">Mises à jour et conseils du cabinet</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-3">Paramètres de l'Application</h3>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">Langue d'affichage</span>
          </div>
          <button
            onClick={switchLanguage}
            className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer"
          >
            {activeLanguage === 'fr' ? 'Français (FR)' : activeLanguage === 'en' ? 'English (EN)' : 'العربية (AR)'}
          </button>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">Charte de Confidentialité (NDA) & Sécurité</span>
          </div>
          <button
            onClick={onOpenSecurity}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Consulter
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">Portfolio Studio Officiel</span>
          </div>
          <a
            href={CABINET_INFO.portfolioOfficialUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Ouvrir</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
