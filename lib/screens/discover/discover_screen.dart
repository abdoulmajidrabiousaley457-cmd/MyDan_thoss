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
      appBar: AppBar(
        title: Text(t['aiTools']),
      ),
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
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const CurrencyConverterScreen(),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.insights,
                  title: t['dataAnalysis'],
                  description: t['dataAnalysisDesc'],
                  color: AppColors.accentPurple,
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const DataAnalysisScreen(),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.track_changes,
                  title: t['trackingEval'],
                  description: t['trackingEvalDesc'],
                  color: AppColors.accentTeal,
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const TrackingScreen(),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.auto_awesome,
                  title: t['aiStockScreener'],
                  description: t['aiStockScreenerDesc'],
                  color: AppColors.accentBlue,
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.analytics_outlined,
                  title: t['financialReport'],
                  description: t['financialReportDesc'],
                  color: AppColors.accentPurple,
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.calculate_outlined,
                  title: t['valuationCalculator'],
                  description: t['valuationCalculatorDesc'],
                  color: AppColors.primaryGold,
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.trending_up,
                  title: t['capitalFlow'],
                  description: t['capitalFlowDesc'],
                  color: AppColors.accentTeal,
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
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.backgroundTertiary,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: color.withValues(alpha: 0.3),
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: color,
                size: 32,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: AppColors.textTertiary,
            ),
          ],
        ),
      ),
    );
  }
}