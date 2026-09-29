import { CabinetService, PortfolioProject, CabinetPillar } from '../types';

export const CABINET_INFO = {
  name: 'Cabinet d\'Expertise Rabiou Saley',
  fullName: 'Rabiou Saley Abdoul Majid',
  title: 'Consultant Expert Data Science & Concepteur d\'Agents IA Autonomes',
  statusBadge: '🟢 Disponible pour missions en Télétravail International (Full Remote)',
  email: 'abdoulmajidrabiousaley457@gmail.com',
  phone: '+227 96 49 99 06',
  whatsappUrl: 'https://wa.me/22796499906?text=Bonjour%20Cabinet%20Rabiou%20Saley%2C%20je%20souhaite%20collaborer%20avec%20vous%20sur%20un%20projet%20en%20t%C3%A9l%C3%A9travail',
  whatsappRaw: '+22796499906',
  twitterUrl: 'https://x.com/RabiousaleyM',
  linkedinUrl: 'https://www.linkedin.com/in/rabiou-saley-abdoul-majid-b1746b425',
  githubUrl: 'https://github.com/abdoulmajidrabiousaley457-cmd',
  portfolioOfficialUrl: 'https://mon-portfolio-fin-ten.vercel.app/',
  omniAgentUrl: 'https://omni-studio-abdoul.ai.studio',
  portfolioStudioUrl: 'https://rabiou-saley-abdoul-majid-data-science-agent-ia.ai.studio/',
  location: 'Niamey, Niger / Mobilité Télétravail (Europe, Afrique, Amérique du Nord)',
  timezone: 'GMT+1 (West Africa Time) / Alignement UTC, CET, EST',
  bio: 'Ingénieur & Consultant passionné par la résolution de problématiques complexes grâce à l\'Intelligence Artificielle de pointe. Spécialisé dans l\'architecture de systèmes multi-agents autonomes, l\'industrialisation de modèles prédictifs et les pipelines MLOps robustes livrés à 100% en télétravail avec rigueur, sécurité et cadence agile.',
  stats: {
    experienceYears: '5+',
    projectsDelivered: '38+',
    remoteClientsCount: '18+',
    clientSatisfaction: '99.4%',
    codeCommits: '1.2k+'
  }
};

export const CABINET_SERVICES: CabinetService[] = [
  {
    id: 'srv_agents_ia',
    title: 'Agents IA Autonomes & Systèmes Multi-Agents',
    subtitle: 'Automatisation intelligente des processus métier avec RAG vectoriel',
    description: 'Conception et orchestration d\'agents autonomes capables de raisonner, d\'exécuter des outils externes (APIs, bases de données, CRM), et de collaborer pour automatiser des tâches à forte valeur ajoutée.',
    iconName: 'Bot',
    deliverables: [
      'Pipelines RAG hybrides (vecteurs + recherche sémantique & BM25)',
      'Orchestration multi-agents via LangGraph, CrewAI & AutoGen',
      'Intégration d\'APIs LLM (Gemini 2.5 Flash/Pro, Claude 3.5, GPT-4o)',
      'Interface utilisateur temps réel avec streaming et gestion de mémoire'
    ],
    tools: ['LangGraph', 'CrewAI', 'FastAPI', 'ChromaDB', 'Gemini API', 'Docker'],
    remoteTimeline: '2 à 6 semaines',
    hourlyRate: '45 €/h - 60 €/h',
    featured: true
  },
  {
    id: 'srv_ml_predictif',
    title: 'Data Science & Machine Learning Prédictif',
    subtitle: 'Modélisation statistique de pointe, scoring et détection de fraudes',
    description: 'Transformation de vos données brutes en modèles prédictifs fiables. Analyse exploratoire approfondie, feature engineering sophistiqué et explicabilité des décisions (SHAP/LIME).',
    iconName: 'TrendingUp',
    deliverables: [
      'Modèles de prédiction d\'attrition (Customer Churn) et scoring d\'octroi',
      'Prévision de séries temporelles (ventes, trésorerie, stocks)',
      'Détection d\'anomalies et systèmes de recommandation personnalisés',
      'Tableaux de bord d\'interprétabilité pour les comités de direction'
    ],
    tools: ['Python', 'Scikit-Learn', 'XGBoost', 'LightGBM', 'Polars', 'SHAP'],
    remoteTimeline: '3 à 8 semaines',
    hourlyRate: '40 €/h - 55 €/h',
    featured: true
  },
  {
    id: 'srv_nlp_vision',
    title: 'NLP & Computer Vision (Extraction de Documents)',
    subtitle: 'Analyse automatique de textes, contrats et pièces d\'identité/factures',
    description: 'Automatisation du traitement des documents volumineux : OCR intelligent, classification automatique de pièces justificatives, extraction d\'entités nommées (NER) et conformité RGPD.',
    iconName: 'Eye',
    deliverables: [
      'Pipelines OCR et extraction d\'informations structurées (JSON)',
      'Analyse de sentiment et classification automatique de tickets clients',
      'Systèmes de détection d\'objets et contrôle qualité visuel',
      'Anonymisation automatique de données sensibles et confidentielles'
    ],
    tools: ['PyTorch', 'Transformers', 'LayoutLM', 'Spacy', 'OpenCV', 'Tesseract'],
    remoteTimeline: '2 à 5 semaines',
    hourlyRate: '45 €/h - 60 €/h',
    featured: false
  },
  {
    id: 'srv_mlops_remote',
    title: 'MLOps, Déploiement Cloud & Télétravail Sécurisé',
    subtitle: 'Industrialisation de vos modèles en production continue',
    description: 'Mise en production de modèles conteneurisés avec CI/CD automatisé, monitoring de dérive des données (Data Drift) et haute disponibilité sur le Cloud.',
    iconName: 'CloudLightning',
    deliverables: [
      'APIs REST ultra-rapides et documentées sous FastAPI',
      'Conteneurisation Docker et orchestration micro-services',
      'Déploiement Cloud Run / AWS / Kubernetes avec mise à l\'échelle automatique',
      'Monitoring temps réel des performances et alertes automatiques'
    ],
    tools: ['FastAPI', 'Docker', 'Google Cloud (GCP)', 'AWS', 'GitHub Actions', 'Prometheus'],
    remoteTimeline: '1 à 4 semaines',
    hourlyRate: '50 €/h - 65 €/h',
    featured: true
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'p1',
    title: 'NexusAgent - Multi-Agents RAG Juridique & Financier',
    category: 'agents_ia',
    summary: 'Système d\'agents IA collaboratifs pour l\'analyse automatisée de contrats complexes, clauses à risques et conformité réglementaire.',
    challenge: 'Les cabinets d\'audit et directions juridiques perdaient des dizaines d\'heures à comparer manuellement des liasses contractuelles de plus de 200 pages.',
    solution: 'Architecture multi-agents basée sur LangGraph, combinant un agent extracteur, un agent juriste vérificateur et un agent de synthèse avec recherche sémantique vectorielle hybride.',
    metrics: [
      { label: 'Temps d\'audit', value: '-75%' },
      { label: 'Précision d\'extraction', value: '98.6%' },
      { label: 'Contrats analysés', value: '1,500+' }
    ],
    technologies: ['LangGraph', 'Gemini Pro', 'FastAPI', 'ChromaDB', 'Docker'],
    isRemoteDelivery: true,
    completionYear: '2024'
  },
  {
    id: 'p2',
    title: 'PredictChurn B2B - Moteur de Rétention Client',
    category: 'data_science',
    summary: 'Modèle de Machine Learning prédictif prédisant l\'attrition des comptes clients clés 60 jours avant leur résiliation.',
    challenge: 'Un client SaaS B2B subissait des pertes imprévues sur ses contrats annuels sans signaux avant-coureurs identifiés.',
    solution: 'Création d\'un pipeline de feature engineering sur l\'activité des utilisateurs, modélisation XGBoost calibrée et tableau de bord SHAP interactif pour les équipes de Customer Success.',
    metrics: [
      { label: 'Score F1', value: '0.91' },
      { label: 'Clients sauvés', value: '+34%' },
      { label: 'ROI annuel', value: '180 k€' }
    ],
    technologies: ['Python', 'XGBoost', 'SHAP', 'PostgreSQL', 'Streamlit'],
    isRemoteDelivery: true,
    completionYear: '2023'
  },
  {
    id: 'p3',
    title: 'SmartDoc Vision OCR - Traitement Intelligent de Factures',
    category: 'computer_vision',
    summary: 'Pipeline de reconnaissance optique et d\'extraction sémantique pour automatiser la saisie comptable en entreprise.',
    challenge: 'Les factures multilingues au format PDF ou photographiées présentaient des formats hétérogènes impossibles à parser par de simples expressions régulières.',
    solution: 'Modèle multimodal LayoutLMv3 combinant vision spatiale et compréhension linguistique fine, renvoyant un schéma JSON validé par Pydantic.',
    metrics: [
      { label: 'Temps de saisie', value: '1.2s / doc' },
      { label: 'Exactitude des totaux', value: '99.8%' },
      { label: 'Économie hebdo', value: '22h' }
    ],
    technologies: ['PyTorch', 'LayoutLMv3', 'FastAPI', 'OpenCV', 'Pydantic'],
    isRemoteDelivery: true,
    completionYear: '2024'
  },
  {
    id: 'p4',
    title: 'Agent Conversationnel & Qualification de Leads B2B',
    category: 'agents_ia',
    summary: 'Assistant IA autonome qualifiant les demandes entrantes 24/7 et synchronisant directement l\'agenda et le CRM commercial.',
    challenge: 'Des leads chauds se perdaient la nuit et les week-ends sans réponse personnalisée immédiate.',
    solution: 'Agent IA interconnecté via Webhooks avec Hubspot et Google Calendar, doté de garde-fous de politesse et de qualification par scoring.',
    metrics: [
      { label: 'Taux de conversion', value: '+28%' },
      { label: 'Délai de prise de RDV', value: '< 2 min' },
      { label: 'Disponibilité', value: '99.9%' }
    ],
    technologies: ['CrewAI', 'LangChain', 'Next.js', 'FastAPI', 'HubSpot API'],
    isRemoteDelivery: true,
    completionYear: '2023'
  }
];

