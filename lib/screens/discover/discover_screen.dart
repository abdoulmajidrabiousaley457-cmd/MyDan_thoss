import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';
import '../tools/currency_converter_screen.dart';
import '../tools/data_analysis_screen.dart';
import '../tools/tracking_screen.dart';

class DiscoverScreen extends StatelessWidget {
  const DiscoverScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(title: Text(t['aiTools'])),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildToolCard(
                  context,
                  icon: Icons.currency_exchange,
                  title: t['currencyConverter'],
                  description: t['currencyConverterDesc'],
                  color: AppColors.primaryGold,
                  onOpen: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const CurrencyConverterScreen(),
                    ),
                  ),
                  options: [
                    _Option(t['convConvert'], t['convConvertDesc'],
                        Icons.swap_horiz, AppColors.primaryGold),
                    _Option(t['convRates'], t['convRatesDesc'],
                        Icons.table_chart_outlined, AppColors.accentBlue),
                    _Option(t['convMulti'], t['convMultiDesc'],
                        Icons.star_border, AppColors.accentPurple),
                    _Option(t['convHistory'], t['convHistoryDesc'],
                        Icons.show_chart, AppColors.accentTeal),
                  ],
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.insights,
                  title: t['dataAnalysis'],
                  description: t['dataAnalysisDesc'],
                  color: AppColors.accentPurple,
                  onOpen: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const DataAnalysisScreen(),
                    ),
                  ),
                  options: [
                    _Option(t['daStats'], t['daStatsDesc'], Icons.calculate,
                        AppColors.accentPurple),
                    _Option(t['daTrend'], t['daTrendDesc'],
                        Icons.trending_up, AppColors.upColor),
                    _Option(t['daOutliers'], t['daOutliersDesc'],
                        Icons.warning_amber_outlined, AppColors.accentOrange),
                    _Option(t['daDist'], t['daDistDesc'],
                        Icons.bar_chart_outlined, AppColors.accentBlue),
                  ],
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.track_changes,
                  title: t['trackingEval'],
                  description: t['trackingEvalDesc'],
                  color: AppColors.accentTeal,
                  onOpen: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const TrackingScreen(),
                    ),
                  ),
                  options: [
                    _Option(t['trPerf'], t['trPerfDesc'], Icons.speed,
                        AppColors.accentTeal),
                    _Option(t['trEval'], t['trEvalDesc'],
                        Icons.workspace_premium_outlined, AppColors.primaryGold),
                    _Option(t['trBench'], t['trBenchDesc'],
                        Icons.compare_arrows, AppColors.accentBlue),
                    _Option(t['trHist'], t['trHistDesc'],
                        Icons.history, AppColors.accentPurple),
                  ],
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.auto_awesome,
                  title: t['aiStockScreener'],
                  description: t['aiStockScreenerDesc'],
                  color: AppColors.accentBlue,
                  options: [
                    _Option(t['scrValue'], t['scrValueDesc'],
                        Icons.price_check, AppColors.primaryGold),
                    _Option(t['scrGrowth'], t['scrGrowthDesc'],
                        Icons.rocket_launch_outlined, AppColors.accentBlue),
                    _Option(t['scrDividend'], t['scrDividendDesc'],
                        Icons.savings_outlined, AppColors.successGreen),
                    _Option(t['scrAI'], t['scrAIDesc'],
                        Icons.auto_awesome, AppColors.accentPurple),
                  ],
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.analytics_outlined,
                  title: t['financialReport'],
                  description: t['financialReportDesc'],
                  color: AppColors.accentPurple,
                  options: [
                    _Option(t['frIncome'], t['frIncomeDesc'],
                        Icons.receipt_long_outlined, AppColors.accentPurple),
                    _Option(t['frBalance'], t['frBalanceDesc'],
                        Icons.balance, AppColors.accentBlue),
                    _Option(t['frCash'], t['frCashDesc'],
                        Icons.waterfall_chart, AppColors.accentTeal),
                    _Option(t['frRatios'], t['frRatiosDesc'],
                        Icons.percent, AppColors.accentOrange),
                  ],
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.calculate_outlined,
                  title: t['valuationCalculator'],
                  description: t['valuationCalculatorDesc'],
                  color: AppColors.primaryGold,
                  options: [
                    _Option(t['valDCF'], t['valDCFDesc'],
                        Icons.account_balance_wallet_outlined, AppColors.primaryGold),
                    _Option(t['valPE'], t['valPEDesc'],
                        Icons.attach_money, AppColors.accentBlue),
                    _Option(t['valPB'], t['valPBDesc'],
                        Icons.menu_book_outlined, AppColors.accentPurple),
                    _Option(t['valDivi'], t['valDiviDesc'],
                        Icons.card_giftcard, AppColors.successGreen),
                  ],
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.trending_up,
                  title: t['capitalFlow'],
                  description: t['capitalFlowDesc'],
                  color: AppColors.accentTeal,
                  options: [
                    _Option(t['cfInst'], t['cfInstDesc'],
                        Icons.account_balance, AppColors.accentBlue),
                    _Option(t['cfSmart'], t['cfSmartDesc'],
                        Icons.psychology_outlined, AppColors.accentPurple),
                    _Option(t['cfSector'], t['cfSectorDesc'],
                        Icons.donut_large, AppColors.accentOrange),
                    _Option(t['cfNorth'], t['cfNorthDesc'],
                        Icons.north_east, AppColors.accentTeal),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildToolCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String description,
    required Color color,
    required List<_Option> options,
    VoidCallback? onOpen,
  }) {
    final t = context.tr;
    return Container(
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      clipBehavior: Clip.antiAlias,
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          childrenPadding: const EdgeInsets.only(bottom: 8),
          iconColor: color,
          collapsedIconColor: AppColors.textTertiary,
          leading: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          title: Text(title, style: Theme.of(context).textTheme.titleMedium),
          subtitle: Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(
              description,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
              child: Row(
                children: [
                  Text(
                    t['toolOptions'],
                    style: const TextStyle(
                      color: AppColors.primaryGold,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(height: 1, color: AppColors.divider),
                  ),
                ],
              ),
            ),
            ...options.map((o) => _buildOptionTile(o)),
            if (onOpen != null)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                child: ElevatedButton.icon(
                  onPressed: onOpen,
                  icon: const Icon(Icons.open_in_new, size: 16),
                  label: Text(t['exploreFeatures']),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: color,
                    foregroundColor: Colors.black,
                    minimumSize: const Size(double.infinity, 44),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildOptionTile(_Option o) {
    return ListTile(
      dense: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: o.color.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(9),
        ),
        child: Icon(o.icon, color: o.color, size: 18),
      ),
      title: Text(
        o.title,
        style: const TextStyle(
          color: AppColors.textPrimary,
          fontSize: 13.5,
          fontWeight: FontWeight.w600,
        ),
      ),
      subtitle: Text(
        o.description,
        style: const TextStyle(color: AppColors.textTertiary, fontSize: 11.5),
      ),
      trailing: const Icon(
        Icons.chevron_right,
        color: AppColors.textTertiary,
        size: 18,
      ),
    );
  }
}

class _Option {
  final String title;
  final String description;
  final IconData icon;
  final Color color;

  _Option(this.title, this.description, this.icon, this.color);
}
