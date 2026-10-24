import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import {
  CorporateEmailMessage,
  CORPORATE_PRIMARY_EMAIL,
  upsertCorporateEmailRecord,
  updateCorporateEmailMetadata,
  isCorporateAddress
} from './corporateMailService';

/**
 * Provisioned Google Workspace Gmail OAuth scopes (least-privilege):
 * - gmail.readonly: Read external client emails arriving in abdoulmajidrabiousaley457@gmail.com
 * - gmail.send: Forward platform messages to abdoulmajidrabiousaley457@gmail.com & reply to external clients
 */
export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send'
];

export const LINKED_GMAIL_ADDRESS = 'abdoulmajidrabiousaley457@gmail.com';
export const LINKED_CORPORATE_ADDRESS = CORPORATE_PRIMARY_EMAIL; // contact@danthoss-cabinet.com

const gmailProvider = new GoogleAuthProvider();
SCOPES.forEach((scope) => gmailProvider.addScope(scope));
gmailProvider.setCustomParameters({
  prompt: 'consent',
  login_hint: LINKED_GMAIL_ADDRESS
});

export interface GmailBridgeState {
  connected: boolean;
  connectedEmail: string | null;
  needsAuth: boolean;
  lastSyncAt: string | null;
}

// Strictly in-memory token cache (NEVER persisted in localStorage or sessionStorage per Workspace security rules)
let isSigningIn = false;
let cachedAccessToken: string | null = null;
let connectedGmailEmail: string | null = null;
let lastSyncTimestamp: string | null = null;

type BridgeListener = (state: GmailBridgeState) => void;
const listeners = new Set<BridgeListener>();

function getSnapshotState(): GmailBridgeState {
  return {
    connected: Boolean(cachedAccessToken),
    connectedEmail: connectedGmailEmail,
    needsAuth: !cachedAccessToken,
    lastSyncAt: lastSyncTimestamp
  };
}

function emitBridgeState() {
  const snapshot = getSnapshotState();
  listeners.forEach((cb) => cb(snapshot));
}

// Clear cached OAuth access token immediately when user signs out of Firebase Auth
onAuthStateChanged(auth, (user: User | null) => {
  if (!user && !isSigningIn) {
    cachedAccessToken = null;
    connectedGmailEmail = null;
    lastSyncTimestamp = null;
    emitBridgeState();
  }
});

export function subscribeGmailBridgeState(listener: BridgeListener): () => void {
  listeners.add(listener);
  listener(getSnapshotState());
  return () => {
    listeners.delete(listener);
  };
}

export function getGmailBridgeState(): GmailBridgeState {
  return getSnapshotState();
}

export async function getGmailAccessToken(): Promise<string | null> {
  return cachedAccessToken;
}

export function disconnectGmailBridge(): void {
  cachedAccessToken = null;
  connectedGmailEmail = null;
  emitBridgeState();
}

function handleUnauthorizedToken() {
  cachedAccessToken = null;
  connectedGmailEmail = null;
  emitBridgeState();
}

/**
 * Initiates Google OAuth popup for Gmail Bridge (gmail.readonly + gmail.send).
 * Must be invoked directly from a user button click.
 */
export async function connectGmailBridge(): Promise<{
  user: User;
  accessToken: string;
  gmailAddress: string;
} | null> {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, gmailProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Impossible d\'obtenir le jeton d\'accès Gmail depuis Google.');
    }

    cachedAccessToken = credential.accessToken;
    let verifiedAddress = result.user.email || LINKED_GMAIL_ADDRESS;

    try {
      const profileRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
        headers: { Authorization: `Bearer ${cachedAccessToken}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData?.emailAddress) {
          verifiedAddress = String(profileData.emailAddress).toLowerCase();
        }
      }
    } catch {
      // Fallback to authenticated Google user email
    }

    connectedGmailEmail = verifiedAddress;
    emitBridgeState();

    return {
      user: result.user,
      accessToken: cachedAccessToken,
      gmailAddress: verifiedAddress
    };
  } catch (error: any) {
    const code = error?.code || '';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return null;
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
}

// =========================================================
// MIME & BASE64URL RFC-2822 HELPERS FOR GMAIL API
// =========================================================

function encodeUtf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function encodeUtf8ToBase64Url(str: string): string {
  return encodeUtf8ToBase64(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function encodeMimeHeaderWord(value: string): string {
  if (!value) return '';
  // Pure ASCII safe check
  if (/^[\x20-\x7E]*$/.test(value)) {
    return value;
  }
  return `=?UTF-8?B?${encodeUtf8ToBase64(value)}?=`;
}

function formatMimeAddress(displayName: string, email: string): string {
  const cleanEmail = email.trim();
  const cleanName = displayName.replace(/["<>]/g, '').trim();
  if (!cleanName) return cleanEmail;
  return `${encodeMimeHeaderWord(cleanName)} <${cleanEmail}>`;
}

function decodeBase64UrlToUtf8(base64Url: string): string {
  if (!base64Url) return '';
  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  } catch {
    return '';
  }
}

function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractBodyFromGmailPayload(payload: any): { plain: string; html: string } {
  let plain = '';
  let html = '';

  if (!payload) return { plain, html };

  const mimeType = String(payload.mimeType || '').toLowerCase();
  if (mimeType === 'text/plain' && payload.body?.data) {
    plain += decodeBase64UrlToUtf8(payload.body.data);
  } else if (mimeType === 'text/html' && payload.body?.data) {
    html += decodeBase64UrlToUtf8(payload.body.data);
  }

  if (Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      const sub = extractBodyFromGmailPayload(part);
      if (sub.plain) plain += (plain ? '\n' : '') + sub.plain;
      if (sub.html) html += (html ? '\n' : '') + sub.html;
    }
  }

  return { plain, html };
}

function parseAddressHeader(rawHeader: string): { name: string; email: string } {
  const trimmed = (rawHeader || '').trim();
  if (!trimmed) return { name: 'Client Externe', email: 'externe@gmail.com' };

  const angleMatch = trimmed.match(/^(.*?)<([^>]+)>$/);
  if (angleMatch) {
    const rawName = angleMatch[1].replace(/^["'\s]+|["'\s]+$/g, '').trim();
    const rawEmail = angleMatch[2].trim().toLowerCase();
    return {
      name: rawName || rawEmail.split('@')[0] || 'Client Externe',
      email: rawEmail
    };
  }

  const emailOnly = trimmed.replace(/^["'\s<]+|["'\s>]+$/g, '').toLowerCase();
  return {
    name: emailOnly.split('@')[0] || 'Client Externe',
    email: emailOnly
  };
}

function getHeader(headers: Array<{ name?: string; value?: string }> | undefined, targetName: string): string {
  if (!Array.isArray(headers)) return '';
  const lower = targetName.toLowerCase();
  const found = headers.find((h) => String(h.name || '').toLowerCase() === lower);
  return found?.value ? String(found.value) : '';
}

// =========================================================
// 1. INBOUND SYNC: EXTERNAL GMAIL -> contact@danthoss-cabinet.com
// =========================================================

export interface GmailSyncResult {
  importedCount: number;
  checkedCount: number;
  importedMessages: CorporateEmailMessage[];
}

/**
 * Reads external emails arriving in abdoulmajidrabiousaley457@gmail.com (sent from Gmail app, Outlook, Yahoo, etc.)
 * and synchronizes them into contact@danthoss-cabinet.com on the platform.
 */
export async function syncExternalGmailToCorporateMailbox(
  existingMessages: CorporateEmailMessage[]
): Promise<GmailSyncResult> {
  if (!cachedAccessToken) {
    handleUnauthorizedToken();
    throw new Error('Veuillez connecter votre compte Gmail pour synchroniser les e-mails externes.');
  }

  const existingIds = new Set(existingMessages.map((m) => m.id));
  const existingGmailIds = new Set(
    existingMessages.map((m) => m.gmailMessageId).filter(Boolean) as string[]
  );

  const listUrl =
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20&q=' +
    encodeURIComponent('in:inbox');

  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${cachedAccessToken}` }
  });

  if (listRes.status === 401) {
    handleUnauthorizedToken();
    throw new Error('Votre session Gmail a expiré. Veuillez reconnecter Gmail.');
  }

  if (!listRes.ok) {
    throw new Error('Impossible de lire la boîte de réception Gmail.');
  }

  const listData = await listRes.json();
  const rawItems: Array<{ id: string; threadId?: string }> = Array.isArray(listData?.messages)
    ? listData.messages
    : [];

  const importedMessages: CorporateEmailMessage[] = [];

  for (const item of rawItems) {
    if (!item?.id) continue;
    const safeGmailId = String(item.id).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100);
    if (!safeGmailId) continue;

    const docId = `gmail_ext_${safeGmailId}`;
    if (existingIds.has(docId) || existingGmailIds.has(item.id)) {
      continue;
    }

    const detailRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(item.id)}?format=full`,
      {
        headers: { Authorization: `Bearer ${cachedAccessToken}` }
      }
    );

    if (detailRes.status === 401) {
      handleUnauthorizedToken();
      throw new Error('Votre session Gmail a expiré. Veuillez reconnecter Gmail.');
    }

    if (!detailRes.ok) continue;

    const detail = await detailRes.json();
    const headers = detail?.payload?.headers || [];

    const bridgeHeader = getHeader(headers, 'X-Danthoss-Bridge');
    const subjectHeader = getHeader(headers, 'Subject') || '(Sans objet)';

    // Skip platform-forwarded copies so they never loop back into Inbox as duplicates
    if (
      bridgeHeader === 'platform-forward' ||
      subjectHeader.startsWith('[Danthoss Pro]') ||
      subjectHeader.startsWith('[Danthoss •')
    ) {
      continue;
    }

    const fromHeader = getHeader(headers, 'From');
    const parsedFrom = parseAddressHeader(fromHeader);

    // Skip emails sent by the connected Gmail account itself unless sent to corporate alias
    const toHeader = getHeader(headers, 'To');
    const parsedTo = parseAddressHeader(toHeader);
    if (
      connectedGmailEmail &&
      parsedFrom.email === connectedGmailEmail.toLowerCase() &&
      !isCorporateAddress(parsedTo.email)
    ) {
      continue;
    }

    const messageIdHeader = getHeader(headers, 'Message-ID') || `<gmail-${safeGmailId}@mail.gmail.com>`;
    const dateHeader = getHeader(headers, 'Date');
    const internalDateMs = detail?.internalDate ? Number(detail.internalDate) : NaN;
    let createdAtIso = new Date().toISOString();
    if (!Number.isNaN(internalDateMs) && internalDateMs > 0) {
      createdAtIso = new Date(internalDateMs).toISOString();
    } else if (dateHeader) {
      const parsedDate = new Date(dateHeader);
      if (!Number.isNaN(parsedDate.getTime())) {
        createdAtIso = parsedDate.toISOString();
      }
    }

    const extracted = extractBodyFromGmailPayload(detail?.payload);
    const cleanBody =
      extracted.plain.trim() ||
      stripHtmlTags(extracted.html) ||
      String(detail?.snippet || '(Message externe reçu via Gmail)').trim();

    const labelIds: string[] = Array.isArray(detail?.labelIds) ? detail.labelIds : [];
    const isUnread = labelIds.includes('UNREAD');
    const isStarred = labelIds.includes('STARRED');

    const lowerSubject = subjectHeader.toLowerCase();
    const category: CorporateEmailMessage['category'] =
      lowerSubject.includes('devis') || lowerSubject.includes('mission') || lowerSubject.includes('offre')
        ? 'devis'
        : lowerSubject.includes('livrable') || lowerSubject.includes('vault')
        ? 'livrable'
        : lowerSubject.includes('support')
        ? 'support'
        : 'general';

    const syncedRecord: CorporateEmailMessage = {
      id: docId,
      senderUid: 'gmail_external',
      fromName: parsedFrom.name.slice(0, 120),
      fromEmail: parsedFrom.email.slice(0, 150),
      toName: 'Cabinet Rabiou Saley (Pont Gmail)',
      toEmail: LINKED_CORPORATE_ADDRESS,
      ccEmail: (connectedGmailEmail || LINKED_GMAIL_ADDRESS).slice(0, 150),
      subject: subjectHeader.slice(0, 250),
      body: cleanBody.slice(0, 15000),
      folder: 'inbox',
      category,
      read: !isUnread,
      starred: isStarred,
      smtpMessageId: messageIdHeader.slice(0, 250),
      externalSource: 'gmail',
      gmailMessageId: String(item.id).slice(0, 128),
      gmailThreadId: String(detail?.threadId || item.threadId || '').slice(0, 128),
      gmailForwarded: true,
      createdAt: createdAtIso
    };

    await upsertCorporateEmailRecord(syncedRecord);
    importedMessages.push(syncedRecord);
  }

  lastSyncTimestamp = new Date().toISOString();
  emitBridgeState();

  return {
    importedCount: importedMessages.length,
    checkedCount: rawItems.length,
    importedMessages
  };
}

// =========================================================
// 2. PLATFORM -> GMAIL DIRECT FORWARDING (Requires user confirmation in UI)
// =========================================================

/**
 * Forwards platform messages addressed to contact@danthoss-cabinet.com directly into
 * the real Gmail inbox abdoulmajidrabiousaley457@gmail.com via Gmail API.
 * Must ONLY be called after explicit user confirmation in UI.
 */
export async function forwardPlatformMessagesToGmail(
  messagesToForward: CorporateEmailMessage[]
): Promise<{ forwardedCount: number }> {
  if (!cachedAccessToken) {
    handleUnauthorizedToken();
    throw new Error('Veuillez connecter votre compte Gmail avant de transférer les messages.');
  }

  const senderGmail = connectedGmailEmail || LINKED_GMAIL_ADDRESS;
  let forwardedCount = 0;

  for (const msg of messagesToForward) {
    const cleanSubject = `[Danthoss Pro] ${msg.subject}`;
    const bodyLines = [
      `Nouveau message reçu sur votre boîte professionnelle ${msg.toEmail || LINKED_CORPORATE_ADDRESS}`,
      `Pont direct : ${LINKED_CORPORATE_ADDRESS} → ${LINKED_GMAIL_ADDRESS}`,
      `------------------------------------------------------------`,
      `Expéditeur : ${msg.fromName} <${msg.fromEmail}>`,
      `Destinataire plateforme : ${msg.toEmail}`,
      `Date : ${new Date(msg.createdAt).toLocaleString('fr-FR')}`,
      `Catégorie : ${msg.category.toUpperCase()}`,
      `------------------------------------------------------------`,
      ``,
      msg.body,
      ``,
      `--`,
      `Astuce : Cliquez directement sur « Répondre » dans Gmail pour répondre à ${msg.fromName} (${msg.fromEmail}).`
    ].join('\r\n');

    const mimeLines = [
      `From: ${formatMimeAddress(`Messagerie Pro (${LINKED_CORPORATE_ADDRESS})`, senderGmail)}`,
      `To: ${LINKED_GMAIL_ADDRESS}`,
      `Reply-To: ${formatMimeAddress(msg.fromName, msg.fromEmail)}`,
      `Subject: ${encodeMimeHeaderWord(cleanSubject)}`,
      `X-Danthoss-Bridge: platform-forward`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=UTF-8`,
      `Content-Transfer-Encoding: 8bit`,
      ``,
      bodyLines
    ].join('\r\n');

    const raw = encodeUtf8ToBase64Url(mimeLines);

    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw })
    });

    if (sendRes.status === 401) {
      handleUnauthorizedToken();
      throw new Error('Votre session Gmail a expiré. Veuillez reconnecter Gmail.');
    }

    if (!sendRes.ok) {
      const errJson = await sendRes.json().catch(() => ({}));
      throw new Error(
        errJson?.error?.message || 'Échec lors du transfert vers votre boîte Gmail.'
      );
    }

    const sendData = await sendRes.json();
    await updateCorporateEmailMetadata(
      msg,
      {
        gmailForwarded: true,
        gmailMessageId: sendData?.id ? String(sendData.id).slice(0, 128) : msg.gmailMessageId
      },
      true
    );
    forwardedCount++;
  }

  lastSyncTimestamp = new Date().toISOString();
  emitBridgeState();

  return { forwardedCount };
}

