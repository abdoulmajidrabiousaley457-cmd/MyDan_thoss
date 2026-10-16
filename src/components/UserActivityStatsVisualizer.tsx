import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  FileText, 
  Bot, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  PieChart as PieIcon, 
  BarChart3, 
  LineChart as LineIcon, 
  RefreshCw, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  FolderLock,
  MessageSquare
} from 'lucide-react';
import { VaultFile } from '../types';
import { computeActivityVisualizationData } from '../services/userActivityStats';

interface UserActivityStatsVisualizerProps {
  vaultFiles?: VaultFile[];
  onOpenChat?: () => void;
  onNavigateTab?: (tab: string) => void;
  className?: string;
}

type ChartViewMode = 'timeline' | 'documents' | 'assistant' | 'combined';
type TimeRangeMode = '7d' | '30d' | '90d';

export const UserActivityStatsVisualizer: React.FC<UserActivityStatsVisualizerProps> = ({
  vaultFiles = [],
  onOpenChat,
  onNavigateTab,
  className = '',
}) => {
  const [timeRange, setTimeRange] = useState<TimeRangeMode>('30d');
  const [viewMode, setViewMode] = useState<ChartViewMode>('timeline');
  const [metricFilter, setMetricFilter] = useState<'all' | 'documents' | 'assistant'>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute stats data based on current range and vault files
  const data = useMemo(() => {
    return computeActivityVisualizationData(timeRange, vaultFiles);
  }, [timeRange, vaultFiles, refreshKey]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setIsRefreshing(false);
    }, 400);
  };

  // Custom Recharts Dark Tooltip
  const CustomTimelineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[190px]">
          <div className="border-b border-slate-800/80 pb-1.5 flex items-center justify-between">
            <span className="font-bold text-white">{label}</span>
            <span className="text-[10px] text-slate-400">Activité Quotidienne</span>
          </div>
          <div className="space-y-1.5">
            {payload.map((item: any) => (
              <div key={item.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: item.color || item.fill }}
                  />
                  <span className="text-slate-300 text-[11px]">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
            <span className="font-bold text-white">{item.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300 pt-1">
            <span>Sessions : <strong className="text-white font-mono">{item.value}</strong></span>
            <span className="text-emerald-400 font-bold">{item.payload.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-white space-y-6 ${className}`}>
      
      {/* Header Bar: Title, Context and Functional Segmented Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Cabinet Rabiou Saley • Analytics Studio</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-slate-400 font-normal">Recharts Engine</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Observatoire d'Activité & Métriques IA</span>
          </h2>

          <p className="text-xs text-slate-400 max-w-2xl">
            Suivi volumétrique en direct : génération de documents chiffrés (CV ATS, NDA, devis) et sollicitation de l'assistant intelligent Majid IA.
          </p>
        </div>

        {/* Global Controls: Time Range & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Time Range Segmented Control */}
          <div className="inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                timeRange === '7d' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Jours
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                timeRange === '30d' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Jours
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                timeRange === '90d' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Trimestre
            </button>
          </div>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Rafraîchir les métriques"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top 4 Key Metric Stat Anchors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Documents Generated */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3" />
              <span>+{data.summary.documentsGrowthPct}%</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Documents Générés</span>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {data.summary.totalDocuments}
              </span>
              <span className="text-[11px] text-slate-500 font-sans">livrables & CV</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Assistant Interactions */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-2 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
              <ArrowUpRight className="w-3 h-3" />
              <span>+{data.summary.interactionsGrowthPct}%</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Interactions Assistant IA</span>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {data.summary.totalAssistantInteractions}
              </span>
              <span className="text-[11px] text-slate-500 font-sans">requêtes & audits</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Engineering Hours Saved */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-2 relative overflow-hidden group hover:border-teal-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Gain de Temps</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Heures Économisées</span>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {data.summary.hoursSavedEstimated}h
              </span>
              <span className="text-[11px] text-teal-400 font-bold">par automatisation</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Success & Automation Rate */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-amber-300 font-medium">Précision IA</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Taux de Réussite</span>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {data.summary.automationSuccessRate}%
              </span>
              <span className="text-[11px] text-slate-500 font-sans">zéro régression</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Navigation Tabs & Secondary Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Visual Mode Selector */}
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Dynamique Temporelle</span>
          </button>

          <button
            onClick={() => setViewMode('documents')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              viewMode === 'documents'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Types de Documents</span>
          </button>

          <button
            onClick={() => setViewMode('assistant')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              viewMode === 'assistant'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Pôles Assistant IA</span>
          </button>

          <button
            onClick={() => setViewMode('combined')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              viewMode === 'combined'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vue Panoramique</span>
          </button>
        </div>

        {/* Metric Filter (Only in Timeline) */}
        {viewMode === 'timeline' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Afficher :</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMetricFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  metricFilter === 'all' 
                    ? 'bg-slate-800 text-white font-bold border border-slate-700' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Tout
              </button>
              <button
                onClick={() => setMetricFilter('documents')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  metricFilter === 'documents' 
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                    : 'text-slate-500 hover:text-emerald-400'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setMetricFilter('assistant')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  metricFilter === 'assistant' 
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30' 
                    : 'text-slate-500 hover:text-indigo-400'
                }`}
              >
                Assistant IA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Chart Canvas Area */}
      <div className="space-y-6">

        {/* VIEW 1: TIMELINE AREA CHART */}
        {viewMode === 'timeline' && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Évolution Temporelle des Livrables et Requêtes IA
                </h3>
                <p className="text-xs text-slate-400">
                  Courbes d'activité cumulées sur la période ({data.timeline.length} points de données)
                </p>
              </div>

              {/* Legend indicators */}
              <div className="flex items-center gap-4 text-xs">
                {(metricFilter === 'all' || metricFilter === 'documents') && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-300 font-medium text-[11px]">Documents Générés</span>
                  </div>
                )}
                {(metricFilter === 'all' || metricFilter === 'assistant') && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1.5 rounded-full bg-indigo-500"></span>
                    <span className="text-slate-300 font-medium text-[11px]">Interactions Assistant IA</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-72 sm:h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.timeline}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    stroke="#64748b" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTimelineTooltip />} />
                  {(metricFilter === 'all' || metricFilter === 'documents') && (
                    <Area
                      type="monotone"
                      dataKey="documentsGenerated"
                      name="Documents Générés"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorDocs)"
                      activeDot={{ r: 6, stroke: '#064e3b', strokeWidth: 2 }}
                    />
                  )}
                  {(metricFilter === 'all' || metricFilter === 'assistant') && (
                    <Area
                      type="monotone"
                      dataKey="assistantInteractions"
                      name="Interactions Assistant IA"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorChats)"
                      activeDot={{ r: 6, stroke: '#312e81', strokeWidth: 2 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* VIEW 2: DOCUMENT TYPES BAR CHART */}
        {viewMode === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Typologie des Livrables & Documents Produits
                </h3>
                <p className="text-xs text-slate-400">
                  Volume total par catégorie au sein du coffre-fort et des générateurs ATS
                </p>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.documentTypes}
                    margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(val: any, name: any, item: any) => [`${val} documents (${item.payload.percentage}%)`, item.payload.name]}
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '1rem', color: '#fff' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Bar 
                      dataKey="count" 
                      name="Documents"
                      radius={[8, 8, 0, 0]}
                    >
                      {data.documentTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Document Breakdown List */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Détail par Pôle Métier</h4>
                <p className="text-xs text-slate-400 mb-4">Pourcentage de production sur votre espace</p>
                
                <div className="space-y-3">
                  {data.documentTypes.map((item) => (
                    <div key={item.categoryKey} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-300 font-medium">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-white">{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {onNavigateTab && (
                <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
                  <button
                    onClick={() => onNavigateTab('cv_builder')}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Créer un nouveau CV ATS</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('client_vault')}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FolderLock className="w-3.5 h-3.5" />
                    <span>Ouvrir Coffre-fort Clients</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: ASSISTANT IA TOPICS PIE / DONUT */}
        {viewMode === 'assistant' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Répartition des Sollicitations de Majid IA
                </h3>
                <p className="text-xs text-slate-400">
                  Domaines d'intervention explorés lors des sessions de travail
                </p>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.assistantTopics}
                      dataKey="count"
                      nameKey="topic"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={4}
                    >
                      {data.assistantTopics.map((entry, index) => (
                        <Cell key={`pie-cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Assistant Topics Legend & Direct Trigger */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Domaines d'Assistance</h4>
                <p className="text-xs text-slate-400 mb-4">Questions et audits traités avec succès</p>
                
                <div className="space-y-3">
                  {data.assistantTopics.map((item) => (
                    <div key={item.topic} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-300 font-medium truncate max-w-[170px]" title={item.topic}>{item.topic}</span>
                        </div>
                        <span className="font-mono font-bold text-white">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {onOpenChat && (
                <div className="pt-4 border-t border-slate-800/80">
                  <button
                    onClick={onOpenChat}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-950" />
                    <span>Lancer une Consultation Majid IA</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: COMBINED PANORAMA */}
        {viewMode === 'combined' && (
          <div className="space-y-6">
            {/* Top Panorama: Timeline Area Chart */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Dynamique Globale (Livrables & IA)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Trajectoire d'activité sur {timeRange === '7d' ? '7 jours' : timeRange === '30d' ? '30 jours' : '90 jours'}
                  </p>
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.timeline}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="combDocs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="combChats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTimelineTooltip />} />
                    <Area type="monotone" dataKey="documentsGenerated" name="Documents" stroke="#10b981" fill="url(#combDocs)" strokeWidth={2} />
                    <Area type="monotone" dataKey="assistantInteractions" name="Assistant IA" stroke="#6366f1" fill="url(#combChats)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Panorama: 2 Columns for Bar + Donut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Bar Chart */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-white">Catégories de Documents</h4>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.documentTypes} margin={{ top: 5, right: 5, left: -25, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} angle={-10} textAnchor="end" />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff' }} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {data.documentTypes.map((entry, index) => (
                          <Cell key={`comb-bar-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Donut Chart */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-white">Thématiques de Consultation</h4>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.assistantTopics}
                        dataKey="count"
                        nameKey="topic"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {data.assistantTopics.map((entry, index) => (
                          <Cell key={`comb-pie-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Info & Quick Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Données actualisées en temps réel via IndexedDB et Firestore</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="font-mono text-slate-300">{data.summary.storageUsedMb} MB sécurisés</span>
        </div>

        <div className="flex items-center gap-3">
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Consulter Majid IA ↗</span>
            </button>
          )}

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('client_vault')}
              className="font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Gérer les Fichiers ↗</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
