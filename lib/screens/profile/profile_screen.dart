import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Profile Header
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: AppColors.bluePurpleGradient,
                ),
                child: Column(
                  children: [
                    const CircleAvatar(
                      radius: 45,
                      backgroundColor: Colors.white,
                      child: Icon(
                        Icons.person,
                        size: 50,
                        color: AppColors.accentBlue,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Investor Pro',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.primaryGold,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.diamond,
                            color: Colors.black,
                            size: 16,
                          ),
                          SizedBox(width: 6),
                          Text(
                            'Premium Member',
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildStatItem('Investment Days', '365'),
                        Container(
                          width: 1,
                          height: 30,
                          color: Colors.white24,
                        ),
                        _buildStatItem('Total Return', '+15.7%'),
                        Container(
                          width: 1,
                          height: 30,
                          color: Colors.white24,
                        ),
                        _buildStatItem('Win Rate', '68%'),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Services Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'My Services',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 16),
                    _buildServiceGrid(context),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Settings Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Settings',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 16),
                    _buildSettingsItem(
                      Icons.person_outline,
                      'Account Information',
                      '',
                    ),
                    _buildSettingsItem(
                      Icons.security_outlined,
                      'Security & Privacy',
                      '',
                    ),
                    _buildSettingsItem(
                      Icons.palette_outlined,
                      'Theme & Display',
                      'Dark Mode',
                    ),
                    _buildSettingsItem(
                      Icons.notifications_outlined,
                      'Notifications',
                      '',
                    ),
                    _buildSettingsItem(
                      Icons.help_outline,
                      'Help & Feedback',
                      '',
                    ),
                    _buildSettingsItem(
                      Icons.info_outline,
                      'About MarketMind',
                      'v1.0.0',
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Logout Button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.errorRed,
                    minimumSize: const Size(double.infinity, 50),
                  ),
                  child: const Text(
                    'Logout',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildServiceGrid(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 3,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 1.0,
      children: [
        _buildServiceCard(
          Icons.diamond_outlined,
          'Membership',
          AppColors.primaryGold,
        ),
        _buildServiceCard(
          Icons.assessment_outlined,
          'Risk Profile',
          AppColors.accentOrange,
        ),
        _buildServiceCard(
          Icons.school_outlined,
          'Learning',
          AppColors.accentBlue,
        ),
        _buildServiceCard(
          Icons.edit_note,
          'Trading Log',
          AppColors.accentTeal,
        ),
        _buildServiceCard(
          Icons.emoji_events_outlined,
          'Achievements',
          AppColors.accentPurple,
        ),
        _buildServiceCard(
          Icons.forum_outlined,
          'Community',
          AppColors.successGreen,
        ),
      ],
    );
  }

  Widget _buildServiceCard(IconData icon, String label, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: color,
            size: 32,
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsItem(IconData icon, String title, String trailing) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.backgroundTertiary,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: Icon(
          icon,
          color: AppColors.textSecondary,
        ),
        title: Text(
          title,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 15,
            fontWeight: FontWeight.w500,
          ),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (trailing.isNotEmpty)
              Text(
                trailing,
                style: const TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 13,
                ),
              ),
            const SizedBox(width: 8),
            const Icon(
              Icons.chevron_right,
              color: AppColors.textTertiary,
              size: 20,
            ),
          ],
        ),
        onTap: () {},
      ),
    );
  }
}
