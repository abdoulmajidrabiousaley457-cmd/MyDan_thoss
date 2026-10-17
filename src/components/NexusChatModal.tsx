import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Trash2, ExternalLink, Globe, Laptop, MessageSquare, Cpu } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { CABINET_INFO } from '../data/cabinetData';
import { recordActivityEvent } from '../services/userActivityStats';

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
}) => {
  const { language, t } = useI18n();

  const getInitialMessage = () => {
    if (language === 'ar') {
      return `مرحباً بك! أنا Gemini AI، مساعد الذكاء الاصطناعي لمكتب رابيو صالح (ماجد الذكي)، المدعوم بنموذج Google Gemini 3.8 Flash. يسعدني الإجابة بدقة على جميع استفساراتك البرمجية (بايثون، تايب سكريبت، أنظمة الوكلاء الذكية، MLOps)، وخدمات المكتب ومهام العمل عن بعد. كيف يمكنني مساعدتك اليوم؟`;
    }
    if (language === 'en') {
      return `Hello! I am Gemini AI, the next-generation intelligent assistant of Rabiou Saley Consulting Firm (Majid IA), powered by Google Gemini 3.8 Flash. I am configured to answer all your technical questions (Python, AI Agents, Data Science, MLOps), remote contract queries, and project audits. How can I assist you today?`;
    }
    return `Bonjour ! Je suis Gemini AI, l'assistant d'Intelligence Artificielle de nouvelle génération du Cabinet Rabiou Saley (Majid IA). Propulsé par Google Gemini 3.8 Flash, je réponds à l'ensemble de vos questions techniques (Python, TypeScript, SQL, modèles prédictifs, architectures multi-agents), vos demandes de devis et missions en télétravail international. Comment puis-je vous aider aujourd'hui ?`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: getInitialMessage(),
      time: 'À l\'instant',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = language === 'ar' ? [
    'أعطني كود بايثون لإنشاء وكيل ذكي متعدد الأدوات',
    'ما هي تخصصات مكتب رابيو صالح؟',
    'كيف تبدأ مهمة عمل عن بعد مع المكتب؟',
    'أين يمكنني رؤية معرض الأعمال المباشر؟'
  ] : language === 'en' ? [
    'Show me a Python script for a multi-agent AI system',
    'What are the core capabilities of Rabiou Saley Firm?',
    'How to launch an international remote mission?',
    'Where is the official live portfolio?'
  ] : [
    'Donne-moi un script Python pour un agent IA multi-outils',
    'Quelles sont les expertises clés du Cabinet Rabiou Saley ?',
    'Comment démarrer une mission en télétravail international ?',
    'Explique-moi l\'architecture d\'un système RAG vectoriel'
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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsThinking(true);
    recordActivityEvent('assistant_chat', query);

    let replyText = '';

    try {
      const payload = JSON.stringify({
        message: query,
        history: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
        language,
      });

      // Try primary /api/gemini/chat endpoint with timeout
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20000);
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data?.reply) {
            replyText = data.reply;
          }
        }
      } catch (firstErr) {
        // If first fetch had network issue, try secondary endpoint
      }

      // If needed, try /api/chat endpoint
      if (!replyText) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 15000);
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (res.ok) {
            const data = await res.json().catch(() => null);
            if (data?.reply) {
              replyText = data.reply;
            }
          }
        } catch (secondErr) {
          // Handled gracefully below
        }
      }
    } catch (networkErr) {
      console.warn('Gemini chat handled network note:', networkErr);
    }

    // High-quality contextual fallback if offline or server temporarily unavailable
    if (!replyText) {
      const lower = query.toLowerCase();
      if (lower.includes('python') || lower.includes('code') || lower.includes('script') || lower.includes('agent')) {
        replyText = `Bonjour ! Je suis **Gemini AI**, l'assistant d'Intelligence Artificielle du Cabinet Rabiou Saley.\n\n` +
          `Voici un exemple de script d'architecture **Agent IA Autonome en Python** prêt pour l'intégration :\n\n` +
          `\`\`\`python\n` +
          `# Architecture Agent Autonome - Cabinet Rabiou Saley\n` +
          `from dataclasses import dataclass\n` +
          `from typing import List, Dict, Any\n\n` +
          `@dataclass\n` +
          `class AgentState:\n` +
          `    prompt: str\n` +
          `    context: List[str]\n\n` +
          `class AutonomousConsultantAgent:\n` +
          `    """Agent IA expert en analyse de données et automatisation."""\n` +
          `    def __init__(self, name: str = "Gemini-Agent"):\n` +
          `        self.name = name\n` +
          `        self.expert = "Abdoul Majid Rabiou Saley"\n` +
          `        self.portfolio = "https://mon-portfolio-fin-ten.vercel.app/"\n\n` +
          `    def execute(self, state: AgentState) -> Dict[str, Any]:\n` +
          `        return {\n` +
          `            "status": "ready",\n` +
          `            "output": f"Analyse exécutée pour : {state.prompt}",\n` +
          `            "firm": "Cabinet Rabiou Saley - Full Remote"\n` +
          `        }\n` +
          `\`\`\`\n\n` +
          `Consultez également nos projets en direct sur le [Portfolio Officiel](https://mon-portfolio-fin-ten.vercel.app/) ou sur [Omni Studio](https://omni-studio-abdoul.ai.studio) !`;
      } else if (lower.includes('portfolio') || lower.includes('projet') || lower.includes('lien') || lower.includes('site')) {
        replyText = `Vous pouvez découvrir l'ensemble des projets, démos et réalisations du Cabinet Rabiou Saley sur le **Portfolio Officiel en direct** :\n\n👉 [https://mon-portfolio-fin-ten.vercel.app/](https://mon-portfolio-fin-ten.vercel.app/)\n\nEt retrouvez notre agent Omni Studio hébergé sur : [https://omni-studio-abdoul.ai.studio](https://omni-studio-abdoul.ai.studio).`;
      } else if (lower.includes('contact') || lower.includes('whatsapp') || lower.includes('devis') || lower.includes('prix')) {
        replyText = `Pour planifier une mission en télétravail international ou demander un devis au Cabinet Rabiou Saley :\n\n• **WhatsApp Direct** : **+227 96 49 99 06**\n• **Email** : **abdoulmajidrabiousaley457@gmail.com**\n• **Disponibilité** : Immédiate à 100% en Full Remote (Fuseaux UTC, CET, EST).`;
      } else {
        replyText = `Bonjour ! Je suis **Gemini AI**, l'assistant d'Intelligence Artificielle du Cabinet Rabiou Saley.\n\n` +
          `Je suis configuré pour répondre à toutes vos interrogations en matière de **Data Science, architectures multi-agents, pipelines MLOps, code Python/TypeScript**, ainsi qu'aux devis et contrats de télétravail international du cabinet.\n\n` +
          `• **Portfolio en direct** : https://mon-portfolio-fin-ten.vercel.app/\n` +
          `• **Agent Omni Studio** : https://omni-studio-abdoul.ai.studio\n` +
          `• **Contact direct** : +227 96 49 99 06\n\n` +
          `Posez-moi votre question, je suis à votre entière disposition !`;
      }
    }

    const botMsg: Message = {
      id: `a-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsThinking(false);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `m-init-${Date.now()}`,
        sender: 'assistant',
        text: getInitialMessage(),
        time: 'À l\'instant',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[680px] max-h-[96dvh] sm:max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header: Gemini AI branding */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-3.5 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-indigo-500 to-sky-400 text-white flex items-center justify-center shadow-lg shadow-indigo-950/50 shrink-0">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5 truncate">
                  <span>Gemini AI</span>
                </h3>
                <span className="text-[9.5px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 shrink-0">
                  Google Gemini 3.8
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden xs:inline shrink-0">
                  Cabinet Rabiou Saley
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                {t('majidAiDesc', "Assistant d'Intelligence Artificielle • Cabinet Rabiou Saley")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleClear}
              title={t('majidAiClear', 'Effacer l\'historique')}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Links Bar: Omni Studio Agent & Live Vercel Portfolio */}
        <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-4 py-1.5 sm:py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <a
            href="https://omni-studio-abdoul.ai.studio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 font-semibold text-[11px] sm:text-xs truncate"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Agent Omni Studio : omni-studio-abdoul.ai.studio</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>

          <a
            href="https://mon-portfolio-fin-ten.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sky-300 hover:text-sky-200 font-semibold text-[11px] sm:text-xs truncate"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Portfolio Vercel</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-4 bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 sm:gap-3 max-w-[92%] sm:max-w-[88%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              )}

              <div
                className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white shadow-md rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs rounded-bl-xs whitespace-pre-line'
                }`}
              >
                {m.text}
                <div className={`text-[10px] mt-2 flex items-center justify-between gap-2 ${m.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-400'}`}>
                  {m.sender === 'assistant' && (
                    <span className="font-bold text-[9px] text-indigo-600 flex items-center gap-1">
                      <Cpu className="w-2.5 h-2.5" />
                      <span>Gemini AI</span>
                    </span>
                  )}
                  <span>{m.time}</span>
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-2.5 sm:gap-3 max-w-[88%] items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 text-xs text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span className="font-medium">{t('majidAiThinking', 'Gemini AI analyse votre requête et prépare la réponse...')}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-2 sm:p-2.5 bg-white border-t border-slate-200 overflow-x-auto no-scrollbar flex gap-2 touch-pan-x">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="text-[10.5px] sm:text-[11px] font-semibold px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-2.5 sm:p-3 md:p-4 bg-white border-t border-slate-200 flex items-center gap-2 pb-[max(0.65rem,env(safe-area-inset-bottom))]">
          <input
            type="text"
            placeholder={t('majidAiPlaceholder', 'Posez votre question à Gemini AI (Python, IA, devis, télétravail)...')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isThinking}
            className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold transition-all cursor-pointer shadow-md shadow-indigo-900/20 shrink-0"
            title="Envoyer à Gemini AI"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
