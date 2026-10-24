import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { UserProfile, NotificationItem, CVData, CoverLetterData, SubscriptionTier, AppLanguage } from '../types';
import { onAuthStateChanged, User, UserCredential } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { auth, db, loginWithGoogle, checkRedirectAuthResult, loginWithEmail, registerWithEmail, resetPassword, logoutUser, handleFirestoreError, OperationType } from '../services/firebase';
import { subscribeToCorporateMailbox, isCorporateAddress } from '../services/corporateMailService';

export const initialCVData: CVData = {
  fullName: 'Rabiou Saley Abdoul Majid',
  jobTitle: 'Consultant Senior Data Science & Ingénieur Agents IA',
  email: 'abdoulmajidrabiousaley457@gmail.com',
  phone: '+227 96 49 99 06',
  location: 'Niamey, Niger / Télétravail International (Fuseaux UTC/CET)',
  portfolioUrl: 'https://rabiou-saley-abdoul-majid-data-science-agent-ia.ai.studio/',
  linkedinUrl: 'https://linkedin.com/in/rabiou-saley-abdoul-majid',
  githubUrl: 'https://github.com/abdoulmajid-saley',
  remoteStatus: 'Full Remote Ready',
  bioSummary: 'Expert Data Science & Concepteur d\'Agents IA Autonomes cumulant +5 années d\'expérience en modélisation prédictive, traitement du langage naturel (NLP/LLMs) et déploiement de pipelines MLOps en télétravail international. Spécialiste de la conception de systèmes multi-agents (LangChain, CrewAI, AutoGen) et de l\'industrialisation de modèles de Machine Learning sécurisés pour cabinets, startups et institutions.',
  templateId: 'ai_data_engineer',
  accentColor: '#16A34A',
  fontScale: 'normal',
  experiences: [
    {
      id: 'exp1',
      company: 'Cabinet Rabiou Saley - Solutions IA & Big Data',
      role: 'Consultant Fondateur & Architecte IA (Télétravail)',
      location: 'International / Remote',
      remoteType: 'full_remote',
      startDate: 'Jan 2023',
      endDate: 'Présent',
      current: true,
      highlights: [
        'Conception et déploiement d\'un écosystème d\'agents IA autonomes pour l\'analyse automatisée de contrats et de flux financiers (+42% d\'efficacité opérationnelle).',
        'Architecture de pipelines RAG vectoriels hybrides sous ChromaDB et Gemini Pro avec intégration multi-outils.',
        'Mise en place de protocoles de télétravail sécurisés pour clients en France, Suisse et Afrique de l\'Ouest.'
      ]
    },
    {
      id: 'exp2',
      company: 'DataMetrics International',
      role: 'Lead Data Scientist & Développeur ML (Remote)',
      location: 'Paris, France (Full Remote)',
      remoteType: 'full_remote',
      startDate: 'Mar 2021',
      endDate: 'Déc 2022',
      current: false,
      highlights: [
        'Développement de modèles prédictifs de rétention client (Churn) traitant plus de 2.5 millions de transactions par mois (Score F1: 0.91).',
        'Création d\'un pipeline de Computer Vision et OCR pour l\'extraction automatique de pièces comptables (gain de 15h/semaine pour les équipes d\'audit).',
        'Encadrement d\'une équipe distribuée de 4 ingénieurs data à distance selon la méthodologie Scrum agile.'
      ]
    },
    {
      id: 'exp3',
      company: 'TechNovate Africa',
      role: 'Data Analyst & Développeur Python',
      location: 'Abidjan / Remote',
      remoteType: 'hybrid',
      startDate: 'Juil 2019',
      endDate: 'Fév 2021',
      current: false,
      highlights: [
        'Automatisation de tableaux de bord décisionnels en temps réel connectés à des bases SQL et APIs REST.',
        'Nettoyage, feature engineering et modélisation statistique sur des jeux de données complexes du secteur logistique.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj1',
      title: 'NexusAgent - Multi-Agents RAG Juridique & Financier',
      technologies: ['LangGraph', 'LangChain', 'FastAPI', 'Gemini 2.5', 'Docker'],
      description: 'Système d\'agents autonomes orchestrés pour l\'audit contractuel et l\'extraction d\'obligations légales avec vérification croisée automatique.',
      link: 'https://github.com/abdoulmajid-saley/nexus-agent-rag',
      impactMetric: 'Temps d\'analyse divisé par 4'
    },
    {
      id: 'proj2',
      title: 'PredictChurn B2B - Plateforme de Scoring Prédictif',
      technologies: ['Python', 'XGBoost', 'SHAP', 'Streamlit', 'PostgreSQL'],
      description: 'Solution SaaS prédisant l\'attrition des clients stratégiques avec interprétabilité des facteurs de risque en temps réel.',
      link: 'https://github.com/abdoulmajid-saley/predict-churn-ml',
      impactMetric: '91% de précision prédictive'
    },
    {
      id: 'proj3',
      title: 'SmartDoc Vision - Pipeline OCR Intelligent',
      technologies: ['PyTorch', 'LayoutLM', 'OpenCV', 'FastAPI'],
      description: 'Système de traitement automatique des documents numérisés avec classification sémantique et validation de conformité.',
      link: 'https://github.com/abdoulmajid-saley/smartdoc-vision',
      impactMetric: '15h économisées/semaine'
    }
  ],
  education: [
    {
      id: 'edu1',
      institution: 'Institut Supérieur d\'Ingénierie & Télécoms',
      degree: 'Master en Ingénierie des Données & Systèmes Intelligents',
      field: 'Data Science & Intelligence Artificielle',
      location: 'Excellence Académique',
      year: '2019 - 2019',
      details: 'Spécialisation : Réseaux de neurones profonds, Vision par ordinateur et Systèmes multi-agents.'
    },
    {
      id: 'edu2',
      institution: 'Faculté des Sciences & Technologies',
      degree: 'Licence en Informatique & Mathématiques Appliquées',
      field: 'Algorithmique & Statistiques',
      location: 'Mention Très Bien',
      year: '2016 - 2019',
      details: 'Mémoire sur la modélisation statistique appliquée à la prévision des séries temporelles.'
    }
  ],
  skillCategories: [
    {
      category: 'Intelligence Artificielle & LLMs',
      skills: ['Agents IA Autonomes', 'LangChain / LangGraph', 'CrewAI', 'RAG Vectoriel', 'Prompt Engineering', 'Gemini API / Claude / GPT']
    },
    {
      category: 'Data Science & Machine Learning',
      skills: ['Python (NumPy, Pandas, Polars)', 'PyTorch & TensorFlow', 'Scikit-Learn', 'XGBoost & LightGBM', 'NLP & Computer Vision', 'SHAP & Interprétabilité']
    },
    {
      category: 'MLOps, Cloud & Télétravail',
      skills: ['Docker & Conteneurs', 'FastAPI & Flask', 'PostgreSQL & MongoDB', 'Git & GitHub Actions', 'Google Cloud Platform (GCP)', 'Méthodes Agiles Remote']
    }
  ],
  certifications: [
    {
      id: 'cert1',
      name: 'Professional Data Scientist Certification',
      issuer: 'Datacamp / Stanford Online',
      date: '2023',
      credentialUrl: '#'
    },
    {
      id: 'cert2',
      name: 'Generative AI & LLM Systems Specialist',
      issuer: 'DeepLearning.AI',
      date: '2024',
      credentialUrl: '#'
    },
    {
      id: 'cert3',
      name: 'Remote Work Professional & Agile Lead',
      issuer: 'Remote Work Association',
      date: '2023',
      credentialUrl: '#'
    }
  ],
  languages: [
    { language: 'Français', level: 'Langue maternelle / Bilingue' },
    { language: 'Anglais', level: 'Professionnel courant (C1 - Télétravail)' },
    { language: 'Arabe', level: 'Notions professionnelles' },
    { language: 'Haoussa', level: 'Courant' }
  ],
  interests: [
    'Recherche en IA éthique',
    'Open source',
    'Mentorat jeunes diplômés',
    'Échecs',
    'Veille technologique'
  ]
};

export const initialCoverLetterData: CoverLetterData = {
  senderName: 'Rabiou Saley Abdoul Majid',
  senderTitle: 'Consultant Senior Data Science & Ingénieur Agents IA',
  senderEmail: 'abdoulmajidrabiousaley457@gmail.com',
  senderPhone: '+227 96 49 99 06',
  senderLocation: 'Niamey, Niger / Télétravail International',
  recipientName: 'Direction du Recrutement & Direction Technique',
  recipientTitle: 'Lead Recruiter / Chief Technology Officer',
  companyName: 'Votre Entreprise / Organisation',
  companyAddress: 'Département Data & Innovation IA',
  date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  jobTarget: 'Consultant Data Scientist Senior & Spécialiste Agents IA en Télétravail',
  workArrangement: 'Télétravail Full Remote',
  tone: 'expert_ai',
  greeting: 'Madame, Monsieur,',
  hookParagraph: 'Fort de plus de 5 années d\'expertise appliquée dans la conception d\'architectures de Machine Learning et le déploiement d\'agents IA autonomes, je vous adresse ma candidature pour collaborer au sein de votre équipe en télétravail international (Full Remote).',
  skillsParagraph: 'À la tête de projets stratégiques pour des organisations internationales, j\'ai développé une méthodologie éprouvée combinant la puissance des modèles de fondation (LLMs, RAG, systèmes multi-agents avec LangGraph et CrewAI) à des pipelines de données robustes sous Python, FastAPI et Docker. Mon autonomie rigoureuse et ma maîtrise des outils collaboratifs à distance garantissent une intégration immédiate et une cadence de livraison transparente.',
  valueParagraph: 'Collaborer avec moi, c\'est faire le choix d\'un expert engagé, capable de traduire vos problématiques métier complexes en solutions d\'intelligence artificielle opérationnelles, mesurables et pérennes, tout en optimisant vos coûts d\'infrastructure.',
  closingParagraph: 'Je serais ravi d\'échanger avec vous lors d\'un entretien en visioconférence pour vous détailler mes réalisations et définir comment je peux accélérer la réussite de vos projets technologiques.',
  signoff: 'Veuillez agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.'
};

export const ADMIN_USER_ID = 'zbc5lYSgQ9bIcKipYER68wbI1Er1';
export const ADMIN_EMAIL = 'abdoulmajidrabiousaley457@gmail.com';
export const CORPORATE_EMAIL = 'contact@danthoss-cabinet.com';
export const ADMIN_EMAILS = [
  'abdoulmajidrabiousaley457@gmail.com',
  'contact@danthoss-cabinet.com',
  'direction@danthoss-cabinet.com',
  'devis@danthoss-cabinet.com',
  'support@danthoss-cabinet.com',
  'rabiou.saley@danthoss-cabinet.com'
];

export const isAdminEmailAddress = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(normalized);
};

