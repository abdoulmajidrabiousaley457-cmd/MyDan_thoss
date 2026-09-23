import 'package:flutter/material.dart';

/// Responsive helpers so the whole app adapts to any device width
/// (small Android / Pixel phones, large phones, tablets, web).
///
/// Breakpoints (logical pixels):
/// - compact  : width < 360  (very small phones)
/// - phone    : 360 <= width < 600 (standard phones — the common case)
/// - tablet   : 600 <= width < 900
/// - desktop  : width >= 900
class Breakpoints {
  const Breakpoints._();

  static const double compact = 360;
  static const double tablet = 600;
  static const double desktop = 900;

  static bool isCompact(double w) => w < compact;
  static bool isPhone(double w) => w >= compact && w < tablet;
  static bool isTablet(double w) => w >= tablet && w < desktop;
  static bool isDesktop(double w) => w >= desktop;

  /// Whether the current screen is a small phone (needs tighter spacing).
  static bool isSmallScreen(BuildContext context) =>
      MediaQuery.sizeOf(context).width < compact;
}

/// A [Builder]-free way to read the current width without rebuilding the whole
/// tree: `context.screenWidth`.
extension ResponsiveContext on BuildContext {
  double get screenWidth => MediaQuery.sizeOf(this).width;
  double get screenHeight => MediaQuery.sizeOf(this).height;

  /// True when the device is a tablet or larger.
  bool get isWide => screenWidth >= Breakpoints.tablet;

  /// A horizontal page padding that grows on larger screens and is comfortable
  /// on small ones (never causes horizontal overflow).
  double get pagePadding {
    final w = screenWidth;
    if (w >= Breakpoints.desktop) return 48;
    if (w >= Breakpoints.tablet) return 32;
    if (w < Breakpoints.compact) return 12;
    return 16;
  }

  /// Number of columns for icon/service grids, adapted to the screen width.
  int get serviceGridColumns {
    final w = screenWidth;
    if (w >= Breakpoints.desktop) return 6;
    if (w >= Breakpoints.tablet) return 5;
    if (w < Breakpoints.compact) return 3;
    return 4;
  }
}

/// Constrains content to a comfortable maximum width and centres it, so the
/// layout stays readable on tablets / web while filling small phones.
class ResponsiveCenter extends StatelessWidget {
  final Widget child;
  final double maxWidth;
  final EdgeInsetsGeometry? padding;

  const ResponsiveCenter({
    super.key,
    required this.child,
    this.maxWidth = 640,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: Padding(padding: padding ?? EdgeInsets.zero, child: child),
      ),
    );
  }
}

/// Scales a font size down slightly on very narrow screens to avoid overflow.
double scaleText(BuildContext context, double size, {double min = 0.82}) {
  final w = context.screenWidth;
  if (w >= Breakpoints.compact) return size;
  final factor = (w / Breakpoints.compact).clamp(min, 1.0);
  return size * factor;
}
