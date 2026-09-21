import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../l10n/app_strings.dart';
import '../services/action_plan_service.dart';
import '../theme/app_colors.dart';

/// A stock price chart paired with a concrete, executable **action plan**
/// (entry, target, stop-loss, reward/risk) — used everywhere a tool needs to
/// "show an example plan".
///
/// Rendering is fully accessible: the chart exposes a [Semantics] label that
/// summarises the plan, so screen-reader users get the information too.
class StockActionPlanCard extends StatelessWidget {
  final ActionPlan plan;

  /// Compact mode = smaller chart + no rationale bullets (for carousels).
  final bool compact;

  const StockActionPlanCard({
    super.key,
    required this.plan,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    final t = context.tr;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 12,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(context, t),
          if (!compact) ...[
            const SizedBox(height: 4),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Semantics(
                image: true,
                label: '${plan.company} ${t['apPriceChart']}: '
                    '${plan.price}, ${t['apTarget']} ${plan.target}',
                child: _buildChart(),
              ),
            ),
          ],
          const SizedBox(height: 12),
          _buildPlanGrid(context, t),
        ],
      ),
    );
  }

  // ---------------- Header ----------------
  Widget _buildHeader(BuildContext context, AppStrings t) {
    final signalColor = _signalColor(plan.signal);
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              gradient: AppColors.toolBlue,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              plan.symbol.substring(0, 2),
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${plan.symbol} · ${plan.market}',
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14.5,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  plan.company,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 11.5,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                plan.price.toStringAsFixed(2),
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 2),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: signalColor.withValues(alpha: 0.14),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '${t['apSignal']}: ${t[_signalKey(plan.signal)]}',
                  style: TextStyle(
                    color: signalColor,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ---------------- Chart ----------------
  Widget _buildChart() {
    final pts = plan.history;
    final minY = ([...pts, plan.stopLoss].reduce((a, b) => a < b ? a : b));
    final maxY = ([...pts, plan.target].reduce((a, b) => a > b ? a : b));
    final pad = (maxY - minY) * 0.08;

    return SizedBox(
      height: 130,
      child: LineChart(
        LineChartData(
          minY: minY - pad,
          maxY: maxY + pad,
          gridData: const FlGridData(show: false),
          titlesData: const FlTitlesData(show: false),
          borderData: FlBorderData(show: false),
          lineTouchData: const LineTouchData(enabled: false),
          extraLinesData: ExtraLinesData(
            horizontalLines: [
              // Target line (green)
              HorizontalLine(
                y: plan.target,
                color: AppColors.upColor.withValues(alpha: 0.6),
                strokeWidth: 1,
                dashArray: [5, 4],
                label: HorizontalLineLabel(
                  show: true,
                  alignment: Alignment.topRight,
                  style: const TextStyle(
                    color: AppColors.upColor,
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                  ),
                  labelResolver: (_) => 'T',
                ),
              ),
              // Entry line (blue)
              HorizontalLine(
                y: plan.entry,
                color: AppColors.blueLight.withValues(alpha: 0.7),
                strokeWidth: 1,
                dashArray: [5, 4],
                label: HorizontalLineLabel(
                  show: true,
                  alignment: Alignment.topLeft,
                  style: const TextStyle(
                    color: AppColors.bluePrimary,
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                  ),
                  labelResolver: (_) => 'E',
                ),
              ),
              // Stop loss line (red)
              HorizontalLine(
                y: plan.stopLoss,
                color: AppColors.downColor.withValues(alpha: 0.6),
                strokeWidth: 1,
                dashArray: [5, 4],
                label: HorizontalLineLabel(
                  show: true,
                  alignment: Alignment.bottomRight,
                  style: const TextStyle(
                    color: AppColors.downColor,
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                  ),
                  labelResolver: (_) => 'SL',
                ),
              ),
            ],
          ),
          lineBarsData: [
            LineChartBarData(
              spots: List.generate(
                pts.length,
                (i) => FlSpot(i.toDouble(), pts[i]),
              ),
              isCurved: true,
              color: AppColors.greenPrimary,
              barWidth: 3,
              dotData: const FlDotData(show: false),
              belowBarData: BarAreaData(
                show: true,
                gradient: LinearGradient(
                  colors: [
                    AppColors.greenPrimary.withValues(alpha: 0.28),
                    AppColors.greenPrimary.withValues(alpha: 0.0),
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------- Plan grid ----------------
  Widget _buildPlanGrid(BuildContext context, AppStrings t) {
    final items = <List<Object>>[
      [t['apEntry'], plan.entry.toStringAsFixed(2), AppColors.bluePrimary],
      [t['apTarget'], plan.target.toStringAsFixed(2), AppColors.upColor],
      [t['apStopLoss'], plan.stopLoss.toStringAsFixed(2), AppColors.downColor],
      [
        t['apUpside'],
        '+${plan.upside.toStringAsFixed(1)}%',
        AppColors.upColor
      ],
      [
        t['apDownside'],
        '-${plan.downside.toStringAsFixed(1)}%',
        AppColors.downColor
      ],
      [
        t['apRewardRisk'],
        '${plan.rewardRisk.toStringAsFixed(2)} : 1',
        AppColors.textPrimary
      ],
      [t['apHorizon'], t[_horizonKey(plan.horizon)], AppColors.textPrimary],
      [t['apRisk'], t[_riskKey(plan.risk)], _riskColor(plan.risk)],
      [t['apScore'], '${plan.score}/100', AppColors.greenPrimary],
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 0, 12, 14),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: items.map((it) {
          final color = it[2] as Color;
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
            decoration: BoxDecoration(
              color: AppColors.backgroundElevated,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.borderPrimary),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  it[0] as String,
                  style: const TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 9.5,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  it[1] as String,
                  style: TextStyle(
                    color: color,
                    fontSize: 12.5,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  // ---------------- Helpers ----------------
  String _signalKey(String s) => switch (s) {
        'buy' => 'apBuy',
        'sell' => 'apSell',
        _ => 'apHold',
      };

  String _riskKey(String r) => switch (r) {
        'low' => 'apLow',
        'high' => 'apHigh',
        _ => 'apMedium',
      };

  String _horizonKey(String h) => switch (h) {
        'short' => 'apShort',
        'long' => 'apLong',
        _ => 'apMediumTerm',
      };

  Color _signalColor(String s) => switch (s) {
        'buy' => AppColors.upColor,
        'sell' => AppColors.downColor,
        _ => AppColors.warningYellow,
      };

  Color _riskColor(String r) => switch (r) {
        'low' => AppColors.upColor,
        'high' => AppColors.downColor,
        _ => AppColors.warningYellow,
      };
}
