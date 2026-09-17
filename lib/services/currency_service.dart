/// A world currency with its code, display name and symbol.
class Currency {
  final String code;
  final String name;
  final String symbol;
  final String flag;

  const Currency(this.code, this.name, this.symbol, this.flag);
}

/// Result of a currency conversion.
class ConversionResult {
  final double amount;
  final double converted;
  final double rate;
  final Currency from;
  final Currency to;

  const ConversionResult({
    required this.amount,
    required this.converted,
    required this.rate,
    required this.from,
    required this.to,
  });
}

/// Global currency conversion service.
///
/// Uses a static table of reference exchange rates (relative to USD) so the
/// converter works fully offline and on every platform (Web / Android).
/// Rates are indicative reference values for demonstration purposes.
class CurrencyService {
  /// All supported world currencies (code, name, symbol, flag).
  static const List<Currency> currencies = [
    Currency('USD', 'US Dollar', '\$', 'United States'),
    Currency('EUR', 'Euro', '€', 'European Union'),
    Currency('GBP', 'British Pound', '£', 'United Kingdom'),
    Currency('JPY', 'Japanese Yen', '¥', 'Japan'),
    Currency('CNY', 'Chinese Yuan', '¥', 'China'),
    Currency('CHF', 'Swiss Franc', 'CHF', 'Switzerland'),
    Currency('CAD', 'Canadian Dollar', 'C\$', 'Canada'),
    Currency('AUD', 'Australian Dollar', 'A\$', 'Australia'),
    Currency('NZD', 'New Zealand Dollar', 'NZ\$', 'New Zealand'),
    Currency('HKD', 'Hong Kong Dollar', 'HK\$', 'Hong Kong'),
    Currency('SGD', 'Singapore Dollar', 'S\$', 'Singapore'),
    Currency('INR', 'Indian Rupee', '₹', 'India'),
    Currency('KRW', 'South Korean Won', '₩', 'South Korea'),
    Currency('BRL', 'Brazilian Real', 'R\$', 'Brazil'),
    Currency('MXN', 'Mexican Peso', 'Mex\$', 'Mexico'),
    Currency('RUB', 'Russian Ruble', '₽', 'Russia'),
    Currency('ZAR', 'South African Rand', 'R', 'South Africa'),
    Currency('TRY', 'Turkish Lira', '₺', 'Turkey'),
    Currency('AED', 'UAE Dirham', 'د.إ', 'UAE'),
    Currency('SAR', 'Saudi Riyal', '﷼', 'Saudi Arabia'),
    Currency('QAR', 'Qatari Riyal', '﷼', 'Qatar'),
    Currency('KWD', 'Kuwaiti Dinar', 'د.ك', 'Kuwait'),
    Currency('EGP', 'Egyptian Pound', 'E£', 'Egypt'),
    Currency('MAD', 'Moroccan Dirham', 'د.م.', 'Morocco'),
    Currency('TND', 'Tunisian Dinar', 'د.ت', 'Tunisia'),
    Currency('DZD', 'Algerian Dinar', 'د.ج', 'Algeria'),
    Currency('JOD', 'Jordanian Dinar', 'د.ا', 'Jordan'),
    Currency('LBP', 'Lebanese Pound', 'ل.ل', 'Lebanon'),
    Currency('IQD', 'Iraqi Dinar', 'ع.د', 'Iraq'),
    Currency('THB', 'Thai Baht', '฿', 'Thailand'),
    Currency('MYR', 'Malaysian Ringgit', 'RM', 'Malaysia'),
    Currency('IDR', 'Indonesian Rupiah', 'Rp', 'Indonesia'),
    Currency('PHP', 'Philippine Peso', '₱', 'Philippines'),
    Currency('VND', 'Vietnamese Dong', '₫', 'Vietnam'),
    Currency('PLN', 'Polish Zloty', 'zł', 'Poland'),
    Currency('SEK', 'Swedish Krona', 'kr', 'Sweden'),
    Currency('NOK', 'Norwegian Krone', 'kr', 'Norway'),
    Currency('DKK', 'Danish Krone', 'kr', 'Denmark'),
    Currency('CZK', 'Czech Koruna', 'Kč', 'Czechia'),
    Currency('HUF', 'Hungarian Forint', 'Ft', 'Hungary'),
    Currency('RON', 'Romanian Leu', 'lei', 'Romania'),
    Currency('UAH', 'Ukrainian Hryvnia', '₴', 'Ukraine'),
    Currency('NGN', 'Nigerian Naira', '₦', 'Nigeria'),
    Currency('KES', 'Kenyan Shilling', 'KSh', 'Kenya'),
    Currency('GHS', 'Ghanaian Cedi', '₵', 'Ghana'),
    Currency('ARS', 'Argentine Peso', 'A\$', 'Argentina'),
    Currency('CLP', 'Chilean Peso', 'CLP\$', 'Chile'),
    Currency('COP', 'Colombian Peso', 'COL\$', 'Colombia'),
    Currency('PEN', 'Peruvian Sol', 'S/', 'Peru'),
    Currency('ILS', 'Israeli Shekel', '₪', 'Israel'),
    Currency('PKR', 'Pakistani Rupee', '₨', 'Pakistan'),
    Currency('BDT', 'Bangladeshi Taka', '৳', 'Bangladesh'),
    Currency('LKR', 'Sri Lankan Rupee', 'Rs', 'Sri Lanka'),
    Currency('TWD', 'Taiwan Dollar', 'NT\$', 'Taiwan'),
    Currency('ISK', 'Icelandic Krona', 'kr', 'Iceland'),
    Currency('BHD', 'Bahraini Dinar', 'ب.د', 'Bahrain'),
    Currency('OMR', 'Omani Rial', '﷼', 'Oman'),
  ];

