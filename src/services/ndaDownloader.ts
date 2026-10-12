import { CABINET_INFO } from '../data/cabinetData';

export interface NDAPartyInfo {
  clientName: string;
  clientEmail: string;
}

export function generateNDADocumentHTML(info?: Partial<NDAPartyInfo>): string {
  const clientName = info?.clientName?.trim() || 'Client du Cabinet Rabiou Saley';
  const clientEmail = info?.clientEmail?.trim() || 'contact.client@partenaire-danthoss.com';
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const refId = `NDA-DANTHOSS-${Date.now().toString().slice(-8)}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Accord de Non-Divulgation & Confidentialité (NDA) - Cabinet Rabiou Saley</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      color: #111827;
      line-height: 1.6;
      background: #ffffff;
      margin: 0;
      padding: 30px;
      max-width: 820px;
      margin-left: auto;
      margin-right: auto;
      box-sizing: border-box;
    }
    .print-bar {
      background: #064e3b;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .print-btn {
      background: #10b981;
      color: #064e3b;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 800;
      cursor: pointer;
      font-size: 13px;
    }
    h1 {
      text-align: center;
      text-transform: uppercase;
      font-size: 17pt;
      color: #064e3b;
      margin-bottom: 6px;
      border-bottom: 2.5px solid #064e3b;
      padding-bottom: 12px;
      letter-spacing: 0.5px;
    }
    .header-info {
      text-align: center;
      font-size: 9.5pt;
      color: #4b5563;
      margin-bottom: 30px;
    }
    .parties {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      font-size: 10.5pt;
    }
    .article {
      margin-bottom: 22px;
      font-size: 10.5pt;
      text-align: justify;
    }
    .article-title {
      font-weight: bold;
      color: #064e3b;
      text-transform: uppercase;
      font-size: 10.5pt;
      margin-bottom: 6px;
      border-left: 3px solid #10b981;
      padding-left: 8px;
    }
    ul {
      margin-top: 6px;
      padding-left: 24px;
    }
    li {
      margin-bottom: 4px;
    }
    .signatures {
      margin-top: 45px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .sig-box {
      width: 46%;
      border-top: 1.5px solid #064e3b;
      padding-top: 10px;
      font-size: 10pt;
    }
    .seal {
      margin-top: 25px;
      border: 1px dashed #059669;
      background: #ecfdf5;
      padding: 12px;
      font-size: 9pt;
      color: #065f46;
      text-align: center;
      border-radius: 6px;
      page-break-inside: avoid;
    }
    @media print {
      body {
        padding: 0;
        margin: 0;
      }
      .print-bar {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <div>
      <strong>Cabinet Rabiou Saley • Accord Officiel NDA</strong>
      <div style="font-size: 11px; opacity: 0.9;">Document certifié conforme pour signature & enregistrement</div>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Imprimer / Sauvegarder en PDF</button>
  </div>

  <h1>Accord de Non-Divulgation & de Confidentialité (NDA)</h1>
  <div class="header-info">
    Cabinet d'Expertise Rabiou Saley • Réf : ${refId} • Date d'effet : ${currentDate}
  </div>

  <div class="parties">
    <p><strong>ENTRE LES SOUSSIGNÉS :</strong></p>
    <p>
      <strong>1. Le Cabinet d'Expertise Rabiou Saley</strong>, représenté par <strong>Rabiou Saley Abdoul Majid</strong>, Consultant Expert en Data Science, Systèmes Multi-Agents IA et Ingénierie Cloud, joignable à <em>${CABINET_INFO.email}</em> / <em>${CABINET_INFO.phone}</em>, ci-après dénommé le « <strong>Prestataire</strong> », d'une part,
    </p>
    <p><strong>ET :</strong></p>
    <p>
      <strong>2. ${clientName}</strong>, joignable à l'adresse <em>${clientEmail}</em>, ci-après dénommé le « <strong>Client</strong> », d'autre part.
    </p>
  </div>

  <div class="article">
    <div class="article-title">Préambule</div>
    <p>
      Dans le cadre de collaborations techniques, audits d'architecture, élaboration de modèles de Machine Learning, pipelines de données, agents IA ou conseil en télétravail international qualifié, les Parties seront amenées à échanger des données commerciales, algorithmiques, stratégiques et organisationnelles hautement confidentielles.
    </p>
  </div>

  <div class="article">
    <div class="article-title">Article 1 - Définition des Informations Confidentielles</div>
    <p>
      Sont considérées comme « Informations Confidentielles » l'ensemble des données numériques, codes sources, architectures, jeux de données bruts ou annotés, identifiants d'API, clés de chiffrement, documents financiers, devis et correspondances échangés entre les Parties.
    </p>
  </div>

  <div class="article">
    <div class="article-title">Article 2 - Engagements Stricts de Confidentialité</div>
    <p>
      Le Prestataire et le Client s'engagent réciproquement à :
    </p>
    <ul>
      <li>Garder les Informations Confidentielles sous le secret le plus strict et ne les divulguer à aucun tiers sans accord écrit exprès.</li>
      <li>Ne faire usage desdites informations qu'aux strictes fins de la mission convenue.</li>
      <li>Travailler dans des conteneurs isolés et éphémères, avec gestion sécurisée des secrets.</li>
    </ul>
  </div>

  <div class="article">
    <div class="article-title">Article 3 - Sécurité Technique & Chiffrement</div>
    <p>
      Conformément aux normes du Cabinet Rabiou Saley, l'ensemble des fichiers déposés dans le Coffre-fort Client Danthoss et les flux de transmission sont chiffrés sous protocole AES-256 et TLS 1.3. Aucune donnée client n'est réutilisée pour entraîner des modèles publics d'intelligence artificielle.
    </p>
  </div>

  <div class="article">
    <div class="article-title">Article 4 - Propriété Intellectuelle Exclusive</div>
    <p>
      La communication des Informations Confidentielles ne confère aucun droit de propriété intellectuelle. L'intégralité du code produit, des modèles entraînés et des livrables devient la propriété exclusive du Client dès paiement complet de la prestation convenue.
    </p>
  </div>

  <div class="article">
    <div class="article-title">Article 5 - Durée de l'Accord</div>
    <p>
      Le présent accord produit ses effets à compter de sa signature pour une durée de <strong>cinq (5) ans</strong> après le terme de la mission.
    </p>
  </div>

  <div class="article">
    <div class="article-title">Article 6 - Règlement des Différends & Droit Applicable</div>
    <p>
      Le présent accord est régi par les usages et règles de bonne foi du commerce international. Tout différend relatif à sa validité ou son exécution sera soumis en priorité à une conciliation amiable directe.
    </p>
  </div>

  <div class="signatures">
    <div class="sig-box">
      <strong>Pour le Cabinet Rabiou Saley</strong><br>
      Rabiou Saley Abdoul Majid<br>
      Consultant Expert Data Science & Agents IA<br>
      <em>Signé électroniquement ✓</em>
      <div style="margin-top: 15px; font-family: cursive; font-size: 14pt; color: #064e3b;">
        Rabiou Saley A. M.
      </div>
    </div>

    <div class="sig-box">
      <strong>Pour le Client</strong><br>
      ${clientName}<br>
      ${clientEmail}<br>
      <em>Lu et approuvé - Bon pour accord</em>
      <div style="margin-top: 15px; font-style: italic; color: #374151;">
        [Signature du Client / Représentant]
      </div>
    </div>
  </div>

  <div class="seal">
    <strong>CERTIFICATION NUMÉRIQUE CABINET RABIOU SALEY</strong><br>
    Identifiant d'authentification : SEC-${refId}<br>
    Contact direct WhatsApp : ${CABINET_INFO.phone} • Email : ${CABINET_INFO.email}
  </div>
</body>
</html>`;
}

