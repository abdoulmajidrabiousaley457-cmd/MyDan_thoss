import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../../l10n/app_strings.dart';
import '../../providers/user_profile_provider.dart';
import '../../services/referral_service.dart';
import '../../theme/app_colors.dart';

class ReferralScreen extends StatefulWidget {
  const ReferralScreen({super.key});

  @override
  State<ReferralScreen> createState() => _ReferralScreenState();
}

class _ReferralScreenState extends State<ReferralScreen> {
  final List<Referral> _referrals = ReferralService.sampleReferrals();
  late String _code;

  @override
  void initState() {
    super.initState();
    final profile = context.read<UserProfileProvider>();
    _code = ReferralService.codeFor(
      profile.hasProfile ? profile.name : 'MyDan',
    );
  }

  void _copyCode(AppStrings t) {
    Clipboard.setData(ClipboardData(text: _code));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(t['copied']),
        backgroundColor: AppColors.bluePrimary,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    final stats = ReferralService.stats(_referrals);
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(context, t),
              const SizedBox(height: 16),
              _buildCodeCard(context, t),
              const SizedBox(height: 16),
              _buildStats(context, t, stats),
              const SizedBox(height: 24),
              _buildSectionTitle(context, t['howItWorks']),
              _buildSteps(context, t),
              const SizedBox(height: 24),
              _buildSectionTitle(context, t['recentReferrals']),
              _buildReferralList(context, t),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, AppStrings t) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.orangePrimary, AppColors.orangeDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.card_giftcard,
                    color: Colors.white, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      t['referralTitle'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 19,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      t['referralSubtitle'],
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCodeCard(BuildContext context, AppStrings t) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.blueGradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.bluePrimary.withValues(alpha: 0.3),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            t['yourReferralCode'],
            style: const TextStyle(color: Colors.white70, fontSize: 13),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Text(
                    _code,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              GestureDetector(
                onTap: () => _copyCode(t),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.copy,
                      color: AppColors.bluePrimary, size: 22),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _copyCode(t),
                  icon: const Icon(Icons.share, size: 18),
                  label: Text(t['shareInvite']),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.bluePrimary,
                    minimumSize: const Size(double.infinity, 46),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStats(BuildContext context, AppStrings t, Map<String, dynamic> stats) {
    final items = <List<Object>>[
      ['${stats['total']}', t['totalReferrals'], AppColors.accentBlue],
      ['${stats['active']}', t['activeReferrals'], AppColors.successGreen],
      ['\$${(stats['earnings'] as double).toStringAsFixed(0)}', t['referralEarnings'], AppColors.orangePrimary],
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: items.map((it) {
          return Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
              decoration: BoxDecoration(
                color: AppColors.backgroundSecondary,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Text(
                    it[0] as String,
                    style: TextStyle(
                      color: it[2] as Color,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    it[1] as String,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 11,
                    ),
                    maxLines: 2,
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
      child: Text(title, style: Theme.of(context).textTheme.titleMedium),
    );
  }

  Widget _buildSteps(BuildContext context, AppStrings t) {
    final steps = [t['referralStep1'], t['referralStep2'], t['referralStep3']];
    final icons = [
      Icons.share_outlined,
      Icons.person_add_alt_1_outlined,
      Icons.redeem_outlined,
    ];
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: List.generate(steps.length, (i) {
          return Padding(
            padding: EdgeInsets.only(bottom: i == steps.length - 1 ? 0 : 16),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.pastelLavender,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icons[i], color: AppColors.accentBlue, size: 22),
                ),
                const SizedBox(width: 14),
                Container(
                  width: 22,
                  height: 22,
                  alignment: Alignment.center,
                  decoration: const BoxDecoration(
                    color: AppColors.orangePrimary,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '${i + 1}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    steps[i],
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 13,
                      height: 1.3,
                    ),
                  ),
                ),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildReferralList(BuildContext context, AppStrings t) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: List.generate(_referrals.length, (i) {
          final r = _referrals[i];
          final initials = r.name
              .split(' ')
              .take(2)
              .map((e) => e.isNotEmpty ? e[0] : '')
              .join()
              .toUpperCase();
          return Column(
            children: [
              ListTile(
                leading: CircleAvatar(
                  backgroundColor:
                      r.active ? AppColors.pastelMint : AppColors.pastelPeach,
                  child: Text(
                    initials,
                    style: TextStyle(
                      color: r.active
                          ? AppColors.successGreen
                          : AppColors.orangePrimary,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ),
                title: Text(
                  r.name,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                subtitle: Text(
                  '${t['joined']} ${r.date}',
                  style: const TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 11.5,
                  ),
                ),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      r.active ? '+\$${r.reward.toStringAsFixed(0)}' : '—',
                      style: TextStyle(
                        color: r.active
                            ? AppColors.successGreen
                            : AppColors.textTertiary,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: r.active
                            ? AppColors.pastelMint
                            : AppColors.pastelPeach,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        r.active ? t['completed'] : t['pending'],
                        style: TextStyle(
                          color: r.active
                              ? AppColors.successGreen
                              : AppColors.orangePrimary,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              if (i != _referrals.length - 1)
                const Divider(height: 1, color: AppColors.divider),
            ],
          );
        }),
      ),
    );
  }
}