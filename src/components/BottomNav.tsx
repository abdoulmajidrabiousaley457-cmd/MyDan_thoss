import React from 'react';
import { Briefcase, LayoutGrid, ArrowRightLeft, BookOpen, User } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useI18n();

  const tabs = [
    { id: 'portfolio', label: t('navCabinet', 'Cabinet & IA'), icon: Briefcase },
    { id: 'cv_builder', label: t('navPortfolios', 'Portfolios & Projets'), icon: LayoutGrid },
    { id: 'currency', label: t('navCurrencies', 'Devises'), icon: ArrowRightLeft },
    { id: 'library', label: t('navLibrary', 'Bibliothèque'), icon: BookOpen },
    { id: 'profile', label: t('navProfile', 'Mon Espace'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 shadow-xl print:hidden">
      <div className="max-w-2xl mx-auto flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative cursor-pointer ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-10 h-1 bg-emerald-600 rounded-full" />
              )}
              <div
                className={`p-1.5 rounded-xl transition-transform ${
                  isActive ? 'scale-110 bg-emerald-50 text-emerald-700' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