const adminDefaultProfile: UserProfile = {
  name: 'Rabiou Saley Abdoul Majid',
  email: CORPORATE_EMAIL,
  phone: '+227 96 49 99 06',
  role: 'Fondateur & Administrateur Référent',
  country: 'Niger / International Remote',
  tier: 'vip_cabinet',
  subscriptionEndDate: '2027-12-31',
  remoteAvailable: true
};

const guestClientDefaultProfile: UserProfile = {
  name: 'Espace Client',
  email: '',
  phone: '',
  role: 'Client & Partenaire',
  country: 'International',
  tier: 'free',
  remoteAvailable: true
};

function buildDefaultClientNotifications(uid: string, clientName: string, clientEmail: string): NotificationItem[] {
  return [
    {
      id: `client_welcome_${uid}`,
      title: `Bienvenue dans votre espace personnel, ${clientName}`,
      message: `Votre compte client (${clientEmail || 'vérifié'}) et votre coffre-fort Client Vault sont isolés et protégés.`,
      time: 'Aujourd\'hui',
      category: 'account',
      read: false,
      audience: 'client',
      recipientUid: uid
    },
    {
      id: `client_vault_ready_${uid}`,
      title: 'Coffre-fort Client Vault opérationnel',
      message: 'Retrouvez vos livrables certifiés ou déposez vos documents confidentiels dans votre coffre-fort personnel.',
      time: 'Actif',
      category: 'cabinet',
      read: true,
      audience: 'client',
      recipientUid: uid
    }
  ];
}

