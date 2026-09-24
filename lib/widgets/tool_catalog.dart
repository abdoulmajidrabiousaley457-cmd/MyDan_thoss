import 'package:flutter/material.dart';

import '../l10n/app_strings.dart';
import '../theme/app_colors.dart';
import '../widgets/tool_logo.dart';

/// A single tool definition with its aesthetic logo and sub-options.
class ToolDef {
  final String key;
  final IconData icon;
  final String logoAsset;
  final Gradient gradient;
  final String title;
  final String description;
  final List<ToolOption> options;

  /// Example templates / models showcased inside the tool.
  final List<String> examples;
  final Widget Function()? builder;

  const ToolDef({
    required this.key,
    required this.icon,
    required this.logoAsset,
    required this.gradient,
    required this.title,
    required this.description,
    required this.options,
    this.examples = const [],
    this.builder,
  });
}

class ToolOption {
  final IconData icon;
  final Color color;
  final String title;
  final String description;
  const ToolOption(this.icon, this.color, this.title, this.description);
}

/// Central catalog of all tools with consistent, aesthetic logos and
/// example model templates.
class ToolCatalog {
  static List<ToolDef> all(BuildContext context) {
    final t = AppStrings.of(context);
    return [
      ToolDef(
        key: 'currencyConverter',
        icon: Icons.currency_exchange,
        logoAsset: ToolLogos.currency,
        gradient: AppColors.toolGreen,
        title: t['currencyConverter'],
        description: t['currencyConverterDesc'],
        options: [
          ToolOption(
            Icons.swap_horiz,
            AppColors.greenPrimary,
            t['convConvert'],
            t['convConvertDesc'],
          ),
          ToolOption(
            Icons.table_chart_outlined,
            AppColors.accentBlue,
            t['convRates'],
            t['convRatesDesc'],
          ),
          ToolOption(
            Icons.star_border,
            AppColors.accentPurple,
            t['convMulti'],
            t['convMultiDesc'],
          ),
          ToolOption(
            Icons.show_chart,
            AppColors.accentTeal,
            t['convHistory'],
            t['convHistoryDesc'],
          ),
        ],
        examples: [t['convExample1'], t['convExample2'], t['convExample3']],
      ),
      ToolDef(
        key: 'dataAnalysis',
        icon: Icons.insights,
        logoAsset: ToolLogos.data,
        gradient: AppColors.toolTeal,
        title: t['dataAnalysis'],
        description: t['dataAnalysisDesc'],
        options: [
          ToolOption(
            Icons.calculate,
            AppColors.accentPurple,
            t['daStats'],
            t['daStatsDesc'],
          ),
          ToolOption(
            Icons.trending_up,
            AppColors.greenPrimary,
            t['daTrend'],
            t['daTrendDesc'],
          ),
          ToolOption(
            Icons.warning_amber_outlined,
            AppColors.accentOrange,
            t['daOutliers'],
            t['daOutliersDesc'],
          ),
          ToolOption(
            Icons.bar_chart_outlined,
            AppColors.accentBlue,
            t['daDist'],
            t['daDistDesc'],
          ),
        ],
        examples: [t['daExample1'], t['daExample2'], t['daExample3']],
      ),
      ToolDef(
        key: 'trackingEval',
        icon: Icons.track_changes,
        logoAsset: ToolLogos.tracking,
        gradient: AppColors.toolViolet,
        title: t['trackingEval'],
        description: t['trackingEvalDesc'],
        options: [
          ToolOption(
            Icons.speed,
            AppColors.accentTeal,
            t['trPerf'],
            t['trPerfDesc'],
          ),
          ToolOption(
            Icons.workspace_premium_outlined,
            AppColors.accentOrange,
            t['trEval'],
            t['trEvalDesc'],
          ),
          ToolOption(
            Icons.compare_arrows,
            AppColors.accentBlue,
            t['trBench'],
            t['trBenchDesc'],
          ),
          ToolOption(
            Icons.history,
            AppColors.accentPurple,
            t['trHist'],
            t['trHistDesc'],
          ),
        ],
        examples: [t['trExample1'], t['trExample2'], t['trExample3']],
      ),
      ToolDef(
        key: 'aiStockScreener',
        icon: Icons.filter_alt_outlined,
        logoAsset: ToolLogos.screener,
        gradient: AppColors.toolSky,
        title: t['aiStockScreener'],
        description: t['aiStockScreenerDesc'],
        options: [
          ToolOption(
            Icons.price_check,
            AppColors.greenPrimary,
            t['scrValue'],
            t['scrValueDesc'],
          ),
          ToolOption(
            Icons.rocket_launch_outlined,
            AppColors.accentBlue,
            t['scrGrowth'],
            t['scrGrowthDesc'],
          ),
          ToolOption(
            Icons.savings_outlined,
            AppColors.successGreen,
            t['scrDividend'],
            t['scrDividendDesc'],
          ),
          ToolOption(
            Icons.auto_awesome,
            AppColors.accentPurple,
            t['scrAI'],
            t['scrAIDesc'],
          ),
        ],
        examples: [t['scrExample1'], t['scrExample2'], t['scrExample3']],
      ),
      ToolDef(
        key: 'financialReport',
        icon: Icons.receipt_long_outlined,
        logoAsset: ToolLogos.report,
        gradient: AppColors.toolBlue,
        title: t['financialReport'],
        description: t['financialReportDesc'],
        options: [
          ToolOption(
            Icons.receipt_long_outlined,
            AppColors.accentPurple,
            t['frIncome'],
            t['frIncomeDesc'],
          ),
          ToolOption(
            Icons.balance,
            AppColors.accentBlue,
            t['frBalance'],
            t['frBalanceDesc'],
          ),
          ToolOption(
            Icons.waterfall_chart,
            AppColors.accentTeal,
            t['frCash'],
            t['frCashDesc'],
          ),
          ToolOption(
            Icons.percent,
            AppColors.accentOrange,
            t['frRatios'],
            t['frRatiosDesc'],
          ),
        ],
        examples: [t['frExample1'], t['frExample2'], t['frExample3']],
      ),
      ToolDef(
        key: 'valuationCalculator',
        icon: Icons.calculate_outlined,
        logoAsset: ToolLogos.valuation,
        gradient: AppColors.toolViolet,
        title: t['valuationCalculator'],
        description: t['valuationCalculatorDesc'],
        options: [
          ToolOption(
            Icons.account_balance_wallet_outlined,
            AppColors.greenPrimary,
            t['valDCF'],
            t['valDCFDesc'],
          ),
          ToolOption(
            Icons.attach_money,
            AppColors.accentBlue,
            t['valPE'],
            t['valPEDesc'],
          ),
          ToolOption(
            Icons.menu_book_outlined,
            AppColors.accentPurple,
            t['valPB'],
            t['valPBDesc'],
          ),
          ToolOption(
            Icons.card_giftcard,
            AppColors.successGreen,
            t['valDivi'],
            t['valDiviDesc'],
          ),
        ],
        examples: [t['valExample1'], t['valExample2'], t['valExample3']],
      ),
      ToolDef(
        key: 'capitalFlow',
        icon: Icons.trending_up,
        logoAsset: ToolLogos.flow,
        gradient: AppColors.toolAmber,
        title: t['capitalFlow'],
        description: t['capitalFlowDesc'],
        options: [
          ToolOption(
            Icons.account_balance,
            AppColors.accentBlue,
            t['cfInst'],
            t['cfInstDesc'],
          ),
          ToolOption(
            Icons.psychology_outlined,
            AppColors.accentPurple,
            t['cfSmart'],
            t['cfSmartDesc'],
          ),
          ToolOption(
            Icons.donut_large,
            AppColors.accentOrange,
            t['cfSector'],
            t['cfSectorDesc'],
          ),
          ToolOption(
            Icons.north_east,
            AppColors.accentTeal,
            t['cfNorth'],
            t['cfNorthDesc'],
          ),
        ],
        examples: [t['cfExample1'], t['cfExample2'], t['cfExample3']],
      ),
      ToolDef(
        key: 'productCatalog',
        icon: Icons.storefront_outlined,
        logoAsset: ToolLogos.product,
        gradient: AppColors.toolPink,
        title: t['productTitle'],
        description: t['productSubtitle'],
        options: [
          ToolOption(
            Icons.inventory_2_outlined,
            AppColors.accentPink,
            t['productModels'],
            t['productModelsDesc'],
          ),
          ToolOption(
            Icons.shopping_bag_outlined,
            AppColors.greenPrimary,
            t['productProducts'],
            t['productProductsDesc'],
          ),
          ToolOption(
            Icons.workspace_premium_outlined,
            AppColors.accentOrange,
            t['productPlans'],
            t['productPlansDesc'],
          ),
          ToolOption(
            Icons.support_agent,
            AppColors.accentBlue,
            t['productContact'],
            t['productContactDesc'],
          ),
        ],
        examples: [t['prodExample1'], t['prodExample2'], t['prodExample3']],
      ),
      ToolDef(
        key: 'aiAgent',
        icon: Icons.smart_toy_outlined,
        logoAsset: ToolLogos.aiAgent,
        gradient: AppColors.toolSky,
        title: t['aiAgent'],
        description: t['aiAgentDesc'],
        options: [
          ToolOption(
            Icons.chat_bubble_outline,
            AppColors.accentBlue,
            t['aiAgentOpen'],
            t['aiAgentDesc'],
          ),
          ToolOption(
            Icons.auto_awesome,
            AppColors.accentPurple,
            t['scrAI'],
            t['aiAgentDesc'],
          ),
          ToolOption(
            Icons.insights,
            AppColors.greenPrimary,
            t['dataAnalysis'],
            t['aiAgentDesc'],
          ),
          ToolOption(
            Icons.open_in_new,
            AppColors.accentTeal,
            t['aiAgentOpenBrowser'],
            t['aiAgentDesc'],
          ),
        ],
        examples: [t['aiAgentDesc'], t['tagline'], t['aiAgentOpen']],
      ),
      ToolDef(
        key: 'library',
        icon: Icons.library_books_outlined,
        logoAsset: ToolLogos.library,
        gradient: AppColors.toolIndigo,
        title: t['libraryTitle'],
        description: t['librarySubtitle'],
        options: [
          ToolOption(
            Icons.picture_as_pdf,
            AppColors.downColor,
            t['libraryBooks'],
            t['libraryDownload'],
          ),
          ToolOption(
            Icons.download_outlined,
            AppColors.greenPrimary,
            t['libraryDownload'],
            t['librarySubtitle'],
          ),
          ToolOption(
            Icons.open_in_new,
            AppColors.accentBlue,
            t['libraryOpen'],
            t['librarySubtitle'],
          ),
          ToolOption(
            Icons.category_outlined,
            AppColors.accentPurple,
            t['libraryCatAll'],
            t['librarySubtitle'],
          ),
        ],
        examples: [
          t['libraryCatInvest'],
          t['libraryCatAnalysis'],
          t['libraryCatAI'],
        ],
      ),
    ];
  }
}
