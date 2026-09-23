import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/responsive.dart';
import '../../widgets/tool_catalog.dart';
import '../../widgets/tool_logo.dart';
import '../product/product_screen.dart';
import '../library/library_screen.dart';
import '../tools/currency_converter_screen.dart';
import '../tools/data_analysis_screen.dart';
import '../tools/tracking_screen.dart';
import '../tools/ai_stock_screener_screen.dart';
import '../tools/financial_report_screen.dart';
import '../tools/valuation_calculator_screen.dart';
import '../tools/capital_flow_screen.dart';

class DiscoverScreen extends StatelessWidget {
  const DiscoverScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    final tools = ToolCatalog.all(context);

    // Dedicated screens keyed by the stable tool key.
    final screens = <String, Widget>{
      'currencyConverter': const CurrencyConverterScreen(),
      'dataAnalysis': const DataAnalysisScreen(),
      'trackingEval': const TrackingScreen(),
      'aiStockScreener': const AiStockScreenerScreen(),
      'financialReport': const FinancialReportScreen(),
      'valuationCalculator': const ValuationCalculatorScreen(),
      'capitalFlow': const CapitalFlowScreen(),
      'productCatalog': const ProductScreen(),
      'library': const LibraryScreen(),
    };

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(title: AppBarTitle(t['aiTools'], subtitle: t['tagline'])),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(context.pagePadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (final tool in tools) ...[
                _buildToolCard(context, tool, screens[tool.key]),
                const SizedBox(height: 14),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildToolCard(BuildContext context, ToolDef tool, Widget? page) {
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
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          childrenPadding: const EdgeInsets.only(bottom: 10),
          iconColor: AppColors.greenPrimary,
          collapsedIconColor: AppColors.textTertiary,
          leading: ToolLogoImage(
            asset: tool.logoAsset,
            remoteUrl: ToolLogos.remoteReferences[tool.key],
            fallbackIcon: tool.icon,
            gradient: tool.gradient,
            semanticLabel: tool.title,
            size: 48,
          ),
          title: Text(
            tool.title,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          subtitle: Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(
              tool.description,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
          children: [
            // ---- Options ----
            _sectionHeader(context, t['toolOptions']),
            ...tool.options.map((o) => _buildOptionTile(context, o)),
            // ---- Example model templates ----
            if (tool.examples.isNotEmpty) ...[
              _sectionHeader(context, t['exampleTemplates']),
              ...tool.examples.map((e) => _buildExampleTile(context, e, tool)),
            ],
            if (page != null)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 10, 16, 8),
                child: Semantics(
                  button: true,
                  label: '${t['exploreFeatures']} — ${tool.title}',
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.of(
                      context,
                    ).push(MaterialPageRoute(builder: (_) => page)),
                    icon: const Icon(Icons.open_in_new, size: 16),
                    label: Text(t['exploreFeatures']),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.greenPrimary,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 46),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _sectionHeader(BuildContext context, String label) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
      child: Row(
        children: [
          Text(
            label,
            style: const TextStyle(
              color: AppColors.greenPrimary,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(child: Container(height: 1, color: AppColors.divider)),
        ],
      ),
    );
  }

  Widget _buildExampleTile(BuildContext context, String example, ToolDef tool) {
    final t = context.tr;
    return Semantics(
      button: true,
      label: '${t['viewExample']} — $example',
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('${t['exampleData']}: $example'),
              backgroundColor: AppColors.greenDark,
              duration: const Duration(seconds: 2),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  gradient: tool.gradient,
                  borderRadius: BorderRadius.circular(9),
                ),
                child: const Icon(
                  Icons.auto_awesome,
                  color: Colors.white,
                  size: 15,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  example,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.greenPrimary.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  t['useTemplate'],
                  style: const TextStyle(
                    color: AppColors.greenPrimary,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOptionTile(BuildContext context, ToolOption o) {
    return Semantics(
      button: true,
      label: o.title,
      hint: o.description,
      child: ListTile(
        dense: true,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: o.color.withValues(alpha: 0.14),
            borderRadius: BorderRadius.circular(9),
          ),
          child: Icon(o.icon, color: o.color, size: 18),
        ),
        title: Text(
          o.title,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 13.5,
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Text(
          o.description,
          style: const TextStyle(color: AppColors.textTertiary, fontSize: 11.5),
        ),
        trailing: const Icon(
          Icons.chevron_right,
          color: AppColors.textTertiary,
          size: 18,
        ),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(o.title),
              backgroundColor: AppColors.greenPrimary,
              duration: const Duration(seconds: 1),
            ),
          );
        },
      ),
    );
  }
}
