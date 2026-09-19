import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';
import '../../widgets/tool_catalog.dart';
import '../../widgets/tool_logo.dart';
import '../tools/currency_converter_screen.dart';
import '../tools/data_analysis_screen.dart';
import '../tools/tracking_screen.dart';

class DiscoverScreen extends StatelessWidget {
  const DiscoverScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    final tools = ToolCatalog.all(context);

    // Dedicated screens keyed by catalog position.
    final screens = <int, Widget>{
      0: const CurrencyConverterScreen(),
      1: const DataAnalysisScreen(),
      2: const TrackingScreen(),
    };

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(title: Text(t['aiTools'])),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (int i = 0; i < tools.length; i++) ...[
                _buildToolCard(context, tools[i], screens[i]),
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
          leading: ToolLogo(
            icon: tool.icon,
            gradient: tool.gradient,
            size: 46,
            iconSize: 22,
            radius: 14,
          ),
          title: Text(tool.title, style: Theme.of(context).textTheme.titleMedium),
          subtitle: Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(
              tool.description,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
              child: Row(
                children: [
                  Text(
                    t['toolOptions'],
                    style: const TextStyle(
                      color: AppColors.greenPrimary,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(height: 1, color: AppColors.divider),
                  ),
                ],
              ),
            ),
            ...tool.options.map((o) => _buildOptionTile(context, o)),
            if (page != null)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                child: Semantics(
                  button: true,
                  label: '${t['exploreFeatures']} — ${tool.title}',
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.of(context)
                        .push(MaterialPageRoute(builder: (_) => page)),
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
