import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Key, 
  Smartphone, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Sparkles,
  Terminal,
  Info,
  Server,
  ArrowRight
} from 'lucide-react';
import { FIREBASE_PROJECT_INFO, loginWithGoogle } from '../services/firebase';
import { useUserProfile } from '../context/UserProfileContext';

interface FirebaseGoogleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedError?: string | null;
  onSuccessLogin?: () => void;
}

export const FirebaseGoogleConfigModal: React.FC<FirebaseGoogleConfigModalProps> = ({
  isOpen,
  onClose,
  detectedError,
  onSuccessLogin
}) => {
  const { isAdmin } = useUserProfile();
  const [activeTab, setActiveTab] = useState<'domains' | 'web_sdk' | 'sha1' | 'diagnostics'>('domains');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen || !isAdmin) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'my-dan-thoss-6zf3poqbb-portfolio-a372.vercel.app';
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://my-dan-thoss-6zf3poqbb-portfolio-a372.vercel.app';
  const vercelDomain = 'my-dan-thoss-6zf3poqbb-portfolio-a372.vercel.app';

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleTestGoogleSignIn = async (mode: 'popup' | 'redirect') => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await loginWithGoogle(mode === 'redirect');
      if (res && res.user) {
        setTestResult({
          success: true,
          message: `Connexion Google réussie avec succès ! Utilisateur : ${res.user.displayName || res.user.email}`
        });
        if (onSuccessLogin) {
          setTimeout(() => {
            onSuccessLogin();
            onClose();
          }, 1500);
        }
      } else {
        setTestResult({
          success: true,
          message: 'Redirection vers Google initiée...'
        });
      }
    } catch (err: any) {
      console.warn('Test Google Sign In notice:', err);
      const code = err?.code || '';
      let msg = err?.message || 'Erreur inconnue';
      if (code === 'auth/unauthorized-domain') {
        msg = `Le domaine "${currentHost}" n'est pas encore autorisé dans votre Firebase Console. Veuillez l'ajouter dans l'onglet Domaines Autorisés ci-dessous.`;
      } else if (code === 'auth/operation-not-allowed') {
        msg = 'Le fournisseur sélectionné est désactivé dans la console Firebase. Activez-le dans Authentication > Sign-in method.';
      } else if (code === 'auth/popup-blocked') {
        msg = 'Le popup a été bloqué par votre navigateur. Cliquez sur le bouton "Mode Redirection" pour contourner le bloqueur.';
      }
      setTestResult({
        success: false,
        message: msg
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl text-white shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1">
                <span>Google Sign-In & Firebase Console</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Configuration SDK Web & Empreinte SHA-1
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detected error alert if any */}
        {detectedError && (
          <div className="mx-5 sm:mx-6 mt-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold block text-rose-300">Diagnostic d'erreur détecté :</strong>
              <p className="text-[11px] leading-relaxed text-rose-200/90 font-mono break-all">{detectedError}</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-5 sm:px-6 gap-2 sm:gap-3 overflow-x-auto no-scrollbar pt-3">
          <button
            onClick={() => setActiveTab('domains')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'domains'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1. Domaines Vercel ({currentHost.includes('vercel') ? 'Action Requise' : 'Autorisés'})</span>
          </button>

          <button
            onClick={() => setActiveTab('web_sdk')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'web_sdk'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>2. Configuration SDK Web Google</span>
          </button>

          <button
            onClick={() => setActiveTab('sha1')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'sha1'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>3. Empreinte SHA-1 (Production)</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>4. Test & Diagnostic en Direct</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs">
          
          {/* TAB 1: DOMAINES VERCEL */}
          {activeTab === 'domains' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Cause principale du blocage de Google Sign-In sur Vercel :</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Par défaut, Google et Firebase bloquent toute tentative d'authentification provenant d'un domaine qui n'a pas été explicitement inscrit dans la liste des <strong>Domaines Autorisés</strong> de votre Firebase Console.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">
                    Domaines à autoriser dans votre Firebase Console :
                  </h3>
                  <button
                    onClick={() => {
                      const allDomains = [
                        vercelDomain,
                        'vercel.app',
                        'ais-dev-2una3d6k52typ45pfcmqpt-207318041778.europe-west2.run.app',
                        'ais-pre-2una3d6k52typ45pfcmqpt-207318041778.europe-west2.run.app',
                        'localhost'
                      ].join('\n');
                      copyToClipboard(allDomains, 'all_domains');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                  >
                    {copiedKey === 'all_domains' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'all_domains' ? 'Tous copiés !' : 'Copier la liste'}</span>
                  </button>
                </div>

                {/* Vercel App Domain */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                      1. Votre URL de Déploiement Vercel (Production)
                    </span>
                    <code className="text-white font-mono text-xs font-bold">{vercelDomain}</code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(vercelDomain, 'vercel_url')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
                  >
                    {copiedKey === 'vercel_url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'vercel_url' ? 'Copié !' : 'Copier ce domaine'}</span>
                  </button>
                </div>

                {/* Generic vercel.app */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">
                      2. Domaine racine Vercel (Recommandé pour tous les aperçus Vercel)
                    </span>
                    <code className="text-white font-mono text-xs font-bold">vercel.app</code>
                  </div>
                  <button
                    onClick={() => copyToClipboard('vercel.app', 'vercel_root')}
                    className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    {copiedKey === 'vercel_root' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'vercel_root' ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>

                {/* AI Studio Dev Domain */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block">
                      3. Environnement de Développement & Aperçu AI Studio
                    </span>
                    <code className="text-white font-mono text-xs font-bold">ais-dev-2una3d6k52typ45pfcmqpt-207318041778.europe-west2.run.app</code>
                  </div>
                  <button
                    onClick={() => copyToClipboard('ais-dev-2una3d6k52typ45pfcmqpt-207318041778.europe-west2.run.app', 'dev_domain')}
                    className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    {copiedKey === 'dev_domain' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'dev_domain' ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>

                {/* AI Studio Preview Domain */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider block">
                      4. Environnement Partagé / Production AI Studio
                    </span>
                    <code className="text-white font-mono text-xs font-bold">ais-pre-2una3d6k52typ45pfcmqpt-207318041778.europe-west2.run.app</code>
                  </div>
                  <button
                    onClick={() => copyToClipboard('ais-pre-2una3d6k52typ45pfcmqpt-207318041778.europe-west2.run.app', 'pre_domain')}
                    className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    {copiedKey === 'pre_domain' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'pre_domain' ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>

                {/* Current domain if different */}
                {currentHost !== vercelDomain && !currentHost.includes('europe-west2.run.app') && (
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                        5. Domaine Actuel (Votre Navigateur)
                      </span>
                      <code className="text-white font-mono text-xs font-bold">{currentHost}</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(currentHost, 'current_host')}
                      className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      {copiedKey === 'current_host' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'current_host' ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Instructions steps */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Procédure en 3 clics dans Firebase Console :
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    Cliquez sur le bouton ci-dessous pour ouvrir directement la section <strong>Paramètres d'Authentification</strong> de votre projet Firebase (<code className="text-amber-300">{FIREBASE_PROJECT_INFO.projectId}</code>).
                  </li>
                  <li>
                    Faites défiler jusqu'à la section <strong>Domaines autorisés</strong> (Authorized domains).
                  </li>
                  <li>
                    Cliquez sur <strong>Ajouter un domaine</strong>, collez <code className="text-emerald-300 font-bold">{vercelDomain}</code>, puis cliquez sur <strong>Ajouter</strong>.
                  </li>
                </ol>

                <div className="pt-2">
                  <a
                    href={FIREBASE_PROJECT_INFO.consoleAuthUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer"
                  >
                    <span>Ouvrir Firebase Console (Domaines Autorisés)</span>
                    <ExternalLink className="w-4 h-4 text-slate-950" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEB SDK */}
          {activeTab === 'web_sdk' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                  <Key className="w-4 h-4" />
                  <span>Nouvelle exigence de Google pour le SDK Web Firebase :</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Google exige que le fournisseur d'authentification Google soit activé avec l'<strong>ID client Web OAuth 2.0</strong> et une adresse email d'assistance de projet valide.
                </p>
              </div>

              <div className="space-y-4">
                {/* Client ID */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    ID Client Web OAuth 2.0 (Google Web Client ID) :
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={FIREBASE_PROJECT_INFO.oAuthClientId}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-[11px] text-emerald-400 select-all"
                    />
                    <button
                      onClick={() => copyToClipboard(FIREBASE_PROJECT_INFO.oAuthClientId, 'oauth_id')}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      {copiedKey === 'oauth_id' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'oauth_id' ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                </div>

                {/* Email Support */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Adresse e-mail d'assistance du projet (Exigé par Google) :
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="abdoulmajidrabiousaley457@gmail.com"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-[11px] text-white select-all"
                    />
                    <button
                      onClick={() => copyToClipboard('abdoulmajidrabiousaley457@gmail.com', 'support_email')}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      {copiedKey === 'support_email' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'support_email' ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                </div>

                {/* Google Cloud Console Credentials configuration */}
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-white text-xs">
                    Origines JavaScript & Redirection autorisées (Google Cloud Console) :
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Dans Google Cloud Console &gt; API et services &gt; Identifiants &gt; ID client OAuth 2.0 Web, assurez-vous d'avoir :
                  </p>
                  
                  <div className="space-y-2 text-[11px] font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300 truncate">Origine : {currentOrigin}</span>
                      <button onClick={() => copyToClipboard(currentOrigin, 'orig')} className="text-emerald-400 hover:underline shrink-0 text-xs font-sans">
                        {copiedKey === 'orig' ? 'Copié' : 'Copier'}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300 truncate">Redirection : https://{FIREBASE_PROJECT_INFO.authDomain}/__/auth/handler</span>
                      <button onClick={() => copyToClipboard(`https://${FIREBASE_PROJECT_INFO.authDomain}/__/auth/handler`, 'redir')} className="text-emerald-400 hover:underline shrink-0 text-xs font-sans">
                        {copiedKey === 'redir' ? 'Copié' : 'Copier'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <a
                      href={FIREBASE_PROJECT_INFO.consoleProvidersUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                    >
                      <span>Sign-in method : Google & Email/Mot de passe (Firebase)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={FIREBASE_PROJECT_INFO.googleCloudCredentialsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
                    >
                      <span>Identifiants (Google Cloud)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SHA-1 */}
          {activeTab === 'sha1' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                  <Smartphone className="w-4 h-4" />
                  <span>Empreinte de certificat SHA-1 de Production :</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  L'empreinte SHA-1 est exigée par Google pour lier votre application de production (PWA, TWA ou APK Android sur Google Play) à votre projet Firebase et autoriser Google Sign-In sans blocage de sécurité.
                </p>
              </div>

              <div className="space-y-4">
                {/* How to get SHA-1 from Google Play */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                    Méthode 1 : Si vous publiez via Google Play Console
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300">
                    <li>Connectez-vous à <strong>Google Play Console</strong>.</li>
                    <li>Sélectionnez votre application, puis allez dans <strong>Configuration &gt; Intégrité de l'application</strong>.</li>
                    <li>Sous <strong>Clé de signature d'application</strong>, copiez l'<strong>Empreinte du certificat SHA-1</strong>.</li>
                  </ol>
                </div>

                {/* How to get SHA-1 from local Keystore */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Méthode 2 : Si vous générez un Keystore Android ou debug
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Exécutez cette commande dans votre terminal pour extraire l'empreinte SHA-1 de votre keystore de release :
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 flex items-center justify-between gap-2 overflow-x-auto">
                    <code>keytool -list -v -keystore mon-keystore-release.jks</code>
                    <button
                      onClick={() => copyToClipboard('keytool -list -v -keystore mon-keystore-release.jks', 'keytool')}
                      className="text-xs text-slate-400 hover:text-white shrink-0"
                    >
                      {copiedKey === 'keytool' ? 'Copié' : 'Copier'}
                    </button>
                  </div>
                </div>

                {/* Adding to Firebase */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-white text-xs">
                    Où coller l'empreinte SHA-1 dans Firebase Console :
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300">
                    <li>Rendez-vous dans les <strong>Paramètres du projet</strong> (icône d'engrenage).</li>
                    <li>Dans l'onglet <strong>Général</strong>, faites défiler jusqu'à <strong>Vos applications</strong>.</li>
                    <li>Cliquez sur votre application Android puis sur <strong>Ajouter une empreinte digitale</strong>.</li>
                    <li>Collez la chaîne SHA-1 (ex: <code className="text-amber-300 font-mono">AA:BB:CC:...</code>) et enregistrez.</li>
                  </ol>

                  <div className="pt-2">
                    <a
                      href={FIREBASE_PROJECT_INFO.consoleGeneralUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span>Ouvrir Paramètres du Projet Firebase (Ajouter SHA-1)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIAGNOSTICS & TEST */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Projet Firebase</span>
                  <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{FIREBASE_PROJECT_INFO.projectId}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Domaine Actuel</span>
                  <div className="font-mono text-xs font-bold text-emerald-400 truncate">
                    {currentHost}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Domaine Auth Firebase</span>
                  <div className="font-mono text-xs font-bold text-white truncate">
                    {FIREBASE_PROJECT_INFO.authDomain}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Mode d'authentification</span>
                  <div className="text-xs font-bold text-white">
                    Hybride (Popup + Redirection Mobile)
                  </div>
                </div>
              </div>

              {testResult && (
                <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                  testResult.success 
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200' 
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <strong className="font-bold block text-sm">
                      {testResult.success ? 'Succès !' : 'Échec de connexion :'}
                    </strong>
                    <p className="leading-relaxed">{testResult.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons to test */}
              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-3">
                <h4 className="font-bold text-white text-xs">
                  Tester la connexion Google en direct :
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleTestGoogleSignIn('popup')}
                    disabled={testLoading}
                    className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{testLoading ? 'Test en cours...' : 'Tester via Popup (Standard)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestGoogleSignIn('redirect')}
                    disabled={testLoading}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                    <span>Tester via Redirection (Mobile / Anti-Popup)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            Cabinet Rabiou Saley • ID Projet : <strong className="text-white">{FIREBASE_PROJECT_INFO.projectId}</strong>
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