function buildDefaultAdminNotifications(uid: string): NotificationItem[] {
  return [
    {
      id: `admin_mailbox_active_${uid}`,
      title: `Boîte Professionnelle Active • ${CORPORATE_EMAIL}`,
      message: `Supervision administrateur active : tous les messages clients et demandes de devis arrivent en temps réel sur ${CORPORATE_EMAIL}.`,
      time: 'En direct',
      category: 'cabinet',
      read: false,
      audience: 'admin',
      recipientUid: uid
    },
    {
      id: `admin_vault_supervision_${uid}`,
      title: 'Supervision Client Vault & Comptes',
      message: 'Accès Super Admin actif sur les répertoires clients, livrables et demandes de missions.',
      time: 'Actif',
      category: 'remote',
      read: true,
      audience: 'admin',
      recipientUid: uid
    }
  ];
}

function isAdminOnlyNotification(n: NotificationItem): boolean {
  if (n.audience === 'admin') return true;
  if (n.id.startsWith('admin_') || n.id.startsWith('notif_mail_in_')) return true;
  const hay = `${n.title} ${n.message}`.toLowerCase();
  if (
    hay.includes('nouveau message client') ||
    hay.includes('abdoulmajidrabiousaley457@gmail.com') ||
    hay.includes('supervision')
  ) {
    return true;
  }
  return false;
}

