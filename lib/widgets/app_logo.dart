import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// The My_danthoss brand logo, rendered from the bundled app icon.
///
/// Used on every AppBar / header so the branding is consistent across the whole
/// app (tools, products, library, settings, portfolio, profile).
///
/// - Renders the bundled PNG inside a rounded white tile.
/// - Falls back to a gradient brain glyph if the asset is missing.
/// - Fully accessible: exposes a [Semantics] label.
class AppLogo extends StatelessWidget {
  /// Path to the app icon asset.
  final String asset;

  /// Rendered size (width & height) in logical pixels.
  final double size;

  /// Corner radius of the white tile.
  final double radius;

  /// When true, no white tile is drawn (icon shown directly).
  final bool bare;

  const AppLogo({
    super.key,
    this.asset = 'assets/icons/app_icon.png',
    this.size = 32,
    this.radius = 9,
    this.bare = false,
  });

  @override
  Widget build(BuildContext context) {
    final img = Image.asset(
      asset,
      width: size,
      height: size,
      fit: BoxFit.cover,
      filterQuality: FilterQuality.high,
      errorBuilder: (context, error, stack) => _fallback(),
    );

    return Semantics(
      image: true,
      label: 'My_danthoss',
      child: bare
          ? ClipRRect(borderRadius: BorderRadius.circular(radius), child: img)
          : Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(radius),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.15),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              padding: EdgeInsets.all(size * 0.06),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(radius * 0.7),
                child: img,
              ),
            ),
    );
  }

  Widget _fallback() {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: AppColors.greenGradient,
        borderRadius: BorderRadius.circular(radius),
      ),
      child: Icon(Icons.psychology, color: Colors.white, size: size * 0.6),
    );
  }
}

/// An AppBar title row that pairs a logo (brand or tool) with a screen title
/// and an optional subtitle.
///
/// Use as `title: AppBarTitle('My title')` on any AppBar. It is intrinsically
/// responsive: the text scales down / ellipsises on very small screens so it
/// never overflows on any device (Android, Pixel, small phones, tablets).
class AppBarTitle extends StatelessWidget {
  final String text;

  /// Optional secondary line rendered under the title (smaller, muted).
  final String? subtitle;

  /// Optional leading tool logo (asset path). When provided it replaces the
  /// default brand logo — used on tool screens so the tool's own logo appears.
  final String? logoAsset;

  final IconData? logoFallbackIcon;
  final Gradient? logoGradient;

  /// Rendered logo size. Defaults to 30 and is clamped for tiny screens.
  final double logoSize;

  const AppBarTitle(
    this.text, {
    super.key,
    this.subtitle,
    this.logoAsset,
    this.logoFallbackIcon,
    this.logoGradient,
    this.logoSize = 30,
  });

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    // Keep the logo comfortably sized but shrink a touch on very narrow screens.
    final effectiveSize = width < 340 ? logoSize * 0.85 : logoSize;

    return Row(
      children: [
        if (logoAsset != null)
          _LeadingLogo(
            asset: logoAsset!,
            fallbackIcon: logoFallbackIcon ?? Icons.widgets_outlined,
            gradient: logoGradient ?? AppColors.greenGradient,
            size: effectiveSize,
          )
        else
          AppLogo(size: effectiveSize),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                text,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: width < 360 ? 16 : 18,
                  fontWeight: FontWeight.w700,
                ),
              ),
              if (subtitle != null && subtitle!.isNotEmpty)
                Text(
                  subtitle!,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

/// A brand lockup for custom (non-AppBar) headers: shows the My_danthoss logo
/// followed by the app name and tagline. Used by the Product / Profile /
/// Portfolio headers so they match the AppBar branding.
class BrandLockup extends StatelessWidget {
  final String title;
  final String? subtitle;
  final double logoSize;
  final Color titleColor;
  final Color subtitleColor;

  const BrandLockup({
    super.key,
    required this.title,
    this.subtitle,
    this.logoSize = 40,
    this.titleColor = Colors.white,
    this.subtitleColor = Colors.white70,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        AppLogo(size: logoSize, radius: logoSize * 0.28),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: titleColor,
                  fontSize: 19,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (subtitle != null && subtitle!.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(
                  subtitle!,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: subtitleColor, fontSize: 12),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}

class _LeadingLogo extends StatelessWidget {
  final String asset;
  final IconData fallbackIcon;
  final Gradient gradient;
  final double size;

  const _LeadingLogo({
    required this.asset,
    required this.fallbackIcon,
    required this.gradient,
    this.size = 30,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      image: true,
      label: 'Tool logo',
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(size * 0.27),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.12),
              blurRadius: 4,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        padding: EdgeInsets.all(size * 0.08),
        child: Image.asset(
          asset,
          fit: BoxFit.contain,
          filterQuality: FilterQuality.high,
          errorBuilder: (context, error, stack) => Container(
            decoration: BoxDecoration(
              gradient: gradient,
              borderRadius: BorderRadius.circular(size * 0.2),
            ),
            child: Icon(fallbackIcon, color: Colors.white, size: size * 0.55),
          ),
        ),
      ),
    );
  }
}
