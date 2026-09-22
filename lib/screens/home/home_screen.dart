import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../l10n/app_strings.dart';
import '../../providers/user_profile_provider.dart';
import '../../theme/app_colors.dart';
import '../../widgets/language_selector.dart';
import '../../widgets/tool_catalog.dart';
import '../../widgets/tool_logo.dart';
import '../tools/currency_converter_screen.dart';
import '../tools/data_analysis_screen.dart';
import '../tools/tracking_screen.dart';
import '../tools/ai_stock_screener_screen.dart';
import '../tools/financial_report_screen.dart';
import '../tools/valuation_calculator_screen.dart';
import '../tools/capital_flow_screen.dart';
import '../product/product_screen.dart';
import '../settings/notifications_screen.dart';
import '../library/library_screen.dart';
import '../profile/profile_screen.dart';

/// Home screen — green mobile-money style:
/// green header + blue balance card + white services grid with tool logos.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.greenPrimary,
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
                color: AppColors.backgroundPrimary,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Transform.translate(
                        offset: const Offset(0, -14),
                        child: _buildSubscriptionCard(context, t),
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

  // ---------------- Header (green) ----------------
  Widget _buildHeader(BuildContext context, AppStrings t) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Menu button
          Semantics(
            button: true,
            label: 'Menu',
            child: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.menu, color: Colors.white, size: 22),
            ),
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
          // Quick access to profile (accessible to everyone)
          _headerIcon(context, Icons.notifications_none, 'Notifications', () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const NotificationsScreen()),
            );
          }),
          const SizedBox(width: 4),
          _headerIcon(context, Icons.support_agent, 'Support', () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const ProductScreen()),
            );
          }),
          const SizedBox(width: 4),
          _profileAvatar(context),
          const SizedBox(width: 6),
          // Language pill
          Semantics(
            button: true,
            label: 'Language, ${context.tr.language.label}',
            child: GestureDetector(
              onTap: () => LanguageSelectorSheet.show(context),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.22),
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
          ),
        ],
      ),
    );
  }

  Widget _headerIcon(
      BuildContext context, IconData icon, String label, VoidCallback onTap) {
    return Semantics(
      button: true,
      label: label,
      child: Tooltip(
        message: label,
        child: InkResponse(
          onTap: onTap,
          radius: 22,
          child: SizedBox(
            width: 36,
            height: 36,
            child: Icon(icon, color: Colors.white, size: 23),
          ),
        ),
      ),
    );
  }

  /// Accessible profile avatar shortcut — always visible on the home header.
  Widget _profileAvatar(BuildContext context) {
    final profile = context.watch<UserProfileProvider>();
    final initials = profile.hasProfile
        ? profile.displayName
            .split(' ')
            .take(2)
            .map((e) => e.isNotEmpty ? e[0] : '')
            .join()
        : '';
    return Semantics(
      button: true,
      label: profile.hasProfile
          ? 'Profile, ${profile.name}'
          : 'Create your profile',
      child: GestureDetector(
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => const _ProfileShortcutPage()),
        ),
        child: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.25),
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white.withValues(alpha: 0.6)),
          ),
          child: Center(
            child: profile.hasProfile
                ? Text(
                    initials,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  )
                : const Icon(Icons.person_add_alt_1,
                    color: Colors.white, size: 18),
          ),
        ),
      ),
    );
  }

  // ---------------- Name row ----------------
  Widget _buildNameRow(BuildContext context, AppStrings t) {
    final profile = context.watch<UserProfileProvider>();
    final name = profile.hasProfile ? profile.displayName : t['myAccount'];
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: Row(
        children: [
          Expanded(
            child: Semantics(
              label: 'Account holder, $name',
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
          ),
          if (!profile.hasProfile)
            TextButton(
              onPressed: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const _ProfileShortcutPage()),
              ),
              style: TextButton.styleFrom(foregroundColor: Colors.white),
              child: Text(t['createProfile'],
                  style: const TextStyle(fontSize: 12)),
            ),
        ],
      ),
    );
  }

  // ---------------- Subscription (Pro) card ----------------
  Widget _buildSubscriptionCard(BuildContext context, AppStrings t) {
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
              Row(
                children: [
                  const Icon(Icons.workspace_premium,
                      color: Colors.white, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    t['subTitle'],
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.22),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      t['subPro'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Semantics(
                    label: '${t['subPro']} — \$19 ${t['subPerMonth']}',
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text(
                          '\$19',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 30,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Padding(
                          padding: const EdgeInsets.only(bottom: 6),
                          child: Text(
                            t['subPerMonth'],
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: AppColors.pastelGreen,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      t['subSave'],
                      style: const TextStyle(
                        color: AppColors.greenDark,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                t['subProAvg'],
                style: const TextStyle(color: Colors.white70, fontSize: 12),
              ),
              const SizedBox(height: 16),
              // Feature bullets
              Wrap(
                spacing: 14,
                runSpacing: 6,
                children: [
                  _subFeature(Icons.check_circle, t['productModels']),
                  _subFeature(Icons.check_circle, t['aiStockScreener']),
                  _subFeature(Icons.check_circle, t['valuationCalculator']),
                ],
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: Semantics(
                  button: true,
                  label: '${t['subSubscribe']} ${t['subPro']}',
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const ProductScreen()),
                    ),
                    icon: const Icon(Icons.arrow_forward, size: 18),
                    label: Text(t['subSubscribe']),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: AppColors.bluePrimary,
                      minimumSize: const Size(double.infinity, 46),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _subFeature(IconData icon, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: Colors.white, size: 14),
        const SizedBox(width: 5),
        Text(
          label,
          style: const TextStyle(color: Colors.white, fontSize: 11.5),
        ),
      ],
    );
  }

  // ---------------- White services grid ----------------
  Widget _buildServicesCard(BuildContext context, AppStrings t) {
    final tools = ToolCatalog.all(context);

    // Landing pages for tools that have a dedicated screen.
    final screens = <String, Widget>{
      'currencyConverter': const CurrencyConverterScreen(),
      'dataAnalysis': const DataAnalysisScreen(),
      'trackingEval': const TrackingScreen(),
      'aiStockScreener': const AiStockScreenerScreen(),
      'financialReport': const FinancialReportScreen(),
      'valuationCalculator': const ValuationCalculatorScreen(),
      'capitalFlow': const CapitalFlowScreen(),
      'productCatalog': const ProductScreen(),
      'library': const LibraryScreen(),
    };

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
          childAspectRatio: 0.80,
          crossAxisSpacing: 4,
          mainAxisSpacing: 16,
        ),
        itemCount: tools.length,
        itemBuilder: (context, i) {
          final tool = tools[i];
          // Shorten long titles gracefully for the compact label.
          return _buildServiceItem(
            context,
            tool,
            onTap: () => _openTool(context, tool, i, screens),
          );
        },
      ),
    );
  }

  void _openTool(
    BuildContext context,
    ToolDef tool,
    int index,
    Map<String, Widget> screens,
  ) {
    final page = screens[tool.key];
    if (page != null) {
      Navigator.of(context).push(MaterialPageRoute(builder: (_) => page));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(tool.title),
          backgroundColor: AppColors.greenPrimary,
          duration: const Duration(seconds: 1),
        ),
      );
    }
  }

  Widget _buildServiceItem(
    BuildContext context,
    ToolDef tool, {
    required VoidCallback onTap,
  }) {
    return Semantics(
      button: true,
      label: tool.title,
      hint: tool.description,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            ToolLogoImage(
              asset: tool.logoAsset,
              remoteUrl: ToolLogos.remoteReferences[tool.key],
              fallbackIcon: tool.icon,
              gradient: tool.gradient,
              semanticLabel: tool.title,
              size: 52,
            ),
            const SizedBox(height: 8),
            Text(
              _shortLabel(tool.title),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: AppColors.greenDark,
                fontSize: 10.5,
                height: 1.15,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _shortLabel(String label) {
    if (label.length <= 16) return label;
    final words = label.split(' ');
    if (words.length <= 2) return label;
    return '${words[0]} ${words[1]}';
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
              color: AppColors.greenPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickTools(BuildContext context, AppStrings t) {
    final items = <List<Object>>[
      [
        Icons.currency_exchange,
        AppColors.toolGreen,
        ToolLogos.currency,
        t['currencyConverter'],
        const CurrencyConverterScreen(),
        'currency',
      ],
      [
        Icons.insights,
        AppColors.toolTeal,
        ToolLogos.data,
        t['dataAnalysis'],
        const DataAnalysisScreen(),
        'data',
      ],
      [
        Icons.track_changes,
        AppColors.toolViolet,
        ToolLogos.tracking,
        t['trackingEval'],
        const TrackingScreen(),
        'tracking',
      ],
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: items.map((s) {
          final title = s[3] as String;
          final page = s[4] as Widget;
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
            child: Semantics(
              button: true,
              label: title,
              child: ListTile(
                onTap: () => Navigator.of(context)
                    .push(MaterialPageRoute(builder: (_) => page)),
                leading: ToolLogoImage(
                  asset: s[2] as String,
                  remoteUrl: ToolLogos.remoteReferences[s[5]],
                  fallbackIcon: s[0] as IconData,
                  gradient: s[1] as Gradient,
                  semanticLabel: title,
                  size: 44,
                ),
                title: Text(title,
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    )),
                trailing: const Icon(Icons.chevron_right,
                    color: AppColors.textTertiary),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

/// Lightweight shortcut that deep-links into the Profile screen.
class _ProfileShortcutPage extends StatelessWidget {
  const _ProfileShortcutPage();

  @override
  Widget build(BuildContext context) {
    return const ProfileScreen();
  }
}
