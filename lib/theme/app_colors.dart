import 'package:flutter/material.dart';

/// MyDan_thoss App Colors
/// Mobile-money style palette (orange header + royal blue accents).
class AppColors {
  // ---------- Brand ----------
  static const Color orangePrimary = Color(0xFFF4511E);      // Header orange
  static const Color orangeDark = Color(0xFFE64A19);         // Orange pressed
  static const Color orangeLight = Color(0xFFFF7043);        // Orange lighter

  static const Color bluePrimary = Color(0xFF0066B3);        // Balance card blue
  static const Color blueDark = Color(0xFF0052A3);           // Bottom nav blue
  static const Color blueLight = Color(0xFF2196F3);          // Lighter blue
  static const Color blueDeep = Color(0xFF0D47A1);           // Deep blue

  // ---------- Backgrounds (Light theme) ----------
  static const Color backgroundPrimary = Color(0xFFF4F6F9);   // App background
  static const Color backgroundSecondary = Color(0xFFFFFFFF); // Cards / white
  static const Color backgroundTertiary = Color(0xFFFFFFFF);  // Card surface
  static const Color backgroundElevated = Color(0xFFF1F3F7);  // Elevated subtle

  // ---------- Pastel icon backgrounds ----------
  static const Color pastelLavender = Color(0xFFE3E8FF);
  static const Color pastelSky = Color(0xFFE1F5FE);
  static const Color pastelPeach = Color(0xFFFFEBE7);
  static const Color pastelPink = Color(0xFFFCE4EC);
  static const Color pastelMint = Color(0xFFE8F5E9);
  static const Color pastelIndigo = Color(0xFFE8EAF6);
  static const Color pastelMagenta = Color(0xFFFCE8F3);
  static const Color pastelOrange = Color(0xFFFFF3E0);

  // ---------- Accent (icon foreground) ----------
  static const Color accentBlue = Color(0xFF3F51B5);         // Indigo
  static const Color accentPurple = Color(0xFF7E57C2);       // Purple
  static const Color accentOrange = Color(0xFFFF9F0A);       // Warning orange
  static const Color accentTeal = Color(0xFF00ACC1);         // Teal
  static const Color accentPink = Color(0xFFEC407A);         // Pink

  // ---------- Semantic ----------
  static const Color upColor = Color(0xFFE53935);            // Red up
  static const Color downColor = Color(0xFF43A047);          // Green down
  static const Color successGreen = Color(0xFF2E7D32);
  static const Color errorRed = Color(0xFFE53935);
  static const Color warningYellow = Color(0xFFF9A825);
  static const Color infoBlue = Color(0xFF1E88E5);

  // Legacy aliases (kept for backward compatibility)
  static const Color primaryGold = bluePrimary;
  static const Color primaryGoldDark = blueDark;
  static const Color primaryGoldLight = blueLight;
  static const Color primaryGoldAlpha = Color(0x330066B3);

  // ---------- Text ----------
  static const Color textPrimary = Color(0xFF1A1D26);        // Dark text
  static const Color textSecondary = Color(0xFF5A6270);      // Secondary text
  static const Color textTertiary = Color(0xFF98A0AC);       // Tertiary text
  static const Color textDisabled = Color(0xFFBFC5CE);       // Disabled
  static const Color textLink = Color(0xFF0066B3);           // Link
  static const Color textOnDark = Color(0xFFFFFFFF);         // On colored bg
  static const Color textOnDarkMuted = Color(0xCCFFFFFF);    // Muted on colored bg

  // ---------- Borders ----------
  static const Color borderPrimary = Color(0xFFE4E8EE);
  static const Color borderSecondary = Color(0xFFEEF1F5);
  static const Color divider = Color(0xFFEDF0F4);

  // ---------- Gradients ----------
  static LinearGradient get goldGradient => const LinearGradient(
    colors: [orangePrimary, orangeLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient get blueGradient => const LinearGradient(
    colors: [bluePrimary, blueDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient get bluePurpleGradient => const LinearGradient(
    colors: [bluePrimary, blueDeep],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient get orangeGradient => const LinearGradient(
    colors: [orangePrimary, orangeDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient get darkOverlayGradient => const LinearGradient(
    colors: [Colors.transparent, Color(0x33000000)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
