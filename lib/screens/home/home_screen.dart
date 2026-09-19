import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../l10n/app_strings.dart';
import '../../providers/user_profile_provider.dart';
import '../../theme/app_colors.dart';
import '../../widgets/language_selector.dart';
import '../tools/currency_converter_screen.dart';
import '../tools/data_analysis_screen.dart';
import '../tools/tracking_screen.dart';

/// Home screen reproducing the mobile-money style interface:
/// orange header + blue balance card + white services grid.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.orangePrimary,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            _buildHeader(context, t),
            _buildNameRow(context, t),
            const SizedBox(height: 8),
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: AppColors.backgroundPrimary,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(0)),
                ),
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Balance card overlaps upward
                      Transform.translate(
                        offset: const Offset(0, -14),
                        child: _buildBalanceCard(context, t),
                      ),
                      Transform.translate(
                        offset: const Offset(0, -6),
                        child: _buildServicesCard(context, t),
                      ),
                      const SizedBox(height: 12),
                      _buildQuickToolsTitle(context, t),
                      _buildQuickTools(context, t),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------- Header (orange) ----------------
  Widget _buildHeader(BuildContext context, AppStrings t) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Menu button (white rounded square)
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.menu, color: Colors.white, size: 22),
          ),
          const SizedBox(width: 12),
          // Welcome text
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                t['welcomeOn'],
                style: const TextStyle(color: Colors.white70, fontSize: 12),
              ),
              const Text(
                'MyDan_thoss',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],
          ),
          const Spacer(),
          // Bell
          _headerIcon(Icons.notifications_none, onTap: () {}),
          const SizedBox(width: 6),
          // Phone
          _headerIcon(Icons.call, onTap: () {}),
          const SizedBox(width: 6),
          // Language pill
          GestureDetector(
            onTap: () => LanguageSelectorSheet.show(context),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
              decoration: BoxDecoration(
                color: AppColors.blueDark,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  Text(
                    context.tr.language.code,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.keyboard_arrow_down,
                      color: Colors.white, size: 16),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _headerIcon(IconData icon, {required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        width: 36,
        height: 36,
        child: Icon(icon, color: Colors.white, size: 24),
      ),
    );
  }

  // ---------------- Name row ----------------
  Widget _buildNameRow(BuildContext context, AppStrings t) {
    final profile = context.watch<UserProfileProvider>();
    final name = profile.hasProfile ? profile.displayName : t['myAccount'];
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          name.toUpperCase(),
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }

  // ---------------- Blue balance card ----------------
  Widget _buildBalanceCard(BuildContext context, AppStrings t) {
    final profile = context.watch<UserProfileProvider>();
    final phone = profile.hasProfile && profile.phone.isNotEmpty
        ? profile.phone
        : '+227 96 49 99 06';
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
      child: Stack(
        children: [
          // Decorative circles
          Positioned(
            right: -30,
            top: -30,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.07),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            right: 20,
            bottom: -40,
            child: Container(
              width: 90,
              height: 90,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.06),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Label + refresh
              Row(
                children: [
                  const Icon(Icons.account_balance_wallet_outlined,
                      color: Colors.white, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    t['mainBalance'],
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () {},
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.18),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.refresh,
                          color: Colors.white, size: 18),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              // Masked balance + eye
              Row(
                children: [
                  Text(
                    profile.balanceHidden ? '••••••••' : '12,480.75',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(width: 12),
                  GestureDetector(
                    onTap: () => profile.toggleBalance(),
                    child: Icon(
                      profile.balanceHidden
                          ? Icons.visibility_outlined
                          : Icons.visibility_off_outlined,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              // Phone + QR
              Row(
                children: [
                  Text(
                    phone,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () {},
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.18),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.qr_code_2,
                          color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ---------------- White services grid ----------------
  Widget _buildServicesCard(BuildContext context, AppStrings t) {
    final services = <_Service>[
      _Service(Icons.send, t['currencyConverter'], AppColors.pastelLavender,
          AppColors.accentBlue,
          () => _open(context, const CurrencyConverterScreen())),
      _Service(Icons.swap_horiz, t['aiStockScreener'], AppColors.pastelSky,
          AppColors.accentTeal, null),
      _Service(Icons.person_add_alt, t['navReferral'], AppColors.pastelPeach,
          AppColors.orangePrimary, null),
      _Service(Icons.savings_outlined, t['trackingEval'], AppColors.pastelPink,
          AppColors.accentPink, () => _open(context, const TrackingScreen())),
      _Service(Icons.insights, t['dataAnalysis'], AppColors.pastelMint,
          AppColors.successGreen,
          () => _open(context, const DataAnalysisScreen())),
      _Service(Icons.confirmation_number_outlined, t['valuationCalculator'],
          AppColors.pastelIndigo, AppColors.accentBlue, null),
      _Service(Icons.account_balance_outlined, t['financialReport'],
          AppColors.pastelMagenta, AppColors.accentPurple, null),
      _Service(Icons.language, t['capitalFlow'], AppColors.pastelOrange,
          AppColors.accentOrange, null),
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 18),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 4),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          childAspectRatio: 0.82,
          crossAxisSpacing: 4,
          mainAxisSpacing: 14,
        ),
        itemCount: services.length,
        itemBuilder: (context, i) => _buildServiceItem(context, services[i]),
      ),
    );
  }

  Widget _buildServiceItem(BuildContext context, _Service s) {
    return InkWell(
      onTap: s.onTap ?? () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(s.label),
            backgroundColor: AppColors.bluePrimary,
            duration: const Duration(seconds: 1),
          ),
        );
      },
      borderRadius: BorderRadius.circular(12),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: s.bg,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(s.icon, color: s.fg, size: 24),
          ),
          const SizedBox(height: 8),
          Text(
            s.label,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: AppColors.blueDark,
              fontSize: 10.5,
              height: 1.15,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // ---------------- Quick tools ----------------
  Widget _buildQuickToolsTitle(BuildContext context, AppStrings t) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(t['homeQuickTools'],
              style: Theme.of(context).textTheme.titleMedium),
          Text(
            t['seeAll'],
            style: const TextStyle(
              color: AppColors.bluePrimary,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickTools(BuildContext context, AppStrings t) {
    final items = <_Service>[
      _Service(Icons.currency_exchange, t['currencyConverter'],
          AppColors.pastelLavender, AppColors.accentBlue,
          () => _open(context, const CurrencyConverterScreen())),
      _Service(Icons.insights, t['dataAnalysis'], AppColors.pastelMint,
          AppColors.successGreen, () => _open(context, const DataAnalysisScreen())),
      _Service(Icons.track_changes, t['trackingEval'], AppColors.pastelSky,
          AppColors.accentTeal, () => _open(context, const TrackingScreen())),
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: items.map((s) {
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            decoration: BoxDecoration(
              color: AppColors.backgroundSecondary,
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: ListTile(
              onTap: s.onTap,
              leading: Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: s.bg,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(s.icon, color: s.fg, size: 20),
              ),
              title: Text(s.label,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  )),
              trailing: const Icon(Icons.chevron_right,
                  color: AppColors.textTertiary),
            ),
          );
        }).toList(),
      ),
    );
  }

  void _open(BuildContext context, Widget page) {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => page));
  }
}

class _Service {
  final IconData icon;
  final String label;
  final Color bg;
  final Color fg;
  final VoidCallback? onTap;
  _Service(this.icon, this.label, this.bg, this.fg, this.onTap);
}