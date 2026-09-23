import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/project_case_study_card.dart';
import '../../widgets/tool_logo.dart';

/// One line item of a financial statement.
class _Line {
  final String label;
  final List<double> values; // one per year (oldest -> newest)
  const _Line(this.label, this.values);
}

/// A company with its 3-year income statement and key ratios.
class _Company {
  final String symbol;
  final String name;
  final String sector;
  final List<String> years;
  final List<_Line> income;
  final Map<String, String> ratios;
  final String summary;
  const _Company({
    required this.symbol,
    required this.name,
    required this.sector,
    required this.years,
    required this.income,
    required this.ratios,
    required this.summary,
  });
}

/// Financial Report Analysis — interactive 3-statement review with a worked
/// "realised project" example.
class FinancialReportScreen extends StatefulWidget {
  const FinancialReportScreen({super.key});

  @override
  State<FinancialReportScreen> createState() => _FinancialReportScreenState();
}

class _FinancialReportScreenState extends State<FinancialReportScreen> {
  int _company = 0;
  String _statement = 'income';

  static const List<_Company> _companies = [
    _Company(
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      years: ['2021', '2022', '2023'],
      income: [
        _Line('Revenue', [365.8, 394.3, 383.3]),
        _Line('Gross profit', [152.8, 170.8, 169.1]),
        _Line('Operating income', [108.9, 119.4, 114.3]),
        _Line('Net income', [94.7, 99.8, 97.0]),
      ],
      ratios: {
        'Gross margin': '44.1%',
        'Operating margin': '29.8%',
        'Net margin': '25.3%',
        'ROE': '171.4%',
        'Debt/Equity': '1.87',
        'Current ratio': '0.99',
      },
      summary:
          'Very high margins and returns, but flat revenue growth in 2023 and '
          'a leveraged balance sheet. Strong free cash flow generation.',
    ),
    _Company(
      symbol: 'JPM',
      name: 'JPMorgan Chase',
      sector: 'Financials',
      years: ['2021', '2022', '2023'],
      income: [
        _Line('Revenue', [121.0, 128.7, 158.1]),
        _Line('Gross profit', [112.0, 119.0, 148.0]),
        _Line('Operating income', [59.5, 53.6, 61.0]),
        _Line('Net income', [48.3, 37.7, 49.6]),
      ],
      ratios: {
        'Net margin': '31.4%',
        'ROE': '17.0%',
        'ROA': '1.3%',
        'CET1 ratio': '15.0%',
        'Dividend yield': '2.3%',
        'P/B': '1.9',
      },
      summary:
          'Best-in-class bank with rising net interest income, solid capital '
          'ratios and a resilient dividend through the rate cycle.',
    ),
    _Company(
      symbol: 'XOM',
      name: 'Exxon Mobil',
      sector: 'Energy',
      years: ['2021', '2022', '2023'],
      income: [
        _Line('Revenue', [285.6, 413.7, 344.6]),
        _Line('Gross profit', [82.0, 130.0, 105.0]),
        _Line('Operating income', [28.9, 70.1, 45.0]),
        _Line('Net income', [23.0, 55.7, 36.0]),
      ],
      ratios: {
        'Net margin': '10.4%',
        'ROE': '17.8%',
        'ROCE': '14.2%',
        'Dividend yield': '3.4%',
        'Debt/Equity': '0.21',
        'P/E': '13.4',
      },
      summary:
          'Highly cyclical but cash-generative. Lower leverage after 2022 and '
          'a competitive dividend make it a solid income pick.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    final c = _companies[_company];

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: AppBarTitle(
          t['financialReport'],
          logoAsset: ToolLogos.report,
          logoFallbackIcon: Icons.receipt_long_outlined,
          logoGradient: AppColors.toolBlue,
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildCompanySelector(context, t),
              const SizedBox(height: 16),
              _buildHeader(context, t, c),
              const SizedBox(height: 16),
              _buildStatementTabs(context, t),
              const SizedBox(height: 14),
              if (_statement == 'income') ...[
                _buildRevenueChart(context, t, c),
                const SizedBox(height: 14),
                _buildIncomeTable(context, t, c),
              ] else
                _buildRatiosGrid(context, t, c),
              const SizedBox(height: 18),
              _buildSummary(context, t, c),
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
    client: 'Sovereign Wealth Fund — Abu Dhabi',
    sector: 'Institutional Investment',
    challenge:
        'The investment committee needed to review 60 annual reports before '
        'each quarterly allocation meeting, a process taking weeks.',
    solution:
        'We built an automated financial-statement analyser extracting income, '
        'balance-sheet and cash-flow lines with ratio scoring.',
    result:
        'Report review became real-time, flagging 9 distressed companies early '
        'and avoiding an estimated \$12M in write-downs.',
    metrics: [
      ['Reports', '60/quarter'],
      ['Risk flagged', '9'],
      ['Saved', '\$12M'],
      ['Turnaround', '-85%'],
    ],
    color: AppColors.accentPurple,
    icon: Icons.receipt_long,
  );

  Widget _buildCompanySelector(BuildContext context, AppStrings t) {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _companies.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, i) {
          final c = _companies[i];
          final selected = _company == i;
          return GestureDetector(
            onTap: () => setState(() => _company = i),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 160),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
              decoration: BoxDecoration(
                color: selected
                    ? AppColors.accentPurple
                    : AppColors.backgroundSecondary,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: selected
                      ? AppColors.accentPurple
                      : AppColors.borderPrimary,
                ),
              ),
              child: Text(
                c.symbol,
                style: TextStyle(
                  color: selected ? Colors.white : AppColors.textPrimary,
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildHeader(BuildContext context, AppStrings t, _Company c) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.accentPurple, AppColors.blueDeep],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.receipt_long, color: Colors.white, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  c.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
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
                child: Text(
                  c.sector,
                  style: const TextStyle(color: Colors.white, fontSize: 10.5),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            '${t['frPeriod']}: ${c.years.first} — ${c.years.last}',
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildStatementTabs(BuildContext context, AppStrings t) {
    final tabs = [
      ['income', t['frIncome']],
      ['ratios', t['frRatios']],
    ];
    return Row(
      children: tabs.map((tab) {
        final selected = _statement == tab[0];
        return Expanded(
          child: GestureDetector(
            onTap: () => setState(() => _statement = tab[0]),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.symmetric(vertical: 11),
              decoration: BoxDecoration(
                color: selected
                    ? AppColors.accentPurple
                    : AppColors.backgroundSecondary,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: selected
                      ? AppColors.accentPurple
                      : AppColors.borderPrimary,
                ),
              ),
              child: Text(
                tab[1],
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

  Widget _buildRevenueChart(BuildContext context, AppStrings t, _Company c) {
    final revenue = c.income.first.values;
    final net = c.income.last.values;
    final maxY = revenue.reduce((a, b) => a > b ? a : b) * 1.1;

    return Container(
      height: 200,
      padding: const EdgeInsets.fromLTRB(8, 16, 16, 8),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: BarChart(
        BarChartData(
          alignment: BarChartAlignment.spaceAround,
          borderData: FlBorderData(show: false),
          gridData: const FlGridData(show: false),
          maxY: maxY,
          titlesData: FlTitlesData(
            leftTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            topTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            rightTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (v, meta) => Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(
                    c.years[v.toInt()],
                    style: const TextStyle(
                      color: AppColors.textTertiary,
                      fontSize: 11,
                    ),
                  ),
                ),
              ),
            ),
          ),
          barTouchData: BarTouchData(enabled: true),
          barGroups: List.generate(revenue.length, (i) {
            return BarChartGroupData(
              x: i,
              barRods: [
                BarChartRodData(
                  toY: revenue[i],
                  color: AppColors.accentPurple,
                  width: 16,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(4),
                  ),
                ),
                BarChartRodData(
                  toY: net[i],
                  color: AppColors.greenPrimary,
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

  Widget _buildIncomeTable(BuildContext context, AppStrings t, _Company c) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(16),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          Container(
            color: AppColors.backgroundElevated,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            child: Row(
              children: [
                const Expanded(
                  flex: 3,
                  child: Text('', style: TextStyle(fontSize: 12)),
                ),
                ...c.years.map(
                  (y) => Expanded(
                    child: Text(
                      y,
                      textAlign: TextAlign.right,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          ...c.income.map((line) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
              child: Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: Text(
                      line.label,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 12.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  ...line.values.map(
                    (v) => Expanded(
                      child: Text(
                        '\$${v.toStringAsFixed(1)}B',
                        textAlign: TextAlign.right,
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildRatiosGrid(BuildContext context, AppStrings t, _Company c) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 2.2,
      children: c.ratios.entries.map((e) {
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.backgroundSecondary,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.borderPrimary),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                e.key,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 11,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                e.value,
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSummary(BuildContext context, AppStrings t, _Company c) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.pastelIndigo,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.accentPurple.withValues(alpha: 0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.insights,
                color: AppColors.accentPurple,
                size: 18,
              ),
              const SizedBox(width: 8),
              Text(
                t['frAIInsight'],
                style: const TextStyle(
                  color: AppColors.accentPurple,
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            c.summary,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 12.5,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}
