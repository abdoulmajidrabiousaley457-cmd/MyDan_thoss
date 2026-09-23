import 'package:flutter/material.dart';

import '../l10n/app_strings.dart';
import '../theme/app_colors.dart';

/// A realised-project example ("projet réalisé") shown inside each tool.
///
/// Each entry documents a concrete, delivered project: the client context,
/// the challenge, the solution and the measurable result — so users can see a
/// real outcome behind every tool.
class ProjectCaseStudy {
  final String client;
  final String sector;

  /// i18n keys are resolved by the widget, so we keep the raw strings here and
  /// pass them through the caller for full localisation support.
  final String challenge;
  final String solution;
  final String result;

  /// Result metrics displayed as KPI chips (label, value).
  final List<List<String>> metrics;

  /// Accent colour for the card.
  final Color color;

  /// Icon representing the project.
  final IconData icon;

  const ProjectCaseStudy({
    required this.client,
    required this.sector,
    required this.challenge,
    required this.solution,
    required this.result,
    required this.metrics,
    required this.color,
    required this.icon,
  });
}

/// Renders a [ProjectCaseStudy] as an attractive, accessible card.
class ProjectCaseStudyCard extends StatelessWidget {
  final ProjectCaseStudy study;

  const ProjectCaseStudyCard({super.key, required this.study});

  @override
  Widget build(BuildContext context) {
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(context, t),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildBlock(
                  t['pcChallenge'],
                  study.challenge,
                  Icons.help_outline,
                  AppColors.warningYellow,
                ),
                const SizedBox(height: 10),
                _buildBlock(
                  t['pcSolution'],
                  study.solution,
                  Icons.lightbulb_outline,
                  AppColors.infoBlue,
                ),
                const SizedBox(height: 10),
                _buildBlock(
                  t['pcResult'],
                  study.result,
                  Icons.emoji_events_outlined,
                  AppColors.upColor,
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: study.metrics
                  .map((m) => _metricChip(m[0], m[1]))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, AppStrings t) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [study.color, study.color.withValues(alpha: 0.75)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(9),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(11),
            ),
            child: Icon(study.icon, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.check_circle,
                      color: Colors.white,
                      size: 13,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      t['pcDelivered'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.4,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  study.client,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  study.sector,
                  style: const TextStyle(color: Colors.white70, fontSize: 11.5),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBlock(String label, String text, IconData icon, Color color) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.14),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: color, size: 15),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  color: color,
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                text,
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 12.5,
                  height: 1.35,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _metricChip(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 7),
      decoration: BoxDecoration(
        color: study.color.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: study.color.withValues(alpha: 0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: AppColors.textTertiary,
              fontSize: 9.5,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: TextStyle(
              color: study.color,
              fontSize: 13,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
