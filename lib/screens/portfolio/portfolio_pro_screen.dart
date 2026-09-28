import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/responsive.dart';

/// My_danthoss — private investment cabinet portfolio.
///
/// Turns the personal CV-style portfolio into the **firm's** portfolio:
/// strategic allocation, investment pillars, governance limits, an equity
/// curve and the cabinet's mandates / contact channels.
class PortfolioProScreen extends StatelessWidget {
  const PortfolioProScreen({super.key});

  // ---- Cabinet contact details ----
  static const String _email = 'contact@mydanthoss.com';
  static const String _phone = '+22796499906';
  static const String _whatsapp = '22796499906';
  static const String _linkedin = 'https://www.linkedin.com/company/mydanthoss';
  static const String _github = 'https://github.com/abdoulmajidrabiousaley457-cmd';
  static const String _x = 'https://x.com/RabiousaleyM';

  // ---- Strategic allocation (matches the agent's treasury model) ----
  static const List<_AllocSlice> _allocation = [
    _AllocSlice('pfPilCore', 0.525, Color(0xFF16A34A)),
    _AllocSlice('pfPilTreasury', 0.272, Color(0xFF0284C7)),
    _AllocSlice('pfPilFx', 0.109, Color(0xFFF59E0B)),
    _AllocSlice('pfPilGrowth', 0.094, Color(0xFF7C3AED)),
  ];

