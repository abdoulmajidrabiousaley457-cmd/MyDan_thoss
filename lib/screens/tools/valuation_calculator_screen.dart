import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/project_case_study_card.dart';
import '../../widgets/tool_logo.dart';

/// Valuation Calculator — an interactive DCF + multiple model with a worked
/// "realised project" example.
class ValuationCalculatorScreen extends StatefulWidget {
  const ValuationCalculatorScreen({super.key});

  @override
  State<ValuationCalculatorScreen> createState() =>
      _ValuationCalculatorScreenState();
}

class _ValuationCalculatorScreenState extends State<ValuationCalculatorScreen> {
  // DCF inputs
  double _fcf = 5.0; // current free cash flow ($B)
  double _growth = 12; // annual FCF growth %
  double _discount = 9; // discount rate (WACC) %
  double _terminal = 3; // terminal growth %
  int _years = 5;

  // Company info
  String _symbol = 'NVDA';
  double _price = 118.40;
  double _shares = 24.6; // billion shares
  double _netDebt = -7.0; // $B (negative = net cash)

  static const List<List<Object>> _presets = [
    ['NVDA', 118.40, 5.0, 24.0, 12.0, 9.0, -7.0],
    ['AAPL', 214.75, 108.0, 15.4, 6.0, 8.5, 51.0],
    ['MSFT', 428.10, 74.0, 7.4, 14.0, 8.0, -20.0],
    ['KO', 63.85, 9.5, 4.3, 4.0, 7.0, 25.0],
  ];

  double get _intrinsicValue {
    final g = _growth / 100;
    final r = _discount / 100;
    final tg = _terminal / 100;
    double pv = 0;
    double fcf = _fcf;
    for (int y = 1; y <= _years; y++) {
      fcf = fcf * (1 + g);
      pv += fcf / _pow(1 + r, y);
    }
    // Terminal value (Gordon growth)
    final tv = fcf * (1 + tg) / (r - tg);
    pv += tv / _pow(1 + r, _years);
    // Equity value = enterprise value - net debt
    final equity = pv - _netDebt;
    return equity / _shares;
  }

  double get _upside => ((_intrinsicValue - _price) / _price) * 100;

  static double _pow(double base, int exp) {
    double r = 1;
    for (int i = 0; i < exp; i++) {
      r *= base;
    }
    return r;
  }

  void _applyPreset(int i) {
    final p = _presets[i];
    setState(() {
      _symbol = p[0] as String;
      _price = p[1] as double;
      _fcf = p[2] as double;
      _shares = p[3] as double;
      _growth = p[4] as double;
      _discount = p[5] as double;
      _netDebt = p[6] as double;
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: AppBarTitle(
          t['valuationCalculator'],
          logoAsset: ToolLogos.valuation,
          logoFallbackIcon: Icons.calculate_outlined,
          logoGradient: AppColors.toolViolet,
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildPresets(context, t),
              const SizedBox(height: 16),
              _buildResultCard(context, t),
              const SizedBox(height: 16),
              _buildInputs(context, t),
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
    client: 'Venture Capital Firm — Paris',
    sector: 'Private Equity',
    challenge:
        'Partners needed a fast, defensible valuation of 30 SaaS targets, each '
        'with different growth and discount assumptions.',
    solution:
        'We deployed the DCF + multiples calculator with scenario toggles and '
        'a sensitivity matrix on WACC and terminal growth.',
    result:
        'Deal screening accelerated 5x; 3 acquisitions closed at an average '
        '18% discount to our intrinsic estimates.',
    metrics: [
      ['Speed', '5x faster'],
      ['Targets', '30'],
      ['Discount', '-18%'],
      ['Closed', '3 deals'],
    ],
    color: AppColors.accentTeal,
    icon: Icons.calculate,
  );

  Widget _buildPresets(BuildContext context, AppStrings t) {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _presets.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, i) {
          final symbol = _presets[i][0] as String;
          final selected = _symbol == symbol;
          return GestureDetector(
            onTap: () => _applyPreset(i),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 160),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
              decoration: BoxDecoration(
                color: selected
                    ? AppColors.accentTeal
                    : AppColors.backgroundSecondary,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: selected
                      ? AppColors.accentTeal
                      : AppColors.borderPrimary,
                ),
              ),
              child: Text(
                symbol,
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

  Widget _buildResultCard(BuildContext context, AppStrings t) {
    final iv = _intrinsicValue;
    final up = _upside;
    final color = up >= 0 ? AppColors.upColor : AppColors.downColor;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.accentTeal, AppColors.blueDeep],
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
              const Icon(Icons.auto_graph, color: Colors.white, size: 20),
              const SizedBox(width: 8),
              Text(
                '${t['valIntrinsic']} · $_symbol',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            '\$${iv.toStringAsFixed(2)}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 38,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${t['valMarketPrice']}: \$${_price.toStringAsFixed(2)}',
            style: const TextStyle(color: Colors.white70, fontSize: 13),
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  up >= 0 ? Icons.trending_up : Icons.trending_down,
                  color: Colors.white,
                  size: 16,
                ),
                const SizedBox(width: 6),
                Text(
                  '${up >= 0 ? '+' : ''}${up.toStringAsFixed(1)}% '
                  '${up >= 0 ? t['valUndervalued'] : t['valOvervalued']}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputs(BuildContext context, AppStrings t) {
    return Container(
      padding: const EdgeInsets.all(16),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.tune, color: AppColors.accentTeal, size: 20),
              const SizedBox(width: 8),
              Text(
                t['valAssumptions'],
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ],
          ),
          const SizedBox(height: 8),
          _slider(
            t['valFcf'],
            _fcf,
            1,
            150,
            (v) => setState(() => _fcf = v),
            '\$${_fcf.toStringAsFixed(1)}B',
          ),
          _slider(
            t['valGrowth'],
            _growth,
            0,
            40,
            (v) => setState(() => _growth = v),
            '${_growth.round()}%',
          ),
          _slider(
            t['valDiscount'],
            _discount,
            5,
            20,
            (v) => setState(() => _discount = v),
            '${_discount.toStringAsFixed(1)}%',
          ),
          _slider(
            t['valTerminal'],
            _terminal,
            0,
            6,
            (v) => setState(() => _terminal = v),
            '${_terminal.toStringAsFixed(1)}%',
          ),
          _slider(
            t['valYears'],
            _years.toDouble(),
            3,
            10,
            (v) => setState(() => _years = v.round()),
            '$_years',
          ),
        ],
      ),
    );
  }

  Widget _slider(
    String label,
    double value,
    double min,
    double max,
    ValueChanged<double> onChanged,
    String valueLabel,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 12.5,
                fontWeight: FontWeight.w600,
              ),
            ),
            Text(
              valueLabel,
              style: const TextStyle(
                color: AppColors.accentTeal,
                fontSize: 12.5,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        SliderTheme(
          data: SliderTheme.of(context).copyWith(
            activeTrackColor: AppColors.accentTeal,
            thumbColor: AppColors.accentTeal,
            inactiveTrackColor: AppColors.backgroundElevated,
            trackHeight: 4,
          ),
          child: Slider(value: value, min: min, max: max, onChanged: onChanged),
        ),
      ],
    );
  }
}
