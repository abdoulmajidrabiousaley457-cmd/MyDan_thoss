import React, { useState, useEffect } from 'react';
import { usePWAInstall, DevicePlatform } from '../hooks/usePWAInstall';
import {
  Download,
  Share,
  PlusSquare,
  X,
  CheckCircle2,
  Sparkles,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Monitor,
  Copy,
  Check,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface InstallAppModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ forceOpen, onClose }) => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    platform: detectedPlatform,
    browserName,
    install
  } = usePWAInstall();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<DevicePlatform>(detectedPlatform);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Sync default tab with detected device
  useEffect(() => {
    setSelectedTab(detectedPlatform);
  }, [detectedPlatform]);

  useEffect(() => {
    // Check if user already dismissed recently
    const hasSeen = sessionStorage.getItem('danthoss_install_prompt_seen');
    const isMobileDevice = /iphone|ipad|ipod|android/i.test(navigator.userAgent);

    if (forceOpen) {
      setIsOpen(true);
    } else if (!isInstalled && !hasSeen && isMobileDevice) {
      // Show automatically on mobile after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('danthoss_install_prompt_seen', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isInstalled, forceOpen]);

  // Listen to both modal events for 100% reliability
  useEffect(() => {
    const handleOpenInstall = () => setIsOpen(true);
    window.addEventListener('open-install-modal', handleOpenInstall);
    window.addEventListener('open-pwa-guide', handleOpenInstall);
    return () => {
      window.removeEventListener('open-install-modal', handleOpenInstall);
      window.removeEventListener('open-pwa-guide', handleOpenInstall);
    };
  }, []);

  if (isInstalled && !forceOpen && !installSuccess) return null;
  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleDirectInstall = async () => {
    setIsInstalling(true);
    try {
      if (isInstallable) {
        const success = await install();
        if (success) {
          setInstallSuccess(true);
          setTimeout(() => {
            handleClose();
          }, 2200);
        }
      } else {
        // If native prompt is not active yet, ensure correct tab is active for guided 1-tap addition
        if (isIOS) {
          setSelectedTab('ios');
        } else if (isAndroid) {
          setSelectedTab('android');
        } else {
          setSelectedTab('desktop');
        }
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const handleCopyAppUrl = () => {
    const appUrl = window.location.origin;
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/40 text-white shadow-2xl p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300">
        
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  Installer Danthoss sur l'écran
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PWA Officielle
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Détecté : <strong className="text-emerald-400">{browserName}</strong> ({detectedPlatform === 'ios' ? 'iPhone / iOS' : detectedPlatform === 'android' ? 'Android' : 'Ordinateur'})
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner if freshly installed */}
        {installSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-sm text-white">Application installée avec succès !</div>
              <div className="text-xs text-emerald-300">L'icône Danthoss est désormais présente sur votre écran d'accueil.</div>
            </div>
          </div>
        )}

        {/* App Showcase Card with Official Logo */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/70 rounded-2xl p-4 border border-emerald-500/30 flex items-center gap-4">
          <div className="relative shrink-0">
            {/* Ambient Pulse Glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-2xl blur-md opacity-60 animate-pulse"></div>
            {/* Real App Icon */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-400/80 shadow-2xl bg-slate-950">
              <img
                src="/app-logo.png"
                alt="Logo Officiel Danthoss"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-md">
              APP
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-white truncate">Danthoss IA</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>
            <p className="text-xs text-emerald-300 font-medium line-clamp-1">
              Cabinet Rabiou Saley • Télétravail & Solutions IA
            </p>
            <p className="text-[11px] text-slate-300 mt-1">
              Ajoutez l'application directement à l'écran de votre téléphone pour une utilisation autonome et rapide.
            </p>
          </div>
        </div>

        {/* Direct One-Tap Install Action */}
        <div className="space-y-2">
          {isInstallable ? (
            <button
              onClick={handleDirectInstall}
              disabled={isInstalling}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/70 flex items-center justify-center gap-2.5 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-5 h-5 text-slate-950 shrink-0" />
              <span>{isInstalling ? 'Téléchargement en cours...' : 'Télécharger & Installer Directement (1 Clic)'}</span>
            </button>
          ) : isInstalled ? (
            <div className="w-full py-3 px-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Application déjà installée et opérationnelle sur votre écran</span>
            </div>
          ) : (
            <div className="w-full py-2.5 px-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Guide pas-à-pas pour votre appareil :</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                100% Gratuit
              </span>
            </div>
          )}
        </div>

        {/* Platform Selector Tabs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Choisissez votre appareil :
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">
              Mode visuel guidé
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/90 rounded-2xl border border-slate-800">
            {/* Android Tab */}
            <button
              onClick={() => setSelectedTab('android')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedTab === 'android'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>🤖</span>
              <span>Android</span>
            </button>

            {/* iOS Tab */}
            <button
              onClick={() => setSelectedTab('ios')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedTab === 'ios'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>🍎</span>
              <span>iPhone (iOS)</span>
            </button>

            {/* Desktop Tab */}
            <button
              onClick={() => setSelectedTab('desktop')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedTab === 'desktop'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Ordinateur</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Visual Instruction Cards */}
        <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-3.5">
          {/* ANDROID VISUAL GUIDE */}
          {selectedTab === 'android' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <span>🤖</span> Guide Android (Google Chrome / Samsung / Firefox)
                </span>
                <span className="text-[10px] text-slate-400">Écran d'accueil</span>
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs text-slate-300 space-y-0.5">
                  <p className="font-semibold text-white">
                    Appuyez sur le menu du navigateur
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Touchez les <strong>3 points verticaux (⋮)</strong> situés en haut à droite de votre écran.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs text-slate-300 space-y-0.5">
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <span>Sélectionnez <strong>« Installer l'application »</strong></span>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Ou appuyez sur <strong>« Ajouter à l'écran d'accueil »</strong> selon votre navigateur.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-xs text-slate-200 space-y-0.5">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span>L'icône Danthoss apparaît directement sur votre écran !</span>
                  </p>
                  <p className="text-emerald-300 text-[11px]">
                    L'application s'ouvre en plein écran, sans barre d'adresse et avec accès direct à vos profils et au coffre-fort.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* IOS VISUAL GUIDE */}
          {selectedTab === 'ios' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <span>🍎</span> Guide iPhone & iPad (Safari iOS)
                </span>
                <span className="text-[10px] text-slate-400">Écran d'accueil</span>
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs text-slate-300 space-y-0.5">
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <span>Touchez le bouton <strong>Partager</strong></span>
                    <Share className="w-4 h-4 text-sky-400 inline" />
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Situé dans la barre en bas de votre écran Safari (carré avec la flèche vers le haut).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs text-slate-300 space-y-0.5">
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <span>Faites défiler et touchez <strong>« Sur l'écran d'accueil »</strong></span>
                    <PlusSquare className="w-4 h-4 text-emerald-400 inline" />
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    L'option est visible dans la liste d'actions sous les contacts.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-xs text-slate-200 space-y-0.5">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span>Appuyez sur <strong>« Ajouter »</strong> en haut à droite</span>
                  </p>
                  <p className="text-emerald-300 text-[11px]">
                    C'est tout ! L'application Danthoss est installée avec son icône sur votre écran d'iPhone comme une app de l'App Store.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DESKTOP VISUAL GUIDE */}
          {selectedTab === 'desktop' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" /> Guide Ordinateur (Chrome / Edge / Mac / Windows)
                </span>
                <span className="text-[10px] text-slate-400">Application Bureau</span>
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs text-slate-300 space-y-0.5">
                  <p className="font-semibold text-white">
                    Repérez l'icône dans la barre d'adresse
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Regardez à droite de la barre d'URL : cliquez sur l'icône d'écran ou de téléchargement (⬇️).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs text-slate-300 space-y-0.5">
                  <p className="font-semibold text-white">
                    Cliquez sur <strong>« Installer Danthoss »</strong>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    L'application apparaîtra dans vos applications macOS ou votre menu Démarrer Windows.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits reminder */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Plein écran sans barre URL</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Disponible hors-connexion</span>
          </div>
        </div>

        {/* Secondary actions: Copy link & Dismiss */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={handleCopyAppUrl}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Lien copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copier le lien direct</span>
              </>
            )}
          </button>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer text-center"
          >
            Continuer dans le navigateur
          </button>
        </div>

      </div>
    </div>
  );
};
