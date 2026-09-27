import { BookResource } from '../types';

export const LIBRARY_BOOKS: BookResource[] = [
  {
    id: 'book_multiagents_ai',
    title: 'Architectures Multi-Agents & RAG Hybride avec LangGraph',
    author: 'Cabinet Rabiou Saley Research',
    category: 'agents_ia',
    coverGradient: 'from-emerald-950 via-slate-900 to-emerald-900',
    year: '2024',
    pages: 240,
    readTime: '4h 30m',
    rating: 4.95,
    summary: 'Le guide de référence pour concevoir des systèmes d\'agents d\'intelligence artificielle autonomes capables de raisonner, de vérifier mutuellement leurs résultats et d\'exécuter des outils métiers en toute sécurité.',
    keyTakeaways: [
      'Différences architecturales clés entre les flux linéaires et les graphes cycliques avec LangGraph.',
      'Mise en place de bases vectorielles hybrides (ChromaDB + BM25) pour éliminer les hallucinations.',
      'Techniques avancées de Prompt Engineering et découpage de contexte (Chunking sémantique).',
      'Cas concrets d\'automatisation juridique, comptable et analyse de données en télétravail.'
    ],
    recommendedFor: 'Ingénieurs IA, Développeurs Python, Architectes Cloud et Consultants Data.',
    fileSize: '14.2 MB',
    badge: '⭐ Guide Officiel Cabinet',
    downloadFilename: 'Guide_MultiAgents_RAG_RabiouSaley.pdf'
  },
  {
    id: 'book_handson_ml',
    title: 'Hands-On Machine Learning with Scikit-Learn & PyTorch',
    author: 'Aurélien Géron',
    category: 'data_science',
    coverGradient: 'from-sky-950 via-slate-900 to-indigo-950',
    year: '2023',
    pages: 850,
    readTime: '18h 00m',
    rating: 4.9,
    summary: 'L\'ouvrage fondamental pour maîtriser la construction, l\'entraînement et le déploiement de modèles prédictifs, des régressions classiques jusqu\'aux réseaux de neurones profonds et Transformers.',
    keyTakeaways: [
      'Cycle de vie complet d\'un projet de Data Science : de l\'ingestion à la mise en production.',
      'Feature engineering avancé, détection de valeurs aberrantes et imputation propre.',
      'Techniques de régularisation, gradient boosting (XGBoost, LightGBM) et optimisation d\'hyperparamètres.',
      'Interprétabilité des modèles avec les valeurs SHAP et matrices de confusion pondérées.'
    ],
    recommendedFor: 'Data Scientists, Ingénieurs ML et étudiants en mathématiques appliquées.',
    fileSize: '28.5 MB',
    badge: 'Classique Tech',
    downloadFilename: 'Hands_On_Machine_Learning_Geron.pdf'
  },
  {
    id: 'book_remote_work',
    title: 'Le Guide Ultime du Télétravail International & Freelance Tech',
    author: 'Jason Fried & David Heinemeier Hansson (Basecamp)',
    category: 'remote_work',
    coverGradient: 'from-amber-950 via-slate-900 to-orange-950',
    year: '2022',
    pages: 280,
    readTime: '3h 45m',
    rating: 4.85,
    summary: 'Comment collaborer efficacement avec des clients situés aux quatre coins du globe sans subir la fatigue des réunions, en privilégiant la communication asynchrone et les livrables concrets.',
    keyTakeaways: [
      'L\'art de la communication asynchrone écrite : clarté, concision et documentation.',
      'Comment structurer sa journée de télétravail pour préserver son énergie et éviter le burn-out.',
      'Techniques de négociation de contrats internationaux en devises fortes (EUR, USD).',
      'Outils indispensables pour le travail à distance : Git, Docker, Loom, Slack et Notion.'
    ],
    recommendedFor: 'Freelances, développeurs à distance, consultants et cadres en télétravail.',
    fileSize: '9.8 MB',
    badge: 'Best-Seller Remote',
    downloadFilename: 'Guide_Teletravail_International_Fried.pdf'
  },
  {
    id: 'book_deep_work',
    title: 'Deep Work : Retrouver la Concentration dans un Monde de Distractions',
    author: 'Cal Newport',
    category: 'remote_work',
    coverGradient: 'from-indigo-950 via-slate-900 to-slate-950',
    year: '2021',
    pages: 310,
    readTime: '4h 15m',
    rating: 4.88,
    summary: 'La capacité à se concentrer intensément sur des tâches cognitives complexes est la super-compétence du XXIe siècle pour tout ingénieur de données et créateur technique.',
    keyTakeaways: [
      'Les 4 règles du travail en profondeur pour produire deux fois plus en moins de temps.',
      'Éliminer la fragmentation d\'attention causée par les messageries instantanées et réseaux sociaux.',
      'Comment calibrer des blocs de 90 minutes de code ininterrompu chaque jour.',
      'Mesurer l\'impact de sa journée par la valeur produite plutôt que les heures de présence.'
    ],
    recommendedFor: 'Développeurs, chercheurs, étudiants et entrepreneurs du numérique.',
    fileSize: '8.4 MB',
    badge: 'Productivité',
    downloadFilename: 'Deep_Work_Cal_Newport.pdf'
  },
  {
    id: 'book_clean_code',
    title: 'Clean Code & Architecture Logicielle pour la Data',
    author: 'Robert C. Martin (Uncle Bob)',
    category: 'data_science',
    coverGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    year: '2020',
    pages: 460,
    readTime: '8h 30m',
    rating: 4.82,
    summary: 'Les principes indispensables pour écrire du code Python et des pipelines de données lisibles, maintenables, modulaires et faciles à tester par n\'importe quelle équipe technique distante.',
    keyTakeaways: [
      'Principes SOLID appliqués aux architectures de traitement de données et APIs FastAPI.',
      'Nommage explicite des variables, fonctions pures et élimination des effets de bord.',
      'Écriture de tests unitaires et de validation de schémas de données avec Pydantic.',
      'Refactoring continu sans casser les fonctionnalités existantes en production.'
    ],
    recommendedFor: 'Développeurs Python, Data Engineers et Lead Développeurs.',
    fileSize: '15.1 MB',
    badge: 'Standard Industriel',
    downloadFilename: 'Clean_Code_Robert_Martin.pdf'
  },
  {
    id: 'book_mckinsey_mind',
    title: 'The McKinsey Mind : Méthodes de Résolution de Problèmes Complexes',
    author: 'Ethan M. Rasiel & Paul N. Friga',
    category: 'strategy_business',
    coverGradient: 'from-slate-950 via-zinc-900 to-slate-900',
    year: '2021',
    pages: 290,
    readTime: '4h 00m',
    rating: 4.79,
    summary: 'Les cadres logiques utilisés par les plus grands cabinets de conseil pour décomposer les enjeux stratégiques des entreprises et proposer des solutions actionnables chiffrées.',
    keyTakeaways: [
      'Le principe MECE (Mutuellement Exclusif, Collectivement Exhaustif) pour structurer un audit.',
      'Approche par hypothèse : comment valider rapidement la faisabilité d\'un projet IA.',
      'La règle des 80/20 appliquée à l\'extraction de valeur des données d\'entreprise.',
      'Storytelling exécutif pour convaincre les directions générales et comités de direction.'
    ],
    recommendedFor: 'Consultants, fondateurs de cabinet, directeurs techniques et chefs de projet.',
    fileSize: '11.3 MB',
    badge: 'Stratégie & Conseil',
    downloadFilename: 'The_McKinsey_Mind_Rasiel.pdf'
  },
  {
    id: 'book_generative_ai_production',
    title: 'Generative AI in Production : Déployer des LLMs à l\'Échelle',
    author: 'Christopher B. & Chip Huyen',
    category: 'agents_ia',
    coverGradient: 'from-purple-950 via-slate-900 to-indigo-950',
    year: '2024',
    pages: 360,
    readTime: '6h 45m',
    rating: 4.92,
    summary: 'Guide d\'ingénierie moderne couvrant le fine-tuning de modèles ouverts, la mise en cache de prompts, l\'évaluation automatisée de réponses LLM et la réduction des coûts d\'API.',
    keyTakeaways: [
      'Architecture d\'évaluation LLM-as-a-judge pour mesurer la qualité des réponses générées.',
      'Optimisation des coûts de requêtes avec des modèles compacts (Gemini Flash, Llama 3).',
      'Stratégies de sécurité : garde-fous contre les injections de prompt et fuites de données.',
      'Déploiement serverless avec mise à l\'échelle automatique et temps de réponse sub-seconde.'
    ],
    recommendedFor: 'Architectes IA, Développeurs LLMs et Responsables Innovation.',
    fileSize: '16.7 MB',
    badge: 'Nouveauté 2024',
    downloadFilename: 'Generative_AI_in_Production.pdf'
  },
  {
    id: 'book_lean_startup',
    title: 'The Lean Startup : Créer des Produits Technologiques Rentables',
    author: 'Eric Ries',
    category: 'strategy_business',
    coverGradient: 'from-rose-950 via-slate-900 to-slate-950',
    year: '2020',
    pages: 340,
    readTime: '5h 15m',
    rating: 4.86,
    summary: 'Comment concevoir un Produit Minimum Viable (MVP) dans le domaine de la tech et tester rapidement son adéquation au marché sans gaspiller de capital ni de temps de développement.',
    keyTakeaways: [
      'La boucle d\'apprentissage : Construire - Mesurer - Apprendre.',
      'Définition du MVP pour une solution d\'IA ou de Data Science.',
      'Pivoter ou persévérer : s\'appuyer sur des métriques réelles plutôt que des vanités.',
      'Comptabilité d\'innovation pour suivre la traction réelle auprès des premiers clients.'
    ],
    recommendedFor: 'Entrepreneurs tech, créateurs de SaaS et porteurs de projets IA.',
    fileSize: '10.5 MB',
    badge: 'Entrepreneuriat',
    downloadFilename: 'The_Lean_Startup_Eric_Ries.pdf'
  }
];
