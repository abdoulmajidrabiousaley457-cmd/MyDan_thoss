import React, { useState } from 'react';
import { CABINET_INFO, CABINET_SERVICES } from '../data/cabinetData';
import { 
  Laptop, 
  Calculator, 
  Send, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Mail, 
  Phone, 
  MessageSquare, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const RemoteDevisScreen: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv_agents_ia');
  const [workFormat, setWorkFormat] = useState<'project' | 'full_time' | 'part_time'>('project');
  const [durationWeeks, setDurationWeeks] = useState<number>(4);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(35);
  const [complexity, setComplexity] = useState<'standard' | 'advanced' | 'enterprise'>('advanced');
  
  // Contact form state
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [ndaRequested, setNdaRequested] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Pricing calculation
  const hourlyBaseRates: Record<string, number> = {
    srv_agents_ia: 55,
    srv_ml_predictif: 50,
    srv_nlp_vision: 50,
    srv_mlops_remote: 60
  };

  const complexityMultipliers = {
    standard: 1.0,
    advanced: 1.25,
    enterprise: 1.5
  };

  const baseRate = hourlyBaseRates[selectedServiceId] || 50;
  const effectiveHourlyRateEUR = Math.round(baseRate * complexityMultipliers[complexity]);
  const effectiveHourlyRateXOF = Math.round(effectiveHourlyRateEUR * 655.957);

  let totalHours = durationWeeks * hoursPerWeek;
  if (workFormat === 'project') {
    totalHours = durationWeeks * 25; // standard project sprint volume
  }

  const estimatedTotalEUR = Math.round(totalHours * effectiveHourlyRateEUR);
  const estimatedTotalXOF = Math.round(estimatedTotalEUR * 655.957);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-xl border border-emerald-800/40 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Laptop className="w-3.5 h-3.5" />
          Télétravail International & Missions Cabinet
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Simulateur de Devis & Recrutement Télétravail
        </h1>
        <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
          Configurez votre projet Data Science ou Agent IA, obtenez une estimation budgétaire transparente en temps réel et transmettez votre cahier des charges au Cabinet Rabiou Saley.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Interactive Estimator */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b pb-3">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-base text-slate-900">1. Paramètres de votre mission en télétravail</h2>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Type de prestation souhaitée
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CABINET_SERVICES.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedServiceId === srv.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{srv.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{srv.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Work Format */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Format d'intervention à distance
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'project', label: 'Projet au Forfait', desc: 'Livrables définis et jalons validés' },
                  { id: 'full_time', label: 'Télétravail Temps Plein', desc: '35h-40h / semaine dédié à votre équipe' },
                  { id: 'part_time', label: 'Télétravail Temps Partiel', desc: '15h-20h / semaine en renfort agile' }
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setWorkFormat(fmt.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      workFormat === fmt.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs">{fmt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{fmt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Duration & Complexity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                  <span>Durée prévisionnelle</span>
                  <span className="text-emerald-700">{durationWeeks} semaines ({Math.round(durationWeeks / 4)} mois)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                  <span>Niveau de complexité technique</span>
                  <span className="text-emerald-700 uppercase text-[11px] font-extrabold">{complexity}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                  {(['standard', 'advanced', 'enterprise'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setComplexity(lvl)}
                      className={`py-1 text-[11px] font-bold rounded-md capitalize transition-colors cursor-pointer ${
                        complexity === lvl ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Brief Transmission Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Send className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-base text-slate-900">2. Transmettre votre besoin pour cadrage visio</h2>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Demande de cadrage reçue avec succès !</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Merci <strong>{clientName}</strong>. Le Cabinet Rabiou Saley étudie votre brief technique et vous recontactera sous 24h ouvrées pour fixer une visioconférence de cadrage.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Votre Nom & Prénom *</label>
                    <input
                      required
                      type="text"
                      placeholder="ex: Jean Dupont"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Entreprise / Organisation</label>
                    <input
                      type="text"
                      placeholder="ex: FinTech Solutions SAS"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email professionnel *</label>
                    <input
                      required
                      type="email"
                      placeholder="ex: contact@entreprise.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="ex: +33 6 12 34 56 78"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description sommaire de votre projet / données</label>
                  <textarea
                    rows={3}
                    placeholder="Précisez votre cas d'usage, vos sources de données et vos échéances clés..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ndaCheck"
                    checked={ndaRequested}
                    onChange={(e) => setNdaRequested(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="ndaCheck" className="text-xs text-slate-600 cursor-pointer">
                    Je souhaite la signature préalable d'un accord de confidentialité (NDA)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs md:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer ma demande de mission au cabinet</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Live Estimate Summary Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 space-y-6 sticky top-24">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Estimation Budgétaire</span>
              <h3 className="text-xl font-extrabold text-white mt-1">Synthèse Prévisionnelle</h3>
              <p className="text-xs text-slate-400 mt-1">
                Calculée selon les standards du marché du télétravail international qualifié.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="text-xs text-slate-400">Montant total estimé :</div>
              <div className="text-3xl font-black text-emerald-400">
                {estimatedTotalEUR.toLocaleString('fr-FR')} €
              </div>
              <div className="text-xs text-slate-300 font-semibold">
                Soit environ {estimatedTotalXOF.toLocaleString('fr-FR')} FCFA
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Taux horaire indicatif :</span>
                <span className="font-bold text-white">{effectiveHourlyRateEUR} €/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Volume horaire total :</span>
                <span className="font-bold text-white">~{totalHours} heures</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cadence de livraison :</span>
                <span className="font-bold text-emerald-400">Sprints hebdomadaires</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mode de travail :</span>
                <span className="font-bold text-white">100% Télétravail sécurisé</span>
              </div>
            </div>

            {/* Direct Instant Channels */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Canaux directs du Cabinet :
              </span>
              <a
                href="https://wa.me/22796499906?text=Bonjour%20Cabinet%20Rabiou%20Saley,%20je%20souhaite%20échanger%20sur%20une%20mission%20en%20télétravail"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discuter sur WhatsApp Pro</span>
              </a>
              <a
                href="mailto:abdoulmajidrabiousaley457@gmail.com?subject=Demande%20de%20mission%20télétravail%20-%20Data%20Science%20/%20IA"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Envoyer un email direct</span>
              </a>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Garantie de non-divulgation (NDA) systématique avant toute analyse de données.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
