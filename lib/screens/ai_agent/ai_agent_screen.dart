import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../l10n/app_strings.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';

/// Embedded AI agent (Google AI Studio web app).
///
/// - On **Android / iOS**: the agent is embedded in a native [WebView] so it
///   lives inside the app.
/// - On **Web**: the AI Studio app sends `Content-Security-Policy:
///   frame-ancestors 'self' …`, which forbids iframe embedding — so we open it
///   in a new browser tab instead (with a clear, branded landing card).
class AiAgentScreen extends StatefulWidget {
  const AiAgentScreen({super.key});

  /// The hosted AI agent (Google AI Studio) endpoint.
  static const String agentUrl =
      'https://ais-dev-ppxd6mc632ewh5fdsoivcx-207318041778.europe-west2.run.app';

  @override
  State<AiAgentScreen> createState() => _AiAgentScreenState();
}

class _AiAgentScreenState extends State<AiAgentScreen> {
  WebViewController? _controller;
  bool _loading = true;
  bool _error = false;

  @override
  void initState() {
    super.initState();
    if (!kIsWeb) {
      _initWebView();
    }
  }

  void _initWebView() {
    final controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) {
            if (mounted) setState(() => _loading = true);
          },
          onPageFinished: (_) {
            if (mounted) setState(() => _loading = false);
          },
          onWebResourceError: (error) {
            // Ignore sub-resource errors; only flag main-frame failures.
            if (error.isForMainFrame == true && mounted) {
              setState(() {
                _error = true;
                _loading = false;
              });
            }
          },
        ),
      )
      ..loadRequest(Uri.parse(AiAgentScreen.agentUrl));
    _controller = controller;
  }

  Future<void> _openExternal() async {
    final uri = Uri.parse(AiAgentScreen.agentUrl);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(context.tr['aiAgentError']),
            backgroundColor: AppColors.errorRed,
          ),
        );
      }
    }
  }

  void _reload() {
    setState(() {
      _error = false;
      _loading = true;
    });
    _controller?.reload();
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: AppBarTitle(
          t['aiAgent'],
          logoFallbackIcon: Icons.smart_toy_outlined,
          logoGradient: AppColors.toolSky,
        ),
        actions: [
          Semantics(
            button: true,
            label: t['aiAgentOpenBrowser'],
            child: IconButton(
              tooltip: t['aiAgentOpenBrowser'],
              onPressed: _openExternal,
              icon: const Icon(Icons.open_in_new),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: kIsWeb
            ? _buildWebFallback(context, t)
            : _buildWebView(context, t),
      ),
    );
  }

  // ---------------- Native WebView (Android / iOS) ----------------
  Widget _buildWebView(BuildContext context, AppStrings t) {
    return Stack(
      children: [
        if (_controller != null && !_error)
          WebViewWidget(controller: _controller!),
        if (_loading && !_error)
          const Center(child: CircularProgressIndicator()),
        if (_error) _buildError(context, t),
      ],
    );
  }

  Widget _buildError(BuildContext context, AppStrings t) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.cloud_off,
              size: 54,
              color: AppColors.textTertiary,
            ),
            const SizedBox(height: 14),
            Text(
              t['aiAgentError'],
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 15,
              ),
            ),
            const SizedBox(height: 18),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                OutlinedButton.icon(
                  onPressed: _reload,
                  icon: const Icon(Icons.refresh, size: 18),
                  label: Text(t['aiAgentRetry']),
                ),
                const SizedBox(width: 12),
                ElevatedButton.icon(
                  onPressed: _openExternal,
                  icon: const Icon(Icons.open_in_new, size: 18),
                  label: Text(t['aiAgentOpenBrowser']),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // ---------------- Web fallback (iframe blocked by CSP) ----------------
  Widget _buildWebFallback(BuildContext context, AppStrings t) {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.backgroundSecondary,
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.06),
                  blurRadius: 18,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const AppLogo(size: 64, radius: 16),
                const SizedBox(height: 16),
                Text(
                  t['aiAgent'],
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  t['aiAgentDesc'],
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 22),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _openExternal,
                    icon: const Icon(Icons.smart_toy_outlined, size: 20),
                    label: Text(t['aiAgentOpen']),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.greenPrimary,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 50),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  '${t['aiAgent']} · ${t['appName']}',
                  style: const TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