export function generateNDAPlainText(info?: Partial<NDAPartyInfo>): string {
  const clientName = info?.clientName?.trim() || 'Client du Cabinet Rabiou Saley';
  const clientEmail = info?.clientEmail?.trim() || 'contact.client@partenaire-danthoss.com';
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const refId = `NDA-DANTHOSS-${Date.now().toString().slice(-8)}`;

  return `========================================================================
ACCORD DE NON-DIVULGATION ET DE CONFIDENTIALITÉ (NDA)
Cabinet d'Expertise Rabiou Saley • Plateforme Danthoss
========================================================================
Date d'effet : ${currentDate}
Réf d'enregistrement : ${refId}

ENTRE LES PARTIES :
1. LE CABINET D'EXPERTISE RABIOU SALEY
   Représenté par Rabiou Saley Abdoul Majid
   Consultant Expert Data Science, Systèmes Multi-Agents IA & Télétravail International
   Email : ${CABINET_INFO.email}
   WhatsApp Direct : ${CABINET_INFO.phone}
   (Ci-après désigné « Le Prestataire »)

ET :
2. LE CLIENT
   Nom / Raison Sociale : ${clientName}
   Email : ${clientEmail}
   (Ci-après désigné « Le Client »)

------------------------------------------------------------------------
PRÉAMBULE
Dans le cadre de collaborations techniques ou missions en télétravail international
(Machine Learning, pipelines de données, agents IA, conseil stratégique), les Parties
échangent des informations hautement sensibles soumises au secret professionnel.

ARTICLE 1 - DÉFINITION DES INFORMATIONS CONFIDENTIELLES
Sont réputées strictement confidentielles l'ensemble des données, architectures,
codes sources, modèles, clés API, documents commerciaux et correspondances.

ARTICLE 2 - ENGAGEMENTS DE NON-DIVULGATION
- Préservation absolue du secret et non-divulgation à des tiers.
- Usage exclusif pour les besoins de la mission.
- Environnements de travail étanches et conteneurs éphémères.

ARTICLE 3 - SÉCURITÉ TECHNIQUE & CHIFFREMENT
Chiffrement de bout en bout AES-256 et TLS 1.3. Aucune donnée client n'est
utilisée pour l'entraînement de modèles d'IA publics.

ARTICLE 4 - PROPRIÉTÉ INTELLECTUELLE
La propriété intégrale de tous les codes, modèles et livrables créés revient
exclusivement au Client dès paiement complet de la prestation.

ARTICLE 5 - DURÉE DE L'ACCORD
Cinq (5) années à compter de la date d'effet du présent accord.

ARTICLE 6 - RÈGLEMENT AMIABLE
Tout différend sera soumis en priorité à une procédure de conciliation amiable.

SIGNATURES :
Pour le Cabinet Rabiou Saley : [Signé numériquement par Rabiou Saley]
Pour le Client : ${clientName} [Lu et approuvé]
========================================================================
Contact : WhatsApp ${CABINET_INFO.phone} • Email ${CABINET_INFO.email}
`;
}

