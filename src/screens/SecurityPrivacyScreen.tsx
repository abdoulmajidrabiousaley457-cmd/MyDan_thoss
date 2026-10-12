import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Check, 
  FileText, 
  Download, 
  Eye, 
  X, 
  Printer, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Copy,
  Share2
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { CABINET_INFO } from '../data/cabinetData';
import { downloadNDAContract, generateNDAPlainText, shareNDAContract } from '../services/ndaDownloader';

interface SecurityPrivacyScreenProps {
  onBack: () => void;
}

export const SecurityPrivacyScreen: React.FC<SecurityPrivacyScreenProps> = ({ onBack }) => {
  const { profile } = useUserProfile();
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const clientName = profile.name || '[Nom du Client / Raison Sociale de l\'Organisation]';
  const clientEmail = profile.email || '[Email Professionnel du Client]';
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleDownloadNDA = (format: 'html' | 'txt' | 'print' = 'html') => {
    const res = downloadNDAContract({ clientName, clientEmail }, format);
    setDownloadSuccessMessage(res.message);
    setTimeout(() => setDownloadSuccessMessage(null), 5000);
  };

  const handleShareNDA = async () => {
    const res = await shareNDAContract({ clientName, clientEmail });
    setDownloadSuccessMessage(res.message);
    setTimeout(() => setDownloadSuccessMessage(null), 5000);
  };

  const handleCopyPlainTextNDA = () => {
    const textContent = generateNDAPlainText({ clientName, clientEmail });
    navigator.clipboard.writeText(textContent);
    setCopiedText(true);
    setDownloadSuccessMessage("Texte intégral du contrat NDA copié dans le presse-papier !");
    setTimeout(() => {
      setCopiedText(false);
      setDownloadSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header with Back */}
      <div className="flex items-center justify-between">
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

        {/* Quick action: View NDA */}
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4 text-slate-500" />
          <span>Consulter le Texte Complet</span>
        </button>
      </div>

      {/* Success Download Toast */}
      {downloadSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessMessage(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* NDA Commitment Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Accord de Non-Divulgation (NDA) Systématique</h3>
              <p className="text-xs text-slate-500">Protection absolue du secret d'affaires et de vos jeux de données en télétravail</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleDownloadNDA('html')}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-950/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              title="Télécharger le modèle officiel NDA au format HTML / PDF"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le modèle NDA</span>
            </button>
            <button
              onClick={() => handleDownloadNDA('print')}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Imprimer ou enregistrer directement en PDF"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Imprimer / PDF</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Le Cabinet Rabiou Saley applique une politique rigoureuse de sécurité de l'information pour l'ensemble de ses interventions en télétravail international auprès des startups, PME et grandes institutions :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">1. Chiffrement de bout en bout</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toutes les données en transit et au repos sont protégées par les standards AES-256 et TLS 1.3. Aucune donnée client n'est conservée sans accord formel.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">2. Environnements cloisonnés</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Travail sous conteneurs Docker éphémères, accès VPN sécurisé et gestion des secrets via gestionnaires de clés (GCP Secret Manager / AWS Secrets).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">3. Propriété intellectuelle exclusive</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              L'intégralité du code source, des modèles entraînés et de la documentation livrée devient la propriété exclusive de votre organisation dès le règlement final.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs text-slate-900">4. Conformité RGPD & Éthique</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anonymisation préalable des données personnelles et respect strict des directives de protection de la vie privée.
            </p>
          </div>
        </div>

        {/* Action Callout Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            <strong>Besoin d'un accord préalable signé par le cabinet ?</strong><br/>
            Téléchargez le document pour votre service juridique ou ouvrez-le en direct.
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Consulter</span>
            </button>
            <button
              onClick={() => handleDownloadNDA('print')}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              title="Imprimer / Enregistrer en PDF"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={() => handleDownloadNDA('html')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger NDA (.html)</span>
            </button>
          </div>
        </div>
      </div>

      {/* NDA Contract Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Contrat NDA Officiel - Prévisualisation</h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-800 space-y-3 font-serif leading-relaxed">
              <div className="text-center pb-2 border-b border-slate-300">
                <h4 className="font-bold text-sm text-emerald-950 uppercase">Accord de Non-Divulgation & de Confidentialité</h4>
                <p className="text-[10px] text-slate-500">Cabinet d'Expertise Rabiou Saley • Réf: NDA-DANTHOSS-{Date.now().toString().slice(-8)}</p>
              </div>

              <div>
                <strong>Entre les soussignés :</strong><br/>
                1. <strong>Cabinet Rabiou Saley</strong> (Prestataire Data Science & IA, Niamey / Remote)<br/>
                2. <strong>{clientName}</strong> ({clientEmail})
              </div>

              <div>
                <strong>Article 1 - Informations Confidentielles :</strong><br/>
                Sont strictement confidentiels l'ensemble des jeux de données, codes sources, architectures, clés d'API et secrets industriels confiés.
              </div>

              <div>
                <strong>Article 2 - Non-Divulgation & Cloisonnement :</strong><br/>
                Engagement formel de non-divulgation à des tiers, utilisation exclusive aux fins du projet, conteneurs Docker éphémères et VPN sécurisé.
              </div>

              <div>
                <strong>Article 3 - Chiffrement :</strong><br/>
                Chiffrement complet AES-256 et TLS 1.3. Aucune rétention de données après validation des livrables.
              </div>

              <div>
                <strong>Article 4 - Propriété Intellectuelle :</strong><br/>
                Cession intégrale et exclusive de tous les droits de propriété intellectuelle sur les livrables au Client.
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between font-sans text-[11px]">
                <div>
                  <strong>Cabinet Rabiou Saley</strong><br/>
                  <em>Signé électroniquement ✓</em>
                </div>
                <div className="text-right">
                  <strong>Client : {clientName}</strong><br/>
                  <em>Prêt pour signature</em>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleDownloadNDA('txt')}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Télécharger version texte"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Texte (.txt)</span>
                </button>
                <button
                  onClick={handleCopyPlainTextNDA}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Copier le texte"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>{copiedText ? 'Copié !' : 'Copier'}</span>
                </button>
                <button
                  onClick={handleShareNDA}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Partager le document NDA"
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>Partager</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleDownloadNDA('print')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  title="Ouvrir la fenêtre d'impression PDF"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Imprimer / PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadNDA('html')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger (.html)</span>
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
