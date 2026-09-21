import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../l10n/app_strings.dart';
import '../../services/book_library_service.dart';
import '../../theme/app_colors.dart';
import '../../widgets/tool_catalog.dart';
import '../../widgets/tool_logo.dart';
import '../library/library_screen.dart';

/// Product screen — replaces the former Referral tab.
///
/// Showcases AI model templates (with examples), the product catalog and
/// monthly / yearly subscription plans, plus a direct contact entry point.
class ProductScreen extends StatefulWidget {
  const ProductScreen({super.key});

  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen> {
  bool _yearly = false;
  int _selectedPlan = 1; // Pro selected by default.

  static const String _contactEmail = 'contact@mydanthoss.com';

  void _subscribe(String plan) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$plan — ${_yearly ? 'Yearly' : 'Monthly'}'),
        backgroundColor: AppColors.greenPrimary,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    final tools = ToolCatalog.all(context);

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(context, t),
              const SizedBox(height: 20),
              _sectionTitle(context, t['productModels']),
              _buildModelTemplates(context, t, tools),
              const SizedBox(height: 24),
              _sectionTitle(context, t['subTitle']),
              _buildBillingToggle(context, t),
              const SizedBox(height: 12),
              _buildPlans(context, t),
              const SizedBox(height: 24),
              _sectionTitle(context, t['productProducts']),
              _buildProductCatalog(context, t),
              const SizedBox(height: 24),
              _sectionTitle(context, t['libraryTitle']),
              _buildLibraryCard(context, t),
              const SizedBox(height: 24),
              _buildContactCard(context, t),
              const SizedBox(height: 28),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, AppStrings t) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 22, 20, 24),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.greenPrimary, AppColors.greenDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.storefront, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  t['productTitle'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 19,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  t['productSubtitle'],
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
      child: Text(title, style: Theme.of(context).textTheme.titleMedium),
    );
  }

  // ---------------- AI model templates with examples ----------------
  Widget _buildModelTemplates(
      BuildContext context, AppStrings t, List<ToolDef> tools) {
    // Show the first tools that expose examples.
    final withExamples = tools.where((e) => e.examples.isNotEmpty).toList();
    return SizedBox(
      height: 232,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: withExamples.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, i) {
          final tool = withExamples[i];
          return _modelCard(context, t, tool);
        },
      ),
    );
  }

  Widget _modelCard(BuildContext context, AppStrings t, ToolDef tool) {
    return Container(
      width: 260,
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
              ToolLogoImage(
                asset: tool.logoAsset,
                remoteUrl: ToolLogos.remoteReferences[tool.key],
                fallbackIcon: tool.icon,
                gradient: tool.gradient,
                semanticLabel: tool.title,
                size: 46,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  tool.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            t['exampleTemplates'],
            style: const TextStyle(
              color: AppColors.greenDark,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.3,
            ),
          ),
          const SizedBox(height: 6),
          ...tool.examples.take(3).map(
                (ex) => Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Padding(
                        padding: EdgeInsets.only(top: 5),
                        child: Icon(Icons.auto_awesome,
                            size: 12, color: AppColors.greenPrimary),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          ex,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 11.5,
                            height: 1.25,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          const Spacer(),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () => _subscribe(tool.title),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.greenPrimary,
                side: const BorderSide(color: AppColors.greenPrimary),
                padding: const EdgeInsets.symmetric(vertical: 8),
              ),
              child: Text(t['useTemplate'],
                  style: const TextStyle(fontSize: 12)),
            ),
          ),
        ],
      ),
    );
  }

  // ---------------- Subscription billing toggle ----------------
  Widget _buildBillingToggle(BuildContext context, AppStrings t) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _toggleBtn(t['subMonthly'], !_yearly, () => setState(() => _yearly = false)),
          const SizedBox(width: 8),
          _toggleBtn(t['subYearly'], _yearly, () => setState(() => _yearly = true)),
          if (_yearly) ...[
            const SizedBox(width: 10),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.pastelGreen,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                t['subSave'],
                style: const TextStyle(
                  color: AppColors.greenDark,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _toggleBtn(String label, bool active, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 9),
        decoration: BoxDecoration(
          color: active ? AppColors.greenPrimary : AppColors.backgroundSecondary,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: active ? AppColors.greenPrimary : AppColors.borderPrimary,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: active ? Colors.white : AppColors.textSecondary,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  // ---------------- Plans ----------------
  Widget _buildPlans(BuildContext context, AppStrings t) {
    final monthly = [0, 19, 79];
    final yearly = [0, 182, 758];
    final names = [t['subFree'], t['subPro'], t['subEnterprise']];
    final features = [
      [t['productModels'], t['dataAnalysis'], t['currencyConverter']],
      [t['productModels'], t['aiStockScreener'], t['trackingEval'], t['financialReport']],
      [
        t['productModels'],
        t['aiStockScreener'],
        t['trackingEval'],
        t['financialReport'],
        t['valuationCalculator'],
        t['capitalFlow'],
      ],
    ];
    final prices = _yearly ? yearly : monthly;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: List.generate(3, (i) {
          final isPopular = i == 1;
          final selected = i == _selectedPlan;
          return GestureDetector(
            onTap: () => setState(() => _selectedPlan = i),
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.backgroundSecondary,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(
                  color: selected ? AppColors.greenPrimary : AppColors.borderPrimary,
                  width: selected ? 2 : 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        names[i],
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 8),
                      if (isPopular)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.greenPrimary,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            t['subPopular'],
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 9.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      const Spacer(),
                      Text(
                        prices[i] == 0 ? '\$0' : '\$${prices[i]}',
                        style: const TextStyle(
                          color: AppColors.greenDark,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        _yearly ? t['subPerYear'] : t['subPerMonth'],
                        style: const TextStyle(
                          color: AppColors.textTertiary,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  ...features[i].map(
                    (f) => Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        children: [
                          const Icon(Icons.check_circle,
                              size: 14, color: AppColors.greenPrimary),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              f,
                              style: const TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => _subscribe(names[i]),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: selected
                            ? AppColors.greenPrimary
                            : AppColors.backgroundElevated,
                        foregroundColor: selected
                            ? Colors.white
                            : AppColors.textPrimary,
                        minimumSize: const Size(double.infinity, 44),
                      ),
                      child: Text(
                        selected ? t['subCurrent'] : t['subSubscribe'],
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }

  // ---------------- Product catalog ----------------
  Widget _buildProductCatalog(BuildContext context, AppStrings t) {
    final products = [
      [Icons.smart_toy_outlined, AppColors.accentPurple, t['prodExample1'], '\$149'],
      [Icons.trending_up, AppColors.greenPrimary, t['prodExample2'], '\$199'],
      [Icons.sentiment_satisfied_alt, AppColors.accentTeal, t['prodExample3'], '\$129'],
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: products.map((p) {
          final color = p[1] as Color;
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            decoration: BoxDecoration(
              color: AppColors.backgroundSecondary,
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: ListTile(
              leading: Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(11),
                ),
                child: Icon(p[0] as IconData, color: color, size: 20),
              ),
              title: Text(
                p[2] as String,
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 13.5,
                  fontWeight: FontWeight.w600,
                ),
              ),
              subtitle: Text(
                t['productProductsDesc'],
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 11,
                ),
              ),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    p[3] as String,
                    style: const TextStyle(
                      color: AppColors.greenDark,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.chevron_right,
                      color: AppColors.textTertiary),
                ],
              ),
              onTap: () => _subscribe(p[2] as String),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ---------------- Library (PDF books) ----------------
  Widget _buildLibraryCard(BuildContext context, AppStrings t) {
    final preview = BookLibraryService.books.take(3).toList();
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
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
              Container(
                padding: const EdgeInsets.all(9),
                decoration: BoxDecoration(
                  gradient: AppColors.toolIndigo,
                  borderRadius: BorderRadius.circular(11),
                ),
                child: const Icon(Icons.menu_book,
                    color: Colors.white, size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      t['libraryTitle'],
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      t['librarySubtitle'],
                      style: const TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.pastelIndigo,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '${BookLibraryService.books.length} ${t['libraryBooks']}',
                  style: const TextStyle(
                    color: AppColors.accentPurple,
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...preview.map(
            (b) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  const Icon(Icons.picture_as_pdf,
                      size: 16, color: AppColors.downColor),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      b.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  Text(
                    b.author.split(' ').first,
                    style: const TextStyle(
                      color: AppColors.textTertiary,
                      fontSize: 10.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const LibraryScreen()),
              ),
              icon: const Icon(Icons.library_books, size: 18),
              label: Text(t['libraryTitle']),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.accentPurple,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 46),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactCard(BuildContext context, AppStrings t) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.blueGradient,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.support_agent, color: Colors.white, size: 20),
              const SizedBox(width: 8),
              Text(
                t['productContact'],
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            t['productContactDesc'],
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    Clipboard.setData(const ClipboardData(text: _contactEmail));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(t['portfolioCopyEmail']),
                        backgroundColor: AppColors.greenPrimary,
                      ),
                    );
                  },
                  icon: const Icon(Icons.mail_outline, size: 18),
                  label: Text(_contactEmail),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.bluePrimary,
                    minimumSize: const Size(double.infinity, 46),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
