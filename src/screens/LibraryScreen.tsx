import React, { useState } from 'react';
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
  ExternalLink, 
  Layers, 
  Bookmark,
  CheckCircle2,
  Cpu,
  Laptop
} from 'lucide-react';

export const LibraryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<BookResource | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tous les Ouvrages', count: LIBRARY_BOOKS.length },
    { id: 'agents_ia', label: 'Agents IA & LLMs', count: LIBRARY_BOOKS.filter((b) => b.category === 'agents_ia').length },
    { id: 'data_science', label: 'Data Science & Code', count: LIBRARY_BOOKS.filter((b) => b.category === 'data_science').length },
    { id: 'remote_work', label: 'Télétravail & Productivité', count: LIBRARY_BOOKS.filter((b) => b.category === 'remote_work').length },
    { id: 'strategy_business', label: 'Stratégie & Cabinet', count: LIBRARY_BOOKS.filter((b) => b.category === 'strategy_business').length }
  ];

  const filteredBooks = LIBRARY_BOOKS.filter((book) => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (book: BookResource) => {
    // Generate text content pretending to be the official guide book
    const textContent = `CABINET RABIOU SALEY - BIBLIOTHÈQUE NUMÉRIQUE PRO
======================================================
Ouvrage : ${book.title}
Auteur : ${book.author} (${book.year})
Catégorie : ${book.category}
Temps de lecture estimé : ${book.readTime}
Pages : ${book.pages}

RÉSUMÉ EXÉCUTIF :
-----------------
${book.summary}

POINTS CLÉS & ENSEIGNEMENTS STRATÉGIQUES :
------------------------------------------
${book.keyTakeaways.map((k, i) => `${i + 1}. ${k}`).join('\n')}

PUBLIC RECOMMANDÉ :
-------------------
${book.recommendedFor}

Cabinet d'Expertise Rabiou Saley - Niamey, Niger / Télétravail International
Contact : abdoulmajidrabiousaley457@gmail.com | +227 96 49 99 06
Portfolio : https://rabiou-saley-abdoul-majid-data-science-agent-ia.ai.studio/
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = book.downloadFilename.replace('.pdf', '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage(`Téléchargement initié : "${book.title}" (${book.fileSize})`);
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          Bibliothèque & Centre de Ressources du Cabinet
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Bibliothèque Numérique d'Excellence
        </h1>
        <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
          Consultez et téléchargez les livres, guides pratiques et synthèses techniques de référence sélectionnés par Rabiou Saley pour accélérer votre maîtrise des Agents IA, de la Data Science et du télétravail international.
        </p>

        {/* Search Input */}
        <div className="pt-2 max-w-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur, mot-clé (LangGraph, MLOps, Remote, etc.)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {downloadSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{downloadSuccessMessage}</span>
          </div>
          <button onClick={() => setDownloadSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedCategory === cat.id ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-500'}`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Book Cover Gradient Header */}
            <div className={`p-6 bg-gradient-to-br ${book.coverGradient} text-white relative`}>
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/20 uppercase tracking-wider">
                  {book.category.replace('_', ' ')}
                </span>
                {book.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950">
                    {book.badge}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <h3 className="font-extrabold text-base md:text-lg text-white leading-snug group-hover:text-emerald-300 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1">{book.author} • {book.year}</p>
              </div>

              <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-300 border-t border-white/10 pt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{book.rating}</span>
                </div>
                <div>•</div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{book.readTime}</span>
                </div>
                <div>•</div>
                <div className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{book.pages} pages</span>
                </div>
              </div>
            </div>

            {/* Book Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {book.summary}
                </p>

                {/* Key takeaway highlight */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Point clé :
                  </span>
                  <p className="text-[11px] text-slate-700 leading-snug font-medium">
                    {book.keyTakeaways[0]}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedBook(book)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Lire la synthèse
                </button>
                <button
                  onClick={() => handleDownload(book)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Reading / Summary Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedBook.coverGradient} text-white flex justify-between items-start`}>
              <div className="space-y-1 pr-6">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                  {selectedBook.category.replace('_', ' ')}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2 leading-tight">
                  {selectedBook.title}
                </h3>
                <p className="text-xs text-slate-300">Par {selectedBook.author} • Édition {selectedBook.year}</p>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs md:text-sm text-slate-700">
              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Note Lecteurs</div>
                  <div className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{selectedBook.rating} / 5</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Volume</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">{selectedBook.pages} pages</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Temps de lecture</div>
                  <div className="text-base font-extrabold text-emerald-700 mt-0.5">{selectedBook.readTime}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                  Résumé Exécutif de l'Ouvrage
                </h4>
                <p className="text-slate-600 leading-relaxed text-justify">
                  {selectedBook.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                  Principaux Enseignements & Recommandations
                </h4>
                <ul className="space-y-2">
                  {selectedBook.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-800 text-xs">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800">Recommandé pour : </span>
                <span className="text-slate-600">{selectedBook.recommendedFor}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center gap-4">
              <span className="text-xs text-slate-500">Taille du fichier : {selectedBook.fileSize}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    handleDownload(selectedBook);
                    setSelectedBook(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger ({selectedBook.fileSize})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
