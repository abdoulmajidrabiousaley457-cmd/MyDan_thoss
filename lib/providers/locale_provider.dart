import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../l10n/app_strings.dart';

/// Holds the active [AppLanguage] and persists it to local storage.
class LocaleProvider extends ChangeNotifier {
  static const String _prefKey = 'app_language';

  AppLanguage _language = AppLanguage.en;

  AppLanguage get language => _language;
  bool get isRtl => _language.isRtl;
  Locale get locale => _language.locale;

  /// Loads the persisted language (defaults to English).
  Future<void> load() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final code = prefs.getString(_prefKey);
      if (code != null) {
        _language = AppLanguage.values.firstWhere(
          (l) => l.code == code,
          orElse: () => AppLanguage.en,
        );
        notifyListeners();
      }
    } catch (_) {
      // Ignore storage errors; keep default language.
    }
  }

  /// Updates the language and persists the change.
  Future<void> setLanguage(AppLanguage language) async {
    if (_language == language) return;
    _language = language;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefKey, language.code);
    } catch (_) {
      // Ignore persistence errors.
    }
  }
}
