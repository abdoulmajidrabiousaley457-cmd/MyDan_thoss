import { CVData } from '../types';
import { initialCVData } from '../context/UserProfileContext';

export interface CVPresetItem {
  id: string;
  title: string;
  subtitle: string;
  roleCategory: 'ia_ml' | 'mlops_cloud' | 'bi_data' | 'fullstack_ai' | 'management_agile';
  badge: string;
  description: string;
  accentColor: string;
  templateId: 'ai_data_engineer' | 'executive_remote' | 'minimal_tech' | 'academic_research';
  cvData: CVData;
}

export const CV_PRESETS: CVPresetItem[] = [
  {
    id: 'preset_rabiousaley_ia',
    title: 'Rabiou Saley - Consultant Senior Data Science & Agents IA',
    subtitle: 'Modèle officiel du cabinet optimisé pour missions en Télétravail International',
    roleCategory: 'ia_ml',
    badge: '⭐ Modèle Officiel Cabinet',
    description: 'Profil complet avec 5+ ans d\'expérience, orchestration multi-agents (LangGraph, CrewAI), pipelines RAG et modèles prédictifs à fort ROI.',
    accentColor: '#16A34A',
    templateId: 'ai_data_engineer',
    cvData: initialCVData
  },
  {
    id: 'preset_mlops_cloud',
    title: 'Sarah Traoré - Lead Ingénieur MLOps & Architecture Cloud Data',
    subtitle: 'Spécialiste de l\'industrialisation des modèles en production continue (Full Remote)',
    roleCategory: 'mlops_cloud',
    badge: 'Cloud & Infrastructure',
    description: 'Orienté conteneurisation Docker/Kubernetes, CI/CD MLflow, déploiement sur Google Cloud et AWS avec haute disponibilité.',
    accentColor: '#0284C7',
    templateId: 'minimal_tech',
    cvData: {
      fullName: 'Sarah Traoré',
      jobTitle: 'Lead Ingénieure MLOps & Architecte Cloud Data',
      email: 'sarah.traore.mlops@example.com',
      phone: '+221 77 890 12 34',
      location: 'Dakar, Sénégal / Télétravail International (Fuseaux UTC/CET)',
      portfolioUrl: 'https://sarah-traore-mlops.dev',
      linkedinUrl: 'https://linkedin.com/in/sarah-traore-mlops',
      githubUrl: 'https://github.com/sarah-traore-cloud',
      remoteStatus: 'Full Remote Ready',
      bioSummary: 'Ingénieure MLOps Senior cumulant 6 ans d\'expérience dans l\'industrialisation de pipelines de Machine Learning à large échelle. Experte dans la mise en production sécurisée de microservices sous Kubernetes, le monitoring de Data Drift et l\'automatisation de pipelines CI/CD en télétravail international pour des entreprises en Europe et Amérique du Nord.',
      templateId: 'minimal_tech',
      accentColor: '#0284C7',
      fontScale: 'normal',
      experiences: [
        {
          id: 'exp_s1',
          company: 'CloudScale Analytics (Paris - Full Remote)',
          role: 'Lead MLOps Engineer (Télétravail 100%)',
          location: 'Remote International',
          remoteType: 'full_remote',
          startDate: 'Fév 2022',
          endDate: 'Présent',
          current: true,
          highlights: [
            'Conception de la plateforme MLOps d\'entreprise servant 12 modèles de scoring en temps réel (latence < 25ms, SLA 99.95%).',
            'Migration d\'infrastructures on-premise vers Google Kubernetes Engine (GKE) réduisant la facture Cloud de 35%.',
            'Mise en place d\'un système de monitoring continu de la dérive des données (Evidently AI, Prometheus & Grafana).'
          ]
        },
        {
          id: 'exp_s2',
          company: 'FinData Technologies',
          role: 'DevOps & Data Platform Engineer',
          location: 'Hybride / Remote',
          remoteType: 'hybrid',
          startDate: 'Jan 2019',
          endDate: 'Jan 2022',
          current: false,
          highlights: [
            'Automatisation complète des déploiements de modèles avec GitHub Actions, Terraform et Docker (gain de 8h par release).',
            'Sécurisation des accès aux données sensibles conformément au standard bancaire PCI-DSS et RGPD.'
          ]
        }
      ],
      projects: [
        {
          id: 'proj_s1',
          title: 'MLOps Pipeline End-to-End Orchestrator',
          technologies: ['Kubeflow', 'Docker', 'FastAPI', 'MLflow', 'Terraform', 'GCP'],
          description: 'Pipeline reproductible automatisant l\'entraînement, les tests de non-régression et le déploiement canari de modèles LLM.',
          impactMetric: 'Déploiement en 1 clic (-70% de temps de mise en prod)'
        },
        {
          id: 'proj_s2',
          title: 'Real-time Fraud Stream Inference Engine',
          technologies: ['Apache Kafka', 'Triton Server', 'Python', 'Redis', 'AWS'],
          description: 'Moteur d\'inférence distribué traitant 15 000 requêtes/seconde pour la détection de transactions frauduleuses.',
          impactMetric: '15 000 req/s sous 18ms'
        }
      ],
      education: [
        {
          id: 'edu_s1',
          institution: 'École Polytechnique / Université de Technologie',
          degree: 'Diplôme d\'Ingénieur en Génie Logiciel & Cloud Computing',
          field: 'Cloud & Systèmes Distribués',
          location: 'Mention Très Bien',
          year: '2016 - 2019'
        }
      ],
      skillCategories: [
        {
          category: 'MLOps & CI/CD',
          skills: ['MLflow', 'Kubeflow', 'Docker', 'Kubernetes (K8s)', 'GitHub Actions', 'Terraform', 'Evidently AI']
        },
        {
          category: 'Cloud & Infrastructure',
          skills: ['Google Cloud Platform (GCP)', 'AWS', 'Linux / Bash', 'Prometheus & Grafana', 'PostgreSQL', 'Redis']
        },
        {
          category: 'Développement & Data',
          skills: ['Python', 'FastAPI', 'Apache Kafka', 'PyTorch', 'Scikit-Learn', 'Git']
        }
      ],
      certifications: [
        {
          id: 'cert_s1',
          name: 'Google Cloud Professional Machine Learning Engineer',
          issuer: 'Google Cloud',
          date: '2023'
        },
        {
          id: 'cert_s2',
          name: 'Certified Kubernetes Administrator (CKA)',
          issuer: 'Linux Foundation',
          date: '2022'
        }
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Bilingue professionnel (C1)' },
        { language: 'Wolof', level: 'Courant' }
      ],
      interests: ['Open source MLOps', 'Architecture serverless', 'Course à pied', 'Mentorat jeunes développeuses']
    }
  },
  {
    id: 'preset_bi_analytics',
    title: 'Alexandre Mendy - Consultant Senior Big Data & BI',
    subtitle: 'Expert en valorisation des données, reporting stratégique et data warehouses (Télétravail)',
    roleCategory: 'bi_data',
    badge: 'Business Intelligence & SQL',
    description: 'Profil orienté modélisation décisionnelle, tableaux de bord interactifs (Power BI / Tableau), requêtage SQL complexe et entrepôts Snowflake/BigQuery.',
    accentColor: '#4F46E5',
    templateId: 'executive_remote',
    cvData: {
      fullName: 'Alexandre Mendy',
      jobTitle: 'Consultant Senior Business Intelligence & Analytics',
      email: 'alexandre.mendy.bi@example.com',
      phone: '+33 6 45 78 90 12',
      location: 'Paris, France / Télétravail International (Remote)',
      portfolioUrl: 'https://alexandre-mendy-bi.com',
      linkedinUrl: 'https://linkedin.com/in/alexandre-mendy-bi',
      githubUrl: 'https://github.com/alex-mendy-data',
      remoteStatus: 'Full Remote Ready',
      bioSummary: 'Consultant Senior Business Intelligence & Data Analyst avec 7 ans d\'expérience dans la conception de tableaux de bord de pilotage exécutif et d\'architectures d\'entrepôts de données modernes (Snowflake, dbt, BigQuery). Passionné par la démocratisation de la data et la transformation d\'indicateurs bruts en leviers de croissance financière mesurables.',
      templateId: 'executive_remote',
      accentColor: '#4F46E5',
      fontScale: 'normal',
      experiences: [
        {
          id: 'exp_b1',
          company: 'OmniData Consulting',
          role: 'Senior Data & BI Consultant (Télétravail)',
          location: 'International / Remote',
          remoteType: 'full_remote',
          startDate: 'Sept 2021',
          endDate: 'Présent',
          current: true,
          highlights: [
            'Pilotage de la refonte du reporting commercial pour un groupe multinational de 4 000 salariés sous Power BI et Snowflake.',
            'Mise en place de 25 dashboards automatisés adoptés par les directions financières et générales (+40% de rapidité de décision).',
            'Modélisation en couches sous dbt et optimisation des coûts de requêtage Snowflake (gain annuel de 45 000 €).'
          ]
        },
        {
          id: 'exp_b2',
          company: 'RetailPulse Analytics',
          role: 'Data Analyst & Développeur SQL',
          location: 'Bordeaux / Remote',
          remoteType: 'hybrid',
          startDate: 'Jan 2018',
          endDate: 'Août 2021',
          current: false,
          highlights: [
            'Analyse du panier moyen et segmentation client RFM sur 5 millions d\'utilisateurs actifs.',
            'Création de rapports Tableau automatisés connectés à des clusters PostgreSQL.'
          ]
        }
      ],
      projects: [
        {
          id: 'proj_b1',
          title: 'Executive Financial Cockpit & Forecasting',
          technologies: ['Power BI', 'DAX', 'Snowflake', 'dbt', 'SQL'],
          description: 'Cockpit de pilotage de trésorerie consolidée pour comités de direction avec simulation de scénarios budgétaires.',
          impactMetric: '25 dashboards adoptés par 120 directeurs'
        },
        {
          id: 'proj_b2',
          title: 'Customer Churn & Cohort Analysis Pipeline',
          technologies: ['Python', 'BigQuery', 'Tableau', 'SQL Server'],
          description: 'Pipeline analytique mesurant la rétention mensuelle et le taux d\'attrition avec alerting automatique Slack.',
          impactMetric: '+18% de rétention client'
        }
      ],
      education: [
        {
          id: 'edu_b1',
          institution: 'IAE School of Management',
          degree: 'Master en Systèmes d\'Information & Aide à la Décision',
          field: 'Data & Management',
          location: 'Major de promotion',
          year: '2016 - 2018'
        }
      ],
      skillCategories: [
        {
          category: 'Outils BI & Visualisation',
          skills: ['Power BI (DAX, Power Query)', 'Tableau Software', 'Looker Studio', 'Metabase', 'Storytelling Data']
        },
        {
          category: 'Entrepôts de Données & ETL',
          skills: ['SQL Expert (Postgres, BigQuery)', 'Snowflake', 'dbt (data build tool)', 'Google BigQuery', 'Airflow']
        },
        {
          category: 'Analyse & Langages',
          skills: ['Python (Pandas, NumPy)', 'Modélisation en étoile (Kimball)', 'Statistiques Descriptives', 'Git']
        }
      ],
      certifications: [
        {
          id: 'cert_b1',
          name: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
          issuer: 'Microsoft',
          date: '2023'
        },
        {
          id: 'cert_b2',
          name: 'Snowflake SnowPro Core Certified',
          issuer: 'Snowflake',
          date: '2022'
        }
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Professionnel courant (C1)' },
        { language: 'Espagnol', level: 'Intermédiaire (B1)' }
      ],
      interests: ['Finance comportementale', 'Échecs', 'Visualisation de données créative']
    }
  },
  {
    id: 'preset_fullstack_ai',
    title: 'Fatouma Kaboré - Ingénieure Full-Stack & Applications IA',
    subtitle: 'Développement d\'interfaces web modernes et intégration d\'agents IA (React, FastAPI, LLMs)',
    roleCategory: 'fullstack_ai',
    badge: 'Full-Stack & LLM Apps',
    description: 'Idéal pour concevoir des SaaS basés sur l\'IA générative avec streaming, gestion de tokens, design responsive et intégration d\'APIs complexes.',
    accentColor: '#059669',
    templateId: 'ai_data_engineer',
    cvData: {
      fullName: 'Fatouma Kaboré',
      jobTitle: 'Ingénieure Full-Stack Web & Applications IA Générative',
      email: 'fatouma.kabore.dev@example.com',
      phone: '+226 70 12 34 56',
      location: 'Ouagadougou, Burkina Faso / Télétravail International (UTC)',
      portfolioUrl: 'https://fatouma-kabore-ai.dev',
      linkedinUrl: 'https://linkedin.com/in/fatouma-kabore',
      githubUrl: 'https://github.com/fatouma-dev-ai',
      remoteStatus: 'Full Remote Ready',
      bioSummary: 'Développeuse Full-Stack Senior spécialisée dans la création de SaaS dopés à l\'Intelligence Artificielle. Maîtrise complète de l\'écosystème frontend (React, TypeScript, Tailwind CSS, Next.js) et backend (FastAPI, Python, bases vectorielles). Autonome et rigoureuse en télétravail international avec une culture produit forte.',
      templateId: 'ai_data_engineer',
      accentColor: '#059669',
      fontScale: 'normal',
      experiences: [
        {
          id: 'exp_f1',
          company: 'NextGen AI Studio (Full Remote)',
          role: 'Senior Full-Stack AI Engineer',
          location: 'Remote International',
          remoteType: 'full_remote',
          startDate: 'Mars 2022',
          endDate: 'Présent',
          current: true,
          highlights: [
            'Développement d\'un SaaS d\'assistance à la rédaction de documents juridiques avec streaming temps réel et Gemini Flash (12 000 utilisateurs actifs).',
            'Architecture d\'un backend asynchrone FastAPI interconnecté avec ChromaDB et Redis pour le caching des embeddings.',
            'Optimisation des performances de l\'interface React permettant d\'atteindre un score Lighthouse de 98/100.'
          ]
        },
        {
          id: 'exp_f2',
          company: 'SaasFlow Labs',
          role: 'Développeuse Frontend React & Node.js',
          location: 'Abidjan / Remote',
          remoteType: 'hybrid',
          startDate: 'Sept 2019',
          endDate: 'Fév 2022',
          current: false,
          highlights: [
            'Conception de composants réutilisables en TypeScript et intégration d\'interfaces responsives modernes.',
            'Connexion avec Stripe pour la gestion des abonnements récurrents et factures automatiques.'
          ]
        }
      ],
      projects: [
        {
          id: 'proj_f1',
          title: 'GenDocs AI - Assistant d\'Analyse Documentaire',
          technologies: ['React', 'Next.js', 'FastAPI', 'LangChain', 'ChromaDB', 'Tailwind'],
          description: 'Application web permettant aux équipes d\'importer des PDF de 500 pages et de poser des questions en langage naturel.',
          impactMetric: '12 000 utilisateurs actifs mensuels'
        },
        {
          id: 'proj_f2',
          title: 'VoiceAgent UI - Interface Vocale d\'Agent IA',
          technologies: ['WebRTC', 'FastAPI', 'TypeScript', 'WebSockets', 'Whisper'],
          description: 'Interface de dialogue en streaming vocal avec un agent IA réactif en moins de 400 millisecondes.',
          impactMetric: 'Latence vocale < 400ms'
        }
      ],
      education: [
        {
          id: 'edu_f1',
          institution: 'Institut International d\'Ingénierie Informatique',
          degree: 'Diplôme d\'Ingénieur en Génie Logiciel & Systèmes d\'Information',
          field: 'Développement Web & IA',
          location: 'Félicitations du Jury',
          year: '2016 - 2019'
        }
      ],
      skillCategories: [
        {
          category: 'Frontend Moderne',
          skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'Vite', 'Responsive Design']
        },
        {
          category: 'Backend & IA',
          skills: ['FastAPI', 'Python', 'Node.js', 'LangChain / LlamaIndex', 'ChromaDB', 'PostgreSQL', 'REST & GraphQL']
        },
        {
          category: 'DevOps & Méthodologie',
          skills: ['Docker', 'Git & GitHub', 'Vercel / Cloud Run', 'Méthode Agile Scrum', 'Tests Jest & PyTest']
        }
      ],
      certifications: [
        {
          id: 'cert_f1',
          name: 'Meta Certified Front-End Developer Professional',
          issuer: 'Meta / Coursera',
          date: '2022'
        },
        {
          id: 'cert_f2',
          name: 'LangChain & Vector Databases Specialization',
          issuer: 'DeepLearning.AI',
          date: '2023'
        }
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Courant professionnel (C1)' },
        { language: 'Mooré', level: 'Courant' }
      ],
      interests: ['Design UI/UX', 'Hackathons IA', 'Intelligence collective', 'Podcast Tech']
    }
  },
  {
    id: 'preset_pm_agile',
    title: 'Ibrahim Diallo - Chef de Projet Digital & Scrum Master Remote',
    subtitle: 'Pilotage de projets tech, coordination d\'équipes distribuées et transformation IA',
    roleCategory: 'management_agile',
    badge: 'Management Agile & Remote',
    description: 'Profil d\'encadrement pour structurer les livraisons, animer les rituels agiles à distance, gérer le budget et aligner les parties prenantes.',
    accentColor: '#D97706',
    templateId: 'academic_research',
    cvData: {
      fullName: 'Ibrahim Diallo',
      jobTitle: 'Chef de Projet Digital Senior & Scrum Master Certifié',
      email: 'ibrahim.diallo.pm@example.com',
      phone: '+223 76 54 32 10',
      location: 'Bamako, Mali / Télétravail International (UTC)',
      portfolioUrl: 'https://ibrahim-diallo-agile.com',
      linkedinUrl: 'https://linkedin.com/in/ibrahim-diallo-pm',
      githubUrl: 'https://github.com/ibrahim-diallo-pmo',
      remoteStatus: 'Full Remote Ready',
      bioSummary: 'Chef de projet digital et Scrum Master certifié PSM II avec 8 ans d\'expérience dans le pilotage de projets technologiques complexes et la coordination d\'équipes pluridisciplinaires 100% à distance. Spécialiste de la livraison continue, de la gestion de budgets multi-projets et de l\'intégration de solutions d\'IA pour accroître l\'efficacité opérationnelle.',
      templateId: 'academic_research',
      accentColor: '#D97706',
      fontScale: 'normal',
      experiences: [
        {
          id: 'exp_p1',
          company: 'Digital Transform Partners (Remote Europe/Afrique)',
          role: 'Senior Project Manager & Agile Coach',
          location: 'Télétravail International',
          remoteType: 'full_remote',
          startDate: 'Juil 2021',
          endDate: 'Présent',
          current: true,
          highlights: [
            'Direction de 4 équipes Scrum distribuées (18 ingénieurs, designers et data scientists) sur 3 fuseaux horaires.',
            'Livraison à temps et dans le budget (1.2M €) d\'une nouvelle plateforme numérique bancaire pour un consortium ouest-africain.',
            'Amélioration de la vélocité d\'équipe de +32% et réduction du temps de cycle des fonctionnalités de 4 à 2 semaines.'
          ]
        },
        {
          id: 'exp_p2',
          company: 'InnoTech Solutions',
          role: 'Scrum Master & Product Owner Adjoint',
          location: 'Dakar / Remote',
          remoteType: 'hybrid',
          startDate: 'Mars 2018',
          endDate: 'Juin 2021',
          current: false,
          highlights: [
            'Animation quotidienne des cérémonies agiles (Daily, Sprint Planning, Retrospectives, Démonstrations).',
            'Gestion du backlog produit sous Jira et reporting hebdomadaire pour les comités de pilotage.'
          ]
        }
      ],
      projects: [
        {
          id: 'proj_p1',
          title: 'Plateforme Digitale de Paiements Transfrontaliers',
          technologies: ['Jira', 'Confluence', 'Miro', 'Slack', 'Notion', 'Agile Scrum'],
          description: 'Projet d\'intégration API monétique multi-pays géré en sprints de 2 semaines avec 100% de conformité réglementaire.',
          impactMetric: '1.2M € de budget piloté avec succès'
        },
        {
          id: 'proj_p2',
          title: 'Programme d\'Accélération IA en Entreprise',
          technologies: ['Lean Inception', 'Roadmap Stratégique', 'KPI Dashboard', 'Asana'],
          description: 'Déploiement d\'outils d\'IA générative auprès de 250 collaborateurs avec plan de conduite du changement et formation.',
          impactMetric: '+32% d\'efficacité opérationnelle'
        }
      ],
      education: [
        {
          id: 'edu_p1',
          institution: 'École Supérieure de Commerce & Management',
          degree: 'Master en Management de Projets & Systèmes d\'Information',
          field: 'Gestion de Projet & Innovation',
          location: 'Mention Très Bien',
          year: '2015 - 2017'
        }
      ],
      skillCategories: [
        {
          category: 'Management Agile & Scrum',
          skills: ['Scrum Master (PSM II)', 'Kanban', 'Lean Inception', 'Gestion du Backlog', 'Estimation & Vélocité', 'Rétrospectives']
        },
        {
          category: 'Outils de Collaboration Remote',
          skills: ['Jira Software', 'Confluence', 'Miro', 'Slack / MS Teams', 'Notion', 'Asana', 'Loom']
        },
        {
          category: 'Gestion de Projet & Gouvernance',
          skills: ['Gestion des risques & Budgets', 'Planification stratégique', 'Conduite du changement', 'Communication Parties Prenantes']
        }
      ],
      certifications: [
        {
          id: 'cert_p1',
          name: 'Professional Scrum Master II (PSM II)',
          issuer: 'Scrum.org',
          date: '2023'
        },
        {
          id: 'cert_p2',
          name: 'PMP - Project Management Professional',
          issuer: 'Project Management Institute (PMI)',
          date: '2021'
        }
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Professionnel complet (C1)' },
        { language: 'Bambara', level: 'Courant' }
      ],
      interests: ['Intelligence collective', 'Innovation managériale', 'Basketball', 'Voyages interculturels']
    }
  }
];
