import 'package:flutter/material.dart';

import '../l10n/app_strings.dart';
import '../theme/app_colors.dart';

/// A single tool definition with its aesthetic logo gradient and sub-options.
class ToolDef {
  final IconData icon;
  final Gradient gradient;
  final String title;
  final String description;
  final List<ToolOption> options;
  final Widget Function()? builder;

  const ToolDef({
    required this.icon,
    required this.gradient,
    required this.title,
    required this.description,
    required this.options,
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

/// Central catalog of all tools with consistent, aesthetic logos.
///
/// Each tool exposes a [Semantics]-friendly `title` used as its accessible
/// label by [ToolLogo]/[ToolLogoButton].
class ToolCatalog {
  static List<ToolDef> all(BuildContext context) {
    final t = AppStrings.of(context);
    return [
      ToolDef(
        icon: Icons.currency_exchange,
        gradient: AppColors.toolGreen,
        title: t['currencyConverter'],
        description: t['currencyConverterDesc'],
        options: [
          ToolOption(Icons.swap_horiz, AppColors.greenPrimary, t['convConvert'], t['convConvertDesc']),
          ToolOption(Icons.table_chart_outlined, AppColors.accentBlue, t['convRates'], t['convRatesDesc']),
          ToolOption(Icons.star_border, AppColors.accentPurple, t['convMulti'], t['convMultiDesc']),
          ToolOption(Icons.show_chart, AppColors.accentTeal, t['convHistory'], t['convHistoryDesc']),
        ],
      ),
      ToolDef(
        icon: Icons.insights,
        gradient: AppColors.toolTeal,
        title: t['dataAnalysis'],
        description: t['dataAnalysisDesc'],
        options: [
          ToolOption(Icons.calculate, AppColors.accentPurple, t['daStats'], t['daStatsDesc']),
          ToolOption(Icons.trending_up, AppColors.greenPrimary, t['daTrend'], t['daTrendDesc']),
          ToolOption(Icons.warning_amber_outlined, AppColors.accentOrange, t['daOutliers'], t['daOutliersDesc']),
          ToolOption(Icons.bar_chart_outlined, AppColors.accentBlue, t['daDist'], t['daDistDesc']),
        ],
      ),
      ToolDef(
        icon: Icons.track_changes,
        gradient: AppColors.toolAmber,
        title: t['trackingEval'],
        description: t['trackingEvalDesc'],
        options: [
          ToolOption(Icons.speed, AppColors.accentTeal, t['trPerf'], t['trPerfDesc']),
          ToolOption(Icons.workspace_premium_outlined, AppColors.accentOrange, t['trEval'], t['trEvalDesc']),
          ToolOption(Icons.compare_arrows, AppColors.accentBlue, t['trBench'], t['trBenchDesc']),
          ToolOption(Icons.history, AppColors.accentPurple, t['trHist'], t['trHistDesc']),
        ],
      ),
      ToolDef(
        icon: Icons.filter_alt_outlined,
        gradient: AppColors.toolViolet,
        title: t['aiStockScreener'],
        description: t['aiStockScreenerDesc'],
        options: [
          ToolOption(Icons.price_check, AppColors.greenPrimary, t['scrValue'], t['scrValueDesc']),
          ToolOption(Icons.rocket_launch_outlined, AppColors.accentBlue, t['scrGrowth'], t['scrGrowthDesc']),
          ToolOption(Icons.savings_outlined, AppColors.successGreen, t['scrDividend'], t['scrDividendDesc']),
          ToolOption(Icons.auto_awesome, AppColors.accentPurple, t['scrAI'], t['scrAIDesc']),
        ],
      ),
      ToolDef(
        icon: Icons.receipt_long_outlined,
        gradient: AppColors.toolBlue,
        title: t['financialReport'],
        description: t['financialReportDesc'],
        options: [
          ToolOption(Icons.receipt_long_outlined, AppColors.accentPurple, t['frIncome'], t['frIncomeDesc']),
          ToolOption(Icons.balance, AppColors.accentBlue, t['frBalance'], t['frBalanceDesc']),
          ToolOption(Icons.waterfall_chart, AppColors.accentTeal, t['frCash'], t['frCashDesc']),
          ToolOption(Icons.percent, AppColors.accentOrange, t['frRatios'], t['frRatiosDesc']),
        ],
      ),
      ToolDef(
        icon: Icons.calculate_outlined,
        gradient: AppColors.toolEmerald,
        title: t['valuationCalculator'],
        description: t['valuationCalculatorDesc'],
        options: [
          ToolOption(Icons.account_balance_wallet_outlined, AppColors.greenPrimary, t['valDCF'], t['valDCFDesc']),
          ToolOption(Icons.attach_money, AppColors.accentBlue, t['valPE'], t['valPEDesc']),
          ToolOption(Icons.menu_book_outlined, AppColors.accentPurple, t['valPB'], t['valPBDesc']),
          ToolOption(Icons.card_giftcard, AppColors.successGreen, t['valDivi'], t['valDiviDesc']),
        ],
      ),
      ToolDef(
        icon: Icons.trending_up,
        gradient: AppColors.toolSky,
        title: t['capitalFlow'],
        description: t['capitalFlowDesc'],
        options: [
          ToolOption(Icons.account_balance, AppColors.accentBlue, t['cfInst'], t['cfInstDesc']),
          ToolOption(Icons.psychology_outlined, AppColors.accentPurple, t['cfSmart'], t['cfSmartDesc']),
          ToolOption(Icons.donut_large, AppColors.accentOrange, t['cfSector'], t['cfSectorDesc']),
          ToolOption(Icons.north_east, AppColors.accentTeal, t['cfNorth'], t['cfNorthDesc']),
        ],
      ),
      ToolDef(
        icon: Icons.card_giftcard,
        gradient: AppColors.toolPink,
        title: t['referralTitle'],
        description: t['referralSubtitle'],
        options: [
          ToolOption(Icons.share_outlined, AppColors.accentPink, t['shareInvite'], t['referralStep1']),
          ToolOption(Icons.person_add_alt_1_outlined, AppColors.greenPrimary, t['inviteNow'], t['referralStep2']),
          ToolOption(Icons.redeem_outlined, AppColors.accentOrange, t['referralEarnings'], t['referralStep3']),
          ToolOption(Icons.group_outlined, AppColors.accentBlue, t['recentReferrals'], t['referralSubtitle']),
        ],
      ),
      ToolDef(
        icon: Icons.workspace_premium_outlined,
        gradient: AppColors.toolIndigo,
        title: t['navMyPortfolio'],
        description: t['portfolioProRole'],
        options: [
          ToolOption(Icons.badge_outlined, AppColors.accentBlue, t['portfolioSkills'], t['portfolioSkills']),
          ToolOption(Icons.folder_open, AppColors.accentPurple, t['portfolioProjects'], t['portfolioProjects']),
          ToolOption(Icons.timeline, AppColors.greenPrimary, t['portfolioExperience'], t['portfolioExperience']),
          ToolOption(Icons.school_outlined, AppColors.accentTeal, t['portfolioEducation'], t['portfolioEducation']),
        ],
      ),
    ];
  }
}
