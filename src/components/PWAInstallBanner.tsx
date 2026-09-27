import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('danthoss_pwa_banner_dismissed') === 'true';
  });

  useEffect(() => {
    const handleOpenGuide = () => setShowIOSModal(true);
    window.addEventListener('open-pwa-guide', handleOpenGuide);
    return () => window.removeEventListener('open-pwa-guide', handleOpenGuide);
  }, []);

  if (isInstalled || dismissed) {
    return (
      <>
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
                    RS
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Installer Danthoss sur votre mobile</h3>
                    <p className="text-xs text-emerald-400 font-medium">Compatible Android & iPhone (iOS)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
                <div className="font-bold text-slate-200 text-sm mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Instructions rapides selon votre téléphone :</span>
                </div>

                <div className="space-y-2 border-t border-slate-700/60 pt-2.5">
                  <div className="font-semibold text-emerald-300">📱 Sur iPhone / iPad (Safari) :</div>
                  <div className="flex items-start gap-2 pl-2">
                    <span className="font-bold text-white">1.</span>
                    <span>Appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" /> en bas de l'écran Safari.</span>
                  </div>
                  <div className="flex items-start gap-2 pl-2">
                    <span className="font-bold text-white">2.</span>
                    <span>Faites défiler vers le bas et touchez <strong>« Sur l'écran d'accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.</span>
                  </div>
                  <div className="flex items-start gap-2 pl-2">
                    <span className="font-bold text-white">3.</span>
                    <span>Confirmez en haut à droite sur <strong>Ajouter</strong>. L'icône de l'application apparaît sur votre téléphone !</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-700/60 pt-2.5">
                  <div className="font-semibold text-emerald-300">🤖 Sur Android (Chrome / Navigateur) :</div>
                  <div className="flex items-start gap-2 pl-2">
                    <span className="font-bold text-white">1.</span>
                    <span>Touchez le menu <strong>(3 points ⋮)</strong> en haut à droite du navigateur.</span>
                  </div>
                  <div className="flex items-start gap-2 pl-2">
                    <span className="font-bold text-white">2.</span>
                    <span>Appuyez sur <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/50">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Une fois installée, l'application fonctionne comme une vraie application native sans barre d'adresse et sauvegarde vos profils !</span>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg transition-colors cursor-pointer"
              >
                Compris, j'installe l'application
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('danthoss_pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else if (isInstallable) {
      await install();
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border-b border-emerald-800/60 px-4 py-3 shadow-md relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wide uppercase text-emerald-400">Application Mobile & PWA</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold">100% Gratuit</span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Installez <strong>Danthoss</strong> sur votre portable pour créer votre profil, sauvegarder vos CV et contacter le Cabinet en 1 clic !
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleInstallClick}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
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

      {/* iOS & Manual Install Modal Guide */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
                  RS
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Installer Danthoss sur votre mobile</h3>
                  <p className="text-xs text-emerald-400 font-medium">Compatible Android & iPhone (iOS)</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
              <div className="font-bold text-slate-200 text-sm mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Instructions rapides selon votre téléphone :</span>
              </div>

              <div className="space-y-2 border-t border-slate-700/60 pt-2.5">
                <div className="font-semibold text-emerald-300">📱 Sur iPhone / iPad (Safari) :</div>
                <div className="flex items-start gap-2 pl-2">
                  <span className="font-bold text-white">1.</span>
                  <span>Appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" /> en bas de l'écran Safari.</span>
                </div>
                <div className="flex items-start gap-2 pl-2">
                  <span className="font-bold text-white">2.</span>
                  <span>Faites défiler vers le bas et touchez <strong>« Sur l'écran d'accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.</span>
                </div>
                <div className="flex items-start gap-2 pl-2">
                  <span className="font-bold text-white">3.</span>
                  <span>Confirmez en haut à droite sur <strong>Ajouter</strong>. L'icône de l'application apparaît sur votre téléphone !</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-700/60 pt-2.5">
                <div className="font-semibold text-emerald-300">🤖 Sur Android (Chrome / Navigateur) :</div>
                <div className="flex items-start gap-2 pl-2">
                  <span className="font-bold text-white">1.</span>
                  <span>Touchez le menu <strong>(3 points ⋮)</strong> en haut à droite du navigateur.</span>
                </div>
                <div className="flex items-start gap-2 pl-2">
                  <span className="font-bold text-white">2.</span>
                  <span>Appuyez sur <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/50">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Une fois installée, l'application fonctionne comme une vraie application native sans barre d'adresse et sauvegarde vos profils !</span>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg transition-colors cursor-pointer"
            >
              Compris, j'installe l'application
            </button>
          </div>
        </div>
      )}
    </>
  );
};
