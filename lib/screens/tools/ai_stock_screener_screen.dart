import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';
import '../../widgets/project_case_study_card.dart';

/// A single stock result produced by the AI screener.
class _ScreenedStock {
  final String symbol;
  final String company;
  final String sector;
  final double price;
  final double pe;
  final double growth;
  final double dividend;
  final int aiScore;
  final String signal;

  const _ScreenedStock({
    required this.symbol,
    required this.company,
    required this.sector,
    required this.price,
    required this.pe,
    required this.growth,
    required this.dividend,
    required this.aiScore,
    required this.signal,
  });
}

/// AI Stock Screener — fully functional, with real filter controls and a
/// worked "realised project" example.
class AiStockScreenerScreen extends StatefulWidget {
  const AiStockScreenerScreen({super.key});

  @override
  State<AiStockScreenerScreen> createState() => _AiStockScreenerScreenState();
}

class _AiStockScreenerScreenState extends State<AiStockScreenerScreen> {
  static const List<_ScreenedStock> _universe = [
    _ScreenedStock(symbol: 'AAPL', company: 'Apple Inc.', sector: 'Technology', price: 214.75, pe: 33.2, growth: 8.5, dividend: 0.5, aiScore: 78, signal: 'hold'),
    _ScreenedStock(symbol: 'NVDA', company: 'NVIDIA Corp.', sector: 'Semiconductors', price: 118.40, pe: 61.8, growth: 94.2, dividend: 0.03, aiScore: 91, signal: 'buy'),
    _ScreenedStock(symbol: 'MSFT', company: 'Microsoft Corp.', sector: 'Technology', price: 428.10, pe: 36.4, growth: 16.8, dividend: 0.7, aiScore: 85, signal: 'buy'),
    _ScreenedStock(symbol: 'KO', company: 'Coca-Cola Co.', sector: 'Consumer Staples', price: 63.85, pe: 24.1, growth: 4.2, dividend: 3.1, aiScore: 72, signal: 'hold'),
    _ScreenedStock(symbol: 'JPM', company: 'JPMorgan Chase', sector: 'Financials', price: 198.20, pe: 11.8, growth: 9.4, dividend: 2.3, aiScore: 80, signal: 'buy'),
    _ScreenedStock(symbol: 'XOM', company: 'Exxon Mobil', sector: 'Energy', price: 112.30, pe: 13.4, growth: 6.1, dividend: 3.4, aiScore: 68, signal: 'buy'),
    _ScreenedStock(symbol: 'PEP', company: 'PepsiCo Inc.', sector: 'Consumer Staples', price: 172.45, pe: 22.6, growth: 3.8, dividend: 3.0, aiScore: 70, signal: 'hold'),
    _ScreenedStock(symbol: 'AMD', company: 'Advanced Micro Devices', sector: 'Semiconductors', price: 156.20, pe: 48.9, growth: 32.5, dividend: 0.0, aiScore: 83, signal: 'buy'),
    _ScreenedStock(symbol: 'TSLA', company: 'Tesla Inc.', sector: 'Automotive', price: 248.60, pe: 72.3, growth: 21.7, dividend: 0.0, aiScore: 74, signal: 'buy'),
    _ScreenedStock(symbol: 'VZ', company: 'Verizon Communications', sector: 'Telecom', price: 41.20, pe: 9.1, growth: 1.9, dividend: 6.6, aiScore: 65, signal: 'hold'),
    _ScreenedStock(symbol: 'PG', company: 'Procter & Gamble', sector: 'Consumer Staples', price: 168.90, pe: 26.8, growth: 5.4, dividend: 2.4, aiScore: 73, signal: 'hold'),
    _ScreenedStock(symbol: 'META', company: 'Meta Platforms', sector: 'Technology', price: 512.30, pe: 28.7, growth: 24.3, dividend: 0.4, aiScore: 87, signal: 'buy'),
  ];

  // Filter state
  double _maxPe = 65;
  double _minGrowth = 0;
  double _minDividend = 0;
  double _minScore = 60;
  String _signalFilter = 'all';

  static const ProjectCaseStudy _caseStudy = ProjectCaseStudy(
    client: 'Global Asset Management — New York',
    sector: 'Portfolio Management',
    challenge:
        'Analysts spent 3 days per week screening 2,400 US equities manually '
        'to build a shortlist of value + growth candidates.',
    solution:
        'We deployed the AI Screener with multi-factor filters (PE, growth, '
        'dividend, momentum) and a machine-learning ranking model.',
    result:
        'Screening time dropped from 3 days to 8 minutes, and the model-driven '
        'portfolio outperformed its benchmark for 4 consecutive quarters.',
    metrics: [
      ['Time saved', '-96%'],
      ['Universe', '2,400'],
      ['Alpha', '+7.4%'],
      ['Horizon', '12 mo'],
    ],
    color: AppColors.accentBlue,
    icon: Icons.filter_alt,
  );

  List<_ScreenedStock> get _results {
    return _universe.where((s) {
      if (s.pe > _maxPe) return false;
      if (s.growth < _minGrowth) return false;
      if (s.dividend < _minDividend) return false;
      if (s.aiScore < _minScore) return false;
      if (_signalFilter != 'all' && s.signal != _signalFilter) return false;
      return true;
    }).toList()
      ..sort((a, b) => b.aiScore.compareTo(a.aiScore));
  }

