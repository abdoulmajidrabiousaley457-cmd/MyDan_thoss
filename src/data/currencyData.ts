import { CurrencyItem } from '../types';

export const CURRENCIES: CurrencyItem[] = [
  {
    code: 'XOF',
    name: 'Franc CFA (UEMOA / Niger)',
    symbol: 'FCFA',
    flag: '🇳🇪',
    rateToUSD: 605.5, // 1 USD = ~605.5 XOF (approx 655.957 XOF per EUR)
    popular: true,
    region: 'Afrique'
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    rateToUSD: 0.923, // 1 USD = 0.923 EUR (1 EUR = ~1.083 USD)
    popular: true,
    region: 'Europe'
  },
  {
    code: 'USD',
    name: 'Dollar Américain',
    symbol: '$',
    flag: '🇺🇸',
    rateToUSD: 1.0,
    popular: true,
    region: 'Amériques'
  },
  {
    code: 'XAF',
    name: 'Franc CFA (CEMAC)',
    symbol: 'FCFA',
    flag: '🇨🇲',
    rateToUSD: 605.5,
    popular: true,
    region: 'Afrique'
  },
  {
    code: 'CAD',
    name: 'Dollar Canadien',
    symbol: 'CA$',
    flag: '🇨🇦',
    rateToUSD: 1.365,
    popular: true,
    region: 'Amériques'
  },
  {
    code: 'GBP',
    name: 'Livre Sterling',
    symbol: '£',
    flag: '🇬🇧',
    rateToUSD: 0.785,
    popular: true,
    region: 'Europe'
  },
  {
    code: 'CHF',
    name: 'Franc Suisse',
    symbol: 'CHF',
    flag: '🇨🇭',
    rateToUSD: 0.895,
    popular: true,
    region: 'Europe'
  },
  {
    code: 'CNY',
    name: 'Yuan Chinois (Renminbi)',
    symbol: '¥',
    flag: '🇨🇳',
    rateToUSD: 7.24,
    popular: true,
    region: 'Asie / Moyen-Orient'
  },
  {
    code: 'AED',
    name: 'Dirham Émirats Arabes Unis',
    symbol: 'AED',
    flag: '🇦🇪',
    rateToUSD: 3.6725,
    popular: true,
    region: 'Asie / Moyen-Orient'
  },
  {
    code: 'SAR',
    name: 'Riyal Saoudien',
    symbol: 'SAR',
    flag: '🇸🇦',
    rateToUSD: 3.75,
    popular: false,
    region: 'Asie / Moyen-Orient'
  },
  {
    code: 'NGN',
    name: 'Naira Nigérian',
    symbol: '₦',
    flag: '🇳🇬',
    rateToUSD: 1580.0,
    popular: true,
    region: 'Afrique'
  },
  {
    code: 'GHS',
    name: 'Cedi Ghanéen',
    symbol: 'GH₵',
    flag: '🇬🇭',
    rateToUSD: 15.65,
    popular: false,
    region: 'Afrique'
  },
  {
    code: 'MAD',
    name: 'Dirham Marocain',
    symbol: 'DH',
    flag: '🇲🇦',
    rateToUSD: 9.95,
    popular: true,
    region: 'Afrique'
  },
  {
    code: 'TND',
    name: 'Dinar Tunisien',
    symbol: 'DT',
    flag: '🇹🇳',
    rateToUSD: 3.12,
    popular: false,
    region: 'Afrique'
  },
  {
    code: 'JPY',
    name: 'Yen Japonais',
    symbol: '¥',
    flag: '🇯🇵',
    rateToUSD: 156.4,
    popular: false,
    region: 'Asie / Moyen-Orient'
  },
  {
    code: 'BRL',
    name: 'Real Brésilien',
    symbol: 'R$',
    flag: '🇧🇷',
    rateToUSD: 5.45,
    popular: false,
    region: 'Amériques'
  },
  {
    code: 'INR',
    name: 'Roupie Indienne',
    symbol: '₹',
    flag: '🇮🇳',
    rateToUSD: 83.5,
    popular: false,
    region: 'Asie / Moyen-Orient'
  }
];

export const REMOTE_RATE_PRESETS = [
  {
    label: 'Tarif Horaire Tech Senior (Remote)',
    amountEUR: 55,
    description: 'Taux horaire moyen international pour mission Data/IA'
  },
  {
    label: 'Taux Journalier Moyen (TJM 1 jour)',
    amountEUR: 400,
    description: 'Facturation journalière standard en régie agile'
  },
  {
    label: 'Sprint de 2 Semaines (Projet IA)',
    amountEUR: 3200,
    description: 'Forfait de livraison d\'un prototype ou agent autonome'
  },
  {
    label: 'Mensuel Télétravail Full Time (35h)',
    amountEUR: 5800,
    description: 'Rémunération mensuelle pour mission dédiée longue durée'
  }
];