// =========================================================
// 3. OUTBOUND GMAIL DELIVERY TO EXTERNAL CLIENTS (Requires user confirmation in UI)
// =========================================================

export interface ExternalGmailSendParams {
  fromDisplayName: string;
  fromCorporateAlias: string;
  toEmail: string;
  toName?: string;
  ccEmail?: string;
  subject: string;
  body: string;
  inReplyToMessageId?: string;
  gmailThreadId?: string;
}

/**
 * Sends a real external email via Gmail API so external clients (Gmail, Outlook, Yahoo, Corporate)
 * receive messages sent from contact@danthoss-cabinet.com in their real inbox.
 * Must ONLY be called after explicit user confirmation in UI.
 */
export async function sendExternalEmailViaGmail(
  params: ExternalGmailSendParams
): Promise<{ gmailId: string; threadId?: string }> {
  if (!cachedAccessToken) {
    handleUnauthorizedToken();
    throw new Error('Veuillez connecter Gmail pour expédier cet e-mail vers une boîte externe.');
  }

  const authenticatedGmail = connectedGmailEmail || LINKED_GMAIL_ADDRESS;
  const senderLabel = `${params.fromDisplayName} (${params.fromCorporateAlias})`;

  const footerSignature = params.body.includes(LINKED_CORPORATE_ADDRESS)
    ? params.body
    : `${params.body}\r\n\r\n--\r\nCabinet d'Expertise Rabiou Saley • ${params.fromCorporateAlias}`;

  const headers: string[] = [
    `From: ${formatMimeAddress(senderLabel, authenticatedGmail)}`,
    `To: ${params.toName ? formatMimeAddress(params.toName, params.toEmail) : params.toEmail.trim()}`,
    ...(params.ccEmail?.trim() ? [`Cc: ${params.ccEmail.trim()}`] : []),
    `Reply-To: ${formatMimeAddress('Cabinet Rabiou Saley', authenticatedGmail)}`,
    `Subject: ${encodeMimeHeaderWord(params.subject.trim())}`,
    ...(params.inReplyToMessageId
      ? [
          `In-Reply-To: ${params.inReplyToMessageId}`,
          `References: ${params.inReplyToMessageId}`
        ]
      : []),
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    footerSignature.replace(/\r?\n/g, '\r\n')
  ];

  const payloadBody: Record<string, any> = {
    raw: encodeUtf8ToBase64Url(headers.join('\r\n'))
  };

  if (params.gmailThreadId) {
    payloadBody.threadId = params.gmailThreadId;
  }

  const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payloadBody)
  });

  if (sendRes.status === 401) {
    handleUnauthorizedToken();
    throw new Error('Votre session Gmail a expiré. Veuillez reconnecter Gmail.');
  }

  if (!sendRes.ok) {
    const errJson = await sendRes.json().catch(() => ({}));
    throw new Error(errJson?.error?.message || 'Échec de l\'envoi externe via l\'API Gmail.');
  }

  const data = await sendRes.json();
  return {
    gmailId: String(data?.id || ''),
    threadId: data?.threadId ? String(data.threadId) : undefined
  };
}
