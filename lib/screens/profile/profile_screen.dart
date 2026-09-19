import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../l10n/app_strings.dart';
import '../../providers/locale_provider.dart';
import '../../providers/user_profile_provider.dart';
import '../../theme/app_colors.dart';
import '../../widgets/language_selector.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _installDone = false;

  void _openEditSheet(BuildContext context) {
    final profile = context.read<UserProfileProvider>();
    final t = context.tr;
    final nameCtrl = TextEditingController(text: profile.name);
    final phoneCtrl = TextEditingController(text: profile.phone);
    final emailCtrl = TextEditingController(text: profile.email);
    final countryCtrl = TextEditingController(text: profile.country);
    final formKey = GlobalKey<FormState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.backgroundSecondary,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Form(
            key: formKey,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.person_outline,
                          color: AppColors.bluePrimary),
                      const SizedBox(width: 10),
                      Text(
                        profile.hasProfile ? t['editProfile'] : t['createProfile'],
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  _field(nameCtrl, t['fullName'], Icons.badge_outlined,
                      validator: (v) => (v == null || v.trim().isEmpty)
                          ? t['requiredField']
                          : null),
                  const SizedBox(height: 12),
                  _field(phoneCtrl, t['phoneNumber'], Icons.phone_outlined,
                      keyboard: TextInputType.phone),
                  const SizedBox(height: 12),
                  _field(emailCtrl, t['email'], Icons.mail_outline,
                      keyboard: TextInputType.emailAddress),
                  const SizedBox(height: 12),
                  _field(countryCtrl, t['country'], Icons.public),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: () async {
                      if (formKey.currentState?.validate() ?? false) {
                        await profile.save(
                          name: nameCtrl.text,
                          phone: phoneCtrl.text,
                          email: emailCtrl.text,
                          country: countryCtrl.text,
                        );
                        if (ctx.mounted) Navigator.of(ctx).pop();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(t['profileSaved']),
                              backgroundColor: AppColors.successGreen,
                            ),
                          );
                        }
                      }
                    },
                    icon: const Icon(Icons.check, size: 18),
                    label: Text(t['saveProfile']),
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 50),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _field(
    TextEditingController ctrl,
    String label,
    IconData icon, {
    TextInputType? keyboard,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: ctrl,
      keyboardType: keyboard,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, size: 20),
      ),
    );
  }

  void _installApp(BuildContext context, AppStrings t) {
    if (kIsWeb) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(t['installHint']),
          backgroundColor: AppColors.bluePrimary,
          duration: const Duration(seconds: 4),
        ),
      );
      setState(() => _installDone = true);
    } else {
      if (!kIsWeb && Platform.isAndroid) {
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: Text(t['installApp']),
            content: Text(t['installHint']),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(ctx).pop();
                  setState(() => _installDone = true);
                },
                child: Text(t['done']),
              ),
            ],
          ),
        );
      } else {
        setState(() => _installDone = true);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(t['appInstalled']),
            backgroundColor: AppColors.successGreen,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    final profile = context.watch<UserProfileProvider>();
    final locale = context.watch<LocaleProvider>();

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          child: Column(
            children: [
              _buildHeader(context, t, profile),
              const SizedBox(height: 20),
              if (!profile.hasProfile) _buildCreatePrompt(context, t),
              const SizedBox(height: 20),
              _buildInstallCard(context, t),
              const SizedBox(height: 20),
              _buildSettings(context, t, locale),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(
      BuildContext context, AppStrings t, UserProfileProvider profile) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.bluePrimary, AppColors.blueDeep],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          Stack(
            children: [
              CircleAvatar(
                radius: 46,
                backgroundColor: Colors.white,
                child: profile.hasProfile
                    ? Text(
                        profile.displayName
                            .split(' ')
                            .take(2)
                            .map((e) => e.isNotEmpty ? e[0] : '')
                            .join(),
                        style: const TextStyle(
                          color: AppColors.bluePrimary,
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                        ),
                      )
                    : const Icon(Icons.person,
                        size: 50, color: AppColors.bluePrimary),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: GestureDetector(
                  onTap: () => _openEditSheet(context),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: AppColors.orangePrimary,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    child: const Icon(Icons.edit,
                        color: Colors.white, size: 14),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            profile.hasProfile ? profile.name : t['notConnected'],
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          if (profile.hasProfile && profile.phone.isNotEmpty)
            Text(
              profile.phone,
              style: const TextStyle(color: Colors.white70, fontSize: 13),
            ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  profile.hasProfile
                      ? Icons.verified
                      : Icons.info_outline,
                  color: Colors.white,
                  size: 14,
                ),
                const SizedBox(width: 6),
                Text(
                  profile.hasProfile
                      ? t['verifiedProfile']
                      : t['completeProfileHint'],
                  style: const TextStyle(color: Colors.white, fontSize: 11.5),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCreatePrompt(BuildContext context, AppStrings t) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.pastelLavender,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(Icons.person_add_alt_1,
                  color: AppColors.accentBlue, size: 22),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'MyDan_thoss',
                  style: TextStyle(
                    color: AppColors.accentBlue,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            t['completeProfileHint'],
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 14),
          ElevatedButton.icon(
            onPressed: () => _openEditSheet(context),
            icon: const Icon(Icons.add, size: 18),
            label: Text(t['createProfile']),
            style: ElevatedButton.styleFrom(
              minimumSize: const Size(double.infinity, 48),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInstallCard(BuildContext context, AppStrings t) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: AppColors.pastelOrange,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.download_for_offline_outlined,
                color: AppColors.orangePrimary, size: 26),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  t['installApp'],
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14.5,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  t['installAppDesc'],
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          _installDone
              ? const Icon(Icons.check_circle,
                  color: AppColors.successGreen, size: 30)
              : ElevatedButton(
                  onPressed: () => _installApp(context, t),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.orangePrimary,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 12),
                  ),
                  child: Text(t['installNow'],
                      style: const TextStyle(fontSize: 12)),
                ),
        ],
      ),
    );
  }

  Widget _buildSettings(
      BuildContext context, AppStrings t, LocaleProvider locale) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          _settingsTile(
            icon: Icons.translate,
            color: AppColors.accentBlue,
            title: t['language'],
            trailing: locale.language.label,
            onTap: () => LanguageSelectorSheet.show(context),
          ),
          const Divider(height: 1, color: AppColors.divider),
          _settingsTile(
            icon: Icons.person_outline,
            color: AppColors.accentPurple,
            title: t['accountInfo'],
            onTap: () => _openEditSheet(context),
          ),
          const Divider(height: 1, color: AppColors.divider),
          _settingsTile(
            icon: Icons.security_outlined,
            color: AppColors.successGreen,
            title: t['securityPrivacy'],
            onTap: () {},
          ),
          const Divider(height: 1, color: AppColors.divider),
          _settingsTile(
            icon: Icons.notifications_outlined,
            color: AppColors.accentOrange,
            title: t['notifications'],
            onTap: () {},
          ),
          const Divider(height: 1, color: AppColors.divider),
          _settingsTile(
            icon: Icons.help_outline,
            color: AppColors.accentTeal,
            title: t['helpFeedback'],
            onTap: () {},
          ),
          const Divider(height: 1, color: AppColors.divider),
          _settingsTile(
            icon: Icons.info_outline,
            color: AppColors.textSecondary,
            title: '${t['about']} MyDan_thoss',
            trailing: 'v1.0.0',
            onTap: () {},
          ),
        ],
      ),
    );
  }

  Widget _settingsTile({
    required IconData icon,
    required Color color,
    required String title,
    String? trailing,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
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
          fontSize: 14.5,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (trailing != null && trailing.isNotEmpty)
            Text(
              trailing,
              style: const TextStyle(
                color: AppColors.textTertiary,
                fontSize: 13,
              ),
            ),
          const SizedBox(width: 6),
          const Icon(Icons.chevron_right,
              color: AppColors.textTertiary, size: 20),
        ],
      ),
    );
  }
}