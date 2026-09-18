import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';

/// Data Scientist professional portfolio for Rabiou Saley Abdoul Majid.
class PortfolioProScreen extends StatelessWidget {
  const PortfolioProScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHero(context, t),
              const SizedBox(height: 20),
              _buildStats(context, t),
              const SizedBox(height: 24),
              _buildSectionTitle(context, t['portfolioAbout']),
              _buildAbout(context),
              const SizedBox(height: 24),
              _buildSectionTitle(context, t['portfolioSkills']),
              _buildSkills(context),
              const SizedBox(height: 24),
              _buildSectionTitle(context, t['portfolioProjects']),
              _buildProjects(context),
              const SizedBox(height: 24),
              _buildSectionTitle(context, t['portfolioExperience']),
              _buildExperience(context),
              const SizedBox(height: 24),
              _buildSectionTitle(context, t['portfolioEducation']),
              _buildEducation(context, t),
              const SizedBox(height: 24),
              _buildSectionTitle(context, t['portfolioContact']),
              _buildContact(context, t),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 20,
            decoration: BoxDecoration(
              gradient: AppColors.goldGradient,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 10),
          Text(title, style: Theme.of(context).textTheme.titleLarge),
        ],
      ),
    );
  }

  Widget _buildHero(BuildContext context, AppStrings t) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF1F2937), Color(0xFF111827)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          // Top bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: Row(
              children: [
                const Icon(Icons.code, color: AppColors.primaryGold, size: 20),
                const SizedBox(width: 8),
                const Text(
                  'RSAM · Portfolio',
                  style: TextStyle(
                    color: AppColors.primaryGold,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: AppColors.successGreen.withValues(alpha: 0.2),
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
                          color: AppColors.successGreen,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        'Available',
                        style: TextStyle(
                          color: AppColors.successGreen,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          // Avatar
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: AppColors.goldGradient,
            ),
            child: const CircleAvatar(
              radius: 52,
              backgroundColor: AppColors.backgroundTertiary,
              child: Text(
                'RS',
                style: TextStyle(
                  color: AppColors.primaryGold,
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Rabiou Saley Abdoul Majid',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            t['portfolioProRole'],
            style: const TextStyle(
              color: AppColors.primaryGold,
              fontSize: 15,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            t['portfolioProHeadline'],
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white60, fontSize: 12),
          ),
          const SizedBox(height: 16),
          // Tech badges
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Wrap(
              alignment: WrapAlignment.center,
              spacing: 8,
              runSpacing: 8,
              children: [
                'Python',
                'TensorFlow',
                'PyTorch',
                'Scikit-learn',
                'SQL',
                'Power BI',
                'RAG & LLM',
                'Docker',
              ].map((s) => _badge(s)).toList(),
            ),
          ),
          const SizedBox(height: 20),
          // Buttons
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _scrollHint(context),
                    icon: const Icon(Icons.folder_open, size: 18),
                    label: Text(t['portfolioViewProjects']),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _scrollHint(context),
                    icon: const Icon(Icons.mail_outline, size: 18),
                    label: Text(t['portfolioContactMe']),
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

  Widget _buildStats(BuildContext context, AppStrings t) {
    final stats = [
      ['5+', t['portfolioYearsExp']],
      ['12+', t['portfolioModels']],
      ['96%', t['portfolioAccuracy']],
      ['8+', t['portfolioCompanies']],
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 2.4,
        children: stats.map((s) {
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.backgroundTertiary,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.borderPrimary),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  s[0],
                  style: const TextStyle(
                    color: AppColors.primaryGold,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  s[1],
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 11,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAbout(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Data Scientist basé à Niamey, Niger, avec plus de 5 ans '
            'd\'expérience en Machine Learning, NLP et Data Visualisation. '
            'Passionné par la conception de modèles prédictifs fiables et '
            'd\'agents intelligents créateurs de valeur.',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 14,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _chip(Icons.school_outlined, 'Master Big Data & IA'),
              _chip(Icons.workspace_premium_outlined, 'Google Certified'),
              _chip(Icons.public, 'Niamey, Niger'),
              _chip(Icons.laptop_mac, 'Remote worldwide'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _chip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.backgroundElevated,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: AppColors.primaryGold, size: 14),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
          ),
        ],
      ),
    );
  }

  Widget _buildSkills(BuildContext context) {
    final groups = <String, List<List<Object>>>{
      'Langages & Données': [
        ['Python (NumPy, Pandas, SciPy)', 0.96],
        ['SQL (PostgreSQL, BigQuery)', 0.92],
        ['R & Statistiques Appliquées', 0.80],
      ],
      'Machine Learning & Deep Learning': [
        ['Scikit-learn, XGBoost, LightGBM', 0.95],
        ['TensorFlow & Keras (Google)', 0.88],
        ['PyTorch & Deep Neural Networks', 0.82],
        ['NLP, Transformers & RAG (BERT)', 0.90],
      ],
      'Data Visualisation & BI': [
        ['Power BI (DAX, Power Query)', 0.90],
        ['Matplotlib, Seaborn, Plotly', 0.94],
        ['D3.js & Dashboards Web', 0.75],
      ],
      'Data Engineering & MLOps': [
        ['Docker & Containerisation', 0.85],
        ['Kafka & Airflow', 0.80],
        ['Google Cloud Platform', 0.86],
        ['Git, CI/CD & MLOps (MLflow)', 0.88],
      ],
    };

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: groups.entries.expand((entry) {
          return [
            Padding(
              padding: const EdgeInsets.only(top: 4, bottom: 10),
              child: Text(
                entry.key,
                style: const TextStyle(
                  color: AppColors.primaryGold,
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            ...entry.value.map((s) => _buildSkillBar(
                  s[0] as String,
                  s[1] as double,
                )),
            const SizedBox(height: 10),
          ];
        }).toList(),
      ),
    );
  }

  Widget _buildSkillBar(String label, double value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 12.5,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Text(
                '${(value * 100).round()}%',
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 5),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: value,
              minHeight: 6,
              backgroundColor: AppColors.backgroundElevated,
              valueColor: const AlwaysStoppedAnimation<Color>(
                AppColors.primaryGold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjects(BuildContext context) {
    final projects = [
      {
        'icon': Icons.person_remove_outlined,
        'title': 'Prédiction du Churn Client',
        'desc':
            'Modèle de classification (Random Forest & XGBoost) prédisant la résiliation client avec 96% de précision pour un opérateur télécom.',
        'tags': ['Python', 'Scikit-learn', 'XGBoost'],
        'color': AppColors.accentBlue,
      },
      {
        'icon': Icons.timeline,
        'title': 'Prévision des Ventes (Séries Temporelles)',
        'desc':
            'Modèle Prophet & LSTM pour anticiper la demande produit sur 12 mois, réduisant les ruptures de stock de 30%.',
        'tags': ['Prophet', 'LSTM', 'PyTorch'],
        'color': AppColors.accentPurple,
      },
      {
        'icon': Icons.sentiment_satisfied_alt,
        'title': 'Analyse de Sentiment — Avis Clients',
        'desc':
            'Pipeline NLP basé sur BERT pour classifier automatiquement des milliers d\'avis clients et détecter les signaux négatifs.',
        'tags': ['BERT', 'NLP', 'HuggingFace'],
        'color': AppColors.accentTeal,
      },
      {
        'icon': Icons.dashboard_outlined,
        'title': 'Dashboard Interactif COVID-19',
        'desc':
            'Tableau de bord Power BI en temps réel suivant la propagation et l\'impact sanitaire à l\'échelle régionale.',
        'tags': ['Power BI', 'SQL', 'DAX'],
        'color': AppColors.accentOrange,
      },
      {
        'icon': Icons.gpp_maybe_outlined,
        'title': 'Détection de Fraude Bancaire',
        'desc':
            'Système de détection d\'anomalies en temps réel combinant Isolation Forest et réseaux de neurones.',
        'tags': ['Isolation Forest', 'Keras', 'Kafka'],
        'color': AppColors.upColor,
      },
      {
        'icon': Icons.smart_toy_outlined,
        'title': 'Chatbot Support Client (LLM + RAG)',
        'desc':
            'Assistant conversationnel basé sur des modèles de langage et le RAG pour automatiser 60% des requêtes support.',
        'tags': ['LLM', 'RAG', 'LangChain', 'FastAPI'],
        'color': AppColors.primaryGold,
      },
    ];

    return Column(
      children: projects.map((p) {
        final color = p['color'] as Color;
        return Container(
          margin: const EdgeInsets.only(left: 16, right: 16, bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.backgroundTertiary,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: color.withValues(alpha: 0.25)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(p['icon'] as IconData, color: color, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      p['title'] as String,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 14.5,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                p['desc'] as String,
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 12.5,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: (p['tags'] as List<String>).map((tag) {
                  return Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      tag,
                      style: TextStyle(
                        color: color,
                        fontSize: 10.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildExperience(BuildContext context) {
    final jobs = [
      {
        'period': '2022 — Présent',
        'company': 'NexaData Analytics',
        'role': 'Data Scientist Senior',
        'points': [
          'Système de détection de fraude : 300 000 €/an économisés.',
          'Encadrement de 3 data analysts + pratiques MLOps.',
          'Modèle de prévision des ventes : -30% de ruptures de stock.',
        ],
      },
      {
        'period': '2020 — 2022',
        'company': 'FinTech Solutions',
        'role': 'Data Analyst',
        'points': [
          'Dashboards Power BI de suivi financier en temps réel.',
          'Automatisation des reportings : -70% de temps de traitement.',
          'Segmentation clients (K-Means) et optimisation des KPIs.',
        ],
      },
      {
        'period': '2019 — 2020',
        'company': 'RetailPlus',
        'role': 'Stagiaire Data Analyst',
        'points': [
          'Segmentation clientèle RFM (Récence, Fréquence, Montant).',
          'Prototype de prévision de la demande saisonnière.',
        ],
      },
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: List.generate(jobs.length, (i) {
          final job = jobs[i];
          final isLast = i == jobs.length - 1;
          return IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Timeline
                Column(
                  children: [
                    Container(
                      width: 14,
                      height: 14,
                      decoration: const BoxDecoration(
                        color: AppColors.primaryGold,
                        shape: BoxShape.circle,
                      ),
                    ),
                    if (!isLast)
                      Expanded(
                        child: Container(
                          width: 2,
                          color: AppColors.borderPrimary,
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          job['period'] as String,
                          style: const TextStyle(
                            color: AppColors.primaryGold,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          job['role'] as String,
                          style: const TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          job['company'] as String,
                          style: const TextStyle(
                            color: AppColors.accentBlue,
                            fontSize: 12.5,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 8),
                        ...(job['points'] as List<String>).map(
                          (pt) => Padding(
                            padding: const EdgeInsets.only(bottom: 4),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Padding(
                                  padding: EdgeInsets.only(top: 6),
                                  child: Icon(
                                    Icons.circle,
                                    size: 4,
                                    color: AppColors.textTertiary,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    pt,
                                    style: const TextStyle(
                                      color: AppColors.textSecondary,
                                      fontSize: 12.5,
                                      height: 1.4,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildEducation(BuildContext context, AppStrings t) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          _buildEduCard(
            icon: Icons.school_outlined,
            period: '2018 — 2020',
            title: t['portfolioMasterTitle'],
            subtitle: t['portfolioMasterSchool'],
            color: AppColors.accentPurple,
          ),
          const SizedBox(height: 12),
          _buildEduCard(
            icon: Icons.workspace_premium_outlined,
            period: '2021 — 2022',
            title: t['portfolioCertTitle'],
            subtitle:
                'TensorFlow Developer · GCP Professional Data Engineer · DeepLearning.AI',
            color: AppColors.primaryGold,
          ),
        ],
      ),
    );
  }

  Widget _buildEduCard({
    required IconData icon,
    required String period,
    required String title,
    required String subtitle,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  period,
                  style: TextStyle(
                    color: color,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 13.5,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContact(BuildContext context, AppStrings t) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.bluePurpleGradient,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.location_on_outlined, color: Colors.white, size: 18),
              SizedBox(width: 8),
              Text(
                'Niamey, Niger · Remote worldwide',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
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
                'Français · English · العربية',
                style: TextStyle(color: Colors.white70, fontSize: 13),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Contact: rabiou.saley@example.com'),
                  backgroundColor: AppColors.backgroundElevated,
                ),
              );
            },
            icon: const Icon(Icons.send, size: 18),
            label: Text(t['portfolioSendMessage']),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppColors.accentBlue,
              minimumSize: const Size(double.infinity, 48),
            ),
          ),
        ],
      ),
    );
  }

  void _scrollHint(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Scroll down to explore projects and experience.'),
        backgroundColor: AppColors.backgroundElevated,
      ),
    );
  }
}
