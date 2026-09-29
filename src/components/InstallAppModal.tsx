import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, CheckCircle, Sparkles, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

interface InstallAppModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ forceOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  useEffect(() => {
    // Check if user already dismissed recently
    const hasSeen = sessionStorage.getItem('danthoss_install_prompt_seen');
    const isMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);

    if (forceOpen) {
      setIsOpen(true);
    } else if (!isInstalled && !hasSeen && isMobile) {
      // Show automatically on mobile after a short 1.2s delay to welcome the user
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('danthoss_install_prompt_seen', 'true');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isInstalled, forceOpen]);

  useEffect(() => {
    const handleOpenInstall = () => setIsOpen(true);
    window.addEventListener('open-install-modal', handleOpenInstall);
    return () => window.removeEventListener('open-install-modal', handleOpenInstall);
  }, []);

  if (isInstalled && !forceOpen) return null;
  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSSteps(true);
    } else if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        handleClose();
      }
    } else {
      setShowIOSSteps(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/40 text-white shadow-2xl p-6 space-y-5 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300">
        
        {/* Close Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Application Mobile Officielle
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo Preview & Visual */}
        <div className="text-center space-y-3">
          <div className="relative inline-block mx-auto">
            {/* Ambient Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-3xl blur-lg opacity-60 animate-pulse"></div>
            
            {/* Aesthetic App Icon */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-400/60 shadow-2xl bg-slate-950 mx-auto">
              <img
                src="/app-logo.png"
                alt="Logo Danthoss"
                className="w-full h-full object-cover"
              />
            </div>
            
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md border border-white">
              PWA
            </span>
          </div>

          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Télécharger Danthoss sur votre portable
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
              Installez l'application avec son <strong>logo officiel</strong> directement sur l'écran d'accueil de votre téléphone.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Icône élégante</strong> ajoutée à vos applications de portable</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Créez votre profil</strong> candidat ou recruteur en 1 clic</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Accès rapide au <strong>Studio CV ATS</strong> et contact WhatsApp direct</span>
          </div>
        </div>

        {/* iOS Step Guide if requested */}
        {showIOSSteps && (
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-emerald-500/50 space-y-2.5 text-xs text-slate-200">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Installation en 2 clics sur votre mobile :</span>
            </div>
            
            {isIOS ? (
              <div className="space-y-1.5 text-slate-300 pl-1">
                <p>1. Touchez le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" /> au bas de Safari.</p>
                <p>2. Défilez vers le bas et touchez <strong>« Sur l'écran d'accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.</p>
                <p>3. Appuyez sur <strong>Ajouter</strong> en haut à droite. Le logo s'affiche dans vos applications !</p>
              </div>
            ) : (
              <div className="space-y-1.5 text-slate-300 pl-1">
                <p>1. Ouvrez le menu de votre navigateur <strong>(les 3 points ⋮)</strong> en haut à droite.</p>
                <p>2. Choisissez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</p>
                <p>3. L'application se télécharge avec son logo sur votre téléphone !</p>
              </div>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-5 h-5 text-slate-950" />
            <span>Télécharger l'Application avec son Logo</span>
          </button>

          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white font-medium text-xs transition-colors"
          >
            Continuer dans le navigateur Web
          </button>
        </div>
      </div>
    </div>
  );
};
