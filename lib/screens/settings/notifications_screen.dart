import 'package:flutter/material.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';

class _Notif {
  final IconData icon;
  final Color color;
  final String title;
  final String body;
  final String time;
  final bool today;
  bool read = false;
  _Notif({
    required this.icon,
    required this.color,
    required this.title,
    required this.body,
    required this.time,
    required this.today,
  });
}

/// Client notifications center.
class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<_Notif> _items = [
    _Notif(
      icon: Icons.trending_up,
      color: AppColors.greenPrimary,
      title: 'Portfolio update',
      body: 'Your portfolio is up +2.4% today.',
      time: '09:12',
      today: true,
    ),
    _Notif(
      icon: Icons.auto_awesome,
      color: AppColors.accentPurple,
      title: 'New AI model available',
      body: 'Sales forecasting model v2 has been released.',
      time: '08:40',
      today: true,
    ),
    _Notif(
      icon: Icons.currency_exchange,
      color: AppColors.accentTeal,
      title: 'Rate alert',
      body: 'USD/XOF reached your target of 610.',
      time: '07:15',
      today: true,
    ),
    _Notif(
      icon: Icons.workspace_premium_outlined,
      color: AppColors.accentOrange,
      title: 'Subscription',
      body: 'Your Pro plan renews in 5 days.',
      time: 'Yesterday',
      today: false,
    ),
    _Notif(
      icon: Icons.security,
      color: AppColors.accentBlue,
      title: 'Security',
      body: 'New sign-in from Niamey, Niger.',
      time: 'Yesterday',
      today: false,
    ),
  ];

  void _markAllRead() {
    setState(() {
      for (final n in _items) {
        n.read = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    final today = _items.where((e) => e.today).toList();
    final earlier = _items.where((e) => !e.today).toList();

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: AppBarTitle(
          t['notifTitle'],
          logoFallbackIcon: Icons.notifications_none,
        ),
        actions: [
          TextButton(
            onPressed: _markAllRead,
            style: TextButton.styleFrom(foregroundColor: Colors.white),
            child: Text(
              t['notifMarkAllRead'],
              style: const TextStyle(fontSize: 12),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            if (today.isNotEmpty) _groupTitle(t['notifToday']),
            ...today.map(_tile),
            if (earlier.isNotEmpty) _groupTitle(t['notifEarlier']),
            ...earlier.map(_tile),
            if (_items.isEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 80),
                child: Column(
                  children: [
                    const Icon(
                      Icons.notifications_none,
                      size: 56,
                      color: AppColors.textTertiary,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      t['notifEmpty'],
                      style: const TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _groupTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, top: 4),
      child: Text(
        title,
        style: const TextStyle(
          color: AppColors.textSecondary,
          fontSize: 12.5,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.4,
        ),
      ),
    );
  }

  Widget _tile(_Notif n) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: n.read
            ? AppColors.backgroundSecondary
            : AppColors.pastelGreen.withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: n.read
              ? AppColors.borderPrimary
              : AppColors.greenPrimary.withValues(alpha: 0.4),
        ),
      ),
      child: ListTile(
        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: n.color.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(11),
          ),
          child: Icon(n.icon, color: n.color, size: 20),
        ),
        title: Text(
          n.title,
          style: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 13.5,
            fontWeight: n.read ? FontWeight.w500 : FontWeight.w700,
          ),
        ),
        subtitle: Text(
          n.body,
          style: const TextStyle(
            color: AppColors.textSecondary,
            fontSize: 12,
            height: 1.3,
          ),
        ),
        trailing: Text(
          n.time,
          style: const TextStyle(color: AppColors.textTertiary, fontSize: 10.5),
        ),
      ),
    );
  }
}
