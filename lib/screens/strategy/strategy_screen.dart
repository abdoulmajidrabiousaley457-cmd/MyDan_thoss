import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class StrategyScreen extends StatelessWidget {
  const StrategyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: const Text('Strategy Backtest'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Create Strategy Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: AppColors.goldGradient,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(
                        Icons.add_circle_outline,
                        color: Colors.black,
                        size: 32,
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Create New Strategy',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Build and backtest your investment strategy',
                        style: TextStyle(
                          color: Colors.black.withValues(alpha: 0.7),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 24),
                
                Text(
                  'Popular Strategies',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                
                const SizedBox(height: 16),
                
                _buildStrategyCard(
                  context,
                  name: 'Value Investing',
                  description: 'Buy undervalued stocks based on fundamentals',
                  returnRate: '+45.2%',
                  sharpe: '1.85',
                  drawdown: '-12.3%',
                ),
                
                const SizedBox(height: 12),
                
                _buildStrategyCard(
                  context,
                  name: 'Momentum Trading',
                  description: 'Follow market trends and momentum signals',
                  returnRate: '+38.7%',
                  sharpe: '1.62',
                  drawdown: '-18.5%',
                ),
                
                const SizedBox(height: 12),
                
                _buildStrategyCard(
                  context,
                  name: 'Mean Reversion',
                  description: 'Profit from price deviations from average',
                  returnRate: '+28.3%',
                  sharpe: '1.43',
                  drawdown: '-15.7%',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStrategyCard(
    BuildContext context, {
    required String name,
    required String description,
    required String returnRate,
    required String sharpe,
    required String drawdown,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
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
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.successGreen.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  returnRate,
                  style: const TextStyle(
                    color: AppColors.successGreen,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildMetric('Sharpe', sharpe),
              const SizedBox(width: 24),
              _buildMetric('Max Drawdown', drawdown),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetric(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textTertiary,
            fontSize: 11,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
