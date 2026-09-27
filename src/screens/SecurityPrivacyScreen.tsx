import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock, Check, FileText, Download } from 'lucide-react';

interface SecurityPrivacyScreenProps {
  onBack: () => void;
}

export const SecurityPrivacyScreen: React.FC<SecurityPrivacyScreenProps> = ({ onBack }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadNDA = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header with Back */}
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sécurité & Charte NDA Télétravail</h2>
          <p className="text-xs text-slate-500">Engagements de confidentialité et protection des données du Cabinet Rabiou Saley</p>
        </div>
      </div>

      {downloaded && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>Modèle officiel d'accord de confidentialité (NDA) prêt pour votre organisation.</span>
        </div>
      )}

      {/* NDA Commitment Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Accord de Non-Divulgation (NDA) Systématique</h3>
            <p className="text-xs text-slate-500">Protection absolue du secret d'affaires et de vos jeux de données</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Le Cabinet Rabiou Saley applique une politique rigoureuse de sécurité de l'information pour l'ensemble de ses interventions en télétravail international auprès des startups, PME et grandes institutions :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-xs text-slate-900">1. Chiffrement de bout en bout</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toutes les données en transit et au repos sont protégées par les standards AES-256 et TLS 1.3. Aucune donnée client n'est conservée sans accord formel.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-xs text-slate-900">2. Environnements cloisonnés</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Travail sous conteneurs Docker éphémères, accès VPN sécurisé et gestion des secrets via gestionnaires de clés (GCP Secret Manager / AWS Secrets).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-xs text-slate-900">3. Propriété intellectuelle exclusive</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              L'intégralité du code source, des modèles entraînés et de la documentation livrée devient la propriété exclusive de votre organisation dès le règlement final.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-xs text-slate-900">4. Conformité RGPD & Éthique</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anonymisation préalable des données personnelles et respect strict des directives de protection de la vie privée.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Besoin d'un accord préalable signé par le cabinet ?</span>
          <button
            onClick={handleDownloadNDA}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger le modèle NDA Cabinet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