  // ---- 12-month equity curve (normalised index, base 100) ----
  static const List<double> _equity = [
    100, 101.4, 100.2, 103.6, 105.1, 104.2,
    107.8, 110.3, 109.1, 112.6, 115.4, 118.9,
  ];

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      body: SafeArea(
        child: SingleChildScrollView(
          child: ResponsiveCenter(
            maxWidth: 760,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHero(context, t),
                const SizedBox(height: 20),
                _buildStats(context, t),
                const SizedBox(height: 24),
                _sectionTitle(context, t['pfPerformance']),
                _buildEquityChart(context, t),
                const SizedBox(height: 24),
                _sectionTitle(context, t['pfAllocation']),
                _buildAllocation(context, t),
                const SizedBox(height: 24),
                _sectionTitle(context, t['pfPillars']),
                _buildPillars(context, t),
                const SizedBox(height: 24),
                _sectionTitle(context, t['pfServices']),
                _buildServices(context, t),
                const SizedBox(height: 24),
                _sectionTitle(context, t['pfGovernance']),
                _buildGovernance(context, t),
                const SizedBox(height: 24),
                _sectionTitle(context, t['pfContactTitle']),
                _buildContact(context, t),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------- section

  Widget _sectionTitle(BuildContext context, String title) {
    return Padding(
      padding: EdgeInsets.fromLTRB(context.pagePadding, 0, context.pagePadding, 12),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 20,
            decoration: BoxDecoration(
              gradient: AppColors.greenGradient,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(title, style: Theme.of(context).textTheme.titleLarge),
          ),
        ],
      ),
    );
  }

  // ------------------------------------------------------------------- hero

  Widget _buildHero(BuildContext context, AppStrings t) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF0F2A1D), Color(0xFF123B27), Color(0xFF0B1F16)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: Row(
              children: [
                const AppLogo(size: 30),
                const SizedBox(width: 8),
                Flexible(
                  child: Text(
                    t['appName'].toUpperCase(),
                    style: const TextStyle(
                      color: AppColors.greenAccent,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      letterSpacing: 1.2,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: AppColors.successGreen.withValues(alpha: 0.18),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppColors.successGreen.withValues(alpha: 0.5),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppColors.greenAccent,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        'AUM 16.4M\u20AC',
                        style: TextStyle(
                          color: AppColors.greenAccent,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),
          // Founder portrait shown to visitors (kept exactly as provided).
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              gradient: AppColors.greenGradient,
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.35),
                  blurRadius: 24,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(19),
              child: SizedBox(
                width: 142,
                height: 254,
                child: Image.asset(
                  'assets/portfolio/rabiou_portrait.jpg',
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: const Color(0xFF0F2A1D),
                    alignment: Alignment.center,
                    child: const Icon(
                      Icons.account_balance_rounded,
                      color: AppColors.greenAccent,
                      size: 48,
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 18),
          Text(
            t['pfCabinet'],
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 23,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Text(
              t['pfSubtitle'],
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.white60, fontSize: 12.5),
            ),
          ),
          const SizedBox(height: 14),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Wrap(
              alignment: WrapAlignment.center,
              spacing: 8,
              runSpacing: 8,
              children: [
                '${t['pfFounded']} 2021',
                '${t['pfHq']}: Niamey · Genève',
                'FR · EN · AR',
              ].map((s) => _badge(s)).toList(),
            ),
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _scrollHint(context, t['pfViewAllocation']),
                    icon: const Icon(Icons.pie_chart_outline, size: 18),
                    label: Text(t['pfViewAllocation']),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _launch(context, Uri.parse('mailto:$_email')),
                    icon: const Icon(Icons.mail_outline, size: 18),
                    label: Text(t['pfTalkAdvisors']),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white38),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _badge(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  // ------------------------------------------------------------------ stats

  Widget _buildStats(BuildContext context, AppStrings t) {
    final stats = [
      ['16.4M\u20AC', t['pfNav']],
      ['+18.9%', t['pfYtd']],
      ['1.92', t['pfSharpe']],
      ['34', t['pfMandates']],
    ];
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: context.pagePadding),
      child: GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: context.screenWidth < 360 ? 2 : 4,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: context.screenWidth < 360 ? 1.9 : 1.15,
        children: stats.map((s) {
          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.backgroundTertiary,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.borderPrimary),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(
                    s[0],
                    style: const TextStyle(
                      color: AppColors.greenPrimary,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  s[1],
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 10.5,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  // ----------------------------------------------------------- equity chart

  Widget _buildEquityChart(BuildContext context, AppStrings t) {
    final spots = <FlSpot>[
      for (int i = 0; i < _equity.length; i++) FlSpot(i.toDouble(), _equity[i]),
    ];
    return Container(
      margin: EdgeInsets.symmetric(horizontal: context.pagePadding),
      padding: const EdgeInsets.fromLTRB(8, 18, 18, 8),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderPrimary),
      ),
      child: SizedBox(
        height: 190,
        child: LineChart(
          LineChartData(
            minY: 96,
            maxY: 122,
            gridData: FlGridData(
              show: true,
              drawVerticalLine: false,
              horizontalInterval: 6,
              getDrawingHorizontalLine: (v) =>
                  const FlLine(color: AppColors.divider, strokeWidth: 1),
            ),
            titlesData: FlTitlesData(
              topTitles: const AxisTitles(
                sideTitles: SideTitles(showTitles: false),
              ),
              rightTitles: const AxisTitles(
                sideTitles: SideTitles(showTitles: false),
              ),
              leftTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  reservedSize: 34,
                  interval: 6,
                  getTitlesWidget: (v, meta) => Text(
                    v.toInt().toString(),
                    style: const TextStyle(
                      color: AppColors.textTertiary,
                      fontSize: 10,
                    ),
                  ),
                ),
              ),
              bottomTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  interval: 2,
                  getTitlesWidget: (v, meta) {
                    const labels = [
                      'J', 'F', 'M', 'A', 'M', 'J',
                      'J', 'A', 'S', 'O', 'N', 'D',
                    ];
                    final i = v.toInt();
                    if (i < 0 || i >= labels.length) return const SizedBox();
                    return Text(
                      labels[i],
                      style: const TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 10,
                      ),
                    );
                  },
                ),
              ),
            ),
            borderData: FlBorderData(show: false),
            lineTouchData: const LineTouchData(enabled: false),
            lineBarsData: [
              LineChartBarData(
                spots: spots,
                isCurved: true,
                color: AppColors.greenPrimary,
                barWidth: 3,
                dotData: const FlDotData(show: false),
                belowBarData: BarAreaData(
                  show: true,
                  gradient: LinearGradient(
                    colors: [
                      AppColors.greenPrimary.withValues(alpha: 0.28),
                      AppColors.greenPrimary.withValues(alpha: 0.0),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // -------------------------------------------------------- allocation pie

  Widget _buildAllocation(BuildContext context, AppStrings t) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: context.pagePadding),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderPrimary),
      ),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final wide = constraints.maxWidth > 420;
          final chart = SizedBox(
            width: 150,
            height: 150,
            child: Stack(
              alignment: Alignment.center,
              children: [
                PieChart(
                  PieChartData(
                    sectionsSpace: 2,
                    centerSpaceRadius: 42,
                    startDegreeOffset: -90,
                    sections: _allocation
                        .map(
                          (s) => PieChartSectionData(
                            value: s.weight * 100,
                            color: s.color,
                            radius: 22,
                            showTitle: false,
                          ),
                        )
                        .toList(),
                  ),
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      '100%',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      t['pfDeployed'],
                      style: const TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 9.5,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
          final legend = Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: _allocation
                .map((s) => _legendRow(t, s))
                .toList(),
          );
          if (!wide) {
            return Column(
              children: [
                chart,
                const SizedBox(height: 16),
                legend,
              ],
            );
          }
          return Row(
            children: [
              chart,
              const SizedBox(width: 24),
              Expanded(child: legend),
            ],
          );
        },
      ),
    );
  }

  Widget _legendRow(AppStrings t, _AllocSlice s) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(
              color: s.color,
              borderRadius: BorderRadius.circular(3),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              t[s.key],
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 12.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Text(
            '${(s.weight * 100).toStringAsFixed(1)}%',
            style: TextStyle(
              color: s.color,
              fontSize: 12.5,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------- pillars

  Widget _buildPillars(BuildContext context, AppStrings t) {
    final pillars = [
      _Pillar('pfPilCore', 'pfPilCoreD', Icons.trending_up, _allocation[0].color, '52.5%'),
      _Pillar('pfPilTreasury', 'pfPilTreasuryD', Icons.account_balance,
          _allocation[1].color, '27.2%'),
      _Pillar('pfPilFx', 'pfPilFxD', Icons.currency_exchange,
          _allocation[2].color, '10.9%'),
      _Pillar('pfPilGrowth', 'pfPilGrowthD', Icons.rocket_launch,
          _allocation[3].color, '9.4%'),
    ];
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: context.pagePadding),
      child: Column(
        children: pillars.map((p) => _pillarCard(t, p)).toList(),
      ),
    );
  }

  Widget _pillarCard(AppStrings t, _Pillar p) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: p.color.withValues(alpha: 0.25)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: p.color.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(p.icon, color: p.color, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        t[p.titleKey],
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 14.5,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Text(
                      p.weight,
                      style: TextStyle(
                        color: p.color,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  t[p.descKey],
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12.5,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --------------------------------------------------------------- services

  Widget _buildServices(BuildContext context, AppStrings t) {
    final services = [
      _Service('pfDiscretionary', 'pfDiscretionaryD', Icons.assignment_ind_outlined,
          AppColors.greenPrimary),
      _Service('pfAdvisory', 'pfAdvisoryD', Icons.insights_outlined,
          AppColors.accentBlue),
      _Service('pfFxOverlay', 'pfFxOverlayD', Icons.shield_outlined,
          AppColors.accentOrange),
      _Service('pfReporting', 'pfReportingD', Icons.description_outlined,
          AppColors.accentPurple),
    ];
    final twoCol = context.screenWidth >= 620;
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: context.pagePadding),
      child: twoCol
          ? GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.55,
              children: services.map((s) => _serviceCard(t, s)).toList(),
            )
          : Column(
              children: services
                  .map((s) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _serviceCard(t, s),
                      ))
                  .toList(),
            ),
    );
  }

  Widget _serviceCard(AppStrings t, _Service s) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderPrimary),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(9),
            decoration: BoxDecoration(
              color: s.color.withValues(alpha: 0.14),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(s.icon, color: s.color, size: 20),
          ),
          const SizedBox(height: 10),
          Text(
            t[s.titleKey],
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 13.5,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            t[s.descKey],
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 11.5,
              height: 1.35,
            ),
          ),
        ],
      ),
    );
  }

  // ------------------------------------------------------------- governance

  Widget _buildGovernance(BuildContext context, AppStrings t) {
    final rows = [
      [t['pfGovIssuer'], t['pfGovIssuerV']],
      [t['pfGovLiquidity'], t['pfGovLiquidityV']],
      [t['pfGovDuration'], t['pfGovDurationV']],
      [t['pfGovVar'], t['pfGovVarV']],
    ];
    return Container(
      margin: EdgeInsets.symmetric(horizontal: context.pagePadding),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderPrimary),
      ),
      child: Column(
        children: rows.map((r) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 7),
            child: Row(
              children: [
                const Icon(
                  Icons.verified_user_outlined,
                  color: AppColors.greenPrimary,
                  size: 16,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    r[0],
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12.5,
                    ),
                  ),
                ),
                Text(
                  r[1],
                  style: const TextStyle(
                    color: AppColors.greenDark,
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  // ---------------------------------------------------------------- contact

  Widget _buildContact(BuildContext context, AppStrings t) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: context.pagePadding),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.greenGradient,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.location_on_outlined, color: Colors.white, size: 18),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Niamey, Niger \u00b7 Gen\u00e8ve, Suisse',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Row(
            children: [
              Icon(Icons.translate, color: Colors.white70, size: 18),
              SizedBox(width: 8),
              Text(
                'Fran\u00e7ais \u00b7 English \u00b7 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',
                style: TextStyle(color: Colors.white70, fontSize: 13),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            t['portfolioDirectContact'],
            style: const TextStyle(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.3,
            ),
          ),
          const SizedBox(height: 12),
          _contactTile(
            context,
            icon: Icons.chat_bubble_outline,
            label: t['portfolioWhatsapp'],
            subtitle: '+227 96 49 99 06',
            onTap: () => _launch(context, Uri.parse('https://wa.me/$_whatsapp')),
          ),
          const SizedBox(height: 10),
          _contactTile(
            context,
            icon: Icons.call_outlined,
            label: t['portfolioCall'],
            subtitle: '+227 96 49 99 06',
            onTap: () => _launch(context, Uri.parse('tel:$_phone')),
          ),
          const SizedBox(height: 10),
          _contactTile(
            context,
            icon: Icons.business_center_outlined,
            label: t['portfolioLinkedin'],
            subtitle: 'in/mydanthoss',
            onTap: () => _launch(context, Uri.parse(_linkedin)),
          ),
          const SizedBox(height: 10),
          _contactTile(
            context,
            icon: Icons.code,
            label: t['portfolioGithub'],
            subtitle: 'abdoulmajidrabiousaley457-cmd',
            onTap: () => _launch(context, Uri.parse(_github)),
          ),
          const SizedBox(height: 10),
          _contactTile(
            context,
            icon: Icons.alternate_email,
            label: t['portfolioTwitter'],
            subtitle: '@RabiousaleyM',
            onTap: () => _launch(context, Uri.parse(_x)),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: () => _copyEmail(context, t),
            icon: const Icon(Icons.mail_outline, size: 18),
            label: const Text(_email),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppColors.greenDark,
              minimumSize: const Size(double.infinity, 48),
            ),
          ),
        ],
      ),
    );
  }

  Widget _contactTile(
    BuildContext context, {
    required IconData icon,
    required String label,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Semantics(
      button: true,
      label: label,
      hint: subtitle,
      child: Material(
        color: Colors.white.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                Icon(icon, color: Colors.white, size: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        label,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 13.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.arrow_forward_ios,
                  color: Colors.white54,
                  size: 14,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // -------------------------------------------------------------- utilities

  Future<void> _launch(BuildContext context, Uri uri) async {
    try {
      final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
      if (!ok && context.mounted) {
        _showSnack(context, uri.toString());
      }
    } catch (_) {
      if (context.mounted) _showSnack(context, uri.toString());
    }
  }

  Future<void> _copyEmail(BuildContext context, AppStrings t) async {
    await Clipboard.setData(const ClipboardData(text: _email));
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${t['portfolioCopyEmail']}: $_email'),
          backgroundColor: AppColors.backgroundElevated,
        ),
      );
    }
  }

  void _showSnack(BuildContext context, String value) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(value),
        backgroundColor: AppColors.backgroundElevated,
      ),
    );
  }

  void _scrollHint(BuildContext context, String label) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(label),
        backgroundColor: AppColors.backgroundElevated,
        duration: const Duration(milliseconds: 1200),
      ),
    );
  }
}

// ------------------------------------------------------------------- models

class _AllocSlice {
  final String key;
  final double weight;
  final Color color;
  const _AllocSlice(this.key, this.weight, this.color);
}

class _Pillar {
  final String titleKey;
  final String descKey;
  final IconData icon;
  final Color color;
  final String weight;
  const _Pillar(this.titleKey, this.descKey, this.icon, this.color, this.weight);
}

class _Service {
  final String titleKey;
  final String descKey;
  final IconData icon;
  final Color color;
  const _Service(this.titleKey, this.descKey, this.icon, this.color);
}