export const CABINET_PILLARS: CabinetPillar[] = [
  {
    title: 'Pratique Éprouvée du Télétravail International',
    description: 'Organisation rigoureuse en remote : réunions de cadrage en visio, standups hebdomadaires, documentation exhaustive et communication asynchrone transparente.',
    icon: 'Laptop',
    stats: '100% Remote Ready'
  },
  {
    title: 'Sécurité & Confidentialité des Données',
    description: 'Signature de contrat de non-divulgation (NDA) strict, respect scrupuleux du RGPD, chiffrement des transferts et travail sous environnement sécurisé (VPN, tokens secrets).',
    icon: 'ShieldCheck',
    stats: 'NDA & RGPD Conforme'
  },
  {
    title: 'Excellence Technique & Code Propre',
    description: 'Chaque ligne de code est testée, typée, conteneurisée et prête pour le déploiement continu. Architecture modulaire facilitant la reprise par vos équipes.',
    icon: 'Code',
    stats: 'Clean Code & MLOps'
  },
  {
    title: 'Accompagnement & Transfert de Compétences',
    description: 'Au-delà de la livraison, le cabinet forme vos collaborateurs, fournit des guides d\'utilisation clairs et assure le support post-déploiement.',
    icon: 'GraduationCap',
    stats: 'Formation Incluse'
  }
];

export const REMOTE_METHODOLOGY_STEPS = [
  {
    step: '01',
    title: 'Cadrage & Briefing Vidéo',
    desc: 'Visio de 45 minutes pour analyser vos besoins, vos données et vos objectifs stratégiques. Validation du cahier des charges et du calendrier.'
  },
  {
    step: '02',
    title: 'Proposition & Accord NDA',
    desc: 'Devis détaillé au forfait ou taux journalier avec jalons mesurables et signature de l\'accord de confidentialité.'
  },
  {
    step: '03',
    title: 'Développement & Sprints Hebdomadaires',
    desc: 'Démonstrations intermédiaires chaque semaine via GitHub / Slack / Teams. Vos retours sont intégrés en continu sans surprise.'
  },
  {
    step: '04',
    title: 'Recette, Déploiement & Formation',
    desc: 'Mise en production sécurisée, remise des accès complets, documentation technique et session de formation pour vos équipes.'
  }
];
