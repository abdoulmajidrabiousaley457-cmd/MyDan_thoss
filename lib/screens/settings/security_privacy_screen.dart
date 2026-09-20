import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';

/// Security & Privacy screen.
class SecurityPrivacyScreen extends StatefulWidget {
  const SecurityPrivacyScreen({super.key});

  @override
  State<SecurityPrivacyScreen> createState() => _SecurityPrivacyScreenState();
}

class _SecurityPrivacyScreenState extends State<SecurityPrivacyScreen> {
  bool _twoFactor = true;
  bool _biometrics = false;
  bool _analytics = false;

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(title: Text(t['securityTitle'])),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _infoCard(
              icon: Icons.lock_outline,
              color: AppColors.greenPrimary,
              title: t['securityEncryption'],
              subtitle: t['securityEncryptionDesc'],
            ),
            const SizedBox(height: 12),
            _switchTile(
              icon: Icons.verified_user_outlined,
              color: AppColors.accentBlue,
              title: t['securityAuth'],
              subtitle: t['securityAuthDesc'],
              value: _twoFactor,
              onChanged: (v) => setState(() => _twoFactor = v),
            ),
            _switchTile(
              icon: Icons.fingerprint,
              color: AppColors.accentPurple,
              title: 'Biometric lock',
              subtitle: 'Face ID / Fingerprint',
              value: _biometrics,
              onChanged: (v) => setState(() => _biometrics = v),
            ),
            _switchTile(
              icon: Icons.analytics_outlined,
              color: AppColors.accentTeal,
              title: 'Usage analytics',
              subtitle: 'Share anonymous usage data',
              value: _analytics,
              onChanged: (v) => setState(() => _analytics = v),
            ),
            const SizedBox(height: 12),
            _infoCard(
              icon: Icons.privacy_tip_outlined,
              color: AppColors.accentOrange,
              title: t['securityData'],
              subtitle: t['securityDataDesc'],
            ),
            const SizedBox(height: 20),
            _linkTile(context, t['securityPrivacyPolicy']),
            _linkTile(context, t['securityTerms']),
            const SizedBox(height: 20),
            Center(
              child: Text(
                'MyDan_thoss · v1.0.0',
                style: const TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoCard({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(11),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _switchTile({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(14),
      ),
      child: SwitchListTile(
        value: value,
        onChanged: onChanged,
        activeThumbColor: AppColors.greenPrimary,
        secondary: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(11),
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(
          title,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 13.5,
            fontWeight: FontWeight.w500,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(
            color: AppColors.textTertiary,
            fontSize: 11.5,
          ),
        ),
      ),
    );
  }

  Widget _linkTile(BuildContext context, String title) {
    return ListTile(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(title),
            backgroundColor: AppColors.greenPrimary,
            duration: const Duration(seconds: 1),
          ),
        );
      },
      title: Text(
        title,
        style: const TextStyle(
          color: AppColors.greenDark,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing: const Icon(Icons.open_in_new,
          color: AppColors.textTertiary, size: 18),
    );
  }
}
