import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// Central registry of the aesthetic tool logos.
///
/// Each logo ships as a bundled asset **and** keeps an absolute remote URL
/// reference (fallback / documentation). Use [ToolLogoImage] to render them
/// everywhere with a single, consistent look.
class ToolLogos {
  const ToolLogos._();

  static const String currency = 'assets/tool_logos/currency.png';
  static const String data = 'assets/tool_logos/data.png';
  static const String tracking = 'assets/tool_logos/tracking.png';
  static const String screener = 'assets/tool_logos/screener.png';
  static const String report = 'assets/tool_logos/report.png';
  static const String valuation = 'assets/tool_logos/valuation.png';
  static const String flow = 'assets/tool_logos/flow.png';
  static const String product = 'assets/tool_logos/product.png';

  /// Absolute references (the online sources these assets were curated from).
  static const Map<String, String> remoteReferences = {
    'currency': 'https://sspark.genspark.ai/i/9Y3D6kT0ghssZfdY',
    'data': 'https://sspark.genspark.ai/i/wopKD8EtugpA04D8',
    'tracking': 'https://sspark.genspark.ai/i/P3otWcPki5pn2fNU',
    'screener': 'https://sspark.genspark.ai/i/6cp2soJh',
    'report': 'https://sspark.genspark.ai/i/29uoueIuH2m9e4ce',
    'valuation': 'https://sspark.genspark.ai/i/b66yqtj8Hcgfb8dD',
    'flow': 'https://sspark.genspark.ai/i/IC0BWk6XAOiEVr6A',
    'product': 'https://sspark.genspark.ai/i/ULEI94DpdEqiqucz',
  };
}

/// Aesthetic tool logo.
///
/// Renders the bundled PNG logo inside a soft rounded tile that matches the
/// tool gradient, falling back to a gradient glyph if the asset is missing.
/// Fully accessible: exposes a [Semantics] label.
class ToolLogoImage extends StatelessWidget {
  final String asset;
  final String? remoteUrl;
  final IconData fallbackIcon;
  final Gradient gradient;
  final String semanticLabel;
  final double size;

  const ToolLogoImage({
    super.key,
    required this.asset,
    required this.semanticLabel,
    this.remoteUrl,
    this.fallbackIcon = Icons.widgets_outlined,
    this.gradient = AppColors.toolGreen,
    this.size = 56,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      image: true,
      label: semanticLabel,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(size * 0.30),
          boxShadow: [
            BoxShadow(
              color: _shadow,
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: EdgeInsets.all(size * 0.12),
        child: Image.asset(
          asset,
          fit: BoxFit.contain,
          filterQuality: FilterQuality.high,
          errorBuilder: (context, error, stack) => _fallback(),
        ),
      ),
    );
  }

  Widget _fallback() {
    return Container(
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(size * 0.22),
      ),
      child: Icon(fallbackIcon, color: Colors.white, size: size * 0.5),
    );
  }

  Color get _shadow {
    if (gradient is LinearGradient) {
      final colors = (gradient as LinearGradient).colors;
      return colors.first.withValues(alpha: 0.35);
    }
    return Colors.black26;
  }
}

/// A fully accessible tappable wrapper around [ToolLogoImage].
///
/// - Provides a [Semantics] node with `button: true` and a descriptive label.
/// - Guarantees a minimum 48x48 tap target.
class ToolLogoButton extends StatelessWidget {
  final String asset;
  final String semanticLabel;
  final String? tooltip;
  final VoidCallback onTap;
  final IconData fallbackIcon;
  final Gradient gradient;
  final double size;

  const ToolLogoButton({
    super.key,
    required this.asset,
    required this.semanticLabel,
    required this.onTap,
    this.tooltip,
    this.fallbackIcon = Icons.widgets_outlined,
    this.gradient = AppColors.toolGreen,
    this.size = 56,
  });

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
      child: Semantics(
        button: true,
        label: semanticLabel,
        hint: tooltip,
        child: Tooltip(
          message: tooltip ?? semanticLabel,
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onTap,
              borderRadius: BorderRadius.circular(16),
              focusColor: Colors.black.withValues(alpha: 0.06),
              child: Padding(
                padding: const EdgeInsets.all(2),
                child: ToolLogoImage(
                  asset: asset,
                  semanticLabel: semanticLabel,
                  fallbackIcon: fallbackIcon,
                  gradient: gradient,
                  size: size,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
