import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, NotificationItem, CVData, CoverLetterData, SubscriptionTier, AppLanguage } from '../types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, handleFirestoreError, OperationType } from '../services/firebase';

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
      year: '2019 - 2021',
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

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Disponibilité Télétravail Confirmée',
    message: 'Le Cabinet Rabiou Saley est ouvert aux nouvelles missions en télétravail international pour ce trimestre.',
    time: 'Il y a 10m',
    category: 'remote',
    read: false,
  },
  {
    id: 'n2',
    title: 'Studio CV & Lettre de Motivation Pro Actif',
    message: '4 modèles de CV professionnels certifiés ATS et un générateur de lettre de motivation sont prêts à l\'emploi.',
    time: 'Il y a 1h',
    category: 'career',
    read: false,
  },
  {
    id: 'n3',
    title: 'Nouveau projet IA au Portfolio',
    message: 'Découvrez NexusAgent, l\'architecture multi-agents RAG juridique & financière documentée sur le portfolio.',
    time: 'Il y a 4h',
    category: 'cabinet',
    read: true,
  },
  {
    id: 'n4',
    title: 'Abonnement & Outils Carrière',
    message: 'Passez au Plan Pro pour exporter des CVs illimités et bénéficier de l\'audit ATS IA de votre profil.',
    time: 'Il y a 1j',
    category: 'account',
    read: true,
  }
];

const defaultProfile: UserProfile = {
  name: 'Rabiou Saley Abdoul Majid',
  email: 'abdoulmajidrabiousaley457@gmail.com',
  phone: '+227 96 49 99 06',
  role: 'Expert Consultant Data Science & Concepteur d\'Agents IA',
  country: 'Niger / International Remote',
  tier: 'pro',
  subscriptionEndDate: '2027-12-31',
  remoteAvailable: true,
};

interface UserProfileContextType {
  profile: UserProfile;
  firebaseUser: User | null;
  authLoading: boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveCVToFirestore: (title?: string) => Promise<boolean>;
  notifications: NotificationItem[];
  unreadCount: number;
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

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('danthoss_cabinet_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [cvData, setCVData] = useState<CVData>(() => {
    const saved = localStorage.getItem('danthoss_cabinet_cv');
    return saved ? JSON.parse(saved) : initialCVData;
  });

  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(() => {
    const saved = localStorage.getItem('danthoss_cabinet_cover_letter');
    return saved ? JSON.parse(saved) : initialCoverLetterData;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeLanguage, setActiveLanguage] = useState<AppLanguage>('fr');

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);

      if (user) {
        // Sync or fetch profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfile((prev) => ({
              ...prev,
              name: data.name || user.displayName || prev.name,
              email: data.email || user.email || prev.email,
              tier: data.tier || (user.email === 'abdoulmajidrabiousaley457@gmail.com' ? 'vip_cabinet' : prev.tier),
              role: data.role || prev.role,
              country: data.country || prev.country
            }));
          } else {
            // Create user document in Firestore
            const initialDoc = {
              id: user.uid,
              name: user.displayName || profile.name,
              email: user.email || profile.email,
              tier: user.email === 'abdoulmajidrabiousaley457@gmail.com' ? 'vip_cabinet' : profile.tier,
              role: profile.role,
              country: profile.country,
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, initialDoc);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const saveCVToFirestore = async (customTitle?: string): Promise<boolean> => {
    if (!firebaseUser) {
      alert('Veuillez vous connecter avec votre compte Google pour sauvegarder dans Firebase.');
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
        title: 'CV sauvegardé dans Firebase Cloud',
        message: `Votre CV "${cvData.jobTitle}" a été synchronisé avec succès dans votre base de données.`,
        time: 'À l\'instant',
        category: 'career',
        read: false
      };
      setNotifications((prev) => [newNotif, ...prev]);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}/savedCVs/${cvId}`);
      return false;
    }
  };

  useEffect(() => {
    localStorage.setItem('danthoss_cabinet_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('danthoss_cabinet_cv', JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem('danthoss_cabinet_cover_letter', JSON.stringify(coverLetterData));
  }, [coverLetterData]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const updateProfile = async (partial: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...partial };
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), {
          id: firebaseUser.uid,
          name: updated.name,
          email: updated.email,
          tier: updated.tier,
          role: updated.role,
          country: updated.country,
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

    const newNotif: NotificationItem = {
      id: `sub_${Date.now()}`,
      title: `Abonnement ${tier === 'vip_cabinet' ? 'Cabinet VIP & Mentorat' : 'Plan Pro'} Activé !`,
      message: 'Toutes les fonctionnalités premium du cabinet, exports illimités et outils d\'audit sont désormais débloqués.',
      time: 'À l\'instant',
      category: 'account',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
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

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        firebaseUser,
        authLoading,
        loginGoogle,
        logout,
        saveCVToFirestore,
        notifications,
        unreadCount,
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
