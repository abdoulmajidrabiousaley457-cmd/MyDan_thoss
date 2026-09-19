import 'package:flutter/material.dart';

/// An aesthetic, gradient "tool logo" badge.
///
/// Renders a rounded-square gradient tile with a soft drop shadow, a subtle
/// glass highlight and a white glyph. Fully accessible: it exposes a
/// [Semantics] label and respects the minimum 48x48 tap-target guidance when
/// used through [ToolLogoButton].
class ToolLogo extends StatelessWidget {
  final IconData icon;
  final Gradient gradient;
  final double size;
  final double iconSize;
  final double radius;

  const ToolLogo({
    super.key,
    required this.icon,
    required this.gradient,
    this.size = 52,
    this.iconSize = 24,
    this.radius = 16,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(radius),
        boxShadow: [
          BoxShadow(
            color: _shadowColor,
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Glass highlight (top-left sheen)
          Positioned(
            top: 3,
            left: 4,
            child: Container(
              width: size * 0.34,
              height: size * 0.2,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.28),
                borderRadius: BorderRadius.circular(size),
              ),
            ),
          ),
          Center(
            child: Icon(icon, color: Colors.white, size: iconSize),
          ),
        ],
      ),
    );
  }

  Color get _shadowColor {
    if (gradient is LinearGradient) {
      final colors = (gradient as LinearGradient).colors;
      return colors.first.withValues(alpha: 0.45);
    }
    return Colors.black26;
  }
}

/// A fully accessible tappable wrapper around [ToolLogo].
///
/// - Provides a [Semantics] node with `button: true` and a descriptive label.
/// - Guarantees a minimum 48x48 tap target.
/// - Shows a visual focus/ripple.
class ToolLogoButton extends StatelessWidget {
  final IconData icon;
  final Gradient gradient;
  final String semanticLabel;
  final String? tooltip;
  final VoidCallback onTap;
  final double size;

  const ToolLogoButton({
    super.key,
    required this.icon,
    required this.gradient,
    required this.semanticLabel,
    required this.onTap,
    this.tooltip,
    this.size = 52,
  });

  @override
  Widget build(BuildContext context) {
    final logo = ToolLogo(icon: icon, gradient: gradient, size: size);
    final wrapped = Semantics(
      button: true,
      label: semanticLabel,
      hint: tooltip,
      child: Tooltip(
        message: tooltip ?? semanticLabel,
        child: logo,
      ),
    );

    return ConstrainedBox(
      constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          focusColor: Colors.black.withValues(alpha: 0.06),
          child: Padding(
            padding: const EdgeInsets.all(2),
            child: wrapped,
          ),
        ),
      ),
    );
  }
}
