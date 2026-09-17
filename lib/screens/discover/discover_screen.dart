import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class DiscoverScreen extends StatelessWidget {
  const DiscoverScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: const Text('AI Tools'),
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
                  icon: Icons.auto_awesome,
                  title: 'AI Stock Screener',
                  description: 'Intelligent stock selection with AI-powered analysis',
                  color: AppColors.accentBlue,
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.analytics_outlined,
                  title: 'Financial Report Analysis',
                  description: 'AI-driven insights from company financials',
                  color: AppColors.accentPurple,
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.calculate_outlined,
                  title: 'Valuation Calculator',
                  description: 'DCF, PE, PB valuation models',
                  color: AppColors.primaryGold,
                ),
                const SizedBox(height: 16),
                _buildToolCard(
                  context,
                  icon: Icons.trending_up,
                  title: 'Capital Flow Tracker',
                  description: 'Track institutional and smart money movements',
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
  }) {
    return Container(
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
    );
  }
}
