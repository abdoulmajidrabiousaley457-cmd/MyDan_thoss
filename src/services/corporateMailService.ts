import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';

export interface CorporateEmailMessage {
  id: string;
  senderUid?: string;
  fromName: string;
  fromEmail: string;
  toName?: string;
  toEmail: string;
  ccEmail?: string;
  subject: string;
  body: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
  category: 'general' | 'devis' | 'livrable' | 'support' | 'system';
  read: boolean;
  starred: boolean;
  smtpMessageId?: string;
  smtpPreviewUrl?: string;
  createdAt: string;
}

export const CORPORATE_PRIMARY_EMAIL = 'contact@danthoss-cabinet.com';
export const CORPORATE_ALL_ADDRESSES = [
  'contact@danthoss-cabinet.com',
  'direction@danthoss-cabinet.com',
  'devis@danthoss-cabinet.com',
  'support@danthoss-cabinet.com',
  'rabiou.saley@danthoss-cabinet.com',
  'abdoulmajidrabiousaley457@gmail.com'
];

export function isCorporateAddress(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return clean.endsWith('@danthoss-cabinet.com') || CORPORATE_ALL_ADDRESSES.includes(clean);
}

function sanitizeEmailDoc(msg: CorporateEmailMessage): Record<string, any> {
  return {
    id: String(msg.id).slice(0, 128),
    senderUid: String(msg.senderUid || '').slice(0, 128),
    fromName: String(msg.fromName || 'Expéditeur').slice(0, 120),
    fromEmail: String(msg.fromEmail || '').trim().toLowerCase().slice(0, 150),
    toName: String(msg.toName || '').slice(0, 120),
    toEmail: String(msg.toEmail || CORPORATE_PRIMARY_EMAIL).trim().toLowerCase().slice(0, 150),
    ccEmail: String(msg.ccEmail || '').trim().toLowerCase().slice(0, 150),
    subject: String(msg.subject || '(Sans objet)').slice(0, 250),
    body: String(msg.body || ' ').slice(0, 15000),
    folder: ['inbox', 'sent', 'drafts', 'trash'].includes(msg.folder) ? msg.folder : 'inbox',
    category: ['general', 'devis', 'livrable', 'support', 'system'].includes(msg.category)
      ? msg.category
      : 'general',
    read: Boolean(msg.read),
    starred: Boolean(msg.starred),
    smtpMessageId: String(msg.smtpMessageId || '').slice(0, 250),
    smtpPreviewUrl: String(msg.smtpPreviewUrl || '').slice(0, 500),
    createdAt: String(msg.createdAt || new Date().toISOString()).slice(0, 50)
  };
}

export interface SendCorporateEmailInput {
  id?: string;
  senderUid?: string;
  isAdminSender?: boolean;
  fromName: string;
  fromEmail: string;
  toName?: string;
  toEmail: string;
  ccEmail?: string;
  subject: string;
  body: string;
  category?: 'general' | 'devis' | 'livrable' | 'support' | 'system';
}

export interface SendCorporateEmailResult {
  success: boolean;
  message: CorporateEmailMessage;
  smtpDelivered: boolean;
  smtpMessageId: string;
  smtpPreviewUrl?: string;
}

/**
 * Sends an email with guaranteed real-time Firestore cloud persistence FIRST
 * (works across AI Studio Dev URL, Shared App URL, Mobile PWA, and Vercel),
 * followed by real TLS SMTP relay delivery via /api/mail/send when backend is reachable.
 */