/**
 * Universal, rock-solid downloader and sharer for the NDA contract on all devices (iOS, Android, PC)
 */
export async function shareNDAContract(
  info?: Partial<NDAPartyInfo>
): Promise<{ success: boolean; message: string }> {
  try {
    if (typeof window === 'undefined') {
      return { success: false, message: 'Environnement non supporté.' };
    }

    const htmlContent = generateNDADocumentHTML(info);
    const filename = 'Accord_de_Confidentialite_NDA_Cabinet_Rabiou_Saley.html';

    // 1. Try native Web Share API with File (iOS Safari & Android Chrome)
    if (typeof navigator !== 'undefined' && 'canShare' in navigator && 'share' in navigator) {
      try {
        const file = new File([htmlContent], filename, { type: 'text/html;charset=utf-8' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Accord NDA - Cabinet Rabiou Saley',
            text: 'Accord officiel de non-divulgation et confidentialité du Cabinet Rabiou Saley'
          });
          return { success: true, message: 'Document partagé avec succès !' };
        }
      } catch (shareErr: any) {
        if (shareErr.name === 'AbortError') {
          return { success: true, message: 'Partage annulé.' };
        }
        console.warn('Share file fallback:', shareErr);
      }
    }

    // 2. Fallback to print / PDF open
    return downloadNDAContract(info, 'print');
  } catch (err) {
    console.error('Erreur partage NDA:', err);
    return downloadNDAContract(info, 'html');
  }
}

