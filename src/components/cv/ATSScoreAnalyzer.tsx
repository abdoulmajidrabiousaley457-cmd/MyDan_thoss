import React from 'react';
import { CVData } from '../../types';
import { CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface ATSScoreAnalyzerProps {
  data: CVData;
}

export const ATSScoreAnalyzer: React.FC<ATSScoreAnalyzerProps> = ({ data }) => {
  // Compute ATS metrics
  let score = 0;
  const checks: { label: string; passed: boolean; tip: string; points: number }[] = [];

  // 1. Contact info
  const hasContact = Boolean(data.fullName && data.email && data.phone && data.location);
  checks.push({
    label: 'Coordonnées complètes & Localisation',
    passed: hasContact,
    tip: 'Vérifiez la présence de votre email, téléphone et mention télétravail/ville.',
    points: 15
  });
  if (hasContact) score += 15;

  // 2. Portfolio or LinkedIn link
  const hasLinks = Boolean(data.portfolioUrl || data.linkedinUrl || data.githubUrl);
  checks.push({
    label: 'Liens professionnels (Portfolio, LinkedIn, GitHub)',
    passed: hasLinks,
    tip: 'Les recruteurs tech évaluent systématiquement vos dépôts GitHub et votre portfolio.',
    points: 15
  });
  if (hasLinks) score += 15;

  // 3. Bio summary
  const hasGoodBio = Boolean(data.bioSummary && data.bioSummary.length >= 100);
  checks.push({
    label: 'Accroche & Résumé professionnel (>100 caractères)',
    passed: hasGoodBio,
    tip: 'Résumez vos années d\'expérience, vos spécialités IA/Data et votre disponibilité.',
    points: 15
  });
  if (hasGoodBio) score += 15;

  // 4. Experiences with quantified metrics
  const allHighlights = data.experiences.flatMap((e) => e.highlights).join(' ');
  const hasNumbers = /\d+%|\d+\s*€|\d+\s*k|\d+\s*h|\d+\s*millions|\d+\.\d+/.test(allHighlights);
  checks.push({
    label: 'Réalisations chiffrées & Métriques d\'impact',
    passed: hasNumbers,
    tip: 'Ajoutez des chiffres clés (ex: +42% d\'efficacité, 1.5M transactions, 15h économisées).',
    points: 20
  });
  if (hasNumbers) score += 20;

  // 5. Tech skills keywords
  const allSkills = data.skillCategories.flatMap((c) => c.skills).join(' ').toLowerCase();
  const techKeywords = ['python', 'ai', 'ia', 'machine learning', 'docker', 'rag', 'fastapi', 'sql', 'remote', 'télétravail'];
  const matchedKeywords = techKeywords.filter((k) => allSkills.includes(k) || allHighlights.toLowerCase().includes(k));
  const hasStrongKeywords = matchedKeywords.length >= 4;
  checks.push({
    label: 'Mots-clés recherchés par les recruteurs Tech & IA',
    passed: hasStrongKeywords,
    tip: `Mots-clés détectés (${matchedKeywords.length}/10) : ${matchedKeywords.join(', ')}`,
    points: 20
  });
  if (hasStrongKeywords) score += 20;

  // 6. Certifications or Education
  const hasCreds = Boolean((data.certifications && data.certifications.length > 0) || (data.education && data.education.length > 0));
  checks.push({
    label: 'Diplômes & Certifications professionnelles',
    passed: hasCreds,
    tip: 'Indiquez vos diplômes d\'ingénieur, masters et certifications récentes.',
    points: 15
  });
  if (hasCreds) score += 15;

  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (s >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Score ATS & Compatibilité Recruteurs</h3>
            <p className="text-xs text-slate-500">Analyse algorithmique en temps réel de votre CV</p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-lg border font-bold text-base flex items-center gap-1.5 ${getScoreColor(score)}`}>
          <Sparkles className="w-4 h-4" />
          <span>{score} / 100</span>
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((chk, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
              chk.passed ? 'bg-slate-50 border-slate-200/80 text-slate-800' : 'bg-amber-50/50 border-amber-200/60 text-slate-700'
            }`}
          >
            {chk.passed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-semibold flex items-center justify-between">
                <span>{chk.label}</span>
                <span className="text-[10px] text-slate-400">+{chk.points} pts</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{chk.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