function loadScopedNotifications(uid: string, userIsAdmin: boolean, clientName: string, clientEmail: string): NotificationItem[] {
  const storageKey = userIsAdmin
    ? `danthoss_notifs_admin_${uid}`
    : `danthoss_notifs_client_${uid}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (userIsAdmin) {
          return parsed.filter((n: NotificationItem) => n.audience !== 'client');
        }
        const sanitized = parsed.filter(
          (n: NotificationItem) =>
            !isAdminOnlyNotification(n) && (!n.recipientUid || n.recipientUid === uid)
        );
        if (sanitized.length > 0) return sanitized;
      }
    }
  } catch {
    // ignore storage parse error
  }
  return userIsAdmin
    ? buildDefaultAdminNotifications(uid)
    : buildDefaultClientNotifications(uid, clientName, clientEmail);
}

interface UserProfileContextType {
  profile: UserProfile;
  firebaseUser: User | null;
  authLoading: boolean;
  isAdmin: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  loginGoogle: (preferRedirect?: boolean | any) => Promise<UserCredential | null>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  registerEmail: (email: string, pass: string, name?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  saveCVToFirestore: (title?: string) => Promise<boolean>;
  notifications: NotificationItem[];
  unreadCount: number;
  unreadEmailsCount: number;
  cvData: CVData;
  coverLetterData: CoverLetterData;
  activeLanguage: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  updateCVData: (partial: Partial<CVData>) => void;
  updateCoverLetterData: (partial: Partial<CoverLetterData>) => void;
  upgradeSubscription: (tier: SubscriptionTier) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetCVToDefault: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>(guestClientDefaultProfile);

  const [cvData, setCVData] = useState<CVData>(() => {
    const saved = localStorage.getItem('danthoss_cabinet_cv');
    return saved ? JSON.parse(saved) : initialCVData;
  });

  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(() => {
    const saved = localStorage.getItem('danthoss_cabinet_cover_letter');
    return saved ? JSON.parse(saved) : initialCoverLetterData;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadEmailsCount, setUnreadEmailsCount] = useState<number>(0);

  const knownMailIdsRef = React.useRef<Set<string>>(new Set());
  const mailInitialLoadedRef = React.useRef<boolean>(false);
  const knownVaultIdsRef = React.useRef<Set<string>>(new Set());
  const vaultInitialLoadedRef = React.useRef<boolean>(false);
  const knownDevisIdsRef = React.useRef<Set<string>>(new Set());
  const devisInitialLoadedRef = React.useRef<boolean>(false);

  const [activeLanguage, setActiveLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('mydanthoss_lang') as AppLanguage) || 'fr';
  });

  const isAdmin = Boolean(
    firebaseUser && (firebaseUser.uid === ADMIN_USER_ID || isAdminEmailAddress(firebaseUser.email))
  );

  const setActiveLanguage = (lang: AppLanguage) => {
    setActiveLanguageState(lang);
    localStorage.setItem('mydanthoss_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    window.dispatchEvent(new CustomEvent('language-change', { detail: lang }));
  };

  useEffect(() => {
    const handleLangChange = (e: any) => {
      if (e.detail && e.detail !== activeLanguage) {
        setActiveLanguageState(e.detail);
      }
    };
    window.addEventListener('language-change', handleLangChange);
    return () => window.removeEventListener('language-change', handleLangChange);
  }, [activeLanguage]);

  // Persist notifications strictly under per-UID + per-role key
  useEffect(() => {
    if (!firebaseUser) return;
    const storageKey = isAdmin
      ? `danthoss_notifs_admin_${firebaseUser.uid}`
      : `danthoss_notifs_client_${firebaseUser.uid}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(notifications.slice(0, 60)));
    } catch {
      // ignore quota
    }
  }, [notifications, firebaseUser, isAdmin]);

  // Listen to Firebase Auth state & isolate profile + notifications per user
  useEffect(() => {
    // Cleanup legacy shared profile key so old admin email never leaks across sessions
    try {
      localStorage.removeItem('danthoss_cabinet_profile');
      localStorage.removeItem('danthoss_admin_auth_tools');
    } catch {}

    checkRedirectAuthResult()
      .then((res) => {
        if (res && res.user) {
          setAuthError(null);
        }
      })
      .catch((err: any) => {
        console.warn('Redirect auth check notice:', err);
        const code = err?.code || '';
        if (code === 'auth/unauthorized-domain') {
          const host = typeof window !== 'undefined' ? window.location.hostname : 'votre domaine';
          setAuthError(`Le domaine "${host}" n'est pas encore autorisé dans Firebase Console.`);
        } else if (code === 'auth/operation-not-allowed') {
          setAuthError('Le fournisseur Google est désactivé dans votre console Firebase (Authentication > Sign-in method).');
        } else if (err?.message) {
          setAuthError(`Erreur d'authentification Google : ${err.message}`);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Reset per-session tracking refs immediately on user change
      knownMailIdsRef.current.clear();
      mailInitialLoadedRef.current = false;
      knownVaultIdsRef.current.clear();
      vaultInitialLoadedRef.current = false;
      knownDevisIdsRef.current.clear();
      devisInitialLoadedRef.current = false;
      setUnreadEmailsCount(0);

      setFirebaseUser(user);
      setAuthLoading(false);

      if (user) {
        setAuthError(null);
        const userIsAdmin = user.uid === ADMIN_USER_ID || isAdminEmailAddress(user.email);
        const fallbackClientName =
          user.displayName || (user.email ? user.email.split('@')[0] : 'Client Danthoss');

        // Immediately hydrate scoped profile & notifications before async Firestore round-trip
        const initialScopedProfile: UserProfile = userIsAdmin
          ? {
              ...adminDefaultProfile,
              name: user.displayName || adminDefaultProfile.name,
              email: user.email || CORPORATE_EMAIL
            }
          : {
              ...guestClientDefaultProfile,
              name: fallbackClientName,
              email: user.email || ''
            };

        try {
          const cachedProfileRaw = localStorage.getItem(`danthoss_profile_${user.uid}`);
          if (cachedProfileRaw) {
            const cachedProfile = JSON.parse(cachedProfileRaw) as UserProfile;
            setProfile({
              ...initialScopedProfile,
              ...cachedProfile,
              email: userIsAdmin
                ? user.email || cachedProfile.email || CORPORATE_EMAIL
                : user.email || (!isAdminEmailAddress(cachedProfile.email) ? cachedProfile.email : '')
            });
          } else {
            setProfile(initialScopedProfile);
          }
        } catch {
          setProfile(initialScopedProfile);
        }

        setNotifications(
          loadScopedNotifications(user.uid, userIsAdmin, fallbackClientName, user.email || '')
        );

        // Sync or fetch profile from Firestore without contaminating client accounts with admin data
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            const cleanStoredEmail =
              !userIsAdmin && isAdminEmailAddress(data.email) ? user.email || '' : data.email;
            const cleanStoredName =
              !userIsAdmin && data.name === adminDefaultProfile.name ? fallbackClientName : data.name;
            const cleanStoredPhone =
              !userIsAdmin && data.phone === adminDefaultProfile.phone ? '' : data.phone || '';

            const nextProfile: UserProfile = {
              name: userIsAdmin
                ? data.name || user.displayName || adminDefaultProfile.name
                : cleanStoredName || fallbackClientName,
              email: userIsAdmin
                ? user.email || data.email || CORPORATE_EMAIL
                : user.email || cleanStoredEmail || '',
              phone: userIsAdmin ? data.phone || adminDefaultProfile.phone : cleanStoredPhone,
              tier: userIsAdmin ? 'vip_cabinet' : data.tier || 'free',
              role: userIsAdmin
                ? data.role || 'Fondateur & Administrateur Référent'
                : data.role && !data.role.includes('Agents IA') && !data.role.includes('Administrateur')
                ? data.role
                : 'Client & Partenaire',
              country: data.country || (userIsAdmin ? adminDefaultProfile.country : 'International'),
              bio: data.bio || undefined,
              subscriptionEndDate: userIsAdmin ? '2027-12-31' : data.subscriptionEndDate,
              remoteAvailable: true
            };

            setProfile(nextProfile);
            try {
              localStorage.setItem(`danthoss_profile_${user.uid}`, JSON.stringify(nextProfile));
            } catch {}
          } else {
            const initialDoc = {
              id: user.uid,
              name: userIsAdmin ? user.displayName || adminDefaultProfile.name : fallbackClientName,
              email: user.email || (userIsAdmin ? CORPORATE_EMAIL : ''),
              phone: userIsAdmin ? adminDefaultProfile.phone : '',
              tier: userIsAdmin ? ('vip_cabinet' as SubscriptionTier) : ('free' as SubscriptionTier),
              role: userIsAdmin ? 'Fondateur & Administrateur Référent' : 'Client & Partenaire',
              country: userIsAdmin ? 'Niger / International' : 'International',
              updatedAt: new Date().toISOString()
            };
            const nextProfile: UserProfile = {
              name: initialDoc.name,
              email: initialDoc.email,
              phone: initialDoc.phone,
              tier: initialDoc.tier,
              role: initialDoc.role,
              country: initialDoc.country,
              remoteAvailable: true
            };
            setProfile(nextProfile);
            try {
              localStorage.setItem(`danthoss_profile_${user.uid}`, JSON.stringify(nextProfile));
            } catch {}
            await setDoc(userDocRef, initialDoc);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setProfile(guestClientDefaultProfile);
        setNotifications([]);
        setUnreadEmailsCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginGoogle = async (preferRedirect?: boolean | any) => {
    try {
      setAuthError(null);
      const shouldRedirect = typeof preferRedirect === 'boolean' ? preferRedirect : false;
      const res = await loginWithGoogle(shouldRedirect);
      if (res && res.user) {
        setFirebaseUser(res.user);
      }
      return res;
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'votre domaine';
        setAuthError(`Le domaine "${host}" n'est pas encore autorisé dans Firebase Console.`);
      } else if (code === 'auth/operation-not-allowed') {
        setAuthError('Le fournisseur Google est désactivé dans votre console Firebase.');
      }
      throw err;
    }
  };

  const loginEmail = async (email: string, pass: string) => {
    setAuthError(null);
    await loginWithEmail(email, pass);
  };

  const registerEmail = async (email: string, pass: string, name?: string) => {
    setAuthError(null);
    await registerWithEmail(email, pass, name);
  };

  const sendPasswordReset = async (email: string) => {
    setAuthError(null);
    await resetPassword(email);
  };

  const logout = async () => {
    try {
      setNotifications([]);
      setUnreadEmailsCount(0);
      setProfile(guestClientDefaultProfile);
      await logoutUser();
    } catch (err) {
      console.warn('Logout notice:', err);
      throw err;
    }
  };

  const saveCVToFirestore = async (customTitle?: string): Promise<boolean> => {
    if (!firebaseUser) {
      const msg = 'Veuillez vous connecter (par Email/Mot de passe ou Google) pour sauvegarder votre CV dans Firebase Cloud.';
      setAuthError(msg);
      return false;
    }

    const cvId = `cv_${Date.now()}`;
    const cvDocRef = doc(db, 'users', firebaseUser.uid, 'savedCVs', cvId);
    try {
      await setDoc(cvDocRef, {
        id: cvId,
        userId: firebaseUser.uid,
        title: customTitle || `${cvData.fullName} - ${cvData.jobTitle}`,
        templateId: cvData.templateId,
        accentColor: cvData.accentColor,
        cvData: cvData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const newNotif: NotificationItem = {
        id: `cv_save_${Date.now()}`,
        title: 'Votre CV a été sauvegardé dans le Cloud',
        message: `Le document "${cvData.jobTitle}" est enregistré dans votre espace personnel.`,
        time: 'À l\'instant',
        category: 'career',
        read: false,
        audience: isAdmin ? 'admin' : 'client',
        recipientUid: firebaseUser.uid
      };
      setNotifications((prev) => [newNotif, ...prev]);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}/savedCVs/${cvId}`);
      return false;
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      try {
        localStorage.setItem(`danthoss_profile_${firebaseUser.uid}`, JSON.stringify(profile));
      } catch {}
    }
  }, [profile, firebaseUser]);

  useEffect(() => {
    localStorage.setItem('danthoss_cabinet_cv', JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem('danthoss_cabinet_cover_letter', JSON.stringify(coverLetterData));
  }, [coverLetterData]);

  // Strict visible notifications filtered for the active user & role
  const visibleNotifications = useMemo(() => {
    if (!firebaseUser) return [];
    if (isAdmin) {
      return notifications.filter((n) => n.audience !== 'client');
    }
    return notifications.filter(
      (n) => !isAdminOnlyNotification(n) && (!n.recipientUid || n.recipientUid === firebaseUser.uid)
    );
  }, [notifications, firebaseUser, isAdmin]);

  const unreadCount = visibleNotifications.filter((n) => !n.read).length;

  const updateProfile = async (partial: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...partial };
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), {
          id: firebaseUser.uid,
          name: updated.name,
          email: updated.email,
          phone: updated.phone || '',
          tier: updated.tier,
          role: updated.role,
          country: updated.country,
          bio: updated.bio || '',
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`);
        });
      }
      return updated;
    });
  };

  const updateCVData = (partial: Partial<CVData>) => {
    setCVData((prev) => ({ ...prev, ...partial }));
  };

  const updateCoverLetterData = (partial: Partial<CoverLetterData>) => {
    setCoverLetterData((prev) => ({ ...prev, ...partial }));
  };

  const upgradeSubscription = (tier: SubscriptionTier) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        tier,
        subscriptionEndDate: '2027-12-31'
      };
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), {
          tier,
          subscriptionEndDate: '2027-12-31',
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`);
        });
      }
      return updated;
    });

    if (firebaseUser) {
      const newNotif: NotificationItem = {
        id: `sub_${Date.now()}`,
        title: `Abonnement ${tier === 'vip_cabinet' ? 'Cabinet VIP & Mentorat' : 'Plan Pro'} Activé !`,
        message: 'Vos fonctionnalités premium et exports illimités sont désormais actifs sur votre compte.',
        time: 'À l\'instant',
        category: 'account',
        read: false,
        audience: isAdmin ? 'admin' : 'client',
        recipientUid: firebaseUser.uid
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetCVToDefault = () => {
    setCVData(initialCVData);
    setCoverLetterData(initialCoverLetterData);
  };

  // Real-time email counter & role-isolated notifications
  useEffect(() => {
    if (!firebaseUser) {
      setUnreadEmailsCount(0);
      return;
    }

    const uid = firebaseUser.uid;
    const myEmail = (firebaseUser.email || '').trim().toLowerCase();

    const unsub = subscribeToCorporateMailbox({
      userUid: uid,
      userEmail: myEmail,
      isAdmin,
      onMessages: (msgs) => {
        if (isAdmin) {
          // ADMIN ONLY: corporate inbox unread count & inbound client email notifications
          const unreadInbox = msgs.filter((m) => m.folder === 'inbox' && !m.read);
          setUnreadEmailsCount(unreadInbox.length);

          if (mailInitialLoadedRef.current) {
            for (const m of unreadInbox) {
              if (!knownMailIdsRef.current.has(m.id)) {
                const adminAlertId = `admin_mail_${m.id}`;
                setNotifications((prev) => {
                  if (prev.some((p) => p.id === adminAlertId)) return prev;
                  return [
                    {
                      id: adminAlertId,
                      title: `Nouveau message client • ${CORPORATE_EMAIL}`,
                      message: `De ${m.fromName} (${m.fromEmail}) : "${m.subject}"`,
                      time: 'À l\'instant',
                      category: 'cabinet',
                      read: false,
                      audience: 'admin',
                      recipientUid: uid
                    },
                    ...prev
                  ];
                });
              }
            }
          }
          msgs.forEach((m) => knownMailIdsRef.current.add(m.id));
          mailInitialLoadedRef.current = true;
        } else {
          // CLIENT ONLY: strictly replies sent BY the Cabinet TO this specific client's email
          if (!myEmail || isAdminEmailAddress(myEmail)) {
            setUnreadEmailsCount(0);
            return;
          }

          const unreadReplies = msgs.filter(
            (m) =>
              m.folder === 'sent' &&
              m.toEmail.toLowerCase() === myEmail &&
              isCorporateAddress(m.fromEmail) &&
              !m.read
          );
          setUnreadEmailsCount(unreadReplies.length);

          if (mailInitialLoadedRef.current) {
            for (const m of unreadReplies) {
              if (!knownMailIdsRef.current.has(m.id)) {
                const clientReplyNotifId = `client_reply_${m.id}`;
                setNotifications((prev) => {
                  if (prev.some((p) => p.id === clientReplyNotifId)) return prev;
                  return [
                    {
                      id: clientReplyNotifId,
                      title: 'Nouvelle réponse du Cabinet Danthoss',
                      message: `Objet : "${m.subject}" — Consultez votre espace messages pour lire la réponse.`,
                      time: 'À l\'instant',
                      category: 'cabinet',
                      read: false,
                      audience: 'client',
                      recipientUid: uid
                    },
                    ...prev
                  ];
                });
              }
            }
          }
          msgs.forEach((m) => knownMailIdsRef.current.add(m.id));
          mailInitialLoadedRef.current = true;
        }
      }
    });

    return () => unsub();
  }, [firebaseUser, isAdmin]);

  // Real-time personal Client notifications for their own Vault deliverables & their own Devis
  useEffect(() => {
    if (!firebaseUser || isAdmin) return;

    const uid = firebaseUser.uid;
    const myEmail = (firebaseUser.email || '').trim().toLowerCase();
    const unsubs: Array<() => void> = [];

    // 1. Personal Client Vault listener (/users/{uid}/vaultFiles)
    const unsubVault = onSnapshot(
      collection(db, 'users', uid, 'vaultFiles'),
      (snap) => {
        if (vaultInitialLoadedRef.current) {
          snap.docChanges().forEach((change) => {
            if (change.type === 'added' && !knownVaultIdsRef.current.has(change.doc.id)) {
              const fileData = change.doc.data() as any;
              const notifId = `client_vault_file_${change.doc.id}`;
              setNotifications((prev) => {
                if (prev.some((p) => p.id === notifId)) return prev;
                return [
                  {
                    id: notifId,
                    title: 'Nouveau document dans votre Coffre-fort',
                    message: `Le fichier "${fileData.name || 'Livrable'}" est disponible dans votre espace Client Vault.`,
                    time: 'À l\'instant',
                    category: 'cabinet',
                    read: false,
                    audience: 'client',
                    recipientUid: uid
                  },
                  ...prev
                ];
              });
            }
          });
        }
        snap.forEach((d) => knownVaultIdsRef.current.add(d.id));
        vaultInitialLoadedRef.current = true;
      },
      () => {}
    );
    unsubs.push(unsubVault);

    // 2. Personal Client Devis listener (/devisRequests where clientEmail == myEmail)
    if (myEmail && !isAdminEmailAddress(myEmail)) {
      const qDevis = query(
        collection(db, 'devisRequests'),
        where('clientEmail', '==', myEmail)
      );
      const unsubDevis = onSnapshot(
        qDevis,
        (snap) => {
          if (devisInitialLoadedRef.current) {
            snap.docChanges().forEach((change) => {
              if (change.type === 'added' && !knownDevisIdsRef.current.has(change.doc.id)) {
                const qData = change.doc.data() as any;
                const notifId = `client_devis_${change.doc.id}`;
                setNotifications((prev) => {
                  if (prev.some((p) => p.id === notifId)) return prev;
                  return [
                    {
                      id: notifId,
                      title: 'Votre demande de devis a bien été transmise',
                      message: `Estimation enregistrée (${(qData.estimatedCostEUR || 0).toLocaleString('fr-FR')} €). Le Cabinet vous répondra sur ${myEmail}.`,
                      time: 'À l\'instant',
                      category: 'remote',
                      read: false,
                      audience: 'client',
                      recipientUid: uid
                    },
                    ...prev
                  ];
                });
              }
            });
          }
          snap.forEach((d) => knownDevisIdsRef.current.add(d.id));
          devisInitialLoadedRef.current = true;
        },
        () => {}
      );
      unsubs.push(unsubDevis);
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [firebaseUser, isAdmin]);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        firebaseUser,
        authLoading,
        isAdmin,
        authError,
        setAuthError,
        loginGoogle,
        loginEmail,
        registerEmail,
        sendPasswordReset,
        logout,
        saveCVToFirestore,
        notifications: visibleNotifications,
        unreadCount,
        unreadEmailsCount,
        cvData,
        coverLetterData,
        activeLanguage,
        setLanguage: setActiveLanguage,
        updateProfile,
        updateCVData,
        updateCoverLetterData,
        upgradeSubscription,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetCVToDefault,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
