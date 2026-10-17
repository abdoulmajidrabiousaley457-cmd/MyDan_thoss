import React from 'react';
import { LayoutGrid, ArrowRightLeft, BookOpen, User, FolderLock, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { useUserProfile } from '../context/UserProfileContext';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useI18n();
  const { isAdmin } = useUserProfile();

  const tabs = [
    ...(isAdmin ? [{ id: 'admin_dashboard', label: 'Admin', icon: ShieldAlert }] : []),
    { id: 'dashboard', label: t('navDashboard', 'Dashboard'), icon: ShieldCheck },
    { id: 'client_vault', label: t('navClientVault', 'Client Vault'), icon: FolderLock },
    { id: 'cv_builder', label: t('navPortfolios', 'Portfolios & CV'), icon: LayoutGrid },
    { id: 'library', label: t('navLibrary', 'Bibliothèque'), icon: BookOpen },
    { id: 'profile', label: t('navProfile', 'Mon Espace'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 sm:bottom-3 z-30 print:hidden pointer-events-none lg:hidden">
      <div className="max-w-2xl sm:max-w-xl mx-auto px-1 sm:px-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border-t sm:border border-slate-200/90 sm:rounded-3xl shadow-xl sm:shadow-2xl py-1 sm:py-1.5 px-1 sm:px-2 flex items-center justify-around pb-[max(0.4rem,env(safe-area-inset-bottom))]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 min-w-0 py-0.5 sm:py-1 transition-all relative cursor-pointer ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 sm:-top-1.5 w-5 sm:w-8 h-1 bg-emerald-600 rounded-full" />
                )}
                <div
                  className={`p-1 sm:p-1.5 rounded-xl transition-transform ${
                    isActive ? 'scale-110 bg-emerald-50 text-emerald-700' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </div>
                <span className="text-[8.5px] xs:text-[9.5px] sm:text-[11px] leading-none sm:leading-tight mt-0.5 tracking-tight truncate max-w-full px-0.5 text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
