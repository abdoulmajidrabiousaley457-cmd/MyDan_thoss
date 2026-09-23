import 'package:flutter/material.dart';

import '../l10n/app_strings.dart';
import '../theme/app_colors.dart';

/// A single bottom-navigation destination with its own accent colour and
/// distinct indicator shape.
class NavBarItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;

  /// Accent colour used for this tab's indicator, icon and label when active.
  final Color accent;

  /// Indicator style — each tab gets a *specific* indicator.
  final NavIndicator indicator;

  const NavBarItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.accent,
    this.indicator = NavIndicator.pill,
  });
}

/// The specific indicator shape drawn for the active tab.
enum NavIndicator {
  /// Rounded pill glow behind the icon.
  pill,

  /// A short bar on top of the item.
  topBar,

  /// A ring / circle outline around the icon.
  ring,

  /// A diamond rotated square behind the icon.
  diamond,

  /// A filled rounded square (squircle) behind the icon.
  squircle,
}

/// Custom bottom navigation bar for MyDan_thoss.
///
/// - Green brand gradient background.
/// - Every tab has its **own accent colour** and a **specific indicator**
///   (pill, top bar, ring, diamond, squircle).
/// - Smooth animated transitions between states.
/// - Fully accessible: each item is a [Semantics] button with selected state,
///   and the tap target is >= 48px.
class MainNavBar extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onSelected;
  final List<NavBarItem> items;

  const MainNavBar({
    super.key,
    required this.selectedIndex,
    required this.onSelected,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.greenPrimary, AppColors.greenDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.greenDark.withValues(alpha: 0.35),
            blurRadius: 18,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 68,
          child: Row(
            children: [
              for (int i = 0; i < items.length; i++)
                Expanded(
                  child: _NavBarButton(
                    item: items[i],
                    selected: i == selectedIndex,
                    onTap: () => onSelected(i),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavBarButton extends StatelessWidget {
  final NavBarItem item;
  final bool selected;
  final VoidCallback onTap;

  const _NavBarButton({
    required this.item,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      selected: selected,
      label: item.label,
      child: Tooltip(
        message: item.label,
        child: InkWell(
          onTap: onTap,
          splashColor: Colors.white.withValues(alpha: 0.12),
          highlightColor: Colors.white.withValues(alpha: 0.06),
          child: SizedBox(
            height: 68,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Indicator + icon
                SizedBox(
                  height: 34,
                  child: Stack(
                    alignment: Alignment.center,
                    clipBehavior: Clip.none,
                    children: [
                      // Specific indicator for this tab
                      AnimatedOpacity(
                        opacity: selected ? 1 : 0,
                        duration: const Duration(milliseconds: 220),
                        child: _indicator(),
                      ),
                      // Icon
                      AnimatedScale(
                        scale: selected ? 1.0 : 0.92,
                        duration: const Duration(milliseconds: 220),
                        child: Icon(
                          selected ? item.activeIcon : item.icon,
                          size: 23,
                          color: selected ? item.accent : Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 3),
                // Label
                AnimatedDefaultTextStyle(
                  duration: const Duration(milliseconds: 220),
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                    color: selected ? item.accent : Colors.white70,
                  ),
                  child: Text(
                    item.label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Renders the *specific* indicator for the active tab.
  Widget _indicator() {
    switch (item.indicator) {
      case NavIndicator.pill:
        return Container(
          width: 46,
          height: 30,
          decoration: BoxDecoration(
            color: item.accent.withValues(alpha: 0.22),
            borderRadius: BorderRadius.circular(15),
            border: Border.all(
              color: item.accent.withValues(alpha: 0.55),
              width: 1.4,
            ),
          ),
        );
      case NavIndicator.topBar:
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 30,
              height: 3.5,
              decoration: BoxDecoration(
                color: item.accent,
                borderRadius: BorderRadius.circular(3),
              ),
            ),
            const SizedBox(height: 3),
            Container(
              width: 40,
              height: 26,
              decoration: BoxDecoration(
                color: item.accent.withValues(alpha: 0.16),
                borderRadius: BorderRadius.circular(13),
              ),
            ),
          ],
        );
      case NavIndicator.ring:
        return Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: item.accent, width: 2),
            color: item.accent.withValues(alpha: 0.14),
          ),
        );
      case NavIndicator.diamond:
        return Transform.rotate(
          angle: 0.785398, // 45°
          child: Container(
            width: 26,
            height: 26,
            decoration: BoxDecoration(
              color: item.accent.withValues(alpha: 0.22),
              borderRadius: BorderRadius.circular(7),
              border: Border.all(
                color: item.accent.withValues(alpha: 0.6),
                width: 1.4,
              ),
            ),
          ),
        );
      case NavIndicator.squircle:
        return Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            color: item.accent.withValues(alpha: 0.22),
            borderRadius: BorderRadius.circular(11),
            border: Border.all(
              color: item.accent.withValues(alpha: 0.6),
              width: 1.4,
            ),
          ),
        );
    }
  }
}

/// Builds the default set of navigation items for the app.
List<NavBarItem> buildNavItems(AppStrings t) => [
  NavBarItem(
    icon: Icons.grid_view_outlined,
    activeIcon: Icons.grid_view_rounded,
    label: t['navHome'],
    accent: const Color(0xFF4ADE80), // bright green
    indicator: NavIndicator.squircle,
  ),
  NavBarItem(
    icon: Icons.auto_awesome_outlined,
    activeIcon: Icons.auto_awesome,
    label: t['navTools'],
    accent: const Color(0xFF22D3EE), // cyan
    indicator: NavIndicator.diamond,
  ),
  NavBarItem(
    icon: Icons.storefront_outlined,
    activeIcon: Icons.storefront,
    label: t['navProduct'],
    accent: const Color(0xFFFBBF24), // amber
    indicator: NavIndicator.pill,
  ),
  NavBarItem(
    icon: Icons.pie_chart_outline,
    activeIcon: Icons.pie_chart,
    label: t['navMyPortfolio'],
    accent: const Color(0xFF60A5FA), // sky blue
    indicator: NavIndicator.ring,
  ),
  NavBarItem(
    icon: Icons.person_outline,
    activeIcon: Icons.person,
    label: t['navProfile'],
    accent: const Color(0xFFC4B5FD), // soft violet
    indicator: NavIndicator.topBar,
  ),
];
