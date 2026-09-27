import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Trash2, ArrowUpRight, MessageSquare, Laptop, FileText, CheckCircle2 } from 'lucide-react';
import { CABINET_INFO } from '../data/cabinetData';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface NexusChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const NexusChatModal: React.FC<NexusChatModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'services'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: `Bonjour ! Je suis Majid IA, l'assistant intelligent du Cabinet Rabiou Saley. Je suis à votre disposition pour vous renseigner sur nos expertises en Data Science & Agents IA, nos modalités de missions en télétravail international, ou pour vous conseiller sur l'optimisation de votre CV professionnel. Comment puis-je vous aider aujourd'hui ?`,
      time: 'À l\'instant',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Quelles sont les expertises clés du Cabinet Rabiou Saley ?',
    'Comment démarrer une mission en télétravail international ?',
    'Quels conseils pour optimiser un CV en Data Science et IA ?',
    'Que comprend l\'abonnement Cabinet VIP & Mentorat ?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isThinking) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: 'À l\'instant',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Provide contextual, high-value consulting answer
    setTimeout(() => {
      let replyText = '';
      const lower = query.toLowerCase();

      if (lower.includes('expertise') || lower.includes('compétence') || lower.includes('service') || lower.includes('que fait')) {
        replyText = `Le Cabinet Rabiou Saley intervient sur 4 pôles d'excellence majeurs :\n\n1. **Agents IA Autonomes & Multi-Agents** : Orchestration avec LangGraph, CrewAI, AutoGen et RAG vectoriel (Gemini, Claude, GPT).\n2. **Data Science & ML Prédictif** : Modélisation avancée, scoring client (Churn, risque), séries temporelles et explicabilité (SHAP).\n3. **Computer Vision & NLP** : Extraction documentaire OCR (LayoutLM), analyse sémantique et automatisation de processus comptables.\n4. **MLOps & Télétravail Sécurisé** : Conteneurisation Docker, APIs FastAPI ultra-rapides et déploiement continu sur GCP/AWS.`;
      } else if (lower.includes('devise') || lower.includes('monnaie') || lower.includes('cfa') || lower.includes('euro') || lower.includes('dollar') || lower.includes('convertisseur')) {
        replyText = `Notre **Convertisseur de Devises Internationales** est disponible directement dans l'application !\n\n• Conversion instantanée entre **Franc CFA (XOF/CEMAC)**, **Euro (EUR)**, **Dollar US (USD)**, **Yuan (CNY)**, **Naira (NGN)** et plus de 15 devises.\n• Barèmes et simulateurs intégrés pour calculer vos honoraires en télétravail : tarif horaire, TJM (taux journalier moyen), sprint de 2 semaines et salaire mensuel remote.\n• Bouton de copie rapide pour intégrer directement la conversion à vos devis et factures.`;
      } else if (lower.includes('bibliothèque') || lower.includes('livre') || lower.includes('pdf') || lower.includes('ressource') || lower.includes('documentation') || lower.includes('télécharger')) {
        replyText = `Notre **Bibliothèque Numérique Pro** regroupe les ouvrages et synthèses de référence sélectionnés par Rabiou Saley :\n\n• **Agents IA & LLMs** : Guide officiel du cabinet sur LangGraph et architectures RAG hybrides, ainsi que "Generative AI in Production".\n• **Data Science & Machine Learning** : "Hands-On Machine Learning" d'Aurélien Géron et "Clean Code" de Robert C. Martin.\n• **Télétravail & Productivité** : "Le Guide du Télétravail International" (Basecamp) et "Deep Work" de Cal Newport.\n• **Stratégie & Cabinet** : "The McKinsey Mind" et "The Lean Startup".\n\nVous pouvez consulter la synthèse complète de chaque ouvrage et télécharger le fichier en 1 clic !`;
      } else if (lower.includes('exemple') || lower.includes('modèle') || lower.includes('cv') || lower.includes('lettre') || lower.includes('recruteur') || lower.includes('ats')) {
        replyText = `Nous avons intégré **5 exemples de CV complets prêts à modifier et télécharger** dans le Studio CV :\n\n1. **Rabiou Saley** : Consultant Senior Data Science & Agents IA (Profil officiel Cabinet)\n2. **Sarah Traoré** : Lead Ingénieure MLOps & Architecture Cloud Data\n3. **Alexandre Mendy** : Consultant Senior Big Data & Business Intelligence (Power BI / Snowflake)\n4. **Fatouma Kaboré** : Ingénieure Full-Stack Web & Applications IA (FastAPI / React / LLMs)\n5. **Ibrahim Diallo** : Chef de Projet Digital Senior & Scrum Master en Télétravail\n\n👉 Cliquez sur l'onglet **"Exemples de CV à Modifier"** dans le Studio CV, choisissez votre profil, cliquez sur **"Charger & Modifier"**, personnalisez vos données et téléchargez votre PDF !`;
      } else if (lower.includes('télétravail') || lower.includes('remote') || lower.includes('mission') || lower.includes('démarrer') || lower.includes('devis')) {
      } else if (lower.includes('abonnement') || lower.includes('vip') || lower.includes('mentorat') || lower.includes('tarif')) {
        replyText = `L'application propose 3 formules :\n\n• **Plan Découverte (0 FCFA)** : Modèle de base et consultation du portfolio.\n• **Plan Pro Carrière (9 900 FCFA / 15 € / mois)** : Débloque les 4 modèles de CV haute définition, lettres de motivation illimitées et audit ATS algorithmique.\n• **Plan Cabinet VIP & Mentorat (39 000 FCFA / 59 € / mois)** : Accompagnement direct par Rabiou Saley, revue de votre CV & LinkedIn, 2 sessions de visioconférence par mois et accès prioritaire aux missions de sous-traitance du cabinet.`;
      } else {
        replyText = `Merci pour votre question ! Le Cabinet d'Expertise Rabiou Saley est à votre écoute pour concevoir vos solutions d'Intelligence Artificielle en télétravail international, ou vous accompagner dans l'accélération de votre carrière tech. N'hésitez pas à configurer un devis de mission ou à nous contacter directement sur WhatsApp au +227 96 49 99 06.`;
      }

      const botMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: 'À l\'instant',
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 900);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'm-init',
        sender: 'assistant',
        text: `Conversation réinitialisée. Comment puis-je vous orienter aujourd'hui concernant le Cabinet Rabiou Saley ou vos projets d'IA en télétravail ?`,
        time: 'À l\'instant',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[650px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">Majid IA</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Assistant Cabinet
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Conseiller Intelligence Artificielle, Télétravail & Carrière Pro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              title="Effacer l'historique"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white shadow-md rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs rounded-bl-xs whitespace-pre-line'
                }`}
              >
                {m.text}
                <div className={`text-[10px] mt-2 ${m.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-400'}`}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 max-w-[85%] items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>Majid IA analyse votre demande...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-200 overflow-x-auto flex gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Posez votre question sur les prestations IA ou le télétravail..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isThinking}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all cursor-pointer shadow-md shadow-emerald-900/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
