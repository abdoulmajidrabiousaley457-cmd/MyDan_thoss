import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/project_case_study_card.dart';
import '../../widgets/tool_logo.dart';

/// A capital-flow row: sector with its net inflow/outflow ($B).
class _Flow {
  final String name;
  final String icon;
  final double net; // + inflow, - outflow ($B)
  final double change; // % change vs previous period
  const _Flow(this.name, this.icon, this.net, this.change);
}

/// Capital Flow Tracker — institutional / smart-money flows, sector heatmap
/// and a worked "realised project" example.
class CapitalFlowScreen extends StatefulWidget {
  const CapitalFlowScreen({super.key});

  @override
  State<CapitalFlowScreen> createState() => _CapitalFlowScreenState();
}

class _CapitalFlowScreenState extends State<CapitalFlowScreen> {
  String _period = 'week';

  static const List<_Flow> _sectors = [
    _Flow('Technology', '💻', 8.42, 2.1),
    _Flow('Semiconductors', '🔌', 5.18, 4.7),
    _Flow('Healthcare', '💊', 3.06, 1.3),
    _Flow('Financials', '🏦', 2.34, 0.9),
    _Flow('Energy', '⛽', -1.24, -0.8),
    _Flow('Consumer Staples', '🛒', 0.85, 0.4),
    _Flow('Utilities', '🔋', -0.62, -0.3),
    _Flow('Real Estate', '🏢', -2.18, -1.6),
  ];

  // Institutional vs retail vs smart-money flows (per period)
  Map<String, double> get _summary => switch (_period) {
    'month' => {'inst': 42.6, 'smart': 28.1, 'retail': -12.4},
    'quarter' => {'inst': 128.3, 'smart': 86.5, 'retail': -34.7},
    _ => {'inst': 14.8, 'smart': 9.3, 'retail': -4.1},
  };

  @override
  Widget build(BuildContext context) {
    final t = context.tr;

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: AppBarTitle(
          t['capitalFlow'],
          logoAsset: ToolLogos.flow,
          logoFallbackIcon: Icons.trending_up,
          logoGradient: AppColors.toolAmber,
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildPeriodSelector(context, t),
              const SizedBox(height: 16),
              _buildSummary(context, t),
              const SizedBox(height: 20),
              Text(
                t['cfSectorHeatmap'],
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),
              _buildHeatmap(context, t),
              const SizedBox(height: 20),
              Text(
                t['cfSectorDetail'],
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),
              _buildSectorList(context, t),
              const SizedBox(height: 24),
              Text(
                t['pcExample'],
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),
              const ProjectCaseStudyCard(study: _caseStudy),
            ],
          ),
        ),
      ),
    );
  }

  static const ProjectCaseStudy _caseStudy = ProjectCaseStudy(
    client: 'Hedge Fund — London',
    sector: 'Quantitative Trading',
    challenge:
        'The macro desk could not see where institutional capital was rotating '
        'in real time, missing early sector moves.',
    solution:
        'We built a capital-flow tracker aggregating institutional, smart-money '
        'and retail flows into a live sector heatmap with alerts.',
    result:
        'The desk caught the semiconductor rotation 6 days early, capturing a '
        '+11.3% sector move with a Sharpe ratio of 1.9.',
    metrics: [
      ['Early entry', '6 days'],
      ['Sector gain', '+11.3%'],
      ['Sharpe', '1.9'],
      ['Coverage', '11 sectors'],
    ],
    color: AppColors.accentOrange,
    icon: Icons.waterfall_chart,
  );

  Widget _buildPeriodSelector(BuildContext context, AppStrings t) {
    final options = [
      ['week', t['cfWeek']],
      ['month', t['monthly']],
      ['quarter', t['quarterly']],
    ];
    return Row(
      children: options.map((o) {
        final selected = _period == o[0];
        return Expanded(
          child: GestureDetector(
            onTap: () => setState(() => _period = o[0]),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.symmetric(vertical: 11),
              decoration: BoxDecoration(
                color: selected
                    ? AppColors.accentOrange
                    : AppColors.backgroundSecondary,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: selected
                      ? AppColors.accentOrange
                      : AppColors.borderPrimary,
                ),
              ),
              child: Text(
                o[1],
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: selected ? Colors.white : AppColors.textSecondary,
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

  Widget _buildSummary(BuildContext context, AppStrings t) {
    final s = _summary;
    final items = <List<Object>>[
      [t['cfInst'], s['inst']!, Icons.account_balance],
      [t['cfSmart'], s['smart']!, Icons.psychology],
      [t['cfRetail'], s['retail']!, Icons.groups_outlined],
    ];
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.accentOrange, Color(0xFFB45309)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.waterfall_chart, color: Colors.white, size: 20),
              const SizedBox(width: 8),
              Text(
                t['cfNetFlows'],
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: items.map((it) {
              final net = it[1] as double;
              final positive = net >= 0;
              return Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          it[2] as IconData,
                          color: Colors.white70,
                          size: 14,
                        ),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(
                            it[0] as String,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${positive ? '+' : ''}\$${net.toStringAsFixed(1)}B',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildHeatmap(BuildContext context, AppStrings t) {
    final maxAbs = _sectors
        .map((s) => s.net.abs())
        .reduce((a, b) => a > b ? a : b);
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 10,
      crossAxisSpacing: 10,
      childAspectRatio: 2.0,
      children: _sectors.map((s) {
        final positive = s.net >= 0;
        final intensity = (s.net.abs() / maxAbs).clamp(0.18, 1.0);
        final base = positive ? AppColors.upColor : AppColors.downColor;
        return Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: base.withValues(alpha: intensity * 0.9),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Row(
                children: [
                  Text(s.icon, style: const TextStyle(fontSize: 15)),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      s.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                '${positive ? '+' : ''}\$${s.net.toStringAsFixed(2)}B',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSectorList(BuildContext context, AppStrings t) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(16),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: List.generate(_sectors.length, (i) {
          final s = _sectors[i];
          final positive = s.net >= 0;
          final color = positive ? AppColors.upColor : AppColors.downColor;
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 12,
                ),
                child: Row(
                  children: [
                    Text(s.icon, style: const TextStyle(fontSize: 16)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        s.name,
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '${positive ? '+' : ''}\$${s.net.toStringAsFixed(2)}B',
                          style: TextStyle(
                            color: color,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '${positive ? '+' : ''}${s.change.toStringAsFixed(1)}%',
                          style: TextStyle(color: color, fontSize: 10.5),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              if (i != _sectors.length - 1)
                const Divider(height: 1, color: AppColors.divider),
            ],
          );
        }),
      ),
    );
  }
}
