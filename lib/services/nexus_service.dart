import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

/// Result of a Nexus AI agent call.
class NexusReply {
  final bool ok;
  final String text;

  /// True when the endpoint could not be reached (agent not published yet, or
  /// offline) — as opposed to a normal but empty answer.
  final bool unavailable;

  const NexusReply({
    required this.ok,
    required this.text,
    this.unavailable = false,
  });
}

/// Nexus AI agent client.
///
/// Faithful Dart port of the official integration script:
///
/// ```js
/// fetch('https://omni-studio-abdoul.ai.studio/api/agent/chat', {
///   method: 'POST',
///   headers: { 'Content-Type': 'application/json' },
///   body: JSON.stringify({ message, activeTool, toolContext: { origin: 'Novita-Sandbox-5060' } })
/// })
/// ```
class NexusService {
  const NexusService._();

  /// The hosted Nexus AI agent base URL (published Google AI Studio app).
  static const String baseUrl = 'https://omni-studio-abdoul.ai.studio';

  static const String chatEndpoint = '$baseUrl/api/agent/chat';

  /// Sends [message] to the agent and returns its reply.
  ///
  /// [activeTool] is one of: `tracking`, `screener`, `valuation`, `report`,
  /// `flow`, `currency`, `data` … (matches the app's tool keys).
  static Future<NexusReply> ask(
    String message, {
    String activeTool = 'tracking',
    String origin = 'Novita-Sandbox-5060',
  }) async {
    try {
      final res = await http
          .post(
            Uri.parse(chatEndpoint),
            headers: const {'Content-Type': 'application/json'},
            body: jsonEncode({
              'message': message,
              'activeTool': activeTool,
              'toolContext': {'origin': origin},
            }),
          )
          .timeout(const Duration(seconds: 45));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final reply = (data is Map && data['reply'] != null)
            ? data['reply'].toString()
            : res.body;
        return NexusReply(ok: true, text: reply);
      }

      // Non-200: the agent deployment is most likely not live yet.
      if (kDebugMode) {
        debugPrint('Nexus AI HTTP ${res.statusCode}: ${res.body}');
      }
      return const NexusReply(ok: false, text: '', unavailable: true);
    } catch (e) {
      if (kDebugMode) debugPrint('Nexus AI error: $e');
      return const NexusReply(ok: false, text: '', unavailable: true);
    }
  }
}
