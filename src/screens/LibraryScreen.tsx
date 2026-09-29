import React, { useState, useEffect } from 'react';
import { LIBRARY_BOOKS } from '../data/libraryData';
import { BookResource } from '../types';
import { 
  BookOpen, 
  Search, 
  Download, 
  Star, 
  Clock, 
  FileText, 
  Sparkles, 
  Check, 
  X, 
  Bookmark,
  CheckCircle2,
  Cpu,
  Laptop,
  Code2,
  Terminal,
  Copy,
  Layers,
  ArrowRight,
  Filter,
  Eye,
  SlidersHorizontal,
  BookmarkCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export const LibraryScreen: React.FC = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<BookResource | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'summary' | 'toc' | 'code' | 'export'>('summary');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Local storage for Favorites and Reading Status
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rabiou_saley_library_favorites');
      return saved ? JSON.parse(saved) : ['book_multiagents_ai', 'cs_python_datascience'];
    } catch {
      return ['book_multiagents_ai', 'cs_python_datascience'];
    }
  });

  const [readingStatus, setReadingStatus] = useState<Record<string, 'unread' | 'reading' | 'completed'>>(() => {
    try {
      const saved = localStorage.getItem('rabiou_saley_library_status');
      return saved ? JSON.parse(saved) : { book_multiagents_ai: 'reading' };
    } catch {
      return { book_multiagents_ai: 'reading' };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rabiou_saley_library_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('rabiou_saley_library_status', JSON.stringify(readingStatus));
    } catch (e) {
      console.warn('Could not save reading status', e);
    }
  }, [readingStatus]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const updateStatus = (id: string, status: 'unread' | 'reading' | 'completed', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReadingStatus((prev) => ({
      ...prev,
      [id]: status
    }));
  };

  const categories = [
    { id: 'all', label: 'Toutes les Ressources', count: LIBRARY_BOOKS.length },
    { id: 'favorites', label: '⭐ Mes Favoris', count: favorites.length },
    { id: 'agents_ia', label: 'Agents IA & LLMs', count: LIBRARY_BOOKS.filter((b) => b.category === 'agents_ia').length },
    { id: 'data_science', label: 'Data Science & MLOps', count: LIBRARY_BOOKS.filter((b) => b.category === 'data_science').length },
    { id: 'cheat_sheets', label: '⚡ Aide-Mémoires & Cheat Sheets', count: LIBRARY_BOOKS.filter((b) => b.category === 'cheat_sheets').length },
    { id: 'blueprints', label: '📐 Blueprints & Modèles', count: LIBRARY_BOOKS.filter((b) => b.category === 'blueprints').length },
    { id: 'remote_work', label: 'Télétravail & Productivité', count: LIBRARY_BOOKS.filter((b) => b.category === 'remote_work').length },
    { id: 'strategy_business', label: 'Stratégie & ROI IA', count: LIBRARY_BOOKS.filter((b) => b.category === 'strategy_business').length }
  ];

  const levels = [
    { id: 'all', label: 'Tous niveaux' },
    { id: 'Débutant', label: 'Débutant' },
    { id: 'Intermédiaire', label: 'Intermédiaire' },
    { id: 'Avancé', label: 'Avancé' },
    { id: 'Expert', label: 'Expert' }
  ];

  const filteredBooks = LIBRARY_BOOKS.filter((book) => {
    // Category or favorites filter
    if (selectedCategory === 'favorites') {
      if (!favorites.includes(book.id)) return false;
    } else if (selectedCategory !== 'all' && book.category !== selectedCategory) {
      return false;
    }

    // Level filter
    if (selectedLevel !== 'all' && book.level && book.level !== selectedLevel && book.level !== 'Tous niveaux') {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = book.title.toLowerCase().includes(q);
      const inAuthor = book.author.toLowerCase().includes(q);
      const inSummary = book.summary.toLowerCase().includes(q);
      const inTags = book.tags?.some((t) => t.toLowerCase().includes(q));
      const inTakeaways = book.keyTakeaways.some((k) => k.toLowerCase().includes(q));
      return inTitle || inAuthor || inSummary || inTags || inTakeaways;
    }

    return true;
  });

  const handleExportSummary = (book: BookResource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    let textContent = `CABINET RABIOU SALEY - BIBLIOTHÈQUE NUMÉRIQUE & RECHERCHE APPLIQUÉE
========================================================================
Document : ${book.title}
Auteur : ${book.author} (${book.year})
Format : ${book.format || 'Document Technique'} | Niveau : ${book.level || 'Tous niveaux'}
Temps de lecture estimé : ${book.readTime} | Pages : ${book.pages}
Note d'évaluation : ${book.rating} / 5.0

------------------------------------------------------------------------
1. RÉSUMÉ EXÉCUTIF
------------------------------------------------------------------------
${book.summary}

------------------------------------------------------------------------
2. ENSEIGNEMENTS STRATÉGIQUES & POINTS CLÉS
------------------------------------------------------------------------
${book.keyTakeaways.map((k, i) => `[${i + 1}] ${k}`).join('\n\n')}
`;

    if (book.tableOfContents && book.tableOfContents.length > 0) {
      textContent += `\n------------------------------------------------------------------------
3. SOMMAIRE DU DOCUMENT
------------------------------------------------------------------------
${book.tableOfContents.join('\n')}
`;
    }

    if (book.codeSnippet) {
      textContent += `\n------------------------------------------------------------------------
4. EXTRAIT DE CODE DE RÉFÉRENCE (${book.codeSnippet.title})
------------------------------------------------------------------------
// Langage : ${book.codeSnippet.language}
${book.codeSnippet.code}
`;
    }

    if (book.promptTemplate) {
      textContent += `\n------------------------------------------------------------------------
5. MODÈLE DE PROMPT RECOMMANDÉ (${book.promptTemplate.title})
------------------------------------------------------------------------
${book.promptTemplate.prompt}
`;
    }

    textContent += `\n------------------------------------------------------------------------
PUBLIC RECOMMANDÉ : ${book.recommendedFor}
------------------------------------------------------------------------
Cabinet Rabiou Saley - Ingénierie Data Science, Agents IA & Télétravail International
Contact WhatsApp : +227 96 49 99 06
Email : abdoulmajidrabiousaley457@gmail.com
Portfolio : https://mon-portfolio-fin-ten.vercel.app/
Agent Omni Studio : https://omni-studio-abdoul.ai.studio
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = book.downloadFilename.replace('.pdf', '_Synthese.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage(`Fiche exportée avec succès : "${book.title}"`);
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Centre de Ressources, Recherche & Modèles Techniques</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Bibliothèque d'Ingénierie IA, Data Science & Télétravail
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Consultez les guides de recherche du <strong>Cabinet Rabiou Saley</strong>, les ouvrages fondamentaux d'apprentissage automatique, les aide-mémoires prêts à l'emploi (Cheat Sheets Python & Prompting) ainsi que nos blueprints et canevas de contrats internationaux.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/80">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{LIBRARY_BOOKS.length} Ouvrages & Guides</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/80">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>{favorites.length} Mis en favoris</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Lecteur interactif intégré</span>
            </span>
          </div>
        </div>
      </div>

      {/* Success alert message */}
      {downloadSuccessMessage && (
        <div className="bg-emerald-950/80 text-emerald-200 border border-emerald-500/50 p-4 rounded-2xl flex items-center justify-between text-sm shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setDownloadSuccessMessage(null)}
            className="text-emerald-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search, Filter Bar and View Mode */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, auteur, mots-clés (LangGraph, Python, MLOps, Prompt)..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter & Layout Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative inline-flex items-center bg-white border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 mr-2" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-2"
              >
                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-emerald-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Affichage Cartes"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'compact' 
                    ? 'bg-white text-emerald-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Affichage Liste & Fiches"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Books & Resources Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Aucun document ne correspond à votre recherche</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Essayez de réinitialiser vos filtres ou effectuez une recherche avec d'autres mots-clés comme "Python", "RAG", ou "Agents".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const isFav = favorites.includes(book.id);
            const status = readingStatus[book.id] || 'unread';

            return (
              <div
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  setActiveModalTab('summary');
                }}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Book Card Cover Header */}
                  <div className={`p-6 bg-gradient-to-br ${book.coverGradient} text-white relative overflow-hidden min-h-[170px] flex flex-col justify-between`}>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none"></div>

                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-2 relative z-10">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-emerald-300 uppercase tracking-wide">
                        {book.badge || book.format || 'Guide Pro'}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => toggleFavorite(book.id, e)}
                          className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${
                            isFav 
                              ? 'bg-amber-400 text-slate-950 shadow-md' 
                              : 'bg-black/30 hover:bg-black/50 text-white/80 hover:text-white'
                          }`}
                          title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-slate-950' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title & Author */}
                    <div className="relative z-10 mt-3 space-y-1">
                      <h3 className="font-bold text-base text-white leading-snug line-clamp-2 group-hover:text-emerald-200 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">
                        {book.author} • <span className="opacity-75">{book.year}</span>
                      </p>
                    </div>

                    {/* Format and Level Indicator */}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10 text-[11px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{book.readTime}</span>
                      </span>
                      <span>•</span>
                      <span>{book.pages} pages</span>
                      {book.level && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-300 font-medium">{book.level}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    {/* Tags */}
                    {book.tags && book.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {book.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Summary */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {book.summary}
                    </p>

                    {/* Key points preview */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                      <div className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Enseignement Clé</span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium line-clamp-2">
                        {book.keyTakeaways[0]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setActiveModalTab('summary');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lire la Fiche</span>
                  </button>

                  <button
                    onClick={(e) => handleExportSummary(book, e)}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
                    title="Exporter la fiche de synthèse en texte"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View */
        <div className="space-y-3">
          {filteredBooks.map((book) => {
            const isFav = favorites.includes(book.id);

            return (
              <div
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  setActiveModalTab('summary');
                }}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-12 h-14 rounded-xl bg-gradient-to-br ${book.coverGradient} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                    <FileText className="w-6 h-6 text-emerald-300" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {book.badge || book.format}
                      </span>
                      {book.level && (
                        <span className="text-[10px] font-semibold text-slate-500">
                          • {book.level}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        • {book.readTime}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {book.title}
                    </h4>

                    <p className="text-xs text-slate-500">
                      {book.author} ({book.year}) • {book.pages} pages
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={(e) => toggleFavorite(book.id, e)}
                    className={`p-2 rounded-xl border transition-all ${
                      isFav 
                        ? 'bg-amber-50 text-amber-600 border-amber-200' 
                        : 'bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handleExportSummary(book, e)}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
                    title="Exporter la synthèse"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setActiveModalTab('summary');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Consulter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reader / Document Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedBook.coverGradient} text-white relative`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-emerald-300 border border-white/10 uppercase">
                      {selectedBook.badge || selectedBook.format}
                    </span>
                    {selectedBook.level && (
                      <span className="text-xs text-slate-300 font-medium">
                        Niveau : {selectedBook.level}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    {selectedBook.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300">
                    Par {selectedBook.author} • {selectedBook.year} • {selectedBook.pages} pages • {selectedBook.readTime}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(selectedBook.id)}
                    className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                      favorites.includes(selectedBook.id)
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-black/30 hover:bg-black/50 text-white'
                    }`}
                    title="Favori"
                  >
                    <Star className={`w-4 h-4 ${favorites.includes(selectedBook.id) ? 'fill-slate-950' : ''}`} />
                  </button>

                  <button
                    onClick={() => setSelectedBook(null)}
                    className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs in Modal */}
              <div className="flex items-center gap-2 mt-6 pt-3 border-t border-white/10 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveModalTab('summary')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeModalTab === 'summary'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📖 Résumé & Enseignements
                </button>

                {selectedBook.tableOfContents && selectedBook.tableOfContents.length > 0 && (
                  <button
                    onClick={() => setActiveModalTab('toc')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      activeModalTab === 'toc'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    📑 Sommaire Détaillé ({selectedBook.tableOfContents.length})
                  </button>
                )}

                {(selectedBook.codeSnippet || selectedBook.promptTemplate) && (
                  <button
                    onClick={() => setActiveModalTab('code')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      activeModalTab === 'code'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    💻 Code & Prompts de Référence
                  </button>
                )}

                <button
                  onClick={() => setActiveModalTab('export')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeModalTab === 'export'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📋 Fiche Métier & Export
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {activeModalTab === 'summary' && (
                <div className="space-y-6">
                  {/* Status update selector */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                      Statut de lecture :
                    </span>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => updateStatus(selectedBook.id, 'unread')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          readingStatus[selectedBook.id] === 'unread' || !readingStatus[selectedBook.id]
                            ? 'bg-slate-100 text-slate-900 font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        À lire
                      </button>
                      <button
                        onClick={() => updateStatus(selectedBook.id, 'reading')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          readingStatus[selectedBook.id] === 'reading'
                            ? 'bg-amber-100 text-amber-900 font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        En cours
                      </button>
                      <button
                        onClick={() => updateStatus(selectedBook.id, 'completed')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          readingStatus[selectedBook.id] === 'completed'
                            ? 'bg-emerald-100 text-emerald-900 font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Terminé ✓
                      </button>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Résumé Exécutif
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100 font-normal">
                      {selectedBook.summary}
                    </p>
                  </div>

                  {/* Strategic Key Takeaways */}
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Points Clés & Enseignements Stratégiques
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {selectedBook.keyTakeaways.map((takeaway, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                            {takeaway}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audience & Tags */}
                  <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
                    <span className="text-xs font-bold text-emerald-950 uppercase">Public Ciblé & Recommandé :</span>
                    <p className="text-xs text-emerald-900 font-medium">
                      {selectedBook.recommendedFor}
                    </p>
                  </div>
                </div>
              )}

              {/* Table of Contents Tab */}
              {activeModalTab === 'toc' && selectedBook.tableOfContents && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      Sommaire Détaillé de l'Ouvrage
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold">
                      {selectedBook.tableOfContents.length} chapitres structurés
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    {selectedBook.tableOfContents.map((chap, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800">
                            {chap}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          Section {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Snippets & Prompt Tab */}
              {activeModalTab === 'code' && (
                <div className="space-y-6">
                  {selectedBook.codeSnippet && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Code2 className="w-4 h-4 text-emerald-600" />
                          {selectedBook.codeSnippet.title}
                        </span>
                        <button
                          onClick={() => handleCopyCode(selectedBook.codeSnippet!.code)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copié !' : 'Copier le code'}</span>
                        </button>
                      </div>

                      <div className="bg-slate-950 rounded-2xl p-4 overflow-x-auto text-slate-200 font-mono text-xs border border-slate-800">
                        <pre>
                          <code>{selectedBook.codeSnippet.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {selectedBook.promptTemplate && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Terminal className="w-4 h-4 text-purple-600" />
                          {selectedBook.promptTemplate.title}
                        </span>
                        <button
                          onClick={() => handleCopyCode(selectedBook.promptTemplate!.prompt)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copié !' : 'Copier le prompt'}</span>
                        </button>
                      </div>

                      <div className="bg-slate-900 rounded-2xl p-4 text-purple-200 font-mono text-xs border border-slate-800 leading-relaxed whitespace-pre-wrap">
                        {selectedBook.promptTemplate.prompt}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fiche Métier & Export Tab */}
              {activeModalTab === 'export' && (
                <div className="space-y-5">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      Fiche Métier & Données Techniques
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Catégorie</span>
                        <span className="font-bold text-slate-800 capitalize">{selectedBook.category.replace('_', ' ')}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Année</span>
                        <span className="font-bold text-slate-800">{selectedBook.year}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Format</span>
                        <span className="font-bold text-slate-800">{selectedBook.format || 'Guide PDF'}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Poids fichier</span>
                        <span className="font-bold text-slate-800">{selectedBook.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="font-bold text-sm text-emerald-950">Télécharger la Fiche de Synthèse Complète</h4>
                      <p className="text-xs text-emerald-800">
                        Générez un document textuel contenant le résumé exécutif, le sommaire, les points clés et les snippets.
                      </p>
                    </div>

                    <button
                      onClick={() => handleExportSummary(selectedBook)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Exporter la Synthèse</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Cabinet Rabiou Saley Research Lab</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-emerald-700 font-bold">Télétravail International</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportSummary(selectedBook)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger la Synthèse</span>
                </button>

                <button
                  onClick={() => setSelectedBook(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advisory & Custom Research Callout */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>Études Sur-Mesure & Conseil Stratégique</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold">
            Besoin d'un livre blanc ou d'un cadrage technique dédié à votre entreprise ?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Le Cabinet Rabiou Saley conçoit des architectures d'agents sur-mesure, des audits de rentabilité IA et forme vos équipes en télétravail asynchrone international.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href="https://mon-portfolio-fin-ten.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs text-center transition-all shadow-md"
          >
            Explorer le Portfolio en Direct ↗
          </a>
          <a
            href="https://wa.me/22796499906"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs text-center transition-all shadow-md"
          >
            Contacter sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
