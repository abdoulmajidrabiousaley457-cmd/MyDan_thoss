import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Trash2, ExternalLink, Globe, Laptop, MessageSquare } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
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
}) => {
  const { language, t } = useI18n();

  const getInitialMessage = () => {
    if (language === 'ar') {
      return `مرحباً بك! أنا "ماجد الذكي"، المساعد الاستشاري لمكتب رابيو صالح. يسعدني الإجابة على جميع استفساراتك حول الذكاء الاصطناعي، البرمجة، والعمل عن بعد. كيف يمكنني مساعدتك اليوم؟`;
    }
    if (language === 'en') {
      return `Hello! I am Majid AI, the intelligent assistant of Rabiou Saley Consulting Firm. I am configured to answer all your questions regarding Data Science, AI Agents, Python coding, and international remote missions. How can I assist you today?`;
    }
    return `Bonjour ! Je suis Majid IA, l'assistant intelligent du Cabinet Rabiou Saley. Je suis configuré pour répondre à toutes vos questions : Intelligence Artificielle, code Python, architecture d'agents autonomes, missions en télétravail international ou nos réalisations. Comment puis-je vous aider aujourd'hui ?`;
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
    'ما هي تخصصات مكتب رابيو صالح؟',
    'كيف تبدأ مهمة عمل عن بعد معي؟',
    'أعطني كود بايثون لإنشاء وكيل RAG ذكي',
    'أين يمكنني رؤية معرض الأعمال المباشر؟'
  ] : language === 'en' ? [
    'What are the core capabilities of Rabiou Saley Firm?',
    'How to launch an international remote mission?',
    'Show me Python code to build a multi-agent RAG system',
    'Where is the official live portfolio?'
  ] : [
    'Quelles sont les expertises clés du Cabinet Rabiou Saley ?',
    'Comment démarrer une mission en télétravail international ?',
    'Donne-moi un exemple de code Python pour un agent RAG',
    'Où consulter le portfolio officiel en direct ?'
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

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || (
        language === 'ar'
          ? 'عذراً، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى أو زيارة معرض الأعمال مباشرة.'
          : language === 'en'
          ? 'Sorry, a temporary issue occurred. Please retry or check the live portfolio.'
          : 'Désolé, une erreur temporaire est survenue. Veuillez réessayer ou consulter le portfolio en direct.'
      );

      const botMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: `Le Cabinet Rabiou Saley est à votre disposition !\n\n• **Portfolio Officiel en direct** : https://mon-portfolio-fin-ten.vercel.app/\n• **Agent Omni Studio Hébergé** : https://omni-studio-abdoul.ai.studio\n• **WhatsApp Direct** : ${CABINET_INFO.phone}\n\nN'hésitez pas à poser une autre question technique ou relative au télétravail international.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[680px] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-4 md:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">{t('majidAiTitle', 'Majid IA')}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t('majidAiBadge', 'Assistant Cabinet & IA')}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {t('majidAiDesc', 'Posez toutes vos questions : IA, code, missions ou télétravail')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              title={t('majidAiClear', 'Effacer l\'historique')}
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

        {/* Live Links Bar: Omni Studio Agent & Live Vercel Portfolio */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <a
            href="https://omni-studio-abdoul.ai.studio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Agent Omni Studio : omni-studio-abdoul.ai.studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href="https://mon-portfolio-fin-ten.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sky-300 hover:text-sky-200 font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>Portfolio Vercel</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[88%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
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
                <span>{t('majidAiThinking', 'Majid IA réfléchit et formule sa réponse...')}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-200 overflow-x-auto flex gap-2">
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
        <div className="p-3 md:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder={t('majidAiPlaceholder', 'Posez votre question (IA, code, télétravail, devis, etc.)...')}
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
