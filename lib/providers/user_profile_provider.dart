import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Holds the user's profile and persists it locally.
class UserProfileProvider extends ChangeNotifier {
  static const String _kName = 'profile_name';
  static const String _kPhone = 'profile_phone';
  static const String _kEmail = 'profile_email';
  static const String _kCountry = 'profile_country';
  static const String _kBalanceHidden = 'profile_balance_hidden';

  String _name = '';
  String _phone = '';
  String _email = '';
  String _country = '';
  bool _balanceHidden = true;

  String get name => _name;
  String get phone => _phone;
  String get email => _email;
  String get country => _country;
  bool get balanceHidden => _balanceHidden;

  bool get hasProfile => _name.trim().isNotEmpty;

  /// Initials / short display name for the header.
  String get displayName {
    if (_name.trim().isEmpty) return '';
    final parts = _name.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return '${parts.first} ${parts.last}'.toUpperCase();
    }
    return _name.trim().toUpperCase();
  }

  /// Loads the persisted profile.
  Future<void> load() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _name = prefs.getString(_kName) ?? '';
      _phone = prefs.getString(_kPhone) ?? '';
      _email = prefs.getString(_kEmail) ?? '';
      _country = prefs.getString(_kCountry) ?? '';
      _balanceHidden = prefs.getBool(_kBalanceHidden) ?? true;
      notifyListeners();
    } catch (_) {
      // Ignore storage errors.
    }
  }

  /// Saves the profile.
  Future<void> save({
    required String name,
    required String phone,
    required String email,
    required String country,
  }) async {
    _name = name.trim();
    _phone = phone.trim();
    _email = email.trim();
    _country = country.trim();
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_kName, _name);
      await prefs.setString(_kPhone, _phone);
      await prefs.setString(_kEmail, _email);
      await prefs.setString(_kCountry, _country);
    } catch (_) {
      // Ignore persistence errors.
    }
  }

  /// Toggles balance visibility.
  Future<void> toggleBalance() async {
    _balanceHidden = !_balanceHidden;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_kBalanceHidden, _balanceHidden);
    } catch (_) {
      // Ignore errors.
    }
  }

  /// Clears the stored profile.
  Future<void> clear() async {
    _name = '';
    _phone = '';
    _email = '';
    _country = '';
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_kName);
      await prefs.remove(_kPhone);
      await prefs.remove(_kEmail);
      await prefs.remove(_kCountry);
    } catch (_) {
      // Ignore errors.
    }
  }
}