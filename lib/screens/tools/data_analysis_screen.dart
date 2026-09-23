import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../services/action_plan_service.dart';
import '../../services/data_analysis_service.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/stock_action_plan_card.dart';
import '../../widgets/tool_logo.dart';

class DataAnalysisScreen extends StatefulWidget {
  const DataAnalysisScreen({super.key});

  @override
  State<DataAnalysisScreen> createState() => _DataAnalysisScreenState();
}

class _DataAnalysisScreenState extends State<DataAnalysisScreen> {
  final TextEditingController _controller = TextEditingController();
  DataStatistics? _stats;
  bool _error = false;

  @override
  void initState() {
    super.initState();
    _controller.text = DataAnalysisService.sampleData.join(', ');
    _analyze();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _analyze() {
    final data = DataAnalysisService.parse(_controller.text);
    setState(() {
      _error = data.isEmpty;
      _stats = data.isEmpty ? null : DataAnalysisService.analyze(data);
    });
  }

  void _loadSample() {
    _controller.text = DataAnalysisService.sampleData.join(', ');
    _analyze();
  }

  String get _trendKey {
    if (_stats == null) return 'trendFlat';
    final s = _stats!.trendStrength;
    if (s > 0.15) return 'trendUp';
    if (s < -0.15) return 'trendDown';
    return 'trendFlat';
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: AppBarTitle(
          t['dataAnalysisTitle'],
          logoAsset: ToolLogos.data,
          logoFallbackIcon: Icons.insights,
          logoGradient: AppColors.toolTeal,
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildInputCard(t),
              const SizedBox(height: 14),
              _buildPresets(t),
              const SizedBox(height: 20),
              if (_error)
                _buildError(t)
              else if (_stats != null) ...[
                _buildTrendCard(t),
                const SizedBox(height: 20),
                Text(
                  t['metrics'],
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 12),
                _buildMetricsGrid(t),
                const SizedBox(height: 20),
                Text(
                  t['distribution'],
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 12),
                _buildHistogram(),
                if (_stats!.outliers.isNotEmpty) ...[
                  const SizedBox(height: 20),
                  Text(
                    t['anomalies'],
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),
                  _buildOutliers(),
                ],
                const SizedBox(height: 24),
                Text(
                  t['apExamplePlans'],
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 12),
                StockActionPlanCard(plan: ActionPlanService.plans[1]),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputCard(AppStrings t) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(t['enterData'], style: Theme.of(context).textTheme.titleSmall),
          const SizedBox(height: 10),
          TextField(
            controller: _controller,
            maxLines: 3,
            keyboardType: TextInputType.multiline,
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
            decoration: const InputDecoration(
              hintText: '120, 125, 118, 130 ...',
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _analyze,
                  icon: const Icon(Icons.analytics, size: 18),
                  label: Text(t['analyze']),
                ),
              ),
              const SizedBox(width: 10),
              OutlinedButton(
                onPressed: _loadSample,
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.primaryGold,
                  side: const BorderSide(color: AppColors.primaryGold),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 14,
                  ),
                ),
                child: const Icon(Icons.refresh, size: 18),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPresets(AppStrings t) {
    final presets = <String, List<double>>{
      t['trPerf']: const [120, 125, 118, 130, 128, 135, 140, 138, 145, 150],
      t['daTrend']: const [50, 55, 62, 70, 79, 89, 100, 112, 125, 139],
      t['daDist']: const [100, 100, 100, 100, 200, 100, 100, 50, 100, 100],
      t['apPriceChart']: const [
        210.5,
        218.2,
        214.9,
        222.6,
        229.1,
        225.4,
        233.8,
      ],
    };
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          t['exampleTemplates'],
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: presets.entries.map((e) {
            return ActionChip(
              avatar: const Icon(
                Icons.auto_awesome,
                size: 15,
                color: AppColors.greenPrimary,
              ),
              label: Text(e.key, style: const TextStyle(fontSize: 12)),
              backgroundColor: AppColors.backgroundSecondary,
              side: const BorderSide(color: AppColors.borderPrimary),
              onPressed: () {
                _controller.text = e.value.join(', ');
                _analyze();
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildError(AppStrings t) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.errorRed.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.errorRed.withValues(alpha: 0.4)),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: AppColors.errorRed),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              t['invalidData'],
              style: const TextStyle(color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrendCard(AppStrings t) {
    final s = _stats!;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.bluePurpleGradient,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                t['trend'],
                style: const TextStyle(color: Colors.white70, fontSize: 13),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Icon(
                      s.trendStrength > 0.15
                          ? Icons.trending_up
                          : s.trendStrength < -0.15
                          ? Icons.trending_down
                          : Icons.trending_flat,
                      color: Colors.white,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      t[_trendKey],
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            s.mean.toStringAsFixed(2),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 34,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${t['mean']} • ${s.count} ${t['count']}',
            style: const TextStyle(color: Colors.white70, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricsGrid(AppStrings t) {
    final s = _stats!;
    final items = <List<String>>[
      [t['mean'], s.mean.toStringAsFixed(2), 'mean'],
      [t['median'], s.median.toStringAsFixed(2), 'median'],
      [t['stdDev'], s.stdDev.toStringAsFixed(2), 'stdDev'],
      [t['variance'], s.variance.toStringAsFixed(2), 'variance'],
      [t['min'], s.min.toStringAsFixed(2), 'min'],
      [t['max'], s.max.toStringAsFixed(2), 'max'],
      [t['range'], s.range.toStringAsFixed(2), 'range'],
      [t['sum'], s.sum.toStringAsFixed(2), 'sum'],
      [t['count'], s.count.toString(), 'count'],
    ];
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 1.35,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: items.length,
      itemBuilder: (context, i) {
        final item = items[i];
        return Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.backgroundTertiary,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                item[0],
                style: const TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 11,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 6),
              Text(
                item[1],
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 15,
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

  Widget _buildHistogram() {
    final s = _stats!;
    final data = s.data;
    if (data.isEmpty) return const SizedBox.shrink();
    final minV = s.min;
    final maxV = s.max;
    final bins = 6;
    final binWidth = (maxV - minV) / bins;
    final counts = List<int>.filled(bins, 0);
    for (final v in data) {
      var idx = binWidth == 0 ? 0 : ((v - minV) / binWidth).floor();
      if (idx >= bins) idx = bins - 1;
      if (idx < 0) idx = 0;
      counts[idx]++;
    }
    final maxCount = counts.reduce((a, b) => a > b ? a : b);

    return Container(
      height: 160,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: BarChart(
        BarChartData(
          alignment: BarChartAlignment.spaceAround,
          borderData: FlBorderData(show: false),
          gridData: const FlGridData(show: false),
          titlesData: const FlTitlesData(show: false),
          barTouchData: BarTouchData(enabled: true),
          maxY: (maxCount + 1).toDouble(),
          barGroups: List.generate(bins, (i) {
            return BarChartGroupData(
              x: i,
              barRods: [
                BarChartRodData(
                  toY: counts[i].toDouble(),
                  color: AppColors.primaryGold,
                  width: 16,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(4),
                  ),
                ),
              ],
            );
          }),
        ),
      ),
    );
  }

  Widget _buildOutliers() {
    final s = _stats!;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.accentOrange.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.accentOrange.withValues(alpha: 0.4),
        ),
      ),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: s.outliers.map((v) {
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.accentOrange.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              v.toStringAsFixed(2),
              style: const TextStyle(
                color: AppColors.accentOrange,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