export async function sendCorporateEmail(
  input: SendCorporateEmailInput
): Promise<SendCorporateEmailResult> {
  const nowIso = new Date().toISOString();
  const isAdminSender = Boolean(input.isAdminSender);

  const rawFromEmail = String(input.fromEmail || '').trim().toLowerCase();
  const cleanFromEmail = isAdminSender
    ? rawFromEmail || CORPORATE_PRIMARY_EMAIL
    : rawFromEmail && !rawFromEmail.endsWith('@danthoss-cabinet.com')
    ? rawFromEmail
    : rawFromEmail || 'client@externe.com';

  const rawToEmail = String(input.toEmail || '').trim().toLowerCase();
  const cleanToEmail = isAdminSender
    ? rawToEmail
    : isCorporateAddress(rawToEmail)
    ? rawToEmail
    : CORPORATE_PRIMARY_EMAIL;

  // Ensure contact@danthoss-cabinet.com ALWAYS receives a copy when a client writes to an alias (e.g., devis@ or support@)
  let cleanCcEmail = String(input.ccEmail || '').trim().toLowerCase();
  if (!isAdminSender && cleanToEmail !== CORPORATE_PRIMARY_EMAIL && !cleanCcEmail) {
    cleanCcEmail = CORPORATE_PRIMARY_EMAIL;
  }

  const baseId =
    input.id && /^[a-zA-Z0-9_-]+$/.test(input.id)
      ? input.id
      : isAdminSender
      ? `mail_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      : `mail_in_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  let smtpMessageId = `<${Date.now()}.${Math.random().toString(36).slice(2, 8)}@danthoss-cabinet.com>`;
  let smtpPreviewUrl = '';
  let smtpDelivered = false;

  const primaryMessage: CorporateEmailMessage = {
    id: baseId,
    senderUid: input.senderUid || (isAdminSender ? '' : 'public_visitor'),
    fromName: String(input.fromName || cleanFromEmail.split('@')[0] || 'Client').trim().slice(0, 120),
    fromEmail: cleanFromEmail,
    toName: String(input.toName || (isAdminSender ? '' : 'Cabinet Rabiou Saley')).trim().slice(0, 120),
    toEmail: cleanToEmail,
    ccEmail: cleanCcEmail,
    subject: String(input.subject || '(Sans objet)').trim().slice(0, 250),
    body: String(input.body || '').trim().slice(0, 15000),
    folder: isAdminSender ? 'sent' : 'inbox',
    category: input.category || 'general',
    read: isAdminSender ? true : false,
    starred: false,
    smtpMessageId,
    smtpPreviewUrl: '',
    createdAt: nowIso
  };

  // 1. Write immediately to Firestore /corporateEmails/{id} so contact@danthoss-cabinet.com receives it in < 200ms everywhere
  await setDoc(doc(db, 'corporateEmails', primaryMessage.id), sanitizeEmailDoc(primaryMessage));

  // If Admin sends a message TO contact@danthoss-cabinet.com (or any corporate alias) as a test, also place an unread copy in Inbox
  let adminSelfInboxId: string | null = null;
  if (isAdminSender && isCorporateAddress(cleanToEmail)) {
    adminSelfInboxId = `mail_in_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const inboxCopy: CorporateEmailMessage = {
      ...primaryMessage,
      id: adminSelfInboxId,
      folder: 'inbox',
      read: false
    };
    await setDoc(doc(db, 'corporateEmails', adminSelfInboxId), sanitizeEmailDoc(inboxCopy));
  }

  // 2. Dispatch through Express Nodemailer TLS SMTP relay if available
  try {
    const res = await fetch('/api/mail/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: primaryMessage.id,
        adminSelfInboxId,
        isAdminSender,
        senderUid: primaryMessage.senderUid,
        fromName: primaryMessage.fromName,
        fromEmail: primaryMessage.fromEmail,
        toName: primaryMessage.toName,
        toEmail: primaryMessage.toEmail,
        ccEmail: primaryMessage.ccEmail,
        subject: primaryMessage.subject,
        body: primaryMessage.body,
        category: primaryMessage.category
      })
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data?.smtpMessageId) smtpMessageId = data.smtpMessageId;
      if (data?.smtpPreviewUrl) smtpPreviewUrl = data.smtpPreviewUrl;
      smtpDelivered = Boolean(data?.smtpDelivered);

      primaryMessage.smtpMessageId = smtpMessageId;
      primaryMessage.smtpPreviewUrl = smtpPreviewUrl;

      // Update Firestore record with real SMTP certificate metadata if we have write permission
      if (isAdminSender && (smtpPreviewUrl || smtpMessageId)) {
        await setDoc(
          doc(db, 'corporateEmails', primaryMessage.id),
          sanitizeEmailDoc(primaryMessage)
        ).catch(() => {});
        if (adminSelfInboxId) {
          await setDoc(
            doc(db, 'corporateEmails', adminSelfInboxId),
            sanitizeEmailDoc({
              ...primaryMessage,
              id: adminSelfInboxId,
              folder: 'inbox',
              read: false
            })
          ).catch(() => {});
        }
      }
    }
  } catch {
    // Graceful cloud-only operation when running on static hosting or offline
  }

  return {
    success: true,
    message: primaryMessage,
    smtpDelivered,
    smtpMessageId,
    smtpPreviewUrl: smtpPreviewUrl || undefined
  };
}

export async function updateCorporateEmailMetadata(
  msg: CorporateEmailMessage,
  updates: Partial<Pick<CorporateEmailMessage, 'read' | 'starred' | 'folder'>>,
  isAdmin: boolean
): Promise<void> {
  const updated: CorporateEmailMessage = {
    ...msg,
    ...updates
  };

  if (isAdmin) {
    await setDoc(doc(db, 'corporateEmails', msg.id), sanitizeEmailDoc(updated)).catch(() => {});
  } else if (typeof updates.read === 'boolean') {
    await setDoc(doc(db, 'corporateEmails', msg.id), { read: updates.read }, { merge: true }).catch(
      () => {}
    );
  }

  fetch(`/api/mail/messages/${encodeURIComponent(msg.id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  }).catch(() => {});
}

export async function deleteCorporateEmailPermanent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'corporateEmails', id)).catch(() => {});
  fetch(`/api/mail/messages/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
}

export async function saveCorporateEmailDraft(draft: {
  id?: string;
  senderUid?: string;
  fromName: string;
  fromEmail: string;
  toEmail: string;
  ccEmail?: string;
  subject: string;
  body: string;
}): Promise<CorporateEmailMessage> {
  const draftId = draft.id || `draft_${Date.now()}`;
  const draftRecord: CorporateEmailMessage = {
    id: draftId,
    senderUid: draft.senderUid || '',
    fromName: draft.fromName || 'Rabiou Saley Abdoul Majid',
    fromEmail: draft.fromEmail || CORPORATE_PRIMARY_EMAIL,
    toName: '',
    toEmail: draft.toEmail || 'destinataire@attente.com',
    ccEmail: draft.ccEmail || '',
    subject: draft.subject || '(Brouillon sans objet)',
    body: draft.body || ' ',
    folder: 'drafts',
    category: 'general',
    read: true,
    starred: false,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'corporateEmails', draftId), sanitizeEmailDoc(draftRecord));

  fetch('/api/mail/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draftRecord)
  }).catch(() => {});

  return draftRecord;
}

/**
 * Generates and downloads a standard RFC-5322 .eml file directly in the browser
 * so every corporate or client email can be exported into Outlook / Apple Mail / Thunderbird.
 */
export function downloadMessageAsEml(msg: CorporateEmailMessage): void {
  const emlLines = [
    `Message-ID: ${msg.smtpMessageId || `<${msg.id}@danthoss-cabinet.com>`}`,
    `Date: ${new Date(msg.createdAt).toUTCString()}`,
    `From: "${msg.fromName.replace(/"/g, '')}" <${msg.fromEmail}>`,
    `To: ${msg.toName ? `"${msg.toName.replace(/"/g, '')}" <${msg.toEmail}>` : msg.toEmail}`,
    ...(msg.ccEmail ? [`Cc: ${msg.ccEmail}`] : []),
    `Subject: ${msg.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    msg.body,
    ``
  ].join('\r\n');

  const blob = new Blob([emlLines], { type: 'message/rfc822;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const safeName = (msg.subject || 'email_danthoss')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 48);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName}.eml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Real-time bidirectional subscription to the Corporate Mailbox.
 * - Admin receives ALL messages in /corporateEmails + automatic sync from /devisRequests + local server seed messages.
 * - Client receives all messages they sent (senderUid == uid) + all replies sent TO their email (toEmail == userEmail).
 */
export function subscribeToCorporateMailbox(options: {
  userUid: string;
  userEmail: string;
  isAdmin: boolean;
  onMessages: (messages: CorporateEmailMessage[]) => void;
}): Unsubscribe {
  const { userUid, userEmail, isAdmin, onMessages } = options;
  const cleanEmail = (userEmail || '').trim().toLowerCase();

  let cloudMap = new Map<string, CorporateEmailMessage>();
  let serverMap = new Map<string, CorporateEmailMessage>();
  let devisMap = new Map<string, CorporateEmailMessage>();

  const emitMerged = () => {
    const combined = new Map<string, CorporateEmailMessage>();
    // Server fallback messages first, then devis auto-emails, then authoritative Firestore cloud messages on top
    serverMap.forEach((v, k) => combined.set(k, v));
    devisMap.forEach((v, k) => combined.set(k, v));
    cloudMap.forEach((v, k) => combined.set(k, v));

    const sorted = Array.from(combined.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    onMessages(sorted);
  };

  // Optional initial fetch from local server /api/mail/messages (merges seed & local SMTP messages)
  fetch(
    `/api/mail/messages?userEmail=${encodeURIComponent(
      isAdmin ? CORPORATE_PRIMARY_EMAIL : cleanEmail
    )}&isAdmin=${isAdmin ? 'true' : 'false'}`
  )
    .then(async (res) => {
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data?.messages)) {
          const nextServer = new Map<string, CorporateEmailMessage>();
          for (const item of data.messages as CorporateEmailMessage[]) {
            nextServer.set(item.id, item);
            // Seed welcome message into Firestore for Admin if not yet stored in cloud
            if (isAdmin && item.id.startsWith('mail_welcome_') && !cloudMap.has(item.id)) {
              setDoc(doc(db, 'corporateEmails', item.id), sanitizeEmailDoc(item)).catch(() => {});
            }
          }
          serverMap = nextServer;
          emitMerged();
        }
      }
    })
    .catch(() => {});

  const unsubscribers: Unsubscribe[] = [];

  if (isAdmin) {
    // 1. Real-time listener on ALL corporateEmails
    const unsubEmails = onSnapshot(
      collection(db, 'corporateEmails'),
      (snap) => {
        const nextCloud = new Map<string, CorporateEmailMessage>();
        snap.forEach((d) => {
          const data = d.data() as CorporateEmailMessage;
          nextCloud.set(d.id, { ...data, id: d.id });
        });
        cloudMap = nextCloud;
        emitMerged();
      },
      (err) => {
        console.warn('Corporate mailbox listener notice:', err?.message || err);
        emitMerged();
      }
    );
    unsubscribers.push(unsubEmails);

    // 2. Real-time listener on /devisRequests so EVERY client quote request is guaranteed to appear in contact@danthoss-cabinet.com
    const unsubDevis = onSnapshot(
      collection(db, 'devisRequests'),
      (snap) => {
        const nextDevis = new Map<string, CorporateEmailMessage>();
        snap.forEach((d) => {
          const q = d.data() as any;
          const syntheticId = `mail_devis_${d.id}`;
          if (cloudMap.has(syntheticId)) return;

          const syntheticEmail: CorporateEmailMessage = {
            id: syntheticId,
            senderUid: '',
            fromName: String(q.clientName || 'Client Devis').slice(0, 120),
            fromEmail: String(q.clientEmail || 'client@devis.com').toLowerCase().slice(0, 150),
            toName: 'Cabinet Rabiou Saley',
            toEmail: CORPORATE_PRIMARY_EMAIL,
            ccEmail: 'devis@danthoss-cabinet.com',
            subject: `[Demande de Devis] ${q.clientCompany || q.clientName || 'Mission IA'} — ${(
              q.estimatedCostEUR || 0
            ).toLocaleString('fr-FR')} €`,
            body: [
              `Bonjour Cabinet Rabiou Saley,`,
              ``,
              `Demande de devis reçue sur votre boîte professionnelle ${CORPORATE_PRIMARY_EMAIL} :`,
              `• Client : ${q.clientName || 'Non renseigné'}${q.clientCompany ? ` (${q.clientCompany})` : ''}`,
              `• Email : ${q.clientEmail || 'Non renseigné'}`,
              `• Téléphone / WhatsApp : ${q.clientPhone || 'Non renseigné'}`,
              `• Format : ${q.workFormat || 'project'} (${q.durationWeeks || 4} semaines • ${q.complexity || 'advanced'})`,
              `• Estimation : ${(q.estimatedCostEUR || 0).toLocaleString('fr-FR')} € (${(
                q.estimatedCostXOF || 0
              ).toLocaleString('fr-FR')} FCFA)`,
              `• Accord NDA souhaité : ${q.ndaRequested ? 'OUI' : 'NON'}`,
              ``,
              `Description du besoin :`,
              `${q.projectDescription || 'Aucune description fournie.'}`
            ].join('\n'),
            folder: 'inbox',
            category: 'devis',
            read: false,
            starred: true,
            createdAt: q.createdAt || new Date().toISOString()
          };
          nextDevis.set(syntheticId, syntheticEmail);
          // Persist into corporateEmails so read/star/trash state is preserved permanently
          setDoc(doc(db, 'corporateEmails', syntheticId), sanitizeEmailDoc(syntheticEmail)).catch(
            () => {}
          );
        });
        devisMap = nextDevis;
        emitMerged();
      },
      () => {}
    );
    unsubscribers.push(unsubDevis);
  } else if (userUid) {
    let sentByClientMap = new Map<string, CorporateEmailMessage>();
    let receivedByClientMap = new Map<string, CorporateEmailMessage>();

    const syncClientMaps = () => {
      const merged = new Map<string, CorporateEmailMessage>();
      sentByClientMap.forEach((v, k) => {
        if (v.folder !== 'trash') merged.set(k, v);
      });
      receivedByClientMap.forEach((v, k) => {
        if (v.folder !== 'trash') merged.set(k, v);
      });
      cloudMap = merged;
      emitMerged();
    };

    // 1. Messages sent BY this client to contact@danthoss-cabinet.com
    const qSent = query(collection(db, 'corporateEmails'), where('senderUid', '==', userUid));
    const unsubSent = onSnapshot(
      qSent,
      (snap) => {
        const next = new Map<string, CorporateEmailMessage>();
        snap.forEach((d) => {
          const data = d.data() as CorporateEmailMessage;
          next.set(d.id, { ...data, id: d.id });
        });
        sentByClientMap = next;
        syncClientMaps();
      },
      () => syncClientMaps()
    );
    unsubscribers.push(unsubSent);

    // 2. Replies sent BY contact@danthoss-cabinet.com TO this client's email
    if (cleanEmail) {
      const qReceived = query(
        collection(db, 'corporateEmails'),
        where('toEmail', '==', cleanEmail)
      );
      const unsubReceived = onSnapshot(
        qReceived,
        (snap) => {
          const next = new Map<string, CorporateEmailMessage>();
          snap.forEach((d) => {
            const data = d.data() as CorporateEmailMessage;
            next.set(d.id, { ...data, id: d.id });
          });
          receivedByClientMap = next;
          syncClientMaps();
        },
        () => syncClientMaps()
      );
      unsubscribers.push(unsubReceived);
    }
  }

  return () => {
    unsubscribers.forEach((u) => u());
  };
}
