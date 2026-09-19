import 'dart:math';

/// A referred contact.
class Referral {
  final String name;
  final String phone;
  final String date;
  final bool active;
  final double reward;

  const Referral({
    required this.name,
    required this.phone,
    required this.date,
    required this.active,
    required this.reward,
  });
}

/// Referral program service (mock data for the referral tab).
class ReferralService {
  static final Random _r = Random();

  /// Generates a referral code derived from the user's name.
  static String codeFor(String name) {
    final clean = name.replaceAll(RegExp(r'[^A-Za-z]'), '').toUpperCase();
    final base = clean.isEmpty ? 'MYDAN' : clean.padRight(5).substring(0, 5);
    final suffix = 100 + _r.nextInt(900);
    return '$base$suffix';
  }

  /// Sample referral history.
  static List<Referral> sampleReferrals() {
    return const [
      Referral(name: 'Aïcha Ibrahim', phone: '+227 96 12 34 56', date: '2025-01-12', active: true, reward: 5.0),
      Referral(name: 'Moussa Diallo', phone: '+227 90 88 77 66', date: '2025-01-08', active: true, reward: 5.0),
      Referral(name: 'Fatou Sow', phone: '+227 97 45 67 89', date: '2024-12-28', active: true, reward: 5.0),
      Referral(name: 'Kwame Mensah', phone: '+233 24 555 1234', date: '2024-12-20', active: false, reward: 0.0),
      Referral(name: 'Ibrahim Bello', phone: '+234 803 123 4567', date: '2024-12-15', active: true, reward: 5.0),
      Referral(name: 'Nadia Cherif', phone: '+213 550 12 34 56', date: '2024-12-02', active: true, reward: 5.0),
    ];
  }

  /// Aggregated referral statistics.
  static Map<String, dynamic> stats(List<Referral> referrals) {
    final total = referrals.length;
    final active = referrals.where((r) => r.active).length;
    final earnings = referrals.fold<double>(0, (s, r) => s + r.reward);
    final pending = total - active;
    return {
      'total': total,
      'active': active,
      'pending': pending,
      'earnings': earnings,
    };
  }
}