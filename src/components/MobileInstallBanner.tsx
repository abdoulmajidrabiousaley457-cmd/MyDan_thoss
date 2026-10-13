import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Sparkles, X, Smartphone, ArrowRight } from 'lucide-react';

export const MobileInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isMobile, install, openInstallModal } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('danthoss_mobile_banner_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  // Suppress banner if already running in standalone mode or on desktop or dismissed
  if (isInstalled || !isMobile || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        openInstallModal();
      }
    } else {
      openInstallModal();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('danthoss_mobile_banner_dismissed', 'true');
  };

  const handleDownloadLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = '/app-logo.png';
    link.download = 'Danthoss-Logo-Officiel-512.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/40 px-3 py-2 text-white shadow-lg sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        {/* Left: App Logo & Text */}
        <div 
          onClick={handleInstallClick}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-400 shadow-md bg-slate-950">
              <img 
                src="/app-logo.png" 
                alt="Logo Danthoss" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-[8px] font-black px-1 rounded-full">
              PWA
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-white truncate">Danthoss IA</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Officiel
              </span>
            </div>
            <p className="text-[10px] text-emerald-300 truncate font-medium">
              Installer l'app avec son logo sur votre téléphone
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleDownloadLogo}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700 transition-colors"
            title="Télécharger l'icône / logo officiel HD (.png)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md shadow-emerald-950/40 cursor-pointer active:scale-95 transition-all"
          >
            <span>{isIOS ? 'Ajouter' : 'Installer'}</span>
            <ArrowRight className="w-3 h-3 text-slate-950" />
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer la bannière"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
