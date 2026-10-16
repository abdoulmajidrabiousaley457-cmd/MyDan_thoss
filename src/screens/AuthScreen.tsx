import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Globe,
  LogOut,
  FolderLock,
  Download,
  Smartphone,
  Key,
  ExternalLink,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { useI18n } from '../i18n/I18nContext';
import { AppLanguage } from '../types';
import { usePWAInstall, openInstallModal } from '../hooks/usePWAInstall';
import { FirebaseGoogleConfigModal } from '../components/FirebaseGoogleConfigModal';
import { FIREBASE_PROJECT_INFO } from '../services/firebase';

interface AuthScreenProps {
  onSuccess?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onNavigateTab }) => {
  const { 
    firebaseUser, 
    loginEmail, 
    registerEmail, 
    sendPasswordReset, 
    loginGoogle, 
    logout,
    authError,
    setAuthError
  } = useUserProfile();

  const { t, language, setLanguage, isRtl } = useI18n();
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const languages: { code: AppLanguage; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg(t('fillAllFields', 'Veuillez renseigner votre email et mot de passe.'));
          setLoading(false);
          return;
        }
        await loginEmail(email.trim(), password);
        setSuccessMsg(t('loginSuccessMsg', 'Connexion réussie ! Chargement de votre espace...'));
        if (onSuccess) onSuccess();
        if (onNavigateTab) onNavigateTab('dashboard');
      } else if (mode === 'register') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg(t('fillAllFields', 'Veuillez renseigner votre email et mot de passe.'));
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg(t('passwordHint', 'Le mot de passe doit comporter au moins 6 caractères.'));
          setLoading(false);
          return;
        }
        await registerEmail(email.trim(), password, name.trim() || undefined);
        setSuccessMsg(t('registerSuccessMsg', 'Compte créé avec succès ! Bienvenue sur Danthoss IA.'));
        if (onSuccess) onSuccess();
        if (onNavigateTab) onNavigateTab('dashboard');
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setErrorMsg(t('fillEmail', 'Veuillez saisir votre adresse email.'));
          setLoading(false);
          return;
        }
        await sendPasswordReset(email.trim());
        setSuccessMsg(t('resetSuccessMsg', 'Un email de réinitialisation vous a été envoyé. Vérifiez votre boîte de réception.'));
        setTimeout(() => setMode('login'), 3500);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMsg(language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : language === 'en' ? 'Invalid email or password.' : 'Adresse email ou mot de passe incorrect.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg(language === 'ar' ? 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.' : language === 'en' ? 'Email is already in use. Please sign in.' : 'Cette adresse email est déjà associée à un compte.');
      } else if (code === 'auth/weak-password') {
        setErrorMsg(t('passwordHint', 'Le mot de passe doit comporter au moins 6 caractères.'));
      } else if (code === 'auth/invalid-email') {
        setErrorMsg(language === 'ar' ? 'صيغة البريد الإلكتروني غير صالحة.' : language === 'en' ? 'Invalid email format.' : 'Format d\'adresse email invalide.');
      } else {
        setErrorMsg(err?.message || (language === 'ar' ? 'حدث خطأ أثناء المصادقة.' : language === 'en' ? 'An authentication error occurred.' : 'Une erreur est survenue lors de l\'authentification.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (preferRedirect = false) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const cred = await loginGoogle(preferRedirect);
      if (cred && cred.user) {
        setSuccessMsg(t('loginSuccessMsg', 'Connexion réussie !'));
        if (onSuccess) onSuccess();
        if (onNavigateTab) onNavigateTab('dashboard');
      } else if (!preferRedirect && !cred) {
        // User closed or cancelled popup window
        setErrorMsg(null);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      const code = err?.code || '';
      const isUnauthorizedDomain = code === 'auth/unauthorized-domain' || err?.message?.includes('authorized domain');

      if (isUnauthorizedDomain) {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'votre domaine';
        setErrorMsg(`Le domaine "${currentHost}" n'est pas encore autorisé dans Firebase Console. Cliquez sur "Configurer" pour voir la procédure.`);
        setConfigError(`Erreur auth/unauthorized-domain : Le domaine "${currentHost}" (Vercel) doit être ajouté dans Firebase Console > Authentication > Settings > Authorized domains.`);
        setIsConfigModalOpen(true);
      } else if (code === 'auth/popup-blocked') {
        setErrorMsg('Le popup Google a été bloqué par votre navigateur. Tentative avec le mode redirection...');
        try {
          await loginGoogle(true);
        } catch {
          setErrorMsg('Veuillez cliquer sur le bouton "Connexion Google (Redirection)" ci-dessous.');
        }
      } else if (code === 'auth/operation-not-allowed') {
        setErrorMsg('Le fournisseur Google est désactivé dans Firebase Console. Activez-le dans Authentication > Sign-in method.');
        setConfigError('Erreur auth/operation-not-allowed : Activez le fournisseur Google dans Firebase Console > Authentication > Sign-in method > Google.');
        setIsConfigModalOpen(true);
      } else if (code === 'auth/popup-closed-by-user') {
        setErrorMsg('Connexion annulée : la fenêtre d\'authentification Google a été fermée.');
      } else {
        setErrorMsg(err?.message || (language === 'ar' ? 'تعذر تسجيل الدخول باستخدام Google.' : language === 'en' ? 'Failed to sign in with Google.' : 'Impossible de se connecter avec Google.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show user dashboard status
  if (firebaseUser) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {t('welcomeUser', 'Bienvenue,')} {firebaseUser.displayName || 'Utilisateur'}
          </h2>
          <p className="text-sm text-slate-500">
            {t('emailLabel', 'Email')} : <strong className="text-slate-800">{firebaseUser.email}</strong>
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 font-medium space-y-1">
          <p className="font-bold flex items-center justify-center gap-1.5">
            <FolderLock className="w-4 h-4 text-emerald-700" />
            <span>{t('authPortalBadge', 'Portail Sécurisé • Cabinet Rabiou Saley')}</span>
          </p>
          <p className="text-emerald-800">
            {t('openClientVaultDesc', 'Vos fichiers et livrables sont chiffrés et isolés dans votre espace personnel Firebase.')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateTab ? onNavigateTab('dashboard') : null}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('navDashboard', 'Accéder au Tableau de Bord')}</span>
          </button>

          <button
            onClick={logout}
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout', 'Se déconnecter')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      {/* Language Switcher Bar at top of login */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>{t('language', 'Langue')} :</span>
        </div>
        <div className="flex items-center gap-1">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                language === l.code
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{l.flag}</span>
              <span className="hidden sm:inline">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
          <FolderLock className="w-3.5 h-3.5" />
          <span>{t('authPortalBadge', 'Portail Sécurisé • Cabinet Rabiou Saley')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {mode === 'login' && t('authLoginTitle', 'Connexion à votre Espace')}
          {mode === 'register' && t('authRegisterTitle', 'Créer un Compte Professionnel')}
          {mode === 'forgot' && t('authForgotTitle', 'Réinitialiser votre mot de passe')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {mode === 'login' && t('authLoginSubtitle', 'Connectez-vous pour accéder à votre tableau de bord et coffre-fort clients.')}
          {mode === 'register' && t('authRegisterSubtitle', 'Rejoignez la plateforme pour gérer vos livrables et devis en toute sécurité.')}
          {mode === 'forgot' && t('authForgotSubtitle', 'Saisissez votre adresse email pour recevoir les instructions.')}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('fullNameLabel', 'Nom Complet ou Entreprise')}</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Abdoul Majid Rabiou Saley"
                  className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{t('emailLabel', 'Adresse Email Professionnelle')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.com"
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">{t('passwordLabel', 'Mot de Passe')}</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {t('forgotPasswordLink', 'Mot de passe oublié ?')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="animate-pulse">{t('loading', 'Chargement en cours...')}</span>
            ) : (
              <>
                <span>
                  {mode === 'login' && t('signInBtn', 'Se Connecter')}
                  {mode === 'register' && t('signUpBtn', 'Créer mon Compte')}
                  {mode === 'forgot' && t('sendResetBtn', 'Envoyer l\'email de réinitialisation')}
                </span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] uppercase font-bold text-slate-400 absolute">
            {t('orSeparator', 'ou')}
          </span>
        </div>

        {/* Google Login Options */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleGoogleLogin(false)}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t('googleSignIn', 'Continuer avec Google')}</span>
          </button>

          {/* Fallback button for mobile browsers with strict popup blockers */}
          <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
            <button
              type="button"
              onClick={() => handleGoogleLogin(true)}
              disabled={loading}
              className="text-slate-500 hover:text-slate-800 underline flex items-center gap-1 cursor-pointer"
              title="Utiliser la redirection si les popups sont bloqués sur iPhone/Android"
            >
              <span>📱 Mode Redirection (Mobile / Safari)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-emerald-600" />
              <span>Config Firebase & SHA-1</span>
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="pt-2 text-center text-xs text-slate-600">
          {mode === 'login' ? (
            <p>
              {t('noAccountPrompt', 'Vous n\'avez pas encore de compte ?')}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                {t('createOneBtn', 'Créer un compte')}
              </button>
            </p>
          ) : (
            <p>
              {t('alreadyAccountPrompt', 'Vous avez déjà un compte ?')}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                {t('signInLink', 'Se connecter')}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Direct Home Screen App Download Card for Clients */}
      {!isInstalled && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-4 sm:p-5 rounded-3xl border border-emerald-500/40 text-white shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-400 shadow-md shrink-0 bg-slate-950">
              <img src="/app-logo.png" alt="Logo Danthoss" className="w-full h-full object-cover" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white">Application Danthoss</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">PWA</span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                Installez l'application directement sur l'écran d'accueil de votre téléphone (Android & iPhone).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={async () => {
                if (isInstallable) {
                  await install();
                } else {
                  openInstallModal();
                }
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Télécharger sur l'Écran</span>
            </button>
            <button
              type="button"
              onClick={() => openInstallModal()}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Guide</span>
            </button>
          </div>
        </div>
      )}

      {/* Firebase & Google Sign-In Diagnostic / Config Modal */}
      <FirebaseGoogleConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        detectedError={configError}
        onSuccessLogin={() => {
          if (onSuccess) onSuccess();
          if (onNavigateTab) onNavigateTab('dashboard');
        }}
      />
    </div>
  );
};
