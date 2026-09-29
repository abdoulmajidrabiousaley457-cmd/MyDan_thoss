export interface PortfolioTemplateItem {
  id: string;
  title: string;
  role: string;
  category: 'ai_data' | 'fullstack' | 'mlops' | 'consulting';
  author: string;
  badge: string;
  isOfficial?: boolean;
  liveUrl?: string;
  tagline: string;
  bio: string;
  stats: { label: string; value: string }[];
  skills: { category: string; items: string[] }[];
  featuredProjects: {
    title: string;
    description: string;
    technologies: string[];
    impact: string;
    github?: string;
    demo?: string;
  }[];
  services: { title: string; desc: string; rate: string }[];
  codeSnippet: string;
}

export const PORTFOLIO_TEMPLATES: PortfolioTemplateItem[] = [
  {
    id: 'portfolio_official_rabiou',
    title: 'Portfolio Officiel - Data Science & Agents IA',
    role: 'Consultant Senior Data Science & Ingénieur Agents IA',
    author: 'Rabiou Saley Abdoul Majid',
    category: 'ai_data',
    badge: 'Portfolio Officiel En Ligne',
    isOfficial: true,
    liveUrl: 'https://mon-portfolio-fin-ten.vercel.app/',
    tagline: 'Architecture Multi-Agents, Systèmes RAG Vectoriels & Pipelines MLOps en Télétravail International.',
    bio: 'Plus de 5 années d\'expertise appliquée dans la conception d\'architectures de Machine Learning et le déploiement d\'agents IA autonomes pour des cabinets, startups et institutions internationales à 100% en télétravail (Full Remote). Spécialiste LangGraph, CrewAI, Gemini et FastAPI.',
    stats: [
      { label: 'Années d\'Expérience', value: '5+' },
      { label: 'Projets IA Déployés', value: '38+' },
      { label: 'Clients en Télétravail', value: '18+' },
      { label: 'Score Satisfaction', value: '99.4%' }
    ],
    skills: [
      { category: 'Agents IA & LLMs', items: ['LangGraph', 'CrewAI', 'AutoGen', 'Gemini 3/2.5', 'RAG Vectoriel', 'ChromaDB', 'Prompt Engineering'] },
      { category: 'Data Science & ML', items: ['Python', 'Scikit-Learn', 'XGBoost', 'Pandas/Polars', 'SHAP (Explicabilité)', 'Time Series'] },
      { category: 'Architecture & Cloud', items: ['FastAPI', 'Docker', 'GCP', 'Vercel', 'PostgreSQL', 'Git / CI-CD'] }
    ],
    featuredProjects: [
      {
        title: 'NexusAgent - Multi-Agents RAG Juridique & Financier',
        description: 'Orchestration d\'agents autonomes pour l\'audit contractuel automatisé et le croisement de réglementations bancaires avec extraction vectorielle.',
        technologies: ['LangGraph', 'Gemini API', 'FastAPI', 'ChromaDB', 'Docker'],
        impact: 'Temps d\'analyse divisé par 4 (-75% de temps)',
        github: 'https://github.com/abdoulmajidrabiousaley457-cmd',
        demo: 'https://mon-portfolio-fin-ten.vercel.app/'
      },
      {
        title: 'PredictChurn B2B - Plateforme de Scoring Prédictif',
        description: 'Solution SaaS prédisant l\'attrition des comptes clés avec analyse causale en temps réel et explicabilité via valeurs SHAP.',
        technologies: ['Python', 'XGBoost', 'SHAP', 'Streamlit', 'PostgreSQL'],
        impact: 'Score F1 de 0.91 sur 2.5M de transactions',
        github: 'https://github.com/abdoulmajidrabiousaley457-cmd'
      },
      {
        title: 'SmartDoc Vision - Pipeline OCR & NLP Intelligent',
        description: 'Pipeline de traitement intelligent de factures et documents complexes avec classification sémantique automatique.',
        technologies: ['PyTorch', 'LayoutLM', 'FastAPI', 'OpenCV'],
        impact: '15h gagnées par semaine par équipe'
      }
    ],
    services: [
      { title: 'Conception d\'Agents IA Autonomes', desc: 'Systèmes multi-agents sur mesure connectés à vos bases de données et APIs métier.', rate: '45 € - 60 € / h' },
      { title: 'Modélisation Data Science & Scoring ML', desc: 'Analyse prédictive de bout en bout, de l\'EDA au déploiement de modèles optimisés.', rate: '40 € - 55 € / h' },
      { title: 'Audit IA & Architecture MLOps Télétravail', desc: 'Évaluation technique, industrialisation cloud sécurisée et accompagnement des équipes.', rate: '50 € - 70 € / h' }
    ],
    codeSnippet: `<!-- Modèle Portfolio Minimaliste HTML/Tailwind pour Data Scientist & IA -->
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Portfolio - Rabiou Saley | Data Science & Agents IA</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans">
  <nav class="border-b border-slate-800 p-6 flex justify-between items-center max-w-6xl mx-auto">
    <div class="font-extrabold text-xl text-emerald-400">Rabiou Saley</div>
    <div class="space-x-6 text-sm">
      <a href="#projets" class="hover:text-emerald-400">Projets</a>
      <a href="#expertises" class="hover:text-emerald-400">Expertises</a>
      <a href="https://mon-portfolio-fin-ten.vercel.app/" target="_blank" class="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl">Portfolio Vercel ↗</a>
    </div>
  </nav>
  <header class="max-w-4xl mx-auto py-20 px-6 text-center">
    <span class="text-xs uppercase tracking-widest text-emerald-400 font-bold">Disponible en Télétravail International</span>
    <h1 class="text-5xl font-black mt-4 leading-tight">Consultant Data Science & Ingénieur Agents IA</h1>
    <p class="text-slate-400 mt-6 text-lg">Je conçois des systèmes d'agents autonomes et des pipelines de Machine Learning sécurisés pour cabinets et startups.</p>
  </header>
</body>
</html>`
  },
  {
    id: 'portfolio_fullstack_ai',
    title: 'Portfolio Développeur Full-Stack IA & Cloud SaaS',
    role: 'Full-Stack Software Engineer & AI Integrator',
    author: 'Modèle Prêt à l\'Emploi (Template Tech)',
    category: 'fullstack',
    badge: 'Template Développeur Web & Mobile',
    tagline: 'Applications Web React 19, APIs FastAPI haute cadence et Microservices IA conteneurisés.',
    bio: 'Profil hybride combinant la rigueur du développement web moderne (TypeScript, Next.js/React, Tailwind) avec l\'intégration d\'APIs de modèles de fondation (Gemini, Claude, OpenAI). Conçu pour lancer rapidement des prototypes ou des produits SaaS complets.',
    stats: [
      { label: 'Applications Développées', value: '24+' },
      { label: 'Uptime Moyen', value: '99.9%' },
      { label: 'Temps Réponse API', value: '<80ms' },
      { label: 'Test Coverage', value: '88%' }
    ],
    skills: [
      { category: 'Frontend', items: ['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PWA'] },
      { category: 'Backend & APIs', items: ['FastAPI', 'Node.js/Express', 'PostgreSQL', 'Redis', 'GraphQL'] },
      { category: 'DevOps & IA', items: ['Docker', 'Vercel', 'AWS/GCP', 'Streaming SSE', 'Embeddings'] }
    ],
    featuredProjects: [
      {
        title: 'AI SaaS Dashboard - Analytics Temps Réel',
        description: 'Dashboard multi-tenant avec interface moderne, prédictions en direct et authentification Firebase/OAuth.',
        technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'FastAPI'],
        impact: '10k requêtes/jour sans latence'
      },
      {
        title: 'OmniChat Copilot - Assistant d\'Entreprise',
        description: 'Interface de chat IA d\'entreprise connectée à Google Drive et Notion avec streaming audio et texte.',
        technologies: ['Next.js', 'Gemini API', 'WebSocket', 'Tailwind'],
        impact: 'Réduction de 50% des tickets support'
      }
    ],
    services: [
      { title: 'Développement d\'Applications Web IA', desc: 'Front-end réactif et intégration d\'agents intelligents avec streaming.', rate: '35 € - 50 € / h' },
      { title: 'Création d\'APIs & Microservices', desc: 'Architecture back-end sécurisée sous FastAPI ou Node.js avec documentation OpenAPI.', rate: '35 € - 48 € / h' }
    ],
    codeSnippet: `// Structure React TypeScript du Portfolio Full-Stack
import React from 'react';

export const FullStackPortfolio = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <header className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">Développeur Full-Stack IA & Cloud</h1>
        <p className="text-slate-400 mt-2">React 19 • FastAPI • Docker • LLM Integration</p>
      </header>
    </div>
  );
};`
  },
  {
    id: 'portfolio_mlops_data',
    title: 'Portfolio MLOps & Ingénieur Plateforme Data',
    role: 'MLOps Engineer & Data Architect (Remote)',
    author: 'Modèle Plateforme & Infrastructure',
    category: 'mlops',
    badge: 'Template Architecture & MLOps',
    tagline: 'Industrialisation de modèles ML, pipelines CI/CD automatisés et observabilité en production.',
    bio: 'Spécialisé dans le passage du modèle expérimental Jupyter Notebook à une mise en production robuste et sécurisée. Gestion des dérives de données (data drift), monitoring des latences, conteneurisation et orchestration Kubernetes.',
    stats: [
      { label: 'Pipelines MLOps', value: '16+' },
      { label: 'Latence Réduite', value: '-65%' },
      { label: 'Data Drift Détecté', value: '100%' },
      { label: 'Coût Cloud Optimisé', value: '-40%' }
    ],
    skills: [
      { category: 'MLOps & CI/CD', items: ['MLflow', 'GitHub Actions', 'Docker', 'Kubernetes', 'DVC'] },
      { category: 'Data Engineering', items: ['Apache Spark', 'Kafka', 'Airflow', 'PostgreSQL', 'Snowflake'] },
      { category: 'Surveillance & Cloud', items: ['Prometheus', 'Grafana', 'GCP Vertex AI', 'AWS SageMaker'] }
    ],
    featuredProjects: [
      {
        title: 'MLOps Pipeline Automatisé - Churn & Fraud',
        description: 'Pipeline complet de réentraînement continu avec tests unitaires sur les données et déploiement canari sur Kubernetes.',
        technologies: ['MLflow', 'Docker', 'Kubernetes', 'FastAPI'],
        impact: 'Zéro temps d\'arrêt lors des mises à jour de modèles'
      },
      {
        title: 'Feature Store & Vector Database Hybride',
        description: 'Infrastructure unifiée pour la recherche de vecteurs et la distribution de features en moins de 15ms.',
        technologies: ['ChromaDB', 'Redis', 'Python', 'Docker'],
        impact: 'Latence divisée par 3'
      }
    ],
    services: [
      { title: 'Mise en Production de Modèles ML (MLOps)', desc: 'Packaging Docker, création de tests automatisés et API de serving haute performance.', rate: '50 € - 65 € / h' },
      { title: 'Audit d\'Architecture Data & Optimisation Cloud', desc: 'Analyse des goulots d\'étranglement et réduction des factures GCP/AWS.', rate: '60 € - 80 € / h' }
    ],
    codeSnippet: `# Dockerfile d'exemple pour serving de modèle IA
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`
  },
  {
    id: 'portfolio_consultant_executive',
    title: 'Portfolio Cabinet & Consultant Stratégie IA & Télétravail',
    role: 'Consultant Stratégie IA & Chef de Projet Digital',
    author: 'Modèle Conseil & Cabinet Exécutif',
    category: 'consulting',
    badge: 'Template Conseil & Direction',
    tagline: 'Conseil en transformation numérique, feuille de route IA générative et ROI d\'automatisation.',
    bio: 'Accompagnement des directions générales, DSI et cabinets pour identifier les cas d\'usage IA à fort retour sur investissement, cadrer les risques de conformité (RGPD, éthique IA) et piloter le déploiement en régie ou forfait à distance.',
    stats: [
      { label: 'Audits Stratégiques', value: '30+' },
      { label: 'ROI Moyen Mesuré', value: '3.4x' },
      { label: 'Heures Gagnées/An', value: '12k h' },
      { label: 'NPS Client', value: '96' }
    ],
    skills: [
      { category: 'Stratégie & Audit', items: ['Roadmap IA', 'Calcul ROI', 'Gouvernance des données', 'Conformité RGPD/IA Act'] },
      { category: 'Pilotage & Agilité', items: ['Scrum / Kanban', 'Gestion d\'équipes distribuées', 'Cadrage fonctionnel', 'Conduite du changement'] },
      { category: 'Outils', items: ['Jira', 'Notion', 'Power BI', 'Figma', 'Miro'] }
    ],
    featuredProjects: [
      {
        title: 'Feuille de Route IA Générative pour Secteur Financier',
        description: 'Audit complet de 12 processus manuels et implémentation priorisée de 3 agents d\'automatisation documentaire.',
        technologies: ['Audit Technique', 'Architecture IA', 'Gouvernance'],
        impact: '450k € d\'économies annuelles identifiées'
      }
    ],
    services: [
      { title: 'Audit Flash de Maturité IA (2 jours)', desc: 'Cartographie des opportunités IA avec estimation des coûts et des gains.', rate: '750 € / jour' },
      { title: 'Direction de Projet IA en Télétravail', desc: 'Coordination hebdomadaire, alignement des développeurs et reporting exécutif.', rate: '550 € / jour' }
    ],
    codeSnippet: `<!-- Plan de Synthèse d'Audit IA Stratégique -->
1. Diagnostic de l'existant & Qualité des données
2. Identification des 3 opportunités IA à plus fort ROI
3. Architecture cible & Sélection des modèles LLM (Open Source vs Propriétaire)
4. Feuille de route opérationnelle (Jalons à 30, 60 et 90 jours)`
  }
];
