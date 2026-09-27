import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Code, Award, CheckCircle, ExternalLink, Calendar, Briefcase, GraduationCap, Cpu } from 'lucide-react';

interface CVTemplateProps {
  data: CVData;
  isPrintMode?: boolean;
}

export const AIDataEngineerTemplate: React.FC<CVTemplateProps> = ({ data }) => {
  const accent = data.accentColor || '#16A34A';

  return (
    <div className="bg-white text-slate-900 font-sans p-8 rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:text-black">
      {/* Top Header with Dark Slate & Emerald Accent */}
      <div className="border-b-2 pb-6 mb-6" style={{ borderColor: accent }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 print:text-2xl">
              {data.fullName}
            </h1>
            <p className="text-lg font-bold mt-1" style={{ color: accent }}>
              {data.jobTitle}
            </p>
            {data.remoteStatus && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {data.remoteStatus}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-600 space-y-1.5 md:text-right">
            <div className="flex items-center md:justify-end gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a>
            </div>
            <div className="flex items-center md:justify-end gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{data.phone}</span>
            </div>
            <div className="flex items-center md:justify-end gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{data.location}</span>
            </div>
            <div className="flex items-center md:justify-end gap-3 pt-1">
              {data.portfolioUrl && (
                <a href={data.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-slate-700 font-medium">
                  <Globe className="w-3 h-3 text-slate-400" /> Portfolio
                </a>
              )}
              {data.linkedinUrl && (
                <a href={data.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-slate-700 font-medium">
                  <Globe className="w-3 h-3 text-slate-400" /> LinkedIn
                </a>
              )}
              {data.githubUrl && (
                <a href={data.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-slate-700 font-medium">
                  <Code className="w-3 h-3 text-slate-400" /> GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio Summary */}
        {data.bioSummary && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed">
            <p>{data.bioSummary}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Experiences & Projects */}
        <div className="md:col-span-2 space-y-6">
          {/* Experiences */}
          {data.experiences && data.experiences.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" style={{ color: accent }} />
                Expérience Professionnelle
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold mt-0.5" style={{ color: accent }}>
                      <span>{exp.company}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-normal">{exp.location}</span>
                      {exp.remoteType === 'full_remote' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                          Télétravail Full Remote
                        </span>
                      )}
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-700 list-disc list-outside pl-3.5">
                      {exp.highlights.map((hl, idx) => (
                        <li key={idx} className="leading-snug">{hl}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projets Clés IA & Data */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4" style={{ color: accent }} />
                Projets & Réalisations Majeures
              </h2>
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                      {proj.impactMetric && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {proj.impactMetric}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.technologies.map((t, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 font-medium text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (1 col): Skills, Education, Certifications, Languages */}
        <div className="space-y-6">
          {/* Compétences Techniques */}
          {data.skillCategories && data.skillCategories.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: accent }} />
                Compétences Clés
              </h2>
              <div className="space-y-3">
                {data.skillCategories.map((cat, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs font-bold text-slate-800 mb-1.5">{cat.category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-800 border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formations */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" style={{ color: accent }} />
                Formation
              </h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                    <div className="text-slate-600 font-medium">{edu.institution}</div>
                    <div className="text-slate-400 text-[11px]">{edu.year} • {edu.location}</div>
                    {edu.details && <p className="text-slate-500 text-[11px] mt-0.5">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: accent }} />
                Certifications
              </h2>
              <div className="space-y-2">
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="text-xs border-l-2 pl-2" style={{ borderColor: accent }}>
                    <div className="font-bold text-slate-800">{cert.name}</div>
                    <div className="text-slate-500 text-[11px]">{cert.issuer} • {cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {data.languages && data.languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Langues</h2>
              <div className="space-y-1 text-xs">
                {data.languages.map((l, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-700">
                    <span className="font-semibold">{l.language}</span>
                    <span className="text-[11px] text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export const ExecutiveRemoteTemplate: React.FC<CVTemplateProps> = ({ data }) => {
  const accent = data.accentColor || '#0284C7';

  return (
    <div className="bg-white text-slate-900 font-sans p-8 rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-lg mb-6 print:bg-slate-900 print:text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{data.fullName}</h1>
            <p className="text-sky-400 font-semibold text-sm mt-1">{data.jobTitle}</p>
            <div className="inline-block mt-2 px-2.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-xs font-medium">
              {data.remoteStatus} • Mobilité Internationale
            </div>
          </div>
          <div className="text-xs space-y-1 text-slate-300 md:text-right">
            <div>{data.email}</div>
            <div>{data.phone}</div>
            <div>{data.location}</div>
            {data.portfolioUrl && <div>{data.portfolioUrl}</div>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.bioSummary && (
        <div className="p-4 mb-6 rounded-lg bg-sky-50/60 border border-sky-100 text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-sky-900 block mb-1">PROFIL EXÉCUTIF & EXPERTISE TÉLÉTRAVAIL</span>
          {data.bioSummary}
        </div>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b pb-1 mb-3">
              Missions & Expériences Professionnelles
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{exp.role}</span>
                    <span className="text-slate-500 font-normal">{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</span>
                  </div>
                  <div className="text-sky-700 font-semibold mb-1">
                    {exp.company} <span className="text-slate-400 font-normal">• {exp.location}</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b pb-1 mb-3">
              Réalisations Stratégiques & Livrables Clés
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div key={proj.id} className="text-xs border-l-2 border-sky-500 pl-3">
                  <div className="font-bold text-slate-900 flex justify-between">
                    <span>{proj.title}</span>
                    {proj.impactMetric && <span className="text-sky-700 font-semibold">{proj.impactMetric}</span>}
                  </div>
                  <p className="text-slate-600 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b pb-1 mb-3">
              Compétences & Outils
            </h2>
            <div className="space-y-3">
              {data.skillCategories.map((c, i) => (
                <div key={i} className="text-xs">
                  <div className="font-bold text-slate-800 mb-1">{c.category}</div>
                  <div className="flex flex-wrap gap-1">
                    {c.skills.map((s, si) => (
                      <span key={si} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b pb-1 mb-3">
              Diplômes & Études
            </h2>
            <div className="space-y-2 text-xs">
              {data.education.map((e) => (
                <div key={e.id}>
                  <div className="font-bold text-slate-900">{e.degree}</div>
                  <div className="text-slate-600">{e.institution} • {e.year}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-800 border-b pb-1 mb-3">
              Langues de Travail
            </h2>
            <div className="space-y-1 text-xs">
              {data.languages.map((l, i) => (
                <div key={i} className="flex justify-between">
                  <span className="font-semibold text-slate-800">{l.language}</span>
                  <span className="text-slate-500">{l.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const MinimalTechTemplate: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-neutral-900 font-mono p-8 rounded-xl shadow-lg border border-neutral-200 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none text-xs">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4 mb-4">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">{data.fullName}</h1>
        <div className="text-neutral-600 font-semibold text-xs mt-0.5">{data.jobTitle} // {data.remoteStatus}</div>
        <div className="flex flex-wrap gap-4 text-[11px] text-neutral-500 mt-2">
          <span>{data.email}</span>
          <span>{data.phone}</span>
          <span>{data.location}</span>
          {data.githubUrl && <span>{data.githubUrl}</span>}
        </div>
      </div>

      {data.bioSummary && (
        <div className="mb-4 text-neutral-700 leading-relaxed font-sans text-xs">
          {data.bioSummary}
        </div>
      )}

      {/* Content */}
      <div className="space-y-5">
        <section>
          <div className="font-bold uppercase tracking-wider text-neutral-900 mb-2 border-b border-neutral-200 pb-0.5">
            01. Expérience // Parcours
          </div>
          <div className="space-y-3">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>{exp.role} @ {exp.company}</span>
                  <span className="text-neutral-500 font-normal">{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</span>
                </div>
                <ul className="list-disc pl-4 text-neutral-600 font-sans text-xs mt-1 space-y-0.5">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="font-bold uppercase tracking-wider text-neutral-900 mb-2 border-b border-neutral-200 pb-0.5">
            02. Projets & Code
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="border border-neutral-300 p-2.5 rounded bg-neutral-50 font-sans">
                <div className="font-bold text-xs text-neutral-900 font-mono">{proj.title}</div>
                <div className="text-[11px] text-neutral-600 mt-1">{proj.description}</div>
                <div className="text-[10px] text-neutral-500 font-mono mt-2">
                  Stack: {proj.technologies.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="font-bold uppercase tracking-wider text-neutral-900 mb-2 border-b border-neutral-200 pb-0.5">
            03. Stack Technique & Diplômes
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
            <div>
              <div className="font-mono text-xs font-bold mb-1">COMPÉTENCES</div>
              {data.skillCategories.map((c, i) => (
                <div key={i} className="text-xs mb-1">
                  <span className="font-semibold text-neutral-800">{c.category}: </span>
                  <span className="text-neutral-600">{c.skills.join(', ')}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="font-mono text-xs font-bold mb-1">FORMATION</div>
              {data.education.map((e) => (
                <div key={e.id} className="text-xs mb-1">
                  <div className="font-bold text-neutral-900">{e.degree}</div>
                  <div className="text-neutral-500">{e.institution} ({e.year})</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const AcademicResearchTemplate: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-slate-900 font-serif p-8 rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none text-xs">
      <div className="text-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold tracking-normal uppercase">{data.fullName}</h1>
        <p className="italic text-slate-700 font-sans text-xs mt-1">{data.jobTitle}</p>
        <p className="font-sans text-[11px] text-slate-500 mt-1">
          {data.location} | {data.email} | {data.phone}
        </p>
      </div>

      <div className="space-y-4">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b pb-0.5 mb-2 font-sans">
            Résumé de Recherche & Expertise
          </h2>
          <p className="text-justify font-sans leading-relaxed text-slate-700 text-xs">
            {data.bioSummary}
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b pb-0.5 mb-2 font-sans">
            Cursus Universitaire
          </h2>
          <div className="space-y-2 font-sans">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">{edu.degree} - {edu.field}</div>
                  <div className="text-slate-600">{edu.institution}</div>
                  {edu.details && <div className="text-slate-500 text-[11px] italic">{edu.details}</div>}
                </div>
                <div className="text-slate-500 font-medium">{edu.year}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b pb-0.5 mb-2 font-sans">
            Expériences Professionnelles & Consulting
          </h2>
          <div className="space-y-3 font-sans">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.role}, {exp.company}</span>
                  <span className="text-slate-500 font-normal">{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</span>
                </div>
                <ul className="list-disc pl-4 text-slate-600 text-xs mt-1 space-y-0.5">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b pb-0.5 mb-2 font-sans">
            Compétences & Domaines d'Expertise
          </h2>
          <div className="font-sans space-y-1">
            {data.skillCategories.map((c, i) => (
              <div key={i} className="text-xs">
                <span className="font-bold text-slate-800">{c.category} : </span>
                <span className="text-slate-600">{c.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