export function downloadNDAContract(
  info?: Partial<NDAPartyInfo>,
  format: 'html' | 'txt' | 'print' = 'html'
): { success: boolean; message: string } {
  try {
    if (typeof window === 'undefined') {
      return { success: false, message: 'Environnement non supporté.' };
    }

    const htmlContent = generateNDADocumentHTML(info);
    const textContent = generateNDAPlainText(info);

    if (format === 'print') {
      // Create a printable tab or hidden iframe for seamless printing/saving as PDF
      try {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          setTimeout(() => {
            try {
              printWindow.focus();
              printWindow.print();
            } catch (e) {
              console.warn('Impression auto', e);
            }
          }, 600);
          return {
            success: true,
            message: 'Fenêtre d\'impression PDF ouverte ! Vous pouvez enregistrer en PDF ou imprimer.'
          };
        }
      } catch (err) {
        console.warn('Popup bloquée pour impression, essai en iframe:', err);
      }

      // Iframe fallback for print if window.open was blocked
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);
      const frameDoc = printIframe.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(htmlContent);
        frameDoc.close();
        setTimeout(() => {
          try {
            printIframe.contentWindow?.focus();
            printIframe.contentWindow?.print();
          } catch (e) {
            console.warn('Iframe print error', e);
          }
          setTimeout(() => {
            document.body.removeChild(printIframe);
          }, 30000);
        }, 600);
        return {
          success: true,
          message: 'Boîte de dialogue d\'impression / Enregistrement PDF prête !'
        };
      }
    }

    // Determine payload and filename
    const isHtml = format === 'html';
    const mimeType = isHtml ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8';
    const content = isHtml ? htmlContent : textContent;
    const filename = isHtml
      ? 'Accord_de_Confidentialite_NDA_Cabinet_Rabiou_Saley.html'
      : 'Accord_de_Confidentialite_NDA_Cabinet_Rabiou_Saley.txt';

    // Create Blob
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const isIOSDevice = /iphone|ipad|ipod/i.test(navigator.userAgent);

    // On iOS Safari, downloading an HTML blob via <a download> is notoriously ignored or blocked.
    // If it's iOS, open the blob URL in a new window or tab where iOS Safari allows "Partager -> Enregistrer dans Fichiers"
    if (isIOSDevice && isHtml) {
      const opened = window.open(url, '_blank');
      if (opened) {
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        return {
          success: true,
          message: 'Contrat NDA ouvert dans un nouvel onglet ! Touchez Partager puis "Enregistrer dans Fichiers" ou "Imprimer".'
        };
      }
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();

    // Do NOT synchronously revokeObjectURL (which causes failures on mobile browsers)
    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch {
        // Ignore if already removed
      }
      URL.revokeObjectURL(url);
    }, 60000);

    return {
      success: true,
      message: `Accord NDA téléchargé avec succès (${isHtml ? 'Format officiel .html / PDF' : 'Format texte .txt'}) !`
    };
  } catch (err) {
    console.error('Erreur lors du téléchargement du contrat NDA:', err);
    return {
      success: false,
      message: 'Erreur lors du téléchargement. Veuillez réessayer ou utiliser l\'option imprimer en PDF.'
    };
  }
}
