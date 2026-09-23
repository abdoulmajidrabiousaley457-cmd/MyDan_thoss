import 'package:flutter/material.dart';

import '../l10n/app_strings.dart';
import '../theme/app_colors.dart';
import 'app_logo.dart';
import 'language_selector.dart';

/// Global key for the root [Scaffold] that hosts the navigation drawer.
///
/// Shared so any screen (e.g. the home header menu button) can open the drawer
/// with `appScaffoldKey.currentState?.openDrawer()`.
final GlobalKey<ScaffoldState> appScaffoldKey = GlobalKey<ScaffoldState>();

/// A destination reachable from the navigation drawer.
class DrawerDestination {
  final IconData icon;
  final String label;
  final String? subtitle;
  final Widget Function()? builder;
  final int? tabIndex;

  const DrawerDestination({
    required this.icon,
    required this.label,
    this.subtitle,
    this.builder,
    this.tabIndex,
  });
}

/// The app-wide navigation drawer.
///
/// Opened from the home header menu button (and any screen that wires it up).
/// Fully accessible: every entry is a [Semantics] button with a descriptive
/// label, and all tap targets are >= 48px.
class AppDrawer extends StatelessWidget {
  /// Called when a primary bottom-navigation destination is selected.
  /// `index` matches the bottom-navigation index in `MainScreen` (0..4).
  final ValueChanged<int>? onSelectTab;

  /// The currently selected bottom-navigation index (for highlighting).
  final int selectedIndex;

  /// Extra destinations (e.g. Library, Security) pushed on top of the stack.
  final List<DrawerDestination> extras;

  const AppDrawer({
    super.key,
    this.onSelectTab,
    this.selectedIndex = 0,
    this.extras = const [],
  });

  @override
  Widget build(BuildContext context) {
    final t = context.tr;

    final primary = <DrawerDestination>[
      DrawerDestination(
        icon: Icons.grid_view,
        label: t['navHome'],
        tabIndex: 0,
      ),
      DrawerDestination(
        icon: Icons.auto_awesome,
        label: t['navTools'],
        tabIndex: 1,
      ),
      DrawerDestination(
        icon: Icons.storefront,
        label: t['navProduct'],
        tabIndex: 2,
      ),
      DrawerDestination(
        icon: Icons.pie_chart,
        label: t['navMyPortfolio'],
        tabIndex: 3,
      ),
      DrawerDestination(
        icon: Icons.person,
        label: t['navProfile'],
        tabIndex: 4,
      ),
    ];

    return Drawer(
      backgroundColor: AppColors.backgroundSecondary,
      child: SafeArea(
        child: Column(
          children: [
            // -------- Header with brand lockup --------
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(20, 20, 10, 20),
              decoration: BoxDecoration(gradient: AppColors.greenGradient),
              child: Row(
                children: [
                  Expanded(
                    child: BrandLockup(
                      title: t['appName'],
                      subtitle: t['drawerTagline'],
                      logoSize: 42,
                    ),
                  ),
                  Semantics(
                    button: true,
                    label: t['drawerClose'],
                    child: IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(Icons.close, color: Colors.white),
                      tooltip: t['drawerClose'],
                    ),
                  ),
                ],
              ),
            ),

            // -------- Scrollable body --------
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 8),
                children: [
                  _sectionLabel(t['drawerMenu']),
                  ...primary.map(
                    (e) => _tile(
                      context,
                      e,
                      highlighted: e.tabIndex == selectedIndex,
                    ),
                  ),

                  if (extras.isNotEmpty) ...[
                    _divider(),
                    _sectionLabel(t['drawerExplore']),
                    ...extras.map((e) => _tile(context, e)),
                  ],

                  _divider(),
                  _sectionLabel(t['drawerPreferences']),

                  // Language selector.
                  Semantics(
                    button: true,
                    label: '${t['language']}, ${t.language.label}',
                    child: ListTile(
                      leading: _leadingIcon(Icons.language),
                      title: Text(
                        t['language'],
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      trailing: Text(
                        t.language.label,
                        style: const TextStyle(
                          color: AppColors.greenPrimary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      onTap: () {
                        Navigator.of(context).pop();
                        LanguageSelectorSheet.show(context);
                      },
                    ),
                  ),
                ],
              ),
            ),

            // -------- Footer --------
            const Divider(height: 1, color: AppColors.divider),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const AppLogo(size: 30),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'v1.0 · ${t['appName']}',
                      style: const TextStyle(
                        color: AppColors.textTertiary,
                        fontSize: 12,
                      ),
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

  Widget _sectionLabel(String label) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 6),
      child: Text(
        label.toUpperCase(),
        style: const TextStyle(
          color: AppColors.greenDark,
          fontSize: 11,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.8,
        ),
      ),
    );
  }

  Widget _divider() => const Padding(
    padding: EdgeInsets.symmetric(vertical: 4),
    child: Divider(height: 1, color: AppColors.divider),
  );

  Widget _leadingIcon(IconData icon, {bool active = false}) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: active
            ? AppColors.greenPrimary.withValues(alpha: 0.14)
            : AppColors.backgroundElevated,
        borderRadius: BorderRadius.circular(11),
      ),
      child: Icon(
        icon,
        color: active ? AppColors.greenPrimary : AppColors.textSecondary,
        size: 20,
      ),
    );
  }

  Widget _tile(
    BuildContext context,
    DrawerDestination item, {
    bool highlighted = false,
  }) {
    return Semantics(
      button: true,
      label: item.label,
      selected: highlighted,
      child: ListTile(
        leading: _leadingIcon(item.icon, active: highlighted),
        title: Text(
          item.label,
          style: TextStyle(
            color: highlighted ? AppColors.greenPrimary : AppColors.textPrimary,
            fontWeight: highlighted ? FontWeight.w700 : FontWeight.w600,
          ),
        ),
        subtitle: item.subtitle == null
            ? null
            : Text(
                item.subtitle!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: AppColors.textTertiary,
                  fontSize: 11.5,
                ),
              ),
        trailing: highlighted
            ? const Icon(
                Icons.check_circle,
                color: AppColors.greenPrimary,
                size: 18,
              )
            : (item.builder != null
                  ? const Icon(
                      Icons.chevron_right,
                      color: AppColors.textTertiary,
                    )
                  : null),
        onTap: () {
          Navigator.of(context).pop();
          if (item.tabIndex != null) {
            onSelectTab?.call(item.tabIndex!);
          } else if (item.builder != null) {
            final page = item.builder!();
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => page));
          }
        },
      ),
    );
  }
}
