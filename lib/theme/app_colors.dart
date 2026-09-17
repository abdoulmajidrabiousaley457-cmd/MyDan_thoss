import 'package:flutter/material.dart';

/// MarketMind App Colors
/// Professional investment platform color system
class AppColors {
  // Background Colors (Dark Theme)
  static const Color backgroundPrimary = Color(0xFF0D1117);      // Main background - Deep gray blue
  static const Color backgroundSecondary = Color(0xFF161B22);    // Secondary background
  static const Color backgroundTertiary = Color(0xFF21262D);     // Card background
  static const Color backgroundElevated = Color(0xFF2D333B);     // Elevated elements

  // Primary Theme - Wisdom Gold
  static const Color primaryGold = Color(0xFFFFB800);            // Primary gold - CTA buttons
  static const Color primaryGoldDark = Color(0xFFE6A500);        // Dark gold - Pressed state
  static const Color primaryGoldLight = Color(0xFFFFD54F);       // Light gold - Highlights
  static const Color primaryGoldAlpha = Color(0x33FFB800);       // Semi-transparent gold

  // Market Colors (Chinese Style - Red Up, Green Down)
  static const Color upColor = Color(0xFFFF3B30);                // Chinese red - Up
  static const Color downColor = Color(0xFF34C759);              // Fruit green - Down

  // Accent Colors
  static const Color accentBlue = Color(0xFF0A84FF);             // Tech blue - Links/Charts
  static const Color accentPurple = Color(0xFFBF5AF2);           // Premium purple - VIP features
  static const Color accentOrange = Color(0xFFFF9F0A);           // Warning orange - Risk alerts
  static const Color accentTeal = Color(0xFF64D2FF);             // Teal - Info tips

  // Status Colors
  static const Color successGreen = Color(0xFF30D158);           // Success
  static const Color errorRed = Color(0xFFFF453A);               // Error
  static const Color warningYellow = Color(0xFFFFD60A);          // Warning
  static const Color infoBlue = Color(0xFF0A84FF);               // Info

  // Text Colors
  static const Color textPrimary = Color(0xFFFFFFFF);            // Primary text - White
  static const Color textSecondary = Color(0xFFAEAEB2);          // Secondary text - Light gray
  static const Color textTertiary = Color(0xFF636366);           // Tertiary text
  static const Color textDisabled = Color(0xFF48484A);           // Disabled text
  static const Color textLink = Color(0xFF0A84FF);               // Link text

  // Border & Divider
  static const Color borderPrimary = Color(0xFF30363D);          // Primary border
  static const Color borderSecondary = Color(0xFF21262D);        // Secondary border
  static const Color divider = Color(0xFF21262D);                // Divider line

  // Light Theme Colors (Alternative)
  static const Color lightBackgroundPrimary = Color(0xFFFFFFFF);
  static const Color lightBackgroundSecondary = Color(0xFFF5F5F7);
  static const Color lightBackgroundTertiary = Color(0xFFE5E5EA);

  // Gradients
  static LinearGradient get goldGradient => const LinearGradient(
    colors: [primaryGold, primaryGoldLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient get bluePurpleGradient => const LinearGradient(
    colors: [accentBlue, accentPurple],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient get darkOverlayGradient => const LinearGradient(
    colors: [Colors.transparent, Color(0x80000000)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
