import React, { useState } from 'react';
import { usePWAInstall, openInstallModal } from '../hooks/usePWAInstall';
import { Download, X } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('danthoss_pwa_banner_dismissed') === 'true';
  });

  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('danthoss_pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        openInstallModal();
      }
    } else {
      openInstallModal();
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border-b border-emerald-800/60 px-4 py-3 shadow-md relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-left">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-emerald-400/50 shadow-md shrink-0 bg-slate-950">
            <img src="/app-logo.png" alt="Logo Danthoss" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide uppercase text-emerald-400">Application Portable</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold">Avec Logo Officiel</span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Téléchargez <strong>Danthoss</strong> avec son logo esthétique pour créer votre profil directement sur votre téléphone !
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleInstallClick}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Installer sur mon téléphone</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Fermer la bannière"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
