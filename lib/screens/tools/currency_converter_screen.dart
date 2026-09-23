import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../services/action_plan_service.dart';
import '../../services/currency_service.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/stock_action_plan_card.dart';
import '../../widgets/tool_logo.dart';

class CurrencyConverterScreen extends StatefulWidget {
  const CurrencyConverterScreen({super.key});

  @override
  State<CurrencyConverterScreen> createState() =>
      _CurrencyConverterScreenState();
}

class _CurrencyConverterScreenState extends State<CurrencyConverterScreen> {
  final TextEditingController _amountController = TextEditingController(
    text: '1000',
  );
  String _from = 'USD';
  String _to = 'EUR';
  ConversionResult? _result;

  @override
  void initState() {
    super.initState();
    _convert();
  }

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  void _convert() {
    final amount = double.tryParse(_amountController.text.replaceAll(',', '.'));
    if (amount == null) return;
    setState(() {
      _result = CurrencyService.convert(amount, _from, _to);
    });
  }

  void _swap() {
    setState(() {
      final tmp = _from;
      _from = _to;
      _to = tmp;
    });
    _convert();
  }

  String _fmt(double v) {
    if (v.abs() >= 1000) {
      return v
          .toStringAsFixed(2)
          .replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+\.)'), (m) => '${m[1]},');
    }
    return v.toStringAsFixed(v.abs() >= 1 ? 2 : 4);
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: AppBarTitle(
          t['currencyConverterTitle'],
          logoAsset: ToolLogos.currency,
          logoFallbackIcon: Icons.currency_exchange,
          logoGradient: AppColors.toolGreen,
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildConverterCard(t),
              const SizedBox(height: 20),
              _buildQuickAmounts(t),
              const SizedBox(height: 24),
              Text(
                t['apExamplePlans'],
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),
              StockActionPlanCard(
                plan:
                    ActionPlanService.plans[(_from.codeUnits.fold(
                          0,
                          (p, e) => p + e,
                        )) %
                        ActionPlanService.plans.length],
              ),
              const SizedBox(height: 24),
              Text(
                t['popularCurrencies'],
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),
              _buildPopularRates(t),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Icon(
                    Icons.info_outline,
                    size: 14,
                    color: AppColors.textTertiary,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      t['rateDisclaimer'],
                      style: const TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildConverterCard(AppStrings t) {
    return Container(
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            t['amount'],
            style: const TextStyle(color: Colors.white70, fontSize: 13),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _amountController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 30,
              fontWeight: FontWeight.bold,
            ),
            cursorColor: Colors.white,
            decoration: InputDecoration(
              hintText: t['enterAmount'],
              hintStyle: const TextStyle(color: Colors.white38),
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              filled: false,
              contentPadding: EdgeInsets.zero,
            ),
            onChanged: (_) => _convert(),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _currencySelector(isFrom: true, t: t)),
              const SizedBox(width: 8),
              Material(
                color: Colors.white.withValues(alpha: 0.2),
                shape: const CircleBorder(),
                child: InkWell(
                  customBorder: const CircleBorder(),
                  onTap: _swap,
                  child: const Padding(
                    padding: EdgeInsets.all(10),
                    child: Icon(
                      Icons.swap_horiz,
                      color: Colors.white,
                      size: 22,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(child: _currencySelector(isFrom: false, t: t)),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _result == null
                      ? '—'
                      : '${_fmt(_result!.converted)} ${_result!.to.symbol}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _result == null
                      ? ''
                      : '1 ${_result!.from.code} = ${_fmt(_result!.rate)} ${_result!.to.code}',
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _currencySelector({required bool isFrom, required AppStrings t}) {
    final value = isFrom ? _from : _to;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      decoration: BoxDecoration(
        // Solid white background so the text is always readable.
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: value,
          isExpanded: true,
          // White menu with dark, high-contrast text.
          dropdownColor: Colors.white,
          borderRadius: BorderRadius.circular(12),
          icon: const Icon(
            Icons.keyboard_arrow_down,
            color: AppColors.greenDark,
          ),
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
          items: CurrencyService.currencies
              .map(
                (c) => DropdownMenuItem(
                  value: c.code,
                  child: Row(
                    children: [
                      Text(
                        c.code,
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        c.symbol,
                        style: const TextStyle(
                          color: AppColors.greenDark,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              )
              .toList(),
          onChanged: (v) {
            if (v == null) return;
            setState(() {
              if (isFrom) {
                _from = v;
              } else {
                _to = v;
              }
            });
            _convert();
          },
        ),
      ),
    );
  }

  Widget _buildQuickAmounts(AppStrings t) {
    const amounts = [10, 50, 100, 500, 1000, 5000];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(t['amount'], style: Theme.of(context).textTheme.titleSmall),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: amounts.map((a) {
            final selected = _amountController.text == a.toString();
            return GestureDetector(
              onTap: () {
                _amountController.text = a.toString();
                _convert();
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 9,
                ),
                decoration: BoxDecoration(
                  color: selected
                      ? AppColors.greenPrimary
                      : AppColors.backgroundSecondary,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: selected
                        ? AppColors.greenPrimary
                        : AppColors.borderPrimary,
                  ),
                ),
                child: Text(
                  a.toString(),
                  style: TextStyle(
                    color: selected ? Colors.white : AppColors.textSecondary,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildPopularRates(AppStrings t) {
    const popular = ['USD', 'EUR', 'XOF', 'NGN', 'GHS', 'GBP', 'CNY', 'AED'];
    return Container(
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: popular.map((code) {
          final c = CurrencyService.currencyFor(code);
          final r = CurrencyService.rate(_from, code);
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: AppColors.backgroundElevated,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        c.symbol,
                        style: const TextStyle(
                          color: AppColors.primaryGold,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            c.code,
                            style: Theme.of(context).textTheme.titleSmall,
                          ),
                          Text(
                            c.name,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    Text(
                      _fmt(r),
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              if (code != popular.last)
                const Divider(height: 1, color: AppColors.divider),
            ],
          );
        }).toList(),
      ),
    );
  }
}
