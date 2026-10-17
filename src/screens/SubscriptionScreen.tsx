import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { SubscriptionTier } from '../types';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Smartphone, 
  X, 
  Calendar,
  Lock,
  ArrowRight,
  ExternalLink,
  Download,
  Building,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { CABINET_INFO } from '../data/cabinetData';

type PaymentMethodOption = 'mobile_money' | 'card' | 'transfer';

export const SubscriptionScreen: React.FC = () => {
  const { profile, upgradeSubscription } = useUserProfile();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [selectedTierToBuy, setSelectedTierToBuy] = useState<SubscriptionTier>('pro');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption>('mobile_money');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [attestationSuccess, setAttestationSuccess] = useState<string | null>(null);

  const plans = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Plan Découverte',
      badge: 'Accès Libre',
      monthlyPrice: '0 FCFA',
      annualPrice: '0 FCFA',
      eurPrice: '0 €',
      period: 'À vie',
      description: 'Idéal pour explorer les réalisations du cabinet et concevoir un premier CV simple.',
      features: [
        { text: '1 modèle de CV standard', included: true },
        { text: 'Consultation du portfolio & projets IA', included: true },
        { text: 'Simulateur de devis télétravail', included: true },
        { text: 'Export PDF avec filigrane', included: true },
        { text: 'Score ATS basique', included: false },
        { text: 'Modèles de lettres de motivation pro', included: false },
        { text: 'Audit personnalisé par Rabiou Saley', included: false },
        { text: 'Sessions de coaching visio télétravail', included: false }
      ],
      buttonText: profile.tier === 'free' ? 'Plan Actuel' : 'Basculer en Gratuit',
      highlighted: false
    },
    {
      id: 'pro' as SubscriptionTier,
      name: 'Plan Pro Carrière & Télétravail',
      badge: 'Le Plus Populaire ⭐',
      monthlyPrice: '9 900 FCFA',
      annualPrice: '7 900 FCFA',
      eurPrice: billingPeriod === 'monthly' ? '15 € / mois' : '12 € / mois',
      period: '/ mois',
      description: 'Pour les professionnels voulant décrocher des postes et missions en télétravail international.',
      features: [
        { text: 'Tous les 4 modèles de CV professionnels certifiés', included: true },
        { text: 'Générateur de lettre de motivation pro illimité', included: true },
        { text: 'Exports PDF illimités sans filigrane', included: true },
        { text: 'Audit ATS complet avec checklist recruteurs', included: true },
        { text: 'Bibliothèque de pitchs IA et Data Science', included: true },
        { text: 'Simulateur d\'entretien technique avec Gemini AI', included: true },
        { text: 'Audit personnalisé par Rabiou Saley', included: false },
        { text: 'Sessions de coaching visio télétravail', included: false }
      ],
      buttonText: profile.tier === 'pro' ? 'Votre Plan Actuel' : 'Souscrire au Plan Pro',
      highlighted: true
    },
    {
      id: 'vip_cabinet' as SubscriptionTier,
      name: 'Plan Cabinet VIP & Mentorat',
      badge: 'Accompagnement Élite 👑',
      monthlyPrice: '39 000 FCFA',
      annualPrice: '31 200 FCFA',
      eurPrice: billingPeriod === 'monthly' ? '59 € / mois' : '47 € / mois',
      period: '/ mois',
      description: 'L\'accompagnement direct du Cabinet Rabiou Saley pour propulser votre carrière ou cabinet IA.',
      features: [
        { text: 'Tout le contenu du Plan Pro en illimité', included: true },
        { text: 'Revue personnalisée de votre CV & LinkedIn par Rabiou Saley', included: true },
        { text: '2 sessions de mentorat vidéo (45 min) par mois', included: true },
        { text: 'Stratégie de prospection pour missions en télétravail', included: true },
        { text: 'Accès prioritaire aux missions de sous-traitance du cabinet', included: true },
        { text: 'Assistance technique & code review par WhatsApp', included: true },
        { text: 'Certificat officiel d\'évaluation de compétences', included: true },
        { text: 'Garantie satisfaction ou remboursement', included: true }
      ],
      buttonText: profile.tier === 'vip_cabinet' ? 'Votre Plan Actuel' : 'Rejoindre le Cercle VIP',
      highlighted: false
    }
  ];

  const handleOpenCheckout = (tier: SubscriptionTier) => {
    if (tier === profile.tier) return;
    setSelectedTierToBuy(tier);
    setCheckoutSuccess(false);
    setShowCheckoutModal(true);
  };

  const getTierDetails = (tier: SubscriptionTier) => {
    if (tier === 'vip_cabinet') {
      return {
        name: 'Plan Cabinet VIP & Mentorat 👑',
        price: billingPeriod === 'monthly' ? '39 000 FCFA (59 €)' : '31 200 FCFA (47 €)',
        rawPrice: billingPeriod === 'monthly' ? '39 000 FCFA / mois' : '31 200 FCFA / mois (facturé annuellement)'
      };
    }
    return {
      name: 'Plan Pro Carrière & Télétravail ⭐',
      price: billingPeriod === 'monthly' ? '9 900 FCFA (15 €)' : '7 900 FCFA (12 €)',
      rawPrice: billingPeriod === 'monthly' ? '9 900 FCFA / mois' : '7 900 FCFA / mois (facturé annuellement)'
    };
  };

  const getPaymentMethodLabel = (method: PaymentMethodOption = paymentMethod) => {
    switch (method) {
      case 'mobile_money':
        return 'Mobile Money (Airtel Money / Moov Money / Orange Money)';
      case 'card':
        return 'Carte Bancaire (Visa / Mastercard)';
      case 'transfer':
        return 'Virement Bancaire International (EUR / USD / XOF)';
      default:
        return 'Mobile Money';
    }
  };

  const buildWhatsAppUrl = (methodOverride?: PaymentMethodOption) => {
    const details = getTierDetails(selectedTierToBuy);
    const subRef = `SUB-${Date.now().toString().slice(-6)}`;
    const clientName = profile.name || 'Client Danthoss';
    const clientEmail = profile.email || 'Email non renseigné';
    const chosenMethod = methodOverride || paymentMethod;

    const message = `Bonjour Cabinet Rabiou Saley ! 👋

Je souhaite souscrire et finaliser mon abonnement Danthoss :

📋 Forfait : ${details.name}
💳 Montant : ${details.price}
🔄 Cycle de facturation : ${billingPeriod === 'monthly' ? 'Mensuel' : 'Annuel (-20%)'}
📱 Moyen de paiement choisi : ${getPaymentMethodLabel(chosenMethod)}
👤 Nom du client : ${clientName}
📧 Email : ${clientEmail}
🆔 Référence : ${subRef}

Merci de m'indiquer les coordonnées de paiement pour valider et achever mon abonnement immédiatement.`;

    return `https://wa.me/22796499906?text=${encodeURIComponent(message)}`;
  };

  const handleFinalizeOnWhatsApp = (methodOverride?: PaymentMethodOption) => {
    const chosenMethod = methodOverride || paymentMethod;
    if (methodOverride) {
      setPaymentMethod(methodOverride);
    }
    setIsProcessing(true);
    const whatsappUrl = buildWhatsAppUrl(chosenMethod);

    // 1. Upgrade subscription tier in the local user profile
    upgradeSubscription(selectedTierToBuy);

    // 2. Open WhatsApp directly - try native open, fallback to location href
    try {
      const opened = window.open(whatsappUrl, '_blank');
      if (!opened) {
        window.location.href = whatsappUrl;
      }
    } catch {
      window.location.href = whatsappUrl;
    }

    // 3. Update modal UI to show success
    setIsProcessing(false);
    setCheckoutSuccess(true);
  };

  const handleDownloadAttestation = () => {
    const today = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const tierLabel = profile.tier === 'vip_cabinet' 
      ? 'Membre Cabinet VIP & Mentorat' 
      : profile.tier === 'pro' 
      ? 'Abonné Plan Pro Carrière & Télétravail' 
      : 'Utilisateur Plan Découverte';

    const attestationHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Attestation d'Abonnement - Danthoss Cabinet Rabiou Saley</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; line-height: 1.6; }
    .header { border-bottom: 3px solid #059669; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { color: #064e3b; font-size: 24px; font-weight: bold; margin: 0; }
    .subtitle { color: #059669; font-size: 14px; margin-top: 4px; }
    .badge { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 13px; }
    .content { margin: 40px 0; }
    .client-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 25px 0; }
    .footer { margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
    .seal { border: 2px dashed #059669; padding: 15px; border-radius: 10px; display: inline-block; text-align: center; color: #065f46; font-weight: bold; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">Cabinet d'Expertise Rabiou Saley</h1>
      <div class="subtitle">Ingénierie Data Science, Agents IA & Télétravail International • Plateforme Danthoss</div>
    </div>
    <div class="badge">ATTESTATION OFFICIELLE</div>
  </div>

  <div class="content">
    <p>Nous soussignés, <strong>Cabinet Rabiou Saley</strong> (Niamey / International Remote), certifions par la présente que :</p>
    
    <div class="client-card">
      <p style="margin: 0 0 8px 0;"><strong>Nom du Titulaire :</strong> ${profile.name || 'Membre Professionnel'}</p>
      <p style="margin: 0 0 8px 0;"><strong>Identifiant / Email :</strong> ${profile.email || 'Email vérifié'}</p>
      <p style="margin: 0 0 8px 0;"><strong>Formule souscrite :</strong> ${tierLabel}</p>
      <p style="margin: 0;"><strong>Statut du Compte :</strong> Actif & Opérationnel</p>
    </div>

    <p>Le titulaire bénéficie d'un accès vérifié aux outils professionnels du cabinet, notamment :</p>
    <ul>
      <li>Studio de conception et optimisation de CV ATS pour le télétravail international</li>
      <li>Générateur de lettres de motivation personnalisées et modèles haute fidélité</li>
      <li>Coffre-fort sécurisé de fichiers et livrables techniques (Client Vault)</li>
      <li>Accompagnement et support direct du Cabinet Rabiou Saley</li>
    </ul>

    <p>Fait à Niamey, le <strong>${today}</strong> pour servir et valoir ce que de droit.</p>

    <div class="seal">
      CACHE ET SIGNATURE NUMÉRIQUE DU CABINET<br>
      Cabinet Rabiou Saley • Réf: ATTEST-${Date.now().toString().slice(-8)}<br>
      WhatsApp: +227 96 49 99 06 • Email: abdoulmajidrabiousaley457@gmail.com
    </div>
  </div>

  <div class="footer">
    <div>Plateforme Officielle Danthoss - Cabinet Rabiou Saley</div>
    <div>Document généré électroniquement avec valeur probante</div>
  </div>
</body>
</html>`;

    const blob = new Blob([attestationHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Attestation_Abonnement_Danthoss_${(profile.name || 'Client').replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setAttestationSuccess("Votre attestation d'abonnement officielle a été téléchargée avec succès !");
    setTimeout(() => setAttestationSuccess(null), 4500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Abonnements & Accès Outils Pro
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Investissez dans votre Carrière & vos Missions Télétravail
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          Débloquez l'intégralité des outils de candidature professionnelle, l'audit ATS IA et finalisez votre souscription en contact direct sur WhatsApp avec Rabiou Saley.
        </p>

        {/* Attestation success feedback */}
        {attestationSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{attestationSuccess}</span>
          </div>
        )}

        {/* Billing period toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 mt-4">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              billingPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Facturation Mensuelle
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              billingPeriod === 'annual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Facturation Annuelle
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500 text-white font-bold">-20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = profile.tier === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 md:p-8 transition-all flex flex-col justify-between relative ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-2xl border-2 border-emerald-500 lg:-translate-y-2'
                  : 'bg-white text-slate-900 shadow-sm border border-slate-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className={`font-bold text-lg ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h3>
                    {!plan.highlighted && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-2 ${plan.highlighted ? 'text-slate-300' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price block */}
                <div className="border-y py-4 space-y-1" style={{ borderColor: plan.highlighted ? '#334155' : '#E2E8F0' }}>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-black">
                      {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                    </span>
                    <span className={`text-xs ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <div className={`text-xs font-medium ${plan.highlighted ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    Soit environ {plan.eurPrice}
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-3">
                  <div className={`text-xs font-bold uppercase tracking-wider ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                    Inclus dans ce forfait :
                  </div>
                  <ul className="space-y-2.5 text-xs">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        {feat.included ? (
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <span className={feat.included ? (plan.highlighted ? 'text-slate-200' : 'text-slate-700') : 'text-slate-400 line-through'}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action button */}
              <div className="pt-8">
                <button
                  disabled={isCurrent}
                  onClick={() => handleOpenCheckout(plan.id)}
                  className={`w-full py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-200 text-slate-600 cursor-default'
                      : plan.highlighted
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrent && <ShieldCheck className="w-4 h-4" />}
                  <span>{plan.buttonText}</span>
                  {!isCurrent && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Current Subscription Management Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">État de votre souscription</div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">
              Statut : {profile.tier === 'vip_cabinet' ? 'Membre Cabinet VIP & Mentorat 👑' : profile.tier === 'pro' ? 'Abonné Plan Pro Carrière ⭐' : 'Utilisateur Découverte Gratuit'}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Compte actif : {profile.email} • Accès complet aux outils carrière et portfolio télétravail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenCheckout(profile.tier === 'vip_cabinet' ? 'pro' : 'vip_cabinet')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Changer de forfait
          </button>
          <button
            onClick={handleDownloadAttestation}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger l'attestation</span>
          </button>
        </div>
      </div>

      {/* Checkout Modal with Direct WhatsApp Finalization */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Demande transmise avec succès !</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                    Votre lien WhatsApp s'est ouvert pour achever votre règlement avec <strong>Rabiou Saley</strong>. Vos outils et modèles <strong>{selectedTierToBuy === 'vip_cabinet' ? 'Cabinet VIP' : 'Plan Pro'}</strong> sont activés.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Réouvrir WhatsApp (+227 96 49 99 06)</span>
                  </a>
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                  >
                    Retourner à la plateforme
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Règlement & Activation
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">Lien WhatsApp Direct</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    Souscrire au {selectedTierToBuy === 'vip_cabinet' ? 'Plan Cabinet VIP' : 'Plan Pro Carrière'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Choisissez votre moyen de paiement ci-dessous puis cliquez sur le bouton pour achever directement votre abonnement sur WhatsApp.
                  </p>
                </div>

                {/* Payment method selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Sélectionnez votre moyen de paiement :
                    </label>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Redirection WhatsApp instantanée
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Mobile Money */}
                    <a
                      href={buildWhatsAppUrl('mobile_money')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        handleFinalizeOnWhatsApp('mobile_money');
                      }}
                      className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-between text-center gap-2.5 transition-all cursor-pointer no-underline group transform hover:scale-[1.02] active:scale-[0.98] ${
                        paymentMethod === 'mobile_money'
                          ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-500/30 shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1.5 w-full">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-emerald-700" />
                        </div>
                        <span className="font-extrabold text-sm text-slate-900 leading-tight">Mobile Money</span>
                        <span className="text-[11px] font-normal text-slate-500">Airtel • Moov • Orange</span>
                      </div>
                      <div className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white text-[11px] font-black tracking-tight flex items-center justify-center gap-1.5 shadow-xs transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Payer via WhatsApp</span>
                      </div>
                    </a>

                    {/* Carte Bancaire */}
                    <a
                      href={buildWhatsAppUrl('card')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        handleFinalizeOnWhatsApp('card');
                      }}
                      className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-between text-center gap-2.5 transition-all cursor-pointer no-underline group transform hover:scale-[1.02] active:scale-[0.98] ${
                        paymentMethod === 'card'
                          ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-500/30 shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1.5 w-full">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-700" />
                        </div>
                        <span className="font-extrabold text-sm text-slate-900 leading-tight">Carte Bancaire</span>
                        <span className="text-[11px] font-normal text-slate-500">Visa • Mastercard • En Ligne</span>
                      </div>
                      <div className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white text-[11px] font-black tracking-tight flex items-center justify-center gap-1.5 shadow-xs transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Payer via WhatsApp</span>
                      </div>
                    </a>

                    {/* Virement Bancaire */}
                    <a
                      href={buildWhatsAppUrl('transfer')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        handleFinalizeOnWhatsApp('transfer');
                      }}
                      className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-between text-center gap-2.5 transition-all cursor-pointer no-underline group transform hover:scale-[1.02] active:scale-[0.98] ${
                        paymentMethod === 'transfer'
                          ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-500/30 shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1.5 w-full">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                          <Building className="w-5 h-5 text-purple-700" />
                        </div>
                        <span className="font-extrabold text-sm text-slate-900 leading-tight">Virement Pro</span>
                        <span className="text-[11px] font-normal text-slate-500">Facture & RIB (EUR, USD, XOF)</span>
                      </div>
                      <div className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white text-[11px] font-black tracking-tight flex items-center justify-center gap-1.5 shadow-xs transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Payer via WhatsApp</span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Payment method instruction callout */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mode sélectionné : {getPaymentMethodLabel()}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    {paymentMethod === 'mobile_money' && 'Transférez via Airtel Money, Moov Money ou Orange Money vers le numéro officiel +227 96 49 99 06, puis cliquez sur le bouton pour confirmer directement sur WhatsApp.'}
                    {paymentMethod === 'card' && 'Un lien de paiement sécurisé direct Visa / Mastercard vous sera généré par Rabiou Saley sur WhatsApp dès votre clic.'}
                    {paymentMethod === 'transfer' && 'Le RIB officiel du Cabinet Rabiou Saley vous sera transmis immédiatement sur WhatsApp avec facture proforma certifiée.'}
                  </p>
                </div>

                {/* Recap block */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Forfait sélectionné :</span>
                    <span className="font-bold text-slate-900">{getTierDetails(selectedTierToBuy).name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Cycle de facturation :</span>
                    <span className="font-semibold text-slate-800">{billingPeriod === 'monthly' ? 'Mensuel' : 'Annuel (-20%)'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                    <span>Montant total :</span>
                    <span className="font-black text-emerald-700 text-base">
                      {getTierDetails(selectedTierToBuy).price}
                    </span>
                  </div>
                </div>

                {/* Direct WhatsApp Action Button (Anchor tag for 100% native click reliability) */}
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleFinalizeOnWhatsApp()}
                  className="w-full py-4 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-950/30 flex items-center justify-center gap-2.5 cursor-pointer transition-all transform hover:scale-[1.01] active:scale-[0.99] text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Achever mon Abonnement sur WhatsApp (+227 96 49 99 06)</span>
                </a>

                <p className="text-[11px] text-slate-400 text-center">
                  En cliquant, vous serez directement redirigé vers WhatsApp avec le message pré-rempli pour activer votre abonnement en direct avec Rabiou Saley.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
