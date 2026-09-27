import React, { useState } from 'react';
import { CABINET_INFO, CABINET_SERVICES, PORTFOLIO_PROJECTS, CABINET_PILLARS, REMOTE_METHODOLOGY_STEPS } from '../data/cabinetData';
import { 
  Bot, 
  TrendingUp, 
  Eye, 
  CloudLightning, 
  ExternalLink, 
  CheckCircle, 
  ShieldCheck, 
  Laptop, 
  Code, 
  Calendar, 
  Mail, 
  Phone, 
  Globe, 
  ArrowRight, 
  FileText, 
  Sparkles,
  Award,
  Users,
  ArrowRightLeft,
  BookOpen
} from 'lucide-react';

interface PortfolioCabinetScreenProps {
  onNavigateTab?: (tab: string) => void;
}

export const PortfolioCabinetScreen: React.FC<PortfolioCabinetScreenProps> = ({ onNavigateTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>('p1');

  const filteredProjects = selectedCategory === 'all'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot': return <Bot className="w-5 h-5 text-emerald-600" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-sky-600" />;
      case 'Eye': return <Eye className="w-5 h-5 text-indigo-600" />;
      case 'CloudLightning': return <CloudLightning className="w-5 h-5 text-amber-600" />;
      default: return <Bot className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-8 md:p-12 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {CABINET_INFO.statusBadge}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {CABINET_INFO.name}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {CABINET_INFO.fullName}
            </h1>
            <p className="text-base md:text-xl text-slate-300 font-medium max-w-3xl leading-relaxed">
              {CABINET_INFO.title}
            </p>
          </div>

          <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
            {CABINET_INFO.bio}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">{CABINET_INFO.stats.experienceYears}</div>
              <div className="text-xs text-slate-400 mt-0.5">Années d'expérience</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl md:text-3xl font-extrabold text-white">{CABINET_INFO.stats.projectsDelivered}</div>
              <div className="text-xs text-slate-400 mt-0.5">Projets IA & Data livrés</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl md:text-3xl font-extrabold text-sky-400">{CABINET_INFO.stats.remoteClientsCount}</div>
              <div className="text-xs text-slate-400 mt-0.5">Clients en Télétravail</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl md:text-3xl font-extrabold text-amber-400">{CABINET_INFO.stats.clientSatisfaction}</div>
              <div className="text-xs text-slate-400 mt-0.5">Satisfaction client</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateTab ? onNavigateTab('remote_devis') : window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'remote_devis' }))}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Laptop className="w-4 h-4" />
              <span>Demander un Devis Télétravail</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab ? onNavigateTab('cv_builder') : window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'cv_builder' }))}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Outils CV & Carrière Pro</span>
            </button>

            <button
              onClick={() => onNavigateTab ? onNavigateTab('currency') : window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'currency' }))}
              className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              <span>Convertisseur Devises</span>
            </button>

            <button
              onClick={() => onNavigateTab ? onNavigateTab('library') : window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'library' }))}
              className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Bibliothèque Pro</span>
            </button>

            <a
              href={CABINET_INFO.portfolioOfficialUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-medium text-sm border border-slate-800 flex items-center gap-2 transition-all"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Portfolio Officiel</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Cabinet Pillars for Remote Work */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Garanties & Rigueur</span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Les Engagements Télétravail du Cabinet
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Une pratique rodée de la collaboration à distance pour les entreprises exigeantes en Europe, Amérique et Afrique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CABINET_PILLARS.map((pillar, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">{pillar.stats}</div>
              <h3 className="font-bold text-sm text-slate-900">{pillar.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services du Cabinet */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Offre de Services</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Pôles d'Expertise & Livrables en Télétravail
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab ? onNavigateTab('remote_devis') : window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'remote_devis' }))}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            Estimer votre projet <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CABINET_SERVICES.map((srv) => (
            <div key={srv.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {getServiceIcon(srv.iconName)}
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200">
                    {srv.hourlyRate}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">Délai : {srv.remoteTimeline}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{srv.title}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{srv.subtitle}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{srv.description}</p>
              </div>

              {/* Deliverables */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Livrables types</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {srv.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools chips */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {srv.tools.map((tool, i) => (
                  <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Showcase Projets Réalisés */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Réalisations & Cas d'Usage</span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-white">
              Portfolio de Projets d'Excellence
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Des systèmes d'IA opérationnels, déployés en production à distance pour des clients internationaux.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Tous les projets' },
              { id: 'agents_ia', label: 'Agents IA' },
              { id: 'data_science', label: 'Data Science' },
              { id: 'computer_vision', label: 'Computer Vision' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => {
            const isExpanded = expandedProjectId === proj.id;
            return (
              <div
                key={proj.id}
                className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-emerald-500/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {proj.category === 'agents_ia' ? 'Agent IA RAG' : proj.category === 'data_science' ? 'Machine Learning' : 'Computer Vision'}
                    </span>
                    <span className="text-xs text-slate-400">{proj.completionYear} • Remote</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{proj.summary}</p>

                  {/* Metrics bar */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-700">
                    {proj.metrics.map((m, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-base font-extrabold text-emerald-400">{m.value}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Challenge & Solution */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-300">Défi client : </span>
                      <span className="text-slate-400">{proj.challenge}</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-400">Solution délivrée : </span>
                      <span className="text-slate-300">{proj.solution}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Livré en télétravail
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Organisation Agile</span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Comment se déroule une mission en télétravail ?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Un processus en 4 étapes transparentes pour un résultat prévisible, documenté et sans frictions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REMOTE_METHODOLOGY_STEPS.map((step) => (
            <div key={step.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-2xl font-black text-emerald-600 block">{step.step}</span>
              <h3 className="font-bold text-sm text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Contact Bar */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-bold">Vous avez un projet d'Agent IA ou de Data Science ?</h3>
          <p className="text-xs text-emerald-100">
            Échangez directement avec Rabiou Saley pour cadrer votre mission en télétravail.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:abdoulmajidrabiousaley457@gmail.com"
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs flex items-center gap-2 hover:bg-emerald-50 transition-colors"
          >
            <Mail className="w-4 h-4 text-emerald-700" />
            <span>abdoulmajidrabiousaley457@gmail.com</span>
          </a>
          <a
            href="tel:+22796499906"
            className="px-4 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs border border-emerald-700 flex items-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <Phone className="w-4 h-4 text-emerald-300" />
            <span>+227 96 49 99 06</span>
          </a>
        </div>
      </div>
    </div>
  );
};
