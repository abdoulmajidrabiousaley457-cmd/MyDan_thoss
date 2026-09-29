import { BookResource } from '../types';

export const LIBRARY_BOOKS: BookResource[] = [
  // --- GUIDES OFFICIELS & AGENTS IA ---
  {
    id: 'book_multiagents_ai',
    title: 'Architectures Multi-Agents & RAG Hybride avec LangGraph',
    author: 'Cabinet Rabiou Saley Research',
    category: 'agents_ia',
    coverGradient: 'from-emerald-950 via-slate-900 to-emerald-900',
    year: '2025',
    pages: 260,
    readTime: '4h 45m',
    rating: 4.98,
    format: 'Guide PDF',
    level: 'Expert',
    badge: '⭐ Guide Officiel Cabinet',
    tags: ['LangGraph', 'Multi-Agents', 'RAG', 'ChromaDB', 'Python', 'Production'],
    summary: 'Le guide de référence du Cabinet Rabiou Saley pour concevoir, superviser et déployer en production des essaims d\'agents IA autonomes capables d\'auto-correction, d\'exécution d\'outils et d\'interrogation documentaire vectorielle sans hallucination.',
    keyTakeaways: [
      'Différences architecturales clés entre flux DAG linéaires et graphes cycliques avec conservation d\'état (StateGraph).',
      'Mise en place de bases vectorielles hybrides (ChromaDB + BM25 Reciprocal Rank Fusion) pour éliminer les hallucinations.',
      'Pattern Human-in-the-loop (HITL) : suspendre l\'exécution d\'un agent pour validation humaine avant actions critiques.',
      'Supervision distribuée : traçabilité des coûts de tokens, latence d\'inférence et monitoring MLOps.'
    ],
    tableOfContents: [
      '1. Fondements des architectures d\'agents autonomes (ReAct, Plan-and-Solve)',
      '2. LangGraph vs LangChain : modélisation par graphes d\'états',
      '3. RAG Hybride haute fidélité (Vector Search + Sparse Keyword + Cross-Encoder)',
      '4. Gestion de la mémoire : à court terme, vectorielle et épisodique',
      '5. Sécurité, sandboxing et déploiement cloud sécurisé (FastAPI + Docker)'
    ],
    codeSnippet: {
      title: 'Exemple de StateGraph LangGraph avec Mémoire et Router',
      language: 'python',
      code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List
import operator

class AgentState(TypedDict):
    messages: Annotated[List[dict], operator.add]
    next_step: str
    context_data: dict

def researcher_node(state: AgentState):
    query = state["messages"][-1]["content"]
    # Appel outil de recherche documentaire RAG
    docs = search_vector_store(query, k=5)
    return {"messages": [{"role": "assistant", "content": f"Trouvé: {docs}"}], "next_step": "verifier"}

def verifier_node(state: AgentState):
    # Auto-évaluation de la pertinence (Self-Correction)
    return {"next_step": END}

workflow = StateGraph(AgentState)
workflow.add_node("researcher", researcher_node)
workflow.add_node("verifier", verifier_node)
workflow.set_entry_point("researcher")
workflow.add_edge("researcher", "verifier")
app = workflow.compile()`
    },
    promptTemplate: {
      title: 'Prompt Système ReAct pour Agent Spécialiste',
      prompt: `Tu es l'agent analyste principal du Cabinet Rabiou Saley.
Ton objectif : Décomposer chaque problème en étapes strictes [Pensée -> Action -> Observation -> Synthèse].
Avant de formuler une conclusion définitive :
1. Recherche systématiquement les preuves dans la base de connaissances.
2. Évalue l'incertitude sur une échelle de 0 à 100%.
3. Si l'incertitude dépasse 20%, formule une hypothèse explicite.`
    },
    recommendedFor: 'Ingénieurs IA, Développeurs Python, Architectes Cloud et Consultants Data.',
    fileSize: '14.8 MB',
    downloadFilename: 'Guide_MultiAgents_RAG_RabiouSaley.pdf'
  },
  {
    id: 'book_omni_studio_agents',
    title: 'Déploiement d\'Agents Omni Studio & Modèles Multimodaux',
    author: 'Abdoul Majid Rabiou Saley',
    category: 'agents_ia',
    coverGradient: 'from-purple-950 via-slate-900 to-indigo-950',
    year: '2025',
    pages: 215,
    readTime: '3h 30m',
    rating: 4.94,
    format: 'Guide PDF',
    level: 'Avancé',
    badge: 'Dernière Édition 2025',
    tags: ['Omni Studio', 'Gemini 2.5', 'Vision', 'Audio', 'APIs'],
    summary: 'Méthodologie concrète pour intégrer l\'agent hébergé Omni Studio (https://omni-studio-abdoul.ai.studio), orchestrer les modèles multimodaux (texte, voix, images) et bâtir des assistants conversationnels d\'entreprise à forte valeur ajoutée.',
    keyTakeaways: [
      'Connexion temps réel aux flux multimodaux (analyse conjointe de visuels et de métriques tabulaires).',
      'Stratégies de mise en cache de contexte (Context Caching) pour réduire les coûts d\'API de 80%.',
      'Orchestration d\'appels de fonctions (Function Calling structuré) avec schémas JSON stricts.',
      'Gestion des erreurs et fallback hors-ligne en cas de latence ou d\'indisponibilité réseau.'
    ],
    tableOfContents: [
      '1. Introduction à l\'écosystème Omni Studio et Gemini',
      '2. Structuration des Function Calls pour les APIs d\'entreprise',
      '3. Pipeline multimodal : traitement des flux audio et des graphiques financiers',
      '4. Optimisation des coûts par Context Caching',
      '5. Intégration dans les environnements Web et Mobile'
    ],
    recommendedFor: 'Concepteurs de chatbots, Directeurs de l\'Innovation et Développeurs Full-Stack.',
    fileSize: '11.5 MB',
    downloadFilename: 'Guide_Omni_Studio_Agents_RabiouSaley.pdf'
  },

  // --- DATA SCIENCE, ML & ARCHITECTURES ---
  {
    id: 'book_handson_ml',
    title: 'Hands-On Machine Learning with Scikit-Learn, Keras & PyTorch',
    author: 'Aurélien Géron',
    category: 'data_science',
    coverGradient: 'from-sky-950 via-slate-900 to-indigo-950',
    year: '2024',
    pages: 870,
    readTime: '18h 00m',
    rating: 4.95,
    format: 'Livre Fondateur',
    level: 'Intermédiaire',
    badge: 'Classique Incontournable',
    tags: ['Machine Learning', 'Scikit-Learn', 'PyTorch', 'Data Science', 'Deep Learning'],
    summary: 'La bible mondiale de l\'apprentissage automatique. Cet ouvrage couvre de bout en bout la construction, l\'évaluation et le déploiement de modèles prédictifs, depuis les régressions linéaires jusqu\'aux architectures Transformers et Vision.',
    keyTakeaways: [
      'Pipeline de nettoyage et feature engineering rigoureux : imputation, encodage et standardisation.',
      'Maîtrise des algorithmes ensemblistes : Random Forest, Gradient Boosting (XGBoost, LightGBM, CatBoost).',
      'Évaluation critique des modèles : courbes ROC-AUC, matrices de confusion pondérées et cross-validation stratifiée.',
      'Régularisation avancée (L1/L2, Dropout) pour éliminer le surapprentissage (overfitting).'
    ],
    tableOfContents: [
      '1. Le Projet de Machine Learning de bout en bout',
      '2. Modèles de régression et de classification',
      '3. Algorithmes ensemblistes et forêts d\'arbres décisionnels',
      '4. Réduction de dimensionnalité (PCA, t-SNE, UMAP)',
      '5. Réseaux neuronaux profonds et apprentissage supervisé moderne'
    ],
    codeSnippet: {
      title: 'Pipeline Complet Scikit-Learn avec XGBoost & Cross-Validation',
      language: 'python',
      code: `import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import StratifiedKFold, cross_val_score
from xgboost import XGBClassifier

# Définition des colonnes
num_features = ['age', 'annees_experience', 'score_test']
cat_features = ['specialite', 'zone_geographique']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), num_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), cat_features)
    ]
)

model = Pipeline(steps=[
    ('prep', preprocessor),
    ('clf', XGBClassifier(n_estimators=200, learning_rate=0.05, max_depth=5, random_state=42))
])

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
# scores = cross_val_score(model, X, y, cv=cv, scoring='roc_auc')
print("Pipeline calibré pour production.")`
    },
    recommendedFor: 'Data Scientists, Ingénieurs ML, Chercheurs et Étudiants en mathématiques appliquées.',
    fileSize: '28.5 MB',
    downloadFilename: 'Hands_On_Machine_Learning_Geron.pdf'
  },
  {
    id: 'book_mlops_production',
    title: 'MLOps en Pratique : De l\'Expérimentation au Déploiement Continu',
    author: 'Cabinet Rabiou Saley MLOps Lab',
    category: 'data_science',
    coverGradient: 'from-blue-950 via-slate-900 to-cyan-950',
    year: '2025',
    pages: 320,
    readTime: '6h 15m',
    rating: 4.92,
    format: 'Guide PDF',
    level: 'Expert',
    badge: 'Production Ready',
    tags: ['MLOps', 'Docker', 'FastAPI', 'MLflow', 'CI/CD', 'Drift'],
    summary: 'Comment industrialiser vos modèles de Machine Learning : versioning des données (DVC), suivi des hyperparamètres (MLflow), conteneurisation Docker, exposition d\'APIs ultra-rapides avec FastAPI et détection du Data Drift.',
    keyTakeaways: [
      'Architecture d\'un pipeline CI/CD automatisé pour les modèles prédictifs.',
      'Conteneurisation sécurisée : images Docker ultra-légères (Alpine/Slim) avec démarrage à froid < 2s.',
      'Surveillance du Data Drift et Concept Drift avec alertes automatisées et ré-entraînement programmé.',
      'Gestion des dépendances et reproductibilité mathématique des expériences.'
    ],
    tableOfContents: [
      '1. Pourquoi 85% des projets IA échouent avant la production',
      '2. Suivi des expérimentations avec MLflow et DVC',
      '3. Création de microservices de scoring avec FastAPI',
      '4. Conteneurisation Docker et orchestration Kubernetes',
      '5. Monitoring temps réel de la dérive des données (Drift Detection)'
    ],
    recommendedFor: 'Ingénieurs MLOps, Développeurs Backend et Chefs de Projets Data.',
    fileSize: '16.2 MB',
    downloadFilename: 'Guide_MLOps_Production_RabiouSaley.pdf'
  },

  // --- AIDE-MÉMOIRES & CHEAT SHEETS PRATIQUES ---
  {
    id: 'cs_python_datascience',
    title: 'Aide-Mémoire Express : Python Data Science & Manipulation Avancée',
    author: 'Cabinet Rabiou Saley',
    category: 'cheat_sheets',
    coverGradient: 'from-teal-950 via-slate-900 to-emerald-950',
    year: '2025',
    pages: 18,
    readTime: '45m',
    rating: 4.99,
    format: 'Aide-Mémoire',
    level: 'Tous niveaux',
    badge: '⚡ Essentiel Pratique',
    tags: ['Python', 'Pandas', 'NumPy', 'Cheat Sheet', 'Data Wrangling'],
    summary: 'Le récapitulatif condensé des commandes, syntaxes et astuces Python pour la manipulation de données à grande échelle (Pandas 2.0+, Polars, NumPy vectorisé et optimisations mémoire).',
    keyTakeaways: [
      'Méthodes de fusion de DataFrames (merge, join, concat) avec gestion optimisée des types.',
      'Agrégations complexes par groupe (groupby, agg, pivot_table, window functions).',
      'Nettoyage éclair des dates, textes (regex vectorisées) et valeurs manquantes.',
      'Réduction de l\'empreinte mémoire par downcasting automatique des entiers et flottants.'
    ],
    tableOfContents: [
      '• Indexation et filtrage conditionnel ultra-rapide',
      '• Manipulations avancées avec groupby() et assign()',
      '• Séries temporelles : resample(), rolling() et shifts',
      '• Optimisations de performance : conversion en catégoriels et formats Parquet'
    ],
    codeSnippet: {
      title: 'Astuces Clés Pandas & Réduction d\'Empreinte Mémoire',
      language: 'python',
      code: `import pandas as pd

# Chargement optimisé avec types stricts et format parquet
df = pd.read_parquet("donnees_clients.parquet")

# Réduction mémoire automatique
for col in df.select_dtypes(include=['int64']).columns:
    df[col] = pd.to_numeric(df[col], downcast='integer')

# Analyse par cohorte vectorisée
res = (
    df.query("statut == 'ACTIF' and montant > 0")
    .assign(date_mois=lambda x: x['date_creation'].dt.to_period('M'))
    .groupby(['date_mois', 'secteur'])['montant']
    .agg(['count', 'mean', 'sum'])
    .rename(columns={'count': 'nb_missions', 'mean': 'panier_moyen', 'sum': 'total_xof'})
    .sort_values(by='total_xof', ascending=False)
)`
    },
    recommendedFor: 'Développeurs, Data Analysts, Data Engineers et candidats aux entretiens techniques.',
    fileSize: '3.2 MB',
    downloadFilename: 'CheatSheet_Python_DataScience_RabiouSaley.pdf'
  },
  {
    id: 'cs_prompt_engineering',
    title: 'Aide-Mémoire : Prompt Engineering & Modèles de Raisonnement',
    author: 'Cabinet Rabiou Saley AI Lab',
    category: 'cheat_sheets',
    coverGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    year: '2025',
    pages: 24,
    readTime: '1h 00m',
    rating: 4.97,
    format: 'Aide-Mémoire',
    level: 'Tous niveaux',
    badge: 'Top Téléchargement',
    tags: ['Prompt Engineering', 'Few-Shot', 'Chain-of-Thought', 'LLMs', 'JSON Mode'],
    summary: 'La boîte à outils opérationnelle pour concevoir des prompts déterministes et infaillibles : techniques Few-Shot, Chain-of-Thought (CoT), sorties JSON garanties et défenses contre les injections de prompt.',
    keyTakeaways: [
      'Structure universelle d\'un prompt de production : Rôle, Contexte, Instructions, Contraintes, Format.',
      'Techniques de Chain-of-Thought (Pensée étape par étape) pour les calculs et la logique formelle.',
      'Garantie de format de sortie JSON valide (Pydantic / Structured Outputs).',
      'Protection contre les attaques par injection de prompt et déviation de contexte.'
    ],
    tableOfContents: [
      '• Anatomie d\'un prompt de classe entreprise',
      '• Modèles Few-Shot pour la classification de texte',
      '• Chain-of-Thought et décomposition récursive de problèmes',
      '• Forçage de schéma JSON strict et gestion des exceptions'
    ],
    promptTemplate: {
      title: 'Prompt Universel pour Extraction Structurée Pydantic',
      prompt: `[ROLE]
Tu es un extracteur de données techniques de précision chirurgicale.

[CONTEXTE]
Document source : "{{DOCUMENT_TEXT}}"

[INSTRUCTIONS]
1. Lis l'intégralité du texte sans rien extrapoler.
2. Extrais les indicateurs quantitatifs clés (valeurs, dates, devises, pourcentages).
3. Ne réponds QUE sous forme d'un objet JSON strict respectant ce schéma :
{
  "client": "string",
  "budget": { "montant": number, "devise": "XOF|EUR|USD" },
  "date_debut": "YYYY-MM-DD",
  "livrables": ["string"],
  "score_confiance": number (entre 0.0 et 1.0)
}`
    },
    recommendedFor: 'Tous les professionnels travaillant avec les modèles IA générative et LLMs.',
    fileSize: '4.1 MB',
    downloadFilename: 'CheatSheet_Prompt_Engineering_RabiouSaley.pdf'
  },

  // --- BLUEPRINTS & MODÈLES MÉTIERS ---
  {
    id: 'bp_cahier_charges_ia',
    title: 'Blueprint & Modèle : Cahier des Charges pour Projet d\'Intelligence Artificielle',
    author: 'Cabinet Rabiou Saley',
    category: 'blueprints',
    coverGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    year: '2025',
    pages: 42,
    readTime: '1h 30m',
    rating: 4.96,
    format: 'Blueprint Métier',
    level: 'Intermédiaire',
    badge: 'Modèle Professionnel',
    tags: ['Cahier des Charges', 'Gouvernance', 'ROI IA', 'Livrables', 'Entreprise'],
    summary: 'Le modèle complet de cahier des charges utilisé par le Cabinet Rabiou Saley lors des missions de cadrage avec les entreprises et bailleurs internationaux. Un canevas rigoureux pour définir les objectifs, données, métriques de succès et livrables.',
    keyTakeaways: [
      'Matrice de cadrage du problème métier vs faisabilité algorithmique.',
      'Inventaire exhaustif des données : sources, fraîcheur, volume, RGPD et sécurité.',
      'Définition des métriques de succès métier (gain d\'heures, réduction d\'erreurs, ROI financier).',
      'Calendrier de jalons (Proof of Concept 4 semaines, MVP 8 semaines, Déploiement 12 semaines).'
    ],
    tableOfContents: [
      '1. Synthèse exécutive et vision du produit IA',
      '2. Cartographie des flux de données et architecture cible',
      '3. Exigences fonctionnelles et non-fonctionnelles (latence, sécurité, SLA)',
      '4. Critères d\'acceptation et matrice de tests de recette',
      '5. Modalités de maintenance et gouvernance éthique'
    ],
    recommendedFor: 'Chefs de projet, Directeurs Techniques (CTO), Consultants et Entrepreneurs.',
    fileSize: '5.8 MB',
    downloadFilename: 'Blueprint_Cahier_Charges_IA_RabiouSaley.pdf'
  },
  {
    id: 'bp_contrat_remote_freelance',
    title: 'Blueprint : Contrat de Prestation Technique & Charte NDA en Télétravail International',
    author: 'Cabinet Rabiou Saley Legal & Consulting',
    category: 'blueprints',
    coverGradient: 'from-slate-950 via-slate-900 to-indigo-950',
    year: '2025',
    pages: 35,
    readTime: '1h 15m',
    rating: 4.93,
    format: 'Blueprint Métier',
    level: 'Tous niveaux',
    badge: 'Sécurité Juridique',
    tags: ['Contrat', 'Télétravail', 'Freelance', 'NDA', 'Propriété Intellectuelle'],
    summary: 'Le contrat type de prestation de services en télétravail international, incluant les clauses de cession de propriété intellectuelle, clause de non-divulgation (NDA), conditions de paiement en devises (EUR, USD, XOF) et livrables.',
    keyTakeaways: [
      'Clauses de propriété intellectuelle protégeant le client et le prestataire.',
      'Modalités de facturation et d\'acompte (50% au lancement, 50% à la livraison finale validée).',
      'Clauses de confidentialité stricte (secret d\'affaires, code source propriétaire, données sensibles).',
      'Juridiction applicable et résolution amiable des différends pour contrats transfrontaliers.'
    ],
    tableOfContents: [
      '1. Objet de la mission et définition des livrables',
      '2. Modalités d\'exécution en télétravail asynchrone',
      '3. Conditions financières, facturation et paiements internationaux',
      '4. Propriété intellectuelle et droits patrimoniaux',
      '5. Engagement de non-divulgation (NDA)'
    ],
    recommendedFor: 'Freelances tech, entreprises clientes et consultants opérant en télétravail international.',
    fileSize: '4.6 MB',
    downloadFilename: 'Blueprint_Contrat_Prestation_Remote_RabiouSaley.pdf'
  },

  // --- TÉLÉTRAVAIL & PRODUCTIVITÉ ---
  {
    id: 'book_remote_work',
    title: 'Le Guide Ultime du Télétravail International & Freelance Tech',
    author: 'Jason Fried & David Heinemeier Hansson (Basecamp)',
    category: 'remote_work',
    coverGradient: 'from-amber-950 via-slate-900 to-orange-950',
    year: '2024',
    pages: 280,
    readTime: '3h 45m',
    rating: 4.88,
    format: 'Livre Fondateur',
    level: 'Tous niveaux',
    badge: 'Best-Seller Remote',
    tags: ['Remote Work', 'Asynchrone', 'Freelance', 'Organisation', 'International'],
    summary: 'Comment collaborer efficacement avec des clients et équipes distribués sur plusieurs fuseaux horaires sans subir la fatigue des réunions, en privilégiant l\'écrit, la documentation et les résultats concrets.',
    keyTakeaways: [
      'La primauté de la communication asynchrone écrite : clarté, concision et suppression des réunions inutiles.',
      'Rythme de travail soutenable : comment fixer des frontières nettes entre vie professionnelle et personnelle.',
      'Techniques de positionnement pour décrocher des missions à forte valeur ajoutée à l\'échelle mondiale.',
      'Outillage indispensable pour le travailleur distant : Git, Docker, Loom, Slack et Notion.'
    ],
    tableOfContents: [
      '1. Pourquoi le bureau n\'est plus obligatoire pour réussir',
      '2. Les pièges du télétravail et comment les contourner',
      '3. L\'art de la communication asynchrone percutante',
      '4. Bâtir la confiance par des livrables irréprochables'
    ],
    recommendedFor: 'Freelances, développeurs à distance, consultants et cadres en télétravail international.',
    fileSize: '9.8 MB',
    downloadFilename: 'Guide_Teletravail_International_Fried.pdf'
  },
  {
    id: 'book_deep_work',
    title: 'Deep Work : Retrouver la Concentration dans un Monde de Distractions',
    author: 'Cal Newport',
    category: 'remote_work',
    coverGradient: 'from-indigo-950 via-slate-900 to-slate-950',
    year: '2023',
    pages: 310,
    readTime: '4h 15m',
    rating: 4.9,
    format: 'Livre Fondateur',
    level: 'Tous niveaux',
    badge: 'Productivité d\'Élite',
    tags: ['Deep Work', 'Concentration', 'Productivité', 'Code', 'Discipline'],
    summary: 'La capacité à se concentrer intensément sans distraction sur des tâches cognitives complexes est la compétence reine du XXIe siècle pour tout ingénieur de données et créateur technique.',
    keyTakeaways: [
      'Les 4 règles du travail en profondeur pour produire deux fois plus en moins de temps.',
      'Éliminer la fragmentation d\'attention causée par les messageries instantanées et réseaux sociaux.',
      'Comment calibrer des blocs de 90 minutes de code ininterrompu chaque jour.',
      'Mesurer l\'impact de sa journée par la valeur produite plutôt que les heures de présence.'
    ],
    tableOfContents: [
      '1. Pourquoi le travail en profondeur est précieux et rare',
      '2. Règle #1 : Travailler avec une intensité maximale',
      '3. Règle #2 : Épouser l\'ennui et muscler l\'attention',
      '4. Règle #3 : Quitter les réseaux sociaux chronophages',
      '5. Règle #4 : Éliminer les tâches superficielles'
    ],
    recommendedFor: 'Développeurs, chercheurs, étudiants et entrepreneurs du numérique.',
    fileSize: '8.4 MB',
    downloadFilename: 'Deep_Work_Cal_Newport.pdf'
  },

  // --- STRATÉGIE, ROI & CABINET ---
  {
    id: 'book_ai_roi_strategy',
    title: 'Audit & Calcul du ROI d\'un Projet IA en Entreprise',
    author: 'Cabinet Rabiou Saley Strategy',
    category: 'strategy_business',
    coverGradient: 'from-emerald-950 via-slate-900 to-emerald-800',
    year: '2025',
    pages: 195,
    readTime: '3h 10m',
    rating: 4.96,
    format: 'Guide PDF',
    level: 'Avancé',
    badge: 'Exclusivité Cabinet',
    tags: ['Audit IA', 'ROI', 'Stratégie', 'Gouvernance', 'Décisionnaires'],
    summary: 'Le framework d\'audit stratégique du Cabinet Rabiou Saley permettant d\'évaluer la rentabilité réelle des investissements IA : modélisation financière, économies d\'échelle, gestion des risques et adoption par les équipes.',
    keyTakeaways: [
      'Formule mathématique de calcul du retour sur investissement d\'un agent automatisé.',
      'Méthode d\'analyse de rentabilité TCO (Total Cost of Ownership) intégrant les coûts API et d\'inférence.',
      'Gestion de la conduite du changement : former les collaborateurs pour démultiplier l\'efficacité.',
      'Gouvernance des données et conformité éthique internationale.'
    ],
    tableOfContents: [
      '1. Les 3 catégories d\'impact financier de l\'IA',
      '2. Calcul du coût total de possession (TCO) d\'une architecture cloud',
      '3. Mesure de la valeur créée : gains d\'heures et réduction des anomalies',
      '4. Matrice de priorisation des cas d\'usage à fort impact'
    ],
    recommendedFor: 'Directeurs Généraux, DAF, Directeurs Informatiques et Consultants Stratégie.',
    fileSize: '12.4 MB',
    downloadFilename: 'Audit_ROI_IA_Cabinet_RabiouSaley.pdf'
  }
];
