import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../l10n/app_strings.dart';
import '../../services/nexus_service.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';

/// One chat message.
class _Msg {
  final String text;
  final bool fromUser;
  _Msg(this.text, {required this.fromUser});
}

/// Nexus AI — in-app chat screen that talks to the hosted agent through the
/// official `/api/agent/chat` endpoint (see [NexusService]).
class NexusChatScreen extends StatefulWidget {
  const NexusChatScreen({super.key});

  @override
  State<NexusChatScreen> createState() => _NexusChatScreenState();
}

class _NexusChatScreenState extends State<NexusChatScreen> {
  final TextEditingController _input = TextEditingController();
  final ScrollController _scroll = ScrollController();
  final List<_Msg> _messages = [];
  bool _sending = false;

  /// Tools the agent can be primed with (matches the hosted agent's keys).
  static const List<String> _tools = [
    'portfolio',
    'screener',
    'valuation',
    'fx',
    'report',
    'flow',
    'data',
  ];

  /// Human-readable labels for the tool chips.
  static const Map<String, String> _toolLabels = {
    'portfolio': 'Portefeuille',
    'screener': 'Screener',
    'valuation': 'Valorisation',
    'fx': 'Devises',
    'report': 'Rapports',
    'flow': 'Flux',
    'data': 'Données',
  };
  String _activeTool = 'portfolio';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      setState(
        () => _messages.add(_Msg(context.tr['nexusWelcome'], fromUser: false)),
      );
    });
  }

  @override
  void dispose() {
    _input.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _send([String? preset]) async {
    final t = context.tr;
    final text = (preset ?? _input.text).trim();
    if (text.isEmpty || _sending) return;

    setState(() {
      _messages.add(_Msg(text, fromUser: true));
      _sending = true;
      _input.clear();
    });
    _scrollToEnd();

    final reply = await NexusService.ask(text, activeTool: _activeTool);

    if (!mounted) return;
    setState(() {
      _sending = false;
      _messages.add(
        _Msg(
          reply.ok ? reply.text : t['nexusErrorUnavailable'],
          fromUser: false,
        ),
      );
    });
    _scrollToEnd();
  }

  void _scrollToEnd() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) {
        _scroll.animateTo(
          _scroll.position.maxScrollExtent + 120,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _openHosted() async {
    await launchUrl(
      Uri.parse(NexusService.baseUrl),
      mode: LaunchMode.externalApplication,
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: AppBarTitle(
          t['nexusAi'],
          logoAsset: 'assets/tool_logos/ai_agent.png',
          logoFallbackIcon: Icons.smart_toy_outlined,
          logoGradient: AppColors.toolSky,
        ),
        actions: [
          Semantics(
            button: true,
            label: t['nexusOpenHosted'],
            child: IconButton(
              tooltip: t['nexusOpenHosted'],
              onPressed: _openHosted,
              icon: const Icon(Icons.open_in_new),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            _toolSelector(t),
            Expanded(
              child: _messages.length <= 1 && !_sending
                  ? _suggestions(t)
                  : _list(),
            ),
            if (_sending) _thinking(t),
            _composer(t),
          ],
        ),
      ),
    );
  }

  Widget _toolSelector(AppStrings t) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 6),
      color: AppColors.backgroundSecondary,
      child: Row(
        children: [
          Text(
            '${t['nexusTool']}:',
            style: const TextStyle(
              color: AppColors.textTertiary,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _tools.map((tool) {
                  final selected = tool == _activeTool;
                  final label = _toolLabels[tool] ?? tool;
                  return Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: Semantics(
                      button: true,
                      selected: selected,
                      label: label,
                      child: GestureDetector(
                        onTap: () => setState(() => _activeTool = tool),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: selected
                                ? AppColors.greenPrimary
                                : AppColors.backgroundElevated,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: selected
                                  ? AppColors.greenPrimary
                                  : AppColors.borderPrimary,
                            ),
                          ),
                          child: Text(
                            label,
                            style: TextStyle(
                              color: selected
                                  ? Colors.white
                                  : AppColors.textSecondary,
                              fontSize: 11.5,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _list() {
    return ListView.builder(
      controller: _scroll,
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 8),
      itemCount: _messages.length,
      itemBuilder: (context, i) => _bubble(_messages[i]),
    );
  }

  Widget _bubble(_Msg m) {
    final t = context.tr;
    final isUser = m.fromUser;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: isUser
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: AppColors.toolSky,
                borderRadius: BorderRadius.circular(10),
              ),
              padding: const EdgeInsets.all(6),
              child: Image.asset(
                'assets/tool_logos/ai_agent.png',
                fit: BoxFit.contain,
                errorBuilder: (_, __, ___) => const Icon(
                  Icons.smart_toy_outlined,
                  color: Colors.white,
                  size: 16,
                ),
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
              decoration: BoxDecoration(
                color: isUser
                    ? AppColors.greenPrimary
                    : AppColors.backgroundSecondary,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isUser ? 16 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 16),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (!isUser)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 3),
                      child: Text(
                        t['nexusAi'],
                        style: const TextStyle(
                          color: AppColors.greenDark,
                          fontSize: 10.5,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  SelectableText(
                    m.text,
                    style: TextStyle(
                      color: isUser ? Colors.white : AppColors.textPrimary,
                      fontSize: 14,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 8),
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.backgroundElevated,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.person,
                color: AppColors.textSecondary,
                size: 18,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _suggestions(AppStrings t) {
    final sugg = [t['nexusSugg1'], t['nexusSugg2'], t['nexusSugg3']];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const SizedBox(height: 8),
        ...sugg.map(
          (s) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Semantics(
              button: true,
              label: s,
              child: InkWell(
                onTap: () => _send(s),
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.backgroundSecondary,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.borderPrimary),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.auto_awesome,
                        color: AppColors.greenPrimary,
                        size: 18,
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          s,
                          style: const TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 13.5,
                          ),
                        ),
                      ),
                      const Icon(
                        Icons.chevron_right,
                        color: AppColors.textTertiary,
                        size: 18,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _thinking(AppStrings t) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
      child: Row(
        children: [
          const SizedBox(
            width: 15,
            height: 15,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: AppColors.greenPrimary,
            ),
          ),
          const SizedBox(width: 10),
          Text(
            t['nexusThinking'],
            style: const TextStyle(
              color: AppColors.textTertiary,
              fontSize: 12.5,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  Widget _composer(AppStrings t) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 8, 8, 12),
      decoration: const BoxDecoration(
        color: AppColors.backgroundSecondary,
        border: Border(top: BorderSide(color: AppColors.divider)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _input,
              minLines: 1,
              maxLines: 4,
              textInputAction: TextInputAction.send,
              onSubmitted: (_) => _send(),
              decoration: InputDecoration(
                hintText: t['nexusHint'],
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 12,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Semantics(
            button: true,
            label: t['nexusSend'],
            child: SizedBox(
              width: 46,
              height: 46,
              child: Material(
                color: AppColors.greenPrimary,
                shape: const CircleBorder(),
                child: InkWell(
                  customBorder: const CircleBorder(),
                  onTap: _sending ? null : () => _send(),
                  child: const Icon(
                    Icons.send_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
