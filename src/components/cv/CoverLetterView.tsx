import React from 'react';
import { CoverLetterData } from '../../types';

interface CoverLetterViewProps {
  data: CoverLetterData;
  accentColor?: string;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({ data, accentColor = '#16A34A' }) => {
  return (
    <div className="bg-white text-slate-900 font-sans p-8 md:p-12 rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:text-black">
      {/* Sender Header */}
      <div className="border-b-2 pb-6 mb-8" style={{ borderColor: accentColor }}>
        <h1 className="text-2xl font-bold text-slate-900">{data.senderName}</h1>
        <p className="text-sm font-semibold mt-0.5" style={{ color: accentColor }}>{data.senderTitle}</p>
        <div className="text-xs text-slate-500 mt-2 flex flex-wrap gap-4">
          <span>{data.senderEmail}</span>
          <span>•</span>
          <span>{data.senderPhone}</span>
          <span>•</span>
          <span>{data.senderLocation}</span>
          {data.workArrangement && (
            <>
              <span>•</span>
              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {data.workArrangement}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Recipient & Date */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 text-xs text-slate-600 gap-4">
        <div className="space-y-0.5">
          <div className="font-bold text-slate-800 text-sm">{data.recipientName}</div>
          <div>{data.recipientTitle}</div>
          <div className="font-semibold text-slate-700">{data.companyName}</div>
          <div>{data.companyAddress}</div>
        </div>
        <div className="text-right text-slate-500">
          <div>{data.date}</div>
        </div>
      </div>

      {/* Subject Line */}
      <div className="mb-6 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <span className="font-bold text-xs text-slate-900">Objet : </span>
        <span className="text-xs text-slate-800 font-medium">
          Candidature au poste de <span className="font-bold">{data.jobTarget}</span> ({data.workArrangement})
        </span>
      </div>

      {/* Letter Body */}
      <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
        <p className="font-semibold text-slate-900">{data.greeting}</p>
        <p className="text-justify">{data.hookParagraph}</p>
        <p className="text-justify">{data.skillsParagraph}</p>
        <p className="text-justify">{data.valueParagraph}</p>
        <p className="text-justify">{data.closingParagraph}</p>
      </div>

      {/* Signoff */}
      <div className="mt-8 pt-4 border-t border-slate-100">
        <p className="text-xs md:text-sm text-slate-700 mb-6">{data.signoff}</p>
        <div className="font-bold text-sm text-slate-900">{data.senderName}</div>
        <div className="text-xs text-slate-500">{data.senderTitle}</div>
        <div className="text-[11px] text-emerald-600 font-medium mt-1">Disponibilité Télétravail Confirmée</div>
      </div>
    </div>
  );
};