  void _reset() {
    setState(() {
      _maxPe = 65;
      _minGrowth = 0;
      _minDividend = 0;
      _minScore = 60;
      _signalFilter = 'all';
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    final results = _results;

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(title: Text(t['aiStockScreener'])),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildFilters(context, t),
              const SizedBox(height: 18),
              Row(
                children: [
                  Text('${results.length} ${t['scrResults']}',
                      style: Theme.of(context).textTheme.titleMedium),
                  const Spacer(),
                  TextButton.icon(
                    onPressed: _reset,
                    icon: const Icon(Icons.restart_alt, size: 16),
                    label: Text(t['scrReset']),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              if (results.isEmpty)
                _buildEmpty(context, t)
              else
                ...results.map((s) => _buildStockCard(context, t, s)),
              const SizedBox(height: 24),
              Text(t['pcExample'],
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              const ProjectCaseStudyCard(study: _caseStudy),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilters(BuildContext context, AppStrings t) {
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
              const Icon(Icons.tune, color: AppColors.accentBlue, size: 20),
              const SizedBox(width: 8),
              Text(t['scrFilters'],
                  style: Theme.of(context).textTheme.titleMedium),
            ],
          ),
          const SizedBox(height: 12),
          _slider(t['scrMaxPe'], _maxPe, 5, 80, (v) => setState(() => _maxPe = v),
              '${_maxPe.round()}x'),
          _slider(t['scrMinGrowth'], _minGrowth, 0, 50,
              (v) => setState(() => _minGrowth = v), '${_minGrowth.round()}%'),
          _slider(t['scrMinDividend'], _minDividend, 0, 7,
              (v) => setState(() => _minDividend = v),
              '${_minDividend.toStringAsFixed(1)}%'),
          _slider(t['scrMinScore'], _minScore, 0, 100,
              (v) => setState(() => _minScore = v), '${_minScore.round()}/100'),
          const SizedBox(height: 4),
          Text(t['apSignal'],
              style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 12.5,
                  fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: ['all', 'buy', 'hold'].map((sig) {
              final selected = _signalFilter == sig;
              final label = sig == 'all'
                  ? t['scrAll']
                  : sig == 'buy'
                      ? t['apBuy']
                      : t['apHold'];
              return GestureDetector(
                onTap: () => setState(() => _signalFilter = sig),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                  decoration: BoxDecoration(
                    color: selected
                        ? AppColors.accentBlue
                        : AppColors.backgroundElevated,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    label,
                    style: TextStyle(
                      color:
                          selected ? Colors.white : AppColors.textSecondary,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _slider(String label, double value, double min, double max,
      ValueChanged<double> onChanged, String valueLabel) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label,
                style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600)),
            Text(valueLabel,
                style: const TextStyle(
                    color: AppColors.accentBlue,
                    fontSize: 12.5,
                    fontWeight: FontWeight.bold)),
          ],
        ),
        SliderTheme(
          data: SliderTheme.of(context).copyWith(
            activeTrackColor: AppColors.accentBlue,
            thumbColor: AppColors.accentBlue,
            inactiveTrackColor: AppColors.backgroundElevated,
            trackHeight: 4,
          ),
          child: Slider(
            value: value,
            min: min,
            max: max,
            onChanged: onChanged,
          ),
        ),
      ],
    );
  }

  Widget _buildEmpty(BuildContext context, AppStrings t) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          const Icon(Icons.search_off, size: 40, color: AppColors.textTertiary),
          const SizedBox(height: 10),
          Text(t['scrNoResults'],
              style: const TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: 8),
          TextButton(onPressed: _reset, child: Text(t['scrReset'])),
        ],
      ),
    );
  }

  Widget _buildStockCard(
      BuildContext context, AppStrings t, _ScreenedStock s) {
    final signalColor =
        s.signal == 'buy' ? AppColors.upColor : AppColors.warningYellow;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  gradient: AppColors.toolSky,
                  borderRadius: BorderRadius.circular(11),
                ),
                child: Text(
                  s.symbol.substring(0, 2),
                  style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${s.symbol} · ${s.sector}',
                        style: const TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 13.5,
                            fontWeight: FontWeight.bold)),
                    Text(s.company,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            color: AppColors.textTertiary, fontSize: 11.5)),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(s.price.toStringAsFixed(2),
                      style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 15,
                          fontWeight: FontWeight.bold)),
                  Container(
                    margin: const EdgeInsets.only(top: 3),
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: signalColor.withValues(alpha: 0.14),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      t[s.signal == 'buy' ? 'apBuy' : 'apHold'],
                      style: TextStyle(
                          color: signalColor,
                          fontSize: 10,
                          fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _stat(t['scrPe'], '${s.pe.toStringAsFixed(1)}x'),
              _stat(t['scrGrowthRate'], '+${s.growth.toStringAsFixed(1)}%'),
              _stat(t['scrDiv'], '${s.dividend.toStringAsFixed(1)}%'),
              _stat(t['apScore'], '${s.aiScore}',
                  highlight: true),
            ],
          ),
        ],
      ),
    );
  }

  Widget _stat(String label, String value, {bool highlight = false}) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label,
              style: const TextStyle(
                  color: AppColors.textTertiary, fontSize: 10)),
          const SizedBox(height: 3),
          Text(
            value,
            style: TextStyle(
              color: highlight ? AppColors.greenPrimary : AppColors.textPrimary,
              fontSize: 13.5,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
