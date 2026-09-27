import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { CVTemplateId, CVExperience, CVProject, CVEducation } from '../types';
import { AIDataEngineerTemplate, ExecutiveRemoteTemplate, MinimalTechTemplate, AcademicResearchTemplate } from '../components/cv/CVTemplates';
import { CoverLetterView } from '../components/cv/CoverLetterView';
import { ATSScoreAnalyzer } from '../components/cv/ATSScoreAnalyzer';
import { CV_PRESETS, CVPresetItem } from '../data/cvPresets';
import { 
  Printer, 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Trash2, 
  FileText, 
  Eye, 
  Check, 
  Palette, 
  Laptop, 
  Briefcase, 
  Award, 
  GraduationCap, 
  Cpu, 
  Mail, 
  Lock,
  ArrowRight,
  Download,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

export const CVBuilderScreen: React.FC = () => {
  const { cvData, updateCVData, coverLetterData, updateCoverLetterData, profile, resetCVToDefault } = useUserProfile();
  
  const [activeTab, setActiveTab] = useState<'presets' | 'editor' | 'cover_letter' | 'preview' | 'ats'>('presets');
  const [activeEditorSection, setActiveEditorSection] = useState<'info' | 'experiences' | 'projects' | 'skills' | 'education'>('info');
  const [loadedPresetMessage, setLoadedPresetMessage] = useState<string | null>(null);
  const [selectedPresetPreview, setSelectedPresetPreview] = useState<CVPresetItem | null>(null);

  const templates: { id: CVTemplateId; name: string; tag: string; desc: string }[] = [
    {
      id: 'ai_data_engineer',
      name: 'IA & Data Science Elite',
      tag: 'Recommandé Tech',
      desc: 'Optimisé pour les ingénieurs IA, Data Scientists et architectes de données.'
    },
    {
      id: 'executive_remote',
      name: 'Exécutif Télétravail International',
      tag: 'Bilingue / Remote',
      desc: 'Conçu pour postuler aux missions en télétravail auprès d\'entreprises internationales.'
    },
    {
      id: 'minimal_tech',
      name: 'Minimaliste Développeur & Freelance',
      tag: 'Monochrome',
      desc: 'Style épuré haute lisibilité mettant en valeur les dépôts et la stack technique.'
    },
    {
      id: 'academic_research',
      name: 'Recherche & Académique IA',
      tag: 'Formel',
      desc: 'Structure classique pour les masters, doctorats, enseignants et consultants.'
    }
  ];

  const accentColors = [
    { name: 'Émeraude Cabinet', color: '#16A34A' },
    { name: 'Bleu Royal Tech', color: '#0284C7' },
    { name: 'Indigo Deep IA', color: '#4F46E5' },
    { name: 'Gris Ardoise Exécutif', color: '#334155' },
    { name: 'Ambre Énergie', color: '#D97706' }
  ];

  // Helper for adding experiences
  const handleAddExperience = () => {
    const newExp: CVExperience = {
      id: `exp_${Date.now()}`,
      company: 'Nouvelle Entreprise / Client',
      role: 'Consultant Data Science / Développeur IA',
      location: 'Télétravail (Remote)',
      remoteType: 'full_remote',
      startDate: '2024',
      endDate: 'Présent',
      current: true,
      highlights: [
        'Conception de pipelines d\'automatisation avec agents IA et modèles LLMs.',
        'Optimisation des modèles prédictifs avec un gain de performance mesurable de +30%.'
      ]
    };
    updateCVData({ experiences: [newExp, ...cvData.experiences] });
  };

  const handleRemoveExperience = (id: string) => {
    updateCVData({ experiences: cvData.experiences.filter((e) => e.id !== id) });
  };

  const handleUpdateExperience = (id: string, partial: Partial<CVExperience>) => {
    updateCVData({
      experiences: cvData.experiences.map((e) => (e.id === id ? { ...e, ...partial } : e))
    });
  };

  // Helper for adding projects
  const handleAddProject = () => {
    const newProj: CVProject = {
      id: `proj_${Date.now()}`,
      title: 'Agent IA Spécialisé / Solution Machine Learning',
      technologies: ['Python', 'FastAPI', 'Gemini API', 'Docker'],
      description: 'Développement d\'une solution clé en main d\'analyse intelligente de données en temps réel.',
      impactMetric: 'Productivité multipliée par 3'
    };
    updateCVData({ projects: [newProj, ...cvData.projects] });
  };

  const handleRemoveProject = (id: string) => {
    updateCVData({ projects: cvData.projects.filter((p) => p.id !== id) });
  };

  // AI Pitch suggestions for summary
  const applyAIPitch = (type: 'data_science' | 'ai_agent' | 'remote_lead') => {
    let pitch = '';
    if (type === 'data_science') {
      pitch = 'Data Scientist Senior certifié cumulant +5 années d\'expertise en modélisation prédictive, traitement du langage naturel (NLP/LLMs) et déploiement de pipelines MLOps robustes en télétravail international. Capacité démontrée à traduire les besoins métiers en modèles à fort ROI mesurable.';
    } else if (type === 'ai_agent') {
      pitch = 'Architecte en Intelligence Artificielle & Concepteur de Systèmes Multi-Agents (LangGraph, CrewAI, AutoGen, RAG vectoriel). Spécialisé dans l\'orchestration d\'agents autonomes interconnectés aux outils métiers d\'entreprise pour automatiser les tâches complexes à 100% en remote.';
    } else {
      pitch = 'Consultant Tech & Lead Développeur habitué aux environnements de télétravail international exigeants. Rigueur d\'exécution, communication asynchrone transparente et cadence de livraison continue en méthode agile pour clients en Europe, Amérique du Nord et Afrique.';
    }
    updateCVData({ bioSummary: pitch });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadPreset = (preset: CVPresetItem, targetTab: 'editor' | 'preview' = 'editor') => {
    updateCVData(preset.cvData);
    setLoadedPresetMessage(`Exemple "${preset.title}" chargé avec succès ! Personnalisez vos données et cliquez sur "Imprimer / Télécharger PDF".`);
    setActiveTab(targetTab);
    setTimeout(() => setLoadedPresetMessage(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-700/60 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Studio Carrière & Recrutement Pro
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Créateur de CV & Lettre de Motivation Pro
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Modèles certifiés ATS conçus pour les ingénieurs IA, Data Scientists et professionnels du télétravail international. Export PDF immédiat et audit d'impact.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Télécharger PDF</span>
            </button>
            <button
              onClick={resetCVToDefault}
              title="Charger l'exemple type Cabinet"
              className="p-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-700/60">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                : 'text-emerald-300 hover:text-white hover:bg-slate-800 bg-emerald-950/60 border border-emerald-500/40'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Exemples de CV à Modifier</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-900 text-emerald-200 font-bold">5</span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Éditeur du CV
          </button>
          <button
            onClick={() => setActiveTab('cover_letter')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cover_letter'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            Lettre de Motivation Pro
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            Aperçu A4 & Modèles
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ats'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Audit ATS & Recrutement
          </button>
        </div>
      </div>

      {/* Preset Loaded Success Toast */}
      {loadedPresetMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{loadedPresetMessage}</span>
          </div>
          <button
            onClick={() => setLoadedPresetMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Subscription Watermark info for free tier */}
      {profile.tier === 'free' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Mode Gratuit actif :</strong> Vous bénéficiez du modèle de base. Passez au <strong>Plan Pro</strong> pour débloquer les 4 modèles haut de gamme, les exports illimités sans filigrane et l'audit ATS IA approfondi.
            </span>
          </div>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'subscription' }));
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 flex items-center gap-1 cursor-pointer"
          >
            Passer Pro <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ================================================= */}
      {/* TAB 0: PRESET CV EXAMPLES TO LOAD & MODIFY */}
      {/* ================================================= */}
      {activeTab === 'presets' && (
        <div className="space-y-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1">
                  <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
                  Modèles Complets Prêts à l'Emploi
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Exemples de CV à Modifier & Télécharger
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Sélectionnez un modèle adapté à votre profil tech. En un clic, l'ensemble des sections (expériences, compétences, réalisations chiffrées) est chargé dans l'éditeur pour vous permettre d'y insérer votre nom, téléphone et de télécharger votre PDF final.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('editor')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Accéder directement à l'éditeur</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {CV_PRESETS.map((pst) => (
                <div
                  key={pst.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {pst.badge}
                      </span>
                      <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: pst.accentColor }} title={`Couleur ${pst.accentColor}`} />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm md:text-base text-slate-900 leading-snug">
                        {pst.title}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                        {pst.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pst.description}
                    </p>

                    {/* Highlights pill */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-700">Contenu inclus :</div>
                      <div className="text-[11px] text-slate-500">
                        • {pst.cvData.experiences.length} expériences chiffrées (missions télétravail)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        • {pst.cvData.projects.length} projets clés avec métriques d'impact
                      </div>
                      <div className="text-[11px] text-slate-500">
                        • Stack : {pst.cvData.skillCategories.flatMap((c) => c.skills).slice(0, 4).join(', ')}...
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleLoadPreset(pst, 'preview')}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Aperçu</span>
                    </button>

                    <button
                      onClick={() => handleLoadPreset(pst, 'editor')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Charger & Modifier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* TAB 1: CV EDITOR */}
      {/* ================================================= */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
          {/* Editor Sections Navigator */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">Sections du CV</h3>
              {[
                { id: 'info', label: 'Coordonnées & Télétravail', icon: Laptop },
                { id: 'experiences', label: 'Missions & Expériences', icon: Briefcase },
                { id: 'projects', label: 'Projets IA & Livrables', icon: Cpu },
                { id: 'skills', label: 'Compétences & Stack', icon: Award },
                { id: 'education', label: 'Formations & Diplômes', icon: GraduationCap }
              ].map((sec) => {
                const Icon = sec.icon;
                const isSelected = activeEditorSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveEditorSection(sec.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-colors text-left cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Preview mini widget */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h4 className="font-bold text-xs text-slate-800 mb-2">Modèle sélectionné</h4>
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block">
                  {templates.find((t) => t.id === cvData.templateId)?.name}
                </span>
                <span className="text-[11px] text-slate-500">
                  {templates.find((t) => t.id === cvData.templateId)?.desc}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('preview')}
                className="mt-3 w-full py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Voir l'aperçu A4 en direct
              </button>
            </div>
          </div>

          {/* Active Section Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section: Coordonnées & Info */}
            {activeEditorSection === 'info' && (
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="border-b pb-3">
                  <h3 className="font-bold text-base text-slate-900">Coordonnées & Positionnement Télétravail</h3>
                  <p className="text-xs text-slate-500">Ces informations figurent dans l'en-tête de votre CV.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom complet</label>
                    <input
                      type="text"
                      value={cvData.fullName}
                      onChange={(e) => updateCVData({ fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Titre professionnel ciblé</label>
                    <input
                      type="text"
                      value={cvData.jobTitle}
                      onChange={(e) => updateCVData({ jobTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email professionnel</label>
                    <input
                      type="email"
                      value={cvData.email}
                      onChange={(e) => updateCVData({ email: e.target.value })}
                      className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de téléphone / WhatsApp</label>
                    <input
                      type="text"
                      value={cvData.phone}
                      onChange={(e) => updateCVData({ phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Localisation & Fuseau horaire</label>
                    <input
                      type="text"
                      value={cvData.location}
                      onChange={(e) => updateCVData({ location: e.target.value })}
                      className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Disponibilité Télétravail</label>
                    <select
                      value={cvData.remoteStatus}
                      onChange={(e) => updateCVData({ remoteStatus: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Full Remote Ready">Full Remote Ready (Télétravail 100%)</option>
                      <option value="Hybride">Hybride (Présentiel & Remote)</option>
                      <option value="Freelance International">Freelance International</option>
                      <option value="Disponible immédiatement">Disponible immédiatement</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Lien Portfolio / Démo</label>
                    <input
                      type="text"
                      value={cvData.portfolioUrl}
                      onChange={(e) => updateCVData({ portfolioUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Profil LinkedIn</label>
                    <input
                      type="text"
                      value={cvData.linkedinUrl}
                      onChange={(e) => updateCVData({ linkedinUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub / Dépôt de code</label>
                    <input
                      type="text"
                      value={cvData.githubUrl}
                      onChange={(e) => updateCVData({ githubUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Bio Summary with AI Pitch helper */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Résumé professionnel & Pitch d'accroche
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>Suggestions IA :</span>
                      <button
                        onClick={() => applyAIPitch('data_science')}
                        className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold cursor-pointer"
                      >
                        Data Science
                      </button>
                      <button
                        onClick={() => applyAIPitch('ai_agent')}
                        className="px-2 py-0.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold cursor-pointer"
                      >
                        Agents IA
                      </button>
                      <button
                        onClick={() => applyAIPitch('remote_lead')}
                        className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold cursor-pointer"
                      >
                        Télétravail
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={cvData.bioSummary}
                    onChange={(e) => updateCVData({ bioSummary: e.target.value })}
                    className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Section: Expériences */}
            {activeEditorSection === 'experiences' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Missions & Expériences Professionnelles</h3>
                    <p className="text-xs text-slate-500">Présentez vos réalisations avec des chiffres d'impact mesurables.</p>
                  </div>
                  <button
                    onClick={handleAddExperience}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter une expérience
                  </button>
                </div>

                {cvData.experiences.map((exp, index) => (
                  <div key={exp.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-400">Poste #{index + 1}</span>
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Supprimer cette expérience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé du poste</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(exp.id, { role: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Entreprise / Organisation</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Période (Début - Fin)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="ex: Jan 2023"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(exp.id, { startDate: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                          <input
                            type="text"
                            placeholder="ex: Présent"
                            value={exp.endDate}
                            onChange={(e) => handleUpdateExperience(exp.id, { endDate: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Format de travail</label>
                        <select
                          value={exp.remoteType}
                          onChange={(e) => handleUpdateExperience(exp.id, { remoteType: e.target.value as any })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="full_remote">Télétravail Full Remote</option>
                          <option value="hybrid">Hybride</option>
                          <option value="onsite">Sur site</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Faits marquants & Réalisations (1 par ligne)
                      </label>
                      <textarea
                        rows={3}
                        value={exp.highlights.join('\n')}
                        onChange={(e) => handleUpdateExperience(exp.id, { highlights: e.target.value.split('\n') })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
                        placeholder="Ajoutez vos résultats chiffrés..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section: Projets */}
            {activeEditorSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Projets & Réalisations Clés</h3>
                    <p className="text-xs text-slate-500">Mettez en avant vos projets phares d'agents IA et de Data Science.</p>
                  </div>
                  <button
                    onClick={handleAddProject}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter un projet
                  </button>
                </div>

                {cvData.projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-400">Projet #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveProject(proj.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du projet</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = cvData.projects.map((p) => p.id === proj.id ? { ...p, title: e.target.value } : p);
                            updateCVData({ projects: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Métrique d'impact (ex: +40% gain)</label>
                        <input
                          type="text"
                          value={proj.impactMetric || ''}
                          onChange={(e) => {
                            const updated = cvData.projects.map((p) => p.id === proj.id ? { ...p, impactMetric: e.target.value } : p);
                            updateCVData({ projects: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Description courte du projet</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const updated = cvData.projects.map((p) => p.id === proj.id ? { ...p, description: e.target.value } : p);
                          updateCVData({ projects: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Technologies (séparées par une virgule)</label>
                      <input
                        type="text"
                        value={proj.technologies.join(', ')}
                        onChange={(e) => {
                          const techs = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                          const updated = cvData.projects.map((p) => p.id === proj.id ? { ...p, technologies: techs } : p);
                          updateCVData({ projects: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section: Compétences */}
            {activeEditorSection === 'skills' && (
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-bold text-base text-slate-900">Compétences Techniques & Outils</h3>
                  <p className="text-xs text-slate-500">Groupées par domaine d'expertise.</p>
                </div>

                {cvData.skillCategories.map((cat, cIdx) => (
                  <div key={cIdx} className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">{cat.category}</label>
                    <input
                      type="text"
                      value={cat.skills.join(', ')}
                      onChange={(e) => {
                        const skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        const updated = [...cvData.skillCategories];
                        updated[cIdx] = { ...updated[cIdx], skills };
                        updateCVData({ skillCategories: updated });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Section: Formation */}
            {activeEditorSection === 'education' && (
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-bold text-base text-slate-900">Formations & Diplômes</h3>
                  <p className="text-xs text-slate-500">Votre parcours académique et spécialisations.</p>
                </div>

                {cvData.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Diplôme</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = cvData.education.map((item) => item.id === edu.id ? { ...item, degree: e.target.value } : item);
                            updateCVData({ education: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Établissement & Lieu</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = cvData.education.map((item) => item.id === edu.id ? { ...item, institution: e.target.value } : item);
                            updateCVData({ education: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* TAB 2: COVER LETTER BUILDER */}
      {/* ================================================= */}
      {activeTab === 'cover_letter' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Paramètres de la Lettre</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Poste visé</label>
                <input
                  type="text"
                  value={coverLetterData.jobTarget}
                  onChange={(e) => updateCoverLetterData({ jobTarget: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Entreprise ciblée</label>
                <input
                  type="text"
                  value={coverLetterData.companyName}
                  onChange={(e) => updateCoverLetterData({ companyName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Format de travail</label>
                <select
                  value={coverLetterData.workArrangement}
                  onChange={(e) => updateCoverLetterData({ workArrangement: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Télétravail Full Remote">Télétravail Full Remote</option>
                  <option value="Mission Freelance Cabinet">Mission Freelance Cabinet</option>
                  <option value="Poste Hybride / CDI">Poste Hybride / CDI</option>
                </select>
              </div>

              <div className="pt-2 border-t">
                <button
                  onClick={handlePrint}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer la Lettre en PDF
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b pb-2">Contenu & Rédaction Personnalisée</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Accroche & Présentation</label>
                <textarea
                  rows={3}
                  value={coverLetterData.hookParagraph}
                  onChange={(e) => updateCoverLetterData({ hookParagraph: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Compétences & Valeur ajoutée en Télétravail</label>
                <textarea
                  rows={4}
                  value={coverLetterData.skillsParagraph}
                  onChange={(e) => updateCoverLetterData({ skillsParagraph: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Conclusion & Proposition d'entretien</label>
                <textarea
                  rows={3}
                  value={coverLetterData.closingParagraph}
                  onChange={(e) => updateCoverLetterData({ closingParagraph: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 leading-relaxed"
                />
              </div>
            </div>

            {/* Live Cover Letter Display */}
            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Rendu Visuel de la Lettre</h4>
              <CoverLetterView data={coverLetterData} accentColor={cvData.accentColor} />
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* TAB 3: LIVE A4 PREVIEW & TEMPLATES SELECTOR */}
      {/* ================================================= */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 print:hidden">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Style & Mise en page du Modèle</span>
                <div className="flex flex-wrap gap-2">
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => updateCVData({ templateId: tpl.id })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        cvData.templateId === tpl.id
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Couleur d'accent</span>
                  <div className="flex items-center gap-2">
                    {accentColors.map((c) => (
                      <button
                        key={c.color}
                        onClick={() => updateCVData({ accentColor: c.color })}
                        style={{ backgroundColor: c.color }}
                        title={c.name}
                        className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                          cvData.accentColor === c.color ? 'scale-125 ring-2 ring-offset-2 ring-slate-900' : 'hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden sm:block" />

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('presets')}
                    className="px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Changer d'exemple</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Télécharger PDF (A4)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Render chosen template */}
          <div className="py-4">
            {cvData.templateId === 'ai_data_engineer' && <AIDataEngineerTemplate data={cvData} />}
            {cvData.templateId === 'executive_remote' && <ExecutiveRemoteTemplate data={cvData} />}
            {cvData.templateId === 'minimal_tech' && <MinimalTechTemplate data={cvData} />}
            {cvData.templateId === 'academic_research' && <AcademicResearchTemplate data={cvData} />}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* TAB 4: ATS SCORE & RECRUITER AUDIT */}
      {/* ================================================= */}
      {activeTab === 'ats' && (
        <div className="space-y-6 print:hidden">
          <ATSScoreAnalyzer data={cvData} />

          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-xl p-6 shadow-md border border-emerald-800">
            <h3 className="font-bold text-base mb-1">Conseil Recrutement Télétravail International</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Pour décrocher des contrats en télétravail auprès d'entreprises internationales, insistez particulièrement sur vos compétences en communication asynchrone, vos outils de gestion de projet (Jira, GitHub Projects) et vos résultats mesurés en autonomie.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
