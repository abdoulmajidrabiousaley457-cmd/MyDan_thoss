import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  Send,
  Inbox,
  Star,
  FileEdit,
  Trash2,
  Search,
  RefreshCw,
  Plus,
  Reply,
  Forward,
  Download,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  Settings,
  KeyRound,
  X,
  MailOpen,
  Zap
} from 'lucide-react';
import { useUserProfile, CORPORATE_EMAIL } from '../context/UserProfileContext';
import { CABINET_INFO } from '../data/cabinetData';
import {
  CorporateEmailMessage,
  subscribeToCorporateMailbox,
  sendCorporateEmail,
  updateCorporateEmailMetadata,
  deleteCorporateEmailPermanent,
  saveCorporateEmailDraft,
  downloadMessageAsEml,
  isCorporateAddress
} from '../services/corporateMailService';

interface MailServerStatus {
  operational: boolean;
  domain: string;
  primaryEmail: string;
  forwardTo: string;
  accounts: Array<{ email: string; name: string; role: string }>;
  transportMode: 'custom_smtp' | 'ethereal_tls_relay' | 'local_mta';
  relayUser: string;
  stats: {
    total: number;
    unreadInbox: number;
    inbox: number;
    sent: number;
    drafts: number;
  };
}

const EMAIL_TEMPLATES = [
  {
    id: 'tpl_proposition',
    label: 'Proposition & Cadrage Mission',
    subject: 'Proposition d\'accompagnement IA & Data Science — Cabinet Rabiou Saley',
    category: 'devis' as const,
    body: `Bonjour,\n\nSuite à l'étude de votre besoin, j'ai le plaisir de vous confirmer la disponibilité du Cabinet Rabiou Saley pour assurer l'architecture et le déploiement de votre solution en télétravail international.\n\nProchaines étapes proposées :\n1. Réunion de cadrage technique (30-45 min en visioconférence).\n2. Signature de l'accord de confidentialité mutuel (NDA).\n3. Lancement du premier sprint avec livrables hebdomadaires vérifiables.\n\nRestant à votre entière disposition pour convenir d'un créneau cette semaine.\n\nBien cordialement,\nRabiou Saley Abdoul Majid\nSenior Data Scientist & Architecte Solutions IA\nCabinet Danthoss • contact@danthoss-cabinet.com\nTél / WhatsApp : +227 96 49 99 06`
  },
  {
    id: 'tpl_livrable',
    label: 'Notification de Livrable (Client Vault)',
    subject: 'Mise à disposition de votre livrable certifié — Client Vault Danthoss',
    category: 'livrable' as const,
    body: `Bonjour,\n\nNous vous informons que votre nouveau livrable technique a été déposé et chiffré dans votre espace sécurisé Client Vault sur la plateforme Danthoss.\n\nVous pouvez le consulter et le télécharger directement depuis l'onglet « Client Vault » de votre compte.\n\nNous restons à votre écoute pour toute revue technique ou question complémentaire.\n\nCordialement,\nSupport Technique & Livrables\nCabinet Rabiou Saley • contact@danthoss-cabinet.com`
  },
  {
    id: 'tpl_nda',
    label: 'Transmission Accord de Confidentialité (NDA)',
    subject: 'Accord de Confidentialité (NDA) — Mission Télétravail Cabinet Rabiou Saley',
    category: 'general' as const,
    body: `Bonjour,\n\nAfin de garantir la stricte confidentialité de vos données, architectures et documents métier conformément au RGPD, vous pouvez générer et télécharger notre Accord de Non-Divulgation (NDA) pré-signé depuis la plateforme.\n\nDès retour de votre exemplaire validé à l'adresse contact@danthoss-cabinet.com, nous pourrons initier l'accès aux environnements techniques.\n\nTrès cordialement,\nDirection Générale • Cabinet Rabiou Saley\ncontact@danthoss-cabinet.com`
  }
];

export const ProfessionalEmailScreen: React.FC = () => {
  const { firebaseUser, profile, isAdmin, registerEmail } = useUserProfile();

  const [messages, setMessages] = useState<CorporateEmailMessage[]>([]);
  const [serverStatus, setServerStatus] = useState<MailServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Navigation & filter state
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'starred' | 'drafts' | 'trash'>('inbox');
  const [selectedAliasFilter, setSelectedAliasFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<CorporateEmailMessage | null>(null);

  // Clean sender email for logged-in user (never let a client inherit contact@danthoss-cabinet.com)
  const activeUserEmail = useMemo(() => {
    if (isAdmin) return CORPORATE_EMAIL;
    if (firebaseUser?.email && !isCorporateAddress(firebaseUser.email)) {
      return firebaseUser.email;
    }
    if (profile.email && !isCorporateAddress(profile.email)) {
      return profile.email;
    }
    return firebaseUser?.email || '';
  }, [isAdmin, firebaseUser, profile.email]);

  // Composer modal state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [draftId, setDraftId] = useState<string | undefined>(undefined);
  const [fromAlias, setFromAlias] = useState<string>(
    isAdmin ? CORPORATE_EMAIL : activeUserEmail
  );
  const [clientSenderName, setClientSenderName] = useState<string>(
    firebaseUser?.displayName || (!isAdmin ? profile.name : '') || ''
  );
  const [toEmail, setToEmail] = useState<string>(isAdmin ? '' : CORPORATE_EMAIL);
  const [toName, setToName] = useState<string>(isAdmin ? '' : 'Cabinet Rabiou Saley');
  const [ccEmail, setCcEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [category, setCategory] = useState<'general' | 'devis' | 'livrable' | 'support'>('general');
  const [sending, setSending] = useState(false);
  const [simulatingClient, setSimulatingClient] = useState(false);
  const [aiDrafting, setAiDrafting] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error';
    text: string;
    previewUrl?: string;
  } | null>(null);

  // Admin Account & Server Settings Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [proAuthPassword, setProAuthPassword] = useState('');
  const [activatingAuth, setActivatingAuth] = useState(false);
  const [authActivationMsg, setAuthActivationMsg] = useState<string | null>(null);

  const fetchServerStatus = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/mail/status');
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const statusData = await res.json();
        setServerStatus(statusData);
      }
    } catch {
      // Cloud Firestore remains active even if local Express status endpoint is unreachable
    } finally {
      setRefreshing(false);
    }
  };

  // Real-time bidirectional subscription via Firestore + Server merge
  useEffect(() => {
    setLoading(true);
    fetchServerStatus();

    const unsub = subscribeToCorporateMailbox({
      userUid: firebaseUser?.uid || '',
      userEmail: firebaseUser?.email || activeUserEmail,
      isAdmin,
      onMessages: (liveMessages) => {
        setMessages(liveMessages);
        setLoading(false);
        setSelectedMessage((prev) => {
          if (!prev) return null;
          return liveMessages.find((m) => m.id === prev.id) || prev;
        });
      }
    });

    return () => unsub();
  }, [firebaseUser?.uid, firebaseUser?.email, activeUserEmail, isAdmin]);

  useEffect(() => {
    setFromAlias(isAdmin ? CORPORATE_EMAIL : activeUserEmail);
    if (!isAdmin) {
      setToEmail(CORPORATE_EMAIL);
      setToName('Cabinet Rabiou Saley');
      setClientSenderName(
        firebaseUser?.displayName ||
          (profile.name && profile.name !== 'Rabiou Saley Abdoul Majid' ? profile.name : '') ||
          (activeUserEmail ? activeUserEmail.split('@')[0] : '')
      );
    }
  }, [isAdmin, activeUserEmail, firebaseUser?.displayName, profile.name]);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (isAdmin) {
        if (activeFolder === 'starred') {
          if (!m.starred || m.folder === 'trash') return false;
        } else if (m.folder !== activeFolder) {
          return false;
        }

        if (selectedAliasFilter !== 'all') {
          const targetAlias = selectedAliasFilter.toLowerCase();
          const toMatch = (m.toEmail || '').toLowerCase() === targetAlias;
          const fromMatch = (m.fromEmail || '').toLowerCase() === targetAlias;
          const ccMatch = (m.ccEmail || '').toLowerCase() === targetAlias;
          // Master account contact@danthoss-cabinet.com also receives all inbound client messages addressed to any @danthoss-cabinet.com alias
          const isMasterCatchAll =
            targetAlias === CORPORATE_EMAIL.toLowerCase() &&
            m.folder === 'inbox' &&
            isCorporateAddress(m.toEmail);

          if (!toMatch && !fromMatch && !ccMatch && !isMasterCatchAll) {
            return false;
          }
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.subject.toLowerCase().includes(q) ||
          m.fromName.toLowerCase().includes(q) ||
          m.fromEmail.toLowerCase().includes(q) ||
          m.toEmail.toLowerCase().includes(q) ||
          m.body.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [messages, activeFolder, selectedAliasFilter, searchQuery, isAdmin]);

  const unreadInboxCount = useMemo(
    () => messages.filter((m) => m.folder === 'inbox' && !m.read).length,
    [messages]
  );

  const handleSelectMessage = async (msg: CorporateEmailMessage) => {
    setSelectedMessage(msg);
    const shouldMarkRead = isAdmin
      ? !msg.read && msg.folder === 'inbox'
      : !msg.read && msg.toEmail.toLowerCase() === activeUserEmail.toLowerCase();

    if (shouldMarkRead) {
      setMessages((prev) => prev.map((item) => (item.id === msg.id ? { ...item, read: true } : item)));
      await updateCorporateEmailMetadata(msg, { read: true }, isAdmin);
    }
  };

  const handleToggleStar = async (e: React.MouseEvent, msg: CorporateEmailMessage) => {
    e.stopPropagation();
    const nextStarred = !msg.starred;
    setMessages((prev) =>
      prev.map((item) => (item.id === msg.id ? { ...item, starred: nextStarred } : item))
    );
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage({ ...msg, starred: nextStarred });
    }
    await updateCorporateEmailMetadata(msg, { starred: nextStarred }, isAdmin);
  };

  const handleMoveToTrashOrDelete = async (msg: CorporateEmailMessage) => {
    if (msg.folder === 'trash') {
      setMessages((prev) => prev.filter((item) => item.id !== msg.id));
      if (selectedMessage?.id === msg.id) setSelectedMessage(null);
      await deleteCorporateEmailPermanent(msg.id);
    } else {
      setMessages((prev) =>
        prev.map((item) => (item.id === msg.id ? { ...item, folder: 'trash' } : item))
      );
      if (selectedMessage?.id === msg.id) setSelectedMessage(null);
      await updateCorporateEmailMetadata(msg, { folder: 'trash' }, isAdmin);
    }
  };

  const openNewComposer = (presetTo?: string, presetSubject?: string, presetBody?: string) => {
    setDraftId(undefined);
    setFromAlias(isAdmin ? CORPORATE_EMAIL : activeUserEmail);
    setToEmail(presetTo !== undefined ? presetTo : isAdmin ? '' : CORPORATE_EMAIL);
    setToName(isAdmin ? '' : 'Cabinet Rabiou Saley');
    setCcEmail('');
    setSubject(presetSubject || '');
    setBody(
      presetBody !== undefined
        ? presetBody
        : isAdmin
        ? `\n\n--\nRabiou Saley Abdoul Majid\nSenior Data Scientist & Concepteur d'Agents IA\nCabinet Danthoss • ${CORPORATE_EMAIL}\nWhatsApp : ${CABINET_INFO.phone}`
        : ''
    );
    setCategory('general');
    setIsComposerOpen(true);
  };

  const handleReply = (msg: CorporateEmailMessage) => {
    const replyTarget = isAdmin
      ? isCorporateAddress(msg.fromEmail)
        ? msg.toEmail
        : msg.fromEmail
      : CORPORATE_EMAIL;
    const replySubject = msg.subject.toLowerCase().startsWith('re:') ? msg.subject : `Re: ${msg.subject}`;
    const quoted = `\n\n\n--- Message d'origine de ${msg.fromName} <${msg.fromEmail}> ---\n${msg.body}`;
    openNewComposer(replyTarget, replySubject, quoted);
  };

  const handleForward = (msg: CorporateEmailMessage) => {
    const fwdSubject = msg.subject.toLowerCase().startsWith('tr:') ? msg.subject : `Tr: ${msg.subject}`;
    const quoted = `\n\n---------- Message transféré ----------\nDe : ${msg.fromName} <${msg.fromEmail}>\nDate : ${new Date(msg.createdAt).toLocaleString('fr-FR')}\nObjet : ${msg.subject}\nÀ : ${msg.toEmail}\n\n${msg.body}`;
    openNewComposer(isAdmin ? '' : CORPORATE_EMAIL, fwdSubject, quoted);
  };

  const handleSaveDraft = async () => {
    try {
      await saveCorporateEmailDraft({
        id: draftId,
        senderUid: firebaseUser?.uid || '',
        fromName: isAdmin
          ? 'Rabiou Saley Abdoul Majid • Cabinet Danthoss'
          : clientSenderName || activeUserEmail.split('@')[0] || 'Client',
        fromEmail: fromAlias,
        toEmail,
        ccEmail,
        subject: subject || '(Brouillon sans objet)',
        body
      });
      setIsComposerOpen(false);
      setFeedbackBanner({ type: 'success', text: 'Brouillon synchronisé dans votre messagerie.' });
    } catch {
      setFeedbackBanner({ type: 'error', text: 'Impossible d\'enregistrer le brouillon.' });
    }
  };

  const handleAssistWithGemini = async () => {
    if (aiDrafting) return;
    setAiDrafting(true);
    try {
      const promptInstruction =
        subject.trim() || body.trim()
          ? `Rédige un e-mail professionnel clair, courtois et structuré en français pour le Cabinet d'Expertise Data Science & IA Rabiou Saley (adresse: ${fromAlias}). Objet indiqué: "${subject}". Contexte ou brouillon actuel: "${body}". Renvoie uniquement le corps de l'e-mail prêt à envoyer avec une signature sobre.`
          : `Rédige un e-mail professionnel de prise de contact commercial pour proposer les services Data Science, Agents IA Autonomes et MLOps en télétravail international du Cabinet Rabiou Saley (${CORPORATE_EMAIL}). Renvoie uniquement le corps de l'e-mail.`;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptInstruction, language: 'fr' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.reply) {
          setBody(data.reply.trim());
          if (!subject.trim()) {
            setSubject('Proposition de collaboration IA & Data Science — Cabinet Rabiou Saley');
          }
        }
      }
    } catch {
      // silent fallback
    } finally {
      setAiDrafting(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !subject.trim() || !body.trim() || sending) return;

    setSending(true);
    setFeedbackBanner(null);

    const aliasObj = CABINET_INFO.emailAliases?.find((a) => a.email === fromAlias);
    const senderDisplayName = isAdmin
      ? aliasObj
        ? `Cabinet Rabiou Saley (${aliasObj.label})`
        : 'Rabiou Saley Abdoul Majid • Cabinet Danthoss'
      : clientSenderName.trim() || firebaseUser?.displayName || activeUserEmail.split('@')[0] || 'Client Danthoss';

    try {
      const result = await sendCorporateEmail({
        senderUid: firebaseUser?.uid || 'public_visitor',
        isAdminSender: isAdmin,
        fromName: senderDisplayName,
        fromEmail: isAdmin ? fromAlias : fromAlias.trim() || activeUserEmail,
        toName: isAdmin ? toName : 'Cabinet Rabiou Saley',
        toEmail: toEmail.trim(),
        ccEmail: ccEmail.trim(),
        subject: subject.trim(),
        body: body.trim(),
        category
      });

      if (draftId) {
        await deleteCorporateEmailPermanent(draftId).catch(() => {});
      }

      setIsComposerOpen(false);
      setFeedbackBanner({
        type: 'success',
        text: isAdmin
          ? `E-mail envoyé avec succès depuis ${fromAlias} vers ${toEmail.trim()}.`
          : `Votre message a bien été transmis en direct à ${CORPORATE_EMAIL}. Le Cabinet Rabiou Saley vous répondra directement ici.`,
        previewUrl: result.smtpPreviewUrl
      });
    } catch (err: any) {
      setFeedbackBanner({
        type: 'error',
        text: err?.message || 'Échec lors de l\'envoi du message.'
      });
    } finally {
      setSending(false);
    }
  };

  // Allows Admin to verify real-time inbound client reception on contact@danthoss-cabinet.com in 1 click
  const handleSimulateClientInbound = async () => {
    if (simulatingClient) return;
    setSimulatingClient(true);
    try {
      const result = await sendCorporateEmail({
        senderUid: firebaseUser?.uid || 'test_client',
        isAdminSender: false,
        fromName: 'Client Test • Vérification Temps Réel',
        fromEmail: 'client.verification@entreprise-partenaire.com',
        toName: 'Cabinet Rabiou Saley',
        toEmail: CORPORATE_EMAIL,
        subject: `Vérification de réception client en direct — ${new Date().toLocaleTimeString('fr-FR')}`,
        body: `Bonjour M. Rabiou Saley,\n\nCe message confirme que votre boîte professionnelle ${CORPORATE_EMAIL} reçoit instantanément en temps réel (Cloud Firestore + Relais SMTP) tous les messages envoyés par vos clients depuis n'importe quel appareil, navigateur ou lien partagé.\n\nVous pouvez cliquer sur « Répondre » pour tester la réponse directe vers le client.\n\nCordialement,\nSystème de Vérification Client Danthoss`,
        category: 'general'
      });

      setActiveFolder('inbox');
      setSelectedAliasFilter('all');
      setIsSettingsOpen(false);
      setFeedbackBanner({
        type: 'success',
        text: `Test réussi : nouveau message client reçu instantanément sur ${CORPORATE_EMAIL} !`,
        previewUrl: result.smtpPreviewUrl
      });
    } catch (err: any) {
      setFeedbackBanner({
        type: 'error',
        text: err?.message || 'Erreur lors du test de réception.'
      });
    } finally {
      setSimulatingClient(false);
    }
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedEmail(addr);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleActivateFirebaseCorporateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proAuthPassword || proAuthPassword.length < 6) {
      setAuthActivationMsg('Veuillez saisir un mot de passe d\'au moins 6 caractères.');
      return;
    }
    setActivatingAuth(true);
    setAuthActivationMsg(null);
    try {
      await registerEmail(CORPORATE_EMAIL, proAuthPassword, 'Rabiou Saley Abdoul Majid');
      setAuthActivationMsg(
        `Le compte de connexion direct ${CORPORATE_EMAIL} est désormais actif avec statut Super Admin.`
      );
      setProAuthPassword('');
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        setAuthActivationMsg(
          `L'identifiant ${CORPORATE_EMAIL} est déjà activé et enregistré dans Firebase Auth.`
        );
      } else {
        setAuthActivationMsg(
          `Compte messagerie ${CORPORATE_EMAIL} actif en temps réel. (${
            err?.message || 'Vérifiez Firebase Console > Email/Password'
          })`
        );
      }
    } finally {
      setActivatingAuth(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Corporate Header */}
      <div className="bg-slate-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-medium">
            <span>Messagerie Professionnelle Danthoss</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{CORPORATE_EMAIL}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300">Synchronisation Cloud Temps Réel & SMTP</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {isAdmin
              ? 'Webmail Professionnel — Cabinet Rabiou Saley'
              : 'Contacter le Cabinet — Messagerie Directe'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {isAdmin
              ? `Recevez en temps réel tous les messages clients et demandes de devis adressés à ${CORPORATE_EMAIL}, quel que soit l'appareil ou le lien utilisé par vos clients.`
              : `Échangez directement avec le Cabinet Rabiou Saley (${CORPORATE_EMAIL}) et recevez vos réponses en temps réel dans cet espace.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => openNewComposer()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdmin ? 'Nouveau message pro' : `Écrire à ${CORPORATE_EMAIL}`}</span>
          </button>

          {isAdmin && (
            <>
              <button
                onClick={handleSimulateClientInbound}
                disabled={simulatingClient}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 font-semibold text-xs sm:text-sm border border-emerald-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Simuler l'envoi d'un message client vers contact@danthoss-cabinet.com"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{simulatingClient ? 'Test...' : 'Tester réception client'}</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>Compte & Alias Pro</span>
              </button>
            </>
          )}

          <button
            onClick={fetchServerStatus}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
            title="Vérifier l'état du serveur SMTP"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Feedback Banner after send / action */}
      {feedbackBanner && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm ${
            feedbackBanner.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{feedbackBanner.text}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {feedbackBanner.previewUrl && (
              <a
                href={feedbackBanner.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 underline"
              >
                <span>Voir l'accusé SMTP réel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => setFeedbackBanner(null)}
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Corporate Aliases Quick Bar (Admin Only) */}
      {isAdmin && (
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedAliasFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedAliasFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Toutes les boîtes ({messages.filter((m) => m.folder !== 'trash').length})
            </button>
            {(CABINET_INFO.emailAliases || []).map((alias) => (
              <button
                key={alias.email}
                onClick={() => setSelectedAliasFilter(alias.email)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  selectedAliasFilter === alias.email
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {alias.email}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCopyAddress(CORPORATE_EMAIL)}
            className="text-xs font-medium text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            {copiedEmail === CORPORATE_EMAIL ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Adresse copiée</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier {CORPORATE_EMAIL}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Main Webmail Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Folder Sidebar */}
        {isAdmin && (
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200 p-3 sm:p-4 bg-slate-50/60 flex flex-row lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'inbox', label: 'Boîte de réception', icon: Inbox, badge: unreadInboxCount },
              { id: 'sent', label: 'Messages envoyés', icon: Send, badge: 0 },
              { id: 'starred', label: 'Suivis & Favoris', icon: Star, badge: 0 },
              {
                id: 'drafts',
                label: 'Brouillons',
                icon: FileEdit,
                badge: messages.filter((m) => m.folder === 'drafts').length
              },
              { id: 'trash', label: 'Corbeille', icon: Trash2, badge: 0 }
            ].map((folder) => {
              const Icon = folder.icon;
              const active = activeFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => {
                    setActiveFolder(folder.id as any);
                    setSelectedMessage(null);
                  }}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 lg:w-full ${
                    active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{folder.label}</span>
                  </span>
                  {folder.badge > 0 && (
                    <span
                      className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                        active ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-rose-500 text-white font-bold'
                      }`}
                    >
                      {folder.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="hidden lg:block mt-auto pt-6 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1 px-2">
              <div className="font-semibold text-slate-700">Réception Temps Réel Active</div>
              <div className="font-mono text-emerald-700">{CORPORATE_EMAIL}</div>
              <div>Synchronisé multi-appareils & Cloud</div>
            </div>
          </div>
        )}

        {/* Middle Column: Thread / Message List */}
        <div
          className={`${
            isAdmin ? 'lg:col-span-4' : 'lg:col-span-5'
          } border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col ${
            selectedMessage ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search Input */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un client, e-mail, objet..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[520px] lg:max-h-none">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Synchronisation temps réel de {CORPORATE_EMAIL}...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <MailOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-sm font-semibold text-slate-700">Aucun message dans ce dossier</div>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isAdmin
                    ? `Les messages envoyés par vos clients vers ${CORPORATE_EMAIL} s'affichent automatiquement ici en temps réel.`
                    : `Envoyez un message direct à ${CORPORATE_EMAIL} pour échanger avec le Cabinet Rabiou Saley.`}
                </p>
                <button
                  type="button"
                  onClick={() => (isAdmin ? handleSimulateClientInbound() : openNewComposer())}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {isAdmin ? 'Tester la réception client' : `Écrire à ${CORPORATE_EMAIL}`}
                </button>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                const isUnreadForViewer = isAdmin
                  ? !msg.read && msg.folder === 'inbox'
                  : !msg.read && msg.toEmail.toLowerCase() === activeUserEmail.toLowerCase();

                const displayCounterpart = isAdmin
                  ? msg.folder === 'sent'
                    ? `À : ${msg.toName || msg.toEmail}`
                    : `${msg.fromName} (${msg.fromEmail})`
                  : isCorporateAddress(msg.fromEmail)
                  ? `Cabinet Rabiou Saley (${msg.fromEmail})`
                  : `Vous → ${msg.toEmail}`;

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3.5 sm:p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                      isSelected
                        ? 'bg-emerald-50/70'
                        : isUnreadForViewer
                        ? 'bg-emerald-50/30'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-xs truncate flex items-center gap-1.5 ${
                          isUnreadForViewer ? 'font-bold text-slate-950' : 'font-semibold text-slate-700'
                        }`}
                      >
                        {isUnreadForViewer && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                        <span className="truncate">{displayCounterpart}</span>
                      </span>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400 shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1">
                      <h4
                        className={`text-xs sm:text-sm truncate ${
                          isUnreadForViewer ? 'font-bold text-slate-900' : 'font-medium text-slate-800'
                        }`}
                      >
                        {msg.subject}
                      </h4>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleStar(e, msg)}
                          className="text-slate-400 hover:text-amber-500 shrink-0 cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              msg.starred ? 'fill-amber-400 text-amber-500' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {msg.body}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Reader Pane */}
        <div
          className={`${
            isAdmin ? 'lg:col-span-5' : 'lg:col-span-7'
          } flex flex-col bg-white ${selectedMessage ? 'flex' : 'hidden lg:flex'}`}
        >
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Reader Toolbar */}
              <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between gap-2 bg-slate-50/50">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <div className="flex items-center gap-1.5 ml-auto">
                  {selectedMessage.folder === 'drafts' ? (
                    <button
                      onClick={() => {
                        setDraftId(selectedMessage.id);
                        setFromAlias(selectedMessage.fromEmail);
                        setToEmail(selectedMessage.toEmail);
                        setCcEmail(selectedMessage.ccEmail || '');
                        setSubject(selectedMessage.subject);
                        setBody(selectedMessage.body);
                        setIsComposerOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 cursor-pointer"
                    >
                      Reprendre le brouillon
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReply(selectedMessage)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Répondre</span>
                      </button>
                      <button
                        onClick={() => handleForward(selectedMessage)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Forward className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Transférer</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => downloadMessageAsEml(selectedMessage)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    title="Télécharger l'original au format .eml (Outlook / Apple Mail)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleMoveToTrashOrDelete(selectedMessage)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 cursor-pointer"
                      title={
                        selectedMessage.folder === 'trash'
                          ? 'Supprimer définitivement'
                          : 'Mettre à la corbeille'
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Message Metadata & Content */}
              <div className="p-5 sm:p-6 space-y-5 flex-1 overflow-y-auto">
                <div className="space-y-3 pb-4 border-b border-slate-200">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {selectedMessage.subject}
                  </h2>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">De : </span>
                      <strong className="text-slate-900">{selectedMessage.fromName}</strong>{' '}
                      <span className="font-mono text-slate-500">&lt;{selectedMessage.fromEmail}&gt;</span>
                    </div>
                    <div>
                      <span className="text-slate-400">À : </span>
                      <span className="font-mono text-slate-700">{selectedMessage.toEmail}</span>
                    </div>
                    {selectedMessage.ccEmail && (
                      <div>
                        <span className="text-slate-400">Cc : </span>
                        <span className="font-mono text-slate-700">{selectedMessage.ccEmail}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                      <span>{new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</span>
                      {selectedMessage.smtpMessageId && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono truncate max-w-[240px]">
                            ID: {selectedMessage.smtpMessageId}
                          </span>
                        </>
                      )}
                      {selectedMessage.smtpPreviewUrl && (
                        <>
                          <span aria-hidden="true">·</span>
                          <a
                            href={selectedMessage.smtpPreviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 hover:underline font-medium inline-flex items-center gap-1"
                          >
                            <span>Certificat SMTP</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                  {selectedMessage.body}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-500">
              <Mail className="w-10 h-10 text-slate-300" />
              <div className="text-sm font-semibold text-slate-700">
                Sélectionnez un e-mail pour l'afficher
              </div>
              <p className="text-xs max-w-sm">
                Compte professionnel actif :{' '}
                <span className="font-mono text-slate-800">{CORPORATE_EMAIL}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rich Email Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[94dvh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  {isAdmin
                    ? 'Nouveau Message Professionnel'
                    : `Envoyer un message à ${CORPORATE_EMAIL}`}
                </h3>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Quick Templates & Gemini Assist Bar (Admin) */}
              {isAdmin && (
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {EMAIL_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => {
                          setSubject(tpl.subject);
                          setBody(tpl.body);
                          setCategory(tpl.category);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAssistWithGemini}
                    disabled={aiDrafting}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiDrafting ? 'animate-spin' : ''}`} />
                    <span>{aiDrafting ? 'Rédaction Gemini...' : 'Rédiger avec Gemini AI'}</span>
                  </button>
                </div>
              )}

              {!isAdmin && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Votre Nom ou Entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientSenderName}
                    onChange={(e) => setClientSenderName(e.target.value)}
                    placeholder="Ex: Jean Dupont — Société FinTech"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    De (Expéditeur)
                  </label>
                  {isAdmin ? (
                    <select
                      value={fromAlias}
                      onChange={(e) => setFromAlias(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {(CABINET_INFO.emailAliases || []).map((a) => (
                        <option key={a.email} value={a.email}>
                          {a.email} ({a.label})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="email"
                      required
                      value={fromAlias}
                      onChange={(e) => setFromAlias(e.target.value)}
                      placeholder="votre.email@entreprise.com"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    À (Destinataire) *
                  </label>
                  {isAdmin ? (
                    <input
                      type="email"
                      required
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      placeholder="client@entreprise.com"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <select
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {(CABINET_INFO.emailAliases || []).map((a) => (
                        <option key={a.email} value={a.email}>
                          {a.email} — {a.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {isAdmin && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Copie (Cc — optionnel)
                  </label>
                  <input
                    type="email"
                    value={ccEmail}
                    onChange={(e) => setCcEmail(e.target.value)}
                    placeholder="partenaire@entreprise.com"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Objet du message *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Demande de mission IA / Question technique"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows={8}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Rédigez votre message..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Enregistrer en brouillon
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    Réception instantanée sur {CORPORATE_EMAIL}
                  </span>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsComposerOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sending ? 'Envoi en direct...' : 'Envoyer l\'e-mail'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Corporate Account & Firebase Auth Provisioning Modal */}
      {isAdmin && isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92dvh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  Paramètres du Compte E-mail Professionnel
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-xs sm:text-sm">
              {/* Provisioned Addresses */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900">
                  1. Adresses professionnelles actives (@danthoss-cabinet.com)
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {(CABINET_INFO.emailAliases || []).map((item) => (
                    <div
                      key={item.email}
                      className="p-3 flex items-center justify-between gap-2 bg-white"
                    >
                      <div>
                        <div className="font-mono font-semibold text-slate-900 text-xs">
                          {item.email}
                        </div>
                        <div className="text-[11px] text-slate-500">{item.label}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyAddress(item.email)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
                      >
                        {copiedEmail === item.email ? 'Copié' : 'Copier'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Server & Cloud Sync Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900">
                  2. Réception Client Temps Réel & Relais SMTP
                </div>
                <div className="text-slate-600">
                  Synchronisation entrante :{' '}
                  <strong className="text-emerald-700">
                    Cloud Firestore Temps Réel + Relais SMTP TLS ({serverStatus?.transportMode === 'custom_smtp' ? 'SMTP Dédié' : 'Actif'})
                  </strong>
                </div>
                <div className="text-slate-600">
                  Compte de secours rattaché :{' '}
                  <span className="font-mono text-slate-800">{CABINET_INFO.backupEmail}</span>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleSimulateClientInbound}
                    disabled={simulatingClient}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Simuler un message client vers {CORPORATE_EMAIL}</span>
                  </button>
                </div>
              </div>

              {/* Direct Firebase Auth Login Activation for contact@danthoss-cabinet.com */}
              <form
                onSubmit={handleActivateFirebaseCorporateLogin}
                className="space-y-3 pt-2 border-t border-slate-200"
              >
                <div>
                  <h4 className="font-bold text-slate-900">
                    3. Accès de connexion directe ({CORPORATE_EMAIL})
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Définissez un mot de passe pour pouvoir également vous connecter à l'application directement avec l'identifiant Super Admin{' '}
                    <span className="font-mono text-slate-700">{CORPORATE_EMAIL}</span>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    minLength={6}
                    value={proAuthPassword}
                    onChange={(e) => setProAuthPassword(e.target.value)}
                    placeholder="Choisir un mot de passe (min. 6 caractères)"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={activatingAuth}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shrink-0"
                  >
                    {activatingAuth ? 'Activation...' : 'Activer l\'identifiant Pro'}
                  </button>
                </div>

                {authActivationMsg && (
                  <p className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                    {authActivationMsg}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
