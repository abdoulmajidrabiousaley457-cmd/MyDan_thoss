import React, { useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { SubscriptionTier } from '../types';
import { 
  Check, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Smartphone, 
  X, 
  Award, 
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';

export const SubscriptionScreen: React.FC = () => {
  const { profile, upgradeSubscription } = useUserProfile();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [selectedTierToBuy, setSelectedTierToBuy] = useState<SubscriptionTier>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

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
        { text: 'Simulateur d\'entretien technique avec Majid IA', included: true },
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

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradeSubscription(selectedTierToBuy);
      setIsProcessing(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        setShowCheckoutModal(false);
      }, 2000);
    }, 1500);
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
          Débloquez l'intégralité des outils de candidature professionnelle, l'audit ATS IA et bénéficiez de l'expertise directe du Cabinet Rabiou Saley.
        </p>

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
            onClick={() => alert('Votre attestation d\'abonnement pro a été envoyée à votre adresse email.')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Télécharger attestation
          </button>
        </div>
      </div>

      {/* Checkout Modal Simulation */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Félicitations !</h3>
                <p className="text-xs text-slate-600">
                  Votre souscription au <strong>{selectedTierToBuy === 'vip_cabinet' ? 'Plan Cabinet VIP' : 'Plan Pro'}</strong> a été activée avec succès. Vos outils et modèles sont débloqués.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Activation Sécurisée</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    Souscrire au {selectedTierToBuy === 'vip_cabinet' ? 'Plan Cabinet VIP' : 'Plan Pro Carrière'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Règlement immédiat par Mobile Money ou Carte Bancaire.
                  </p>
                </div>

                {/* Payment method selector */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'mobile_money'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                    <span>Mobile Money (Niger / UEMOA)</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span>Carte Visa / Mastercard</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Forfait sélectionné :</span>
                    <span className="font-bold text-slate-900">{selectedTierToBuy === 'vip_cabinet' ? 'Cabinet VIP' : 'Plan Pro'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Montant total :</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {selectedTierToBuy === 'vip_cabinet' ? '39 000 FCFA (59 €)' : '9 900 FCFA (15 €)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t">
                    Paiement chiffré et sécurisé SSL 256 bits. Annulable à tout moment.
                  </div>
                </div>

                <button
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs md:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {isProcessing ? (
                    <span>Validation du paiement en cours...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Confirmer et Activer l'Abonnement</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
