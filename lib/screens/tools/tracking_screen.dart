import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../services/tracking_service.dart';
import '../../theme/app_colors.dart';

class TrackingScreen extends StatefulWidget {
  const TrackingScreen({super.key});

  @override
  State<TrackingScreen> createState() => _TrackingScreenState();
}

class _TrackingScreenState extends State<TrackingScreen> {
  final List<TrackingEntry> _history = TrackingService.sampleHistory();
  final EvaluationResult _eval =
      TrackingService.evaluate(TrackingService.sampleHistory());
  String _period = 'monthly';

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(title: Text(t['trackingTitle'])),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildRatingCard(t),
              const SizedBox(height: 20),
              _buildPeriodSelector(t),
              const SizedBox(height: 20),
              Text(t['performanceTracking'],
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              _buildLineChart(),
              const SizedBox(height: 20),
              Text(t['evaluation'], style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              _buildEvaluationGrid(t),
              const SizedBox(height: 20),
              Text(t['history'], style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              _buildHistory(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRatingCard(AppStrings t) {
    final e = _eval;
    final ratingLabel = e.rating >= 75
        ? t['excellent']
        : e.rating >= 50
            ? t['good']
            : e.rating >= 30
                ? t['average']
                : t['poor'];
    final ratingColor = e.rating >= 75
        ? AppColors.successGreen
        : e.rating >= 50
            ? AppColors.primaryGold
            : e.rating >= 30
                ? AppColors.accentOrange
                : AppColors.errorRed;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.bluePurpleGradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.accentBlue.withValues(alpha: 0.3),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          SizedBox(
            width: 96,
            height: 96,
            child: Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 96,
                  height: 96,
                  child: CircularProgressIndicator(
                    value: e.rating / 100,
                    strokeWidth: 8,
                    backgroundColor: Colors.white24,
                    valueColor: AlwaysStoppedAnimation<Color>(ratingColor),
                  ),
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      e.rating.toStringAsFixed(0),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text('/100',
                        style: const TextStyle(color: Colors.white70, fontSize: 11)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(t['rating'],
                    style: const TextStyle(color: Colors.white70, fontSize: 12)),
                const SizedBox(height: 4),
                Text(
                  ratingLabel,
                  style: TextStyle(
                    color: ratingColor,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(
                      e.outperforming ? Icons.arrow_upward : Icons.arrow_downward,
                      color: e.outperforming ? AppColors.successGreen : AppColors.errorRed,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        e.outperforming ? t['outperforming'] : t['underperforming'],
                        style: const TextStyle(color: Colors.white, fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodSelector(AppStrings t) {
    final options = [
      ['monthly', t['monthly']],
      ['quarterly', t['quarterly']],
      ['yearly', t['yearly']],
    ];
    return Row(
      children: options.map((o) {
        final selected = _period == o[0];
        return Expanded(
          child: GestureDetector(
            onTap: () => setState(() => _period = o[0]),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                color: selected
                    ? AppColors.primaryGold
                    : AppColors.backgroundTertiary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                o[1],
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: selected ? Colors.black : AppColors.textSecondary,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildLineChart() {
    final values = _history.map((e) => e.value).toList();
    final bench = _history.map((e) => e.benchmarkValue).toList();
    final all = [...values, ...bench];
    final minY = all.reduce((a, b) => a < b ? a : b);
    final maxY = all.reduce((a, b) => a > b ? a : b);
    final pad = (maxY - minY) * 0.1;

    return Container(
      height: 220,
      padding: const EdgeInsets.fromLTRB(8, 16, 16, 8),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: LineChart(
        LineChartData(
          minY: minY - pad,
          maxY: maxY + pad,
          gridData: FlGridData(
            show: true,
            drawVerticalLine: false,
            horizontalInterval: (maxY - minY) / 4,
            getDrawingHorizontalLine: (v) => const FlLine(
              color: AppColors.divider,
              strokeWidth: 1,
            ),
          ),
          titlesData: const FlTitlesData(show: false),
          borderData: FlBorderData(show: false),
          lineTouchData: const LineTouchData(enabled: true),
          lineBarsData: [
            LineChartBarData(
              spots: List.generate(values.length,
                  (i) => FlSpot(i.toDouble(), values[i])),
              isCurved: true,
              color: AppColors.primaryGold,
              barWidth: 3,
              dotData: const FlDotData(show: false),
            ),
            LineChartBarData(
              spots:
                  List.generate(bench.length, (i) => FlSpot(i.toDouble(), bench[i])),
              isCurved: true,
              color: AppColors.accentBlue,
              barWidth: 2,
              dashArray: [6, 4],
              dotData: const FlDotData(show: false),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEvaluationGrid(AppStrings t) {
    final e = _eval;
    final items = <List<Object>>[
      [t['totalReturn'], '+${e.totalReturn.toStringAsFixed(2)}%', e.totalReturn >= 0],
      [t['benchmark'], '+${e.benchmarkReturn.toStringAsFixed(2)}%', true],
      [t['vsBenchmark'], '${e.alpha >= 0 ? '+' : ''}${e.alpha.toStringAsFixed(2)}%', e.alpha >= 0],
      [t['winRate'], '${e.winRate.toStringAsFixed(1)}%', e.winRate >= 50],
      [t['sharpeRatio'], e.sharpe.toStringAsFixed(2), e.sharpe >= 1],
      [t['maxDrawdown'], '-${e.maxDrawdown.toStringAsFixed(2)}%', false],
      [t['volatility'], '${e.volatility.toStringAsFixed(2)}%', true],
      ['${e.wins}W / ${e.losses}L', '${e.wins}/${e.losses}', e.wins >= e.losses],
    ];
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 2.1,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: items.length,
      itemBuilder: (context, i) {
        final item = items[i];
        final positive = item[2] as bool;
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.backgroundTertiary,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                item[0] as String,
                style: const TextStyle(color: AppColors.textTertiary, fontSize: 11),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 6),
              Text(
                item[1] as String,
                style: TextStyle(
                  color: positive ? AppColors.upColor : AppColors.downColor,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHistory() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: List.generate(_history.length, (i) {
          final entry = _history[i];
          double change = 0;
          if (i > 0) {
            change = ((entry.value - _history[i - 1].value) /
                    _history[i - 1].value) *
                100;
          }
          final isUp = change >= 0;
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(entry.label,
                              style: Theme.of(context).textTheme.titleSmall),
                          Text(
                            '${entry.value.toStringAsFixed(0)}  •  ${entry.benchmarkValue.toStringAsFixed(0)}',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: isUp ? AppColors.upColor : AppColors.downColor,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '${isUp ? '+' : ''}${change.toStringAsFixed(2)}%',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              if (i != _history.length - 1)
                const Divider(height: 1, color: AppColors.divider),
            ],
          );
        }),
      ),
    );
  }
}