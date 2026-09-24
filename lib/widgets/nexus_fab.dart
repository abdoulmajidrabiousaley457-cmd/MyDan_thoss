import 'package:flutter/material.dart';

import '../l10n/app_strings.dart';
import '../screens/ai_agent/nexus_chat_screen.dart';
import '../theme/app_colors.dart';

/// Nexus AI — interactive floating action button.
///
/// Sits in the **bottom-right corner** of the app, floats above every screen,
/// can be **dragged** to reposition, gently **pulses** to invite interaction,
/// and opens the AI agent when tapped.
///
/// Fully accessible: [Semantics] button with a descriptive label and a >= 56px
/// tap target.
class NexusFab extends StatefulWidget {
  /// Bottom offset reserved for the bottom navigation bar (so the button
  /// doesn't overlap it).
  final double bottomInset;

  const NexusFab({super.key, this.bottomInset = 84});

  @override
  State<NexusFab> createState() => _NexusFabState();
}

class _NexusFabState extends State<NexusFab>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulse;
  // Drag offset from the default corner position.
  Offset _offset = Offset.zero;
  bool _dragging = false;

  @override
  void initState() {
    super.initState();
    _pulse = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  void _open() {
    Navigator.of(
      context,
      rootNavigator: true,
    ).push(MaterialPageRoute(builder: (_) => const NexusChatScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Positioned(
      right: 16 + _offset.dx,
      bottom: widget.bottomInset + _offset.dy,
      child: GestureDetector(
        onPanStart: (_) => setState(() => _dragging = true),
        onPanUpdate: (d) => setState(() => _offset += d.delta),
        onPanEnd: (_) => setState(() => _dragging = false),
        child: Semantics(
          button: true,
          label: t['nexusAi'],
          hint: t['aiAgentDesc'],
          child: Tooltip(
            message: t['nexusAi'],
            child: SizedBox(
              width: 76,
              height: 76,
              child: Stack(
                alignment: Alignment.center,
                clipBehavior: Clip.none,
                children: [
                  // Pulsing halo
                  AnimatedBuilder(
                    animation: _pulse,
                    builder: (context, _) {
                      final v = _pulse.value;
                      return Container(
                        width: 56 + 16 * v,
                        height: 56 + 16 * v,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.toolSky.colors.first.withValues(
                            alpha: 0.28 * (1 - v),
                          ),
                        ),
                      );
                    },
                  ),
                  // Button
                  Material(
                    color: Colors.transparent,
                    shape: const CircleBorder(),
                    elevation: 8,
                    shadowColor: Colors.black.withValues(alpha: 0.3),
                    child: InkWell(
                      onTap: _dragging ? null : _open,
                      customBorder: const CircleBorder(),
                      child: Container(
                        width: 58,
                        height: 58,
                        decoration: const BoxDecoration(
                          gradient: AppColors.toolSky,
                          shape: BoxShape.circle,
                        ),
                        padding: const EdgeInsets.all(12),
                        child: Image.asset(
                          'assets/tool_logos/ai_agent.png',
                          fit: BoxFit.contain,
                          filterQuality: FilterQuality.high,
                          errorBuilder: (_, __, ___) => const Icon(
                            Icons.smart_toy_outlined,
                            color: Colors.white,
                            size: 26,
                          ),
                        ),
                      ),
                    ),
                  ),
                  // "Nexus AI" pill label
                  Positioned(
                    bottom: -4,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.18),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: Text(
                        t['nexusAi'],
                        style: const TextStyle(
                          color: AppColors.bluePrimary,
                          fontSize: 9.5,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Convenience wrapper that overlays the [NexusFab] on top of any body.
class NexusFabOverlay extends StatelessWidget {
  final Widget child;
  final double bottomInset;

  const NexusFabOverlay({
    super.key,
    required this.child,
    this.bottomInset = 84,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        NexusFab(bottomInset: bottomInset),
      ],
    );
  }
}
