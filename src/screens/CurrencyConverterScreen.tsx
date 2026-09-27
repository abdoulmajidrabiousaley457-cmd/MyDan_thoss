import React, { useState } from 'react';
import { CURRENCIES, REMOTE_RATE_PRESETS } from '../data/currencyData';
import { CurrencyItem } from '../types';
import { 
  ArrowRightLeft, 
  Copy, 
  Check, 
  TrendingUp, 
  Globe, 
  DollarSign, 
  Calculator, 
  Sparkles, 
  Briefcase,
  Share2,
  RefreshCw
} from 'lucide-react';

export const CurrencyConverterScreen: React.FC = () => {
  const [fromCurrencyCode, setFromCurrencyCode] = useState<string>('EUR');
  const [toCurrencyCode, setToCurrencyCode] = useState<string>('XOF');
  const [amountStr, setAmountStr] = useState<string>('100');
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');

  const fromCurrency = CURRENCIES.find((c) => c.code === fromCurrencyCode) || CURRENCIES[1]; // EUR
  const toCurrency = CURRENCIES.find((c) => c.code === toCurrencyCode) || CURRENCIES[0]; // XOF

  const amount = parseFloat(amountStr) || 0;

  // Convert via USD as bridge
  // fromAmount in FromCurrency -> USD = amount / fromCurrency.rateToUSD
  // USD -> toCurrency = USD * toCurrency.rateToUSD
  const amountInUSD = fromCurrency.rateToUSD > 0 ? amount / fromCurrency.rateToUSD : 0;
  const convertedAmount = amountInUSD * toCurrency.rateToUSD;

  // Unit rate: 1 FromCurrency = ? ToCurrency
  const unitRate = fromCurrency.rateToUSD > 0 ? (1 / fromCurrency.rateToUSD) * toCurrency.rateToUSD : 0;
  // Inverse rate: 1 ToCurrency = ? FromCurrency
  const inverseUnitRate = unitRate > 0 ? 1 / unitRate : 0;

  const handleSwap = () => {
    setFromCurrencyCode(toCurrencyCode);
    setToCurrencyCode(fromCurrencyCode);
  };

  const handleCopySummary = () => {
    const summary = `${amount.toLocaleString('fr-FR')} ${fromCurrency.code} = ${convertedAmount.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${toCurrency.code} (Taux: 1 ${fromCurrency.code} = ${unitRate.toFixed(4)} ${toCurrency.code})`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const applyRemotePreset = (amountEUR: number) => {
    setFromCurrencyCode('EUR');
    setToCurrencyCode('XOF');
    setAmountStr(amountEUR.toString());
  };

  const filteredCurrencies = selectedRegionFilter === 'all'
    ? CURRENCIES
    : CURRENCIES.filter((c) => c.region === selectedRegionFilter);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 md:p-10 shadow-xl border border-emerald-800/40 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Globe className="w-3.5 h-3.5" />
          Finances & Devises Internationales
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Convertisseur de Devises Mondiales & Télétravail
        </h1>
        <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
          Calculez instantanément les équivalences entre le Franc CFA (XOF / CEMAC), l'Euro (EUR), le Dollar américain (USD) et plus de 15 devises pour vos contrats, factures et missions à l'international.
        </p>
      </div>

      {/* Main Converter Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* FROM input */}
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Montant à convertir</span>
              <span className="text-[11px] font-normal text-slate-400">Origine</span>
            </label>
            <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/50 p-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
              <input
                type="number"
                min="0"
                step="any"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-xl md:text-2xl font-black text-slate-900 focus:outline-none"
                placeholder="0"
              />
              <select
                value={fromCurrencyCode}
                onChange={(e) => setFromCurrencyCode(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-bold text-slate-800 focus:outline-none shadow-xs cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} - {c.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-slate-400 px-1 font-medium">
              {fromCurrency.name} ({fromCurrency.region})
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:pt-4">
            <button
              onClick={handleSwap}
              title="Inverser les devises"
              className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-transform active:scale-95 shadow-xs cursor-pointer"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* TO output */}
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Résultat converti</span>
              <span className="text-[11px] font-normal text-slate-400">Destination</span>
            </label>
            <div className="flex items-center rounded-2xl border border-emerald-200 bg-emerald-50/40 p-2">
              <div className="w-full px-3 py-2 text-xl md:text-2xl font-black text-emerald-950 truncate">
                {convertedAmount.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <select
                value={toCurrencyCode}
                onChange={(e) => setToCurrencyCode(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs md:text-sm font-bold text-slate-800 focus:outline-none shadow-xs cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} - {c.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold px-1">
              {toCurrency.name} ({toCurrency.region})
            </div>
          </div>
        </div>

        {/* Live Rates Summary & Copy Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-0.5 text-xs">
            <div className="text-slate-400">Taux de change indicatif en direct :</div>
            <div className="font-bold text-sm text-emerald-400 flex items-center gap-2">
              <span>1 {fromCurrency.code} = {unitRate.toLocaleString('fr-FR', { maximumFractionDigits: 4 })} {toCurrency.code}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-normal">
                1 {toCurrency.code} = {inverseUnitRate.toLocaleString('fr-FR', { maximumFractionDigits: 4 })} {fromCurrency.code}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié dans le presse-papier !' : 'Copier pour facture / devis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Télétravail & Facturation Presets */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900">
              Barème & Presets Télétravail International (EUR ➔ FCFA)
            </h2>
            <p className="text-xs text-slate-500">
              Cliquez sur un montant type pour charger immédiatement la conversion pour vos devis de mission.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {REMOTE_RATE_PRESETS.map((pst, idx) => {
            const xofEquivalent = Math.round(pst.amountEUR * (CURRENCIES[0].rateToUSD / CURRENCIES[1].rateToUSD));
            return (
              <div
                key={idx}
                onClick={() => applyRemotePreset(pst.amountEUR)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {pst.label}
                  </span>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    {pst.amountEUR.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5">
                    ≈ {xofEquivalent.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 group-hover:text-slate-700 leading-snug">
                  {pst.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Currency Matrix for Current Amount */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Équivalence de {amount.toLocaleString('fr-FR')} {fromCurrency.code} dans le monde
            </h3>
            <p className="text-xs text-slate-500">
              Aperçu instantané sur les principales devises de travail à l'international.
            </p>
          </div>

          {/* Region filter */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'Afrique', label: 'Afrique' },
              { id: 'Europe', label: 'Europe' },
              { id: 'Amériques', label: 'Amériques' },
              { id: 'Asie / Moyen-Orient', label: 'Asie & MO' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegionFilter(r.id)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedRegionFilter === r.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredCurrencies.map((c) => {
            const equiv = amountInUSD * c.rateToUSD;
            const isSource = c.code === fromCurrency.code;
            return (
              <div
                key={c.code}
                onClick={() => setToCurrencyCode(c.code)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSource
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50/60 hover:bg-emerald-50/40 border-slate-200/90 text-slate-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-base">{c.flag}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSource ? 'bg-slate-800 text-emerald-400' : 'bg-white text-slate-500 border border-slate-200'}`}>
                    {c.code}
                  </span>
                </div>
                <div className="mt-2">
                  <div className={`text-base font-extrabold truncate ${isSource ? 'text-emerald-400' : 'text-slate-900'}`}>
                    {equiv.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} {c.symbol}
                  </div>
                  <div className={`text-[10px] truncate mt-0.5 ${isSource ? 'text-slate-400' : 'text-slate-500'}`}>
                    {c.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