  /// Reference rates: value of 1 USD expressed in each currency.
  static const Map<String, double> _usdRates = {
    'USD': 1.0,
    'EUR': 0.92,
    'GBP': 0.79,
    'JPY': 149.50,
    'CNY': 7.24,
    'CHF': 0.88,
    'CAD': 1.36,
    'AUD': 1.52,
    'NZD': 1.64,
    'HKD': 7.82,
    'SGD': 1.34,
    'INR': 83.12,
    'KRW': 1325.40,
    'BRL': 4.97,
    'MXN': 17.15,
    'RUB': 92.50,
    'ZAR': 18.75,
    'TRY': 30.20,
    'AED': 3.67,
    'SAR': 3.75,
    'QAR': 3.64,
    'KWD': 0.31,
    'EGP': 30.90,
    'MAD': 10.05,
    'TND': 3.12,
    'DZD': 134.50,
    'JOD': 0.71,
    'LBP': 89500.0,
    'IQD': 1310.0,
    'THB': 35.80,
    'MYR': 4.72,
    'IDR': 15650.0,
    'PHP': 56.10,
    'VND': 24600.0,
    'PLN': 4.02,
    'SEK': 10.45,
    'NOK': 10.65,
    'DKK': 6.87,
    'CZK': 22.85,
    'HUF': 355.20,
    'RON': 4.58,
    'UAH': 38.20,
    'NGN': 1450.0,
    'KES': 153.20,
    'GHS': 12.10,
    'ARS': 810.50,
    'CLP': 925.30,
    'COP': 3920.0,
    'PEN': 3.72,
    'ILS': 3.68,
    'PKR': 278.50,
    'BDT': 109.80,
    'LKR': 312.40,
    'TWD': 31.50,
    'ISK': 137.60,
    'BHD': 0.376,
    'OMR': 0.385,
  };

  /// Returns the [Currency] metadata for a given [code].
  static Currency currencyFor(String code) {
    return currencies.firstWhere(
      (c) => c.code == code,
      orElse: () => currencies.first,
    );
  }

  /// Rate to convert 1 unit of [from] into [to].
  static double rate(String from, String to) {
    final fromRate = _usdRates[from] ?? 1.0;
    final toRate = _usdRates[to] ?? 1.0;
    return toRate / fromRate;
  }

  /// Converts [amount] from one currency to another.
  static ConversionResult convert(double amount, String from, String to) {
    final r = rate(from, to);
    return ConversionResult(
      amount: amount,
      converted: amount * r,
      rate: r,
      from: currencyFor(from),
      to: currencyFor(to),
    );
  }

  /// A short "as of" label for the reference rates.
  static String get lastUpdatedLabel {
    final now = DateTime.now();
    final m = now.month.toString().padLeft(2, '0');
    final d = now.day.toString().padLeft(2, '0');
    return '${now.year}-$m-$d';
  }
}