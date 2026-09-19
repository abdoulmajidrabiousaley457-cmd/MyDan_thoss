import 'package:flutter/material.dart';

/// MyDan_thoss App Colors
/// Green mobile-money style palette (emerald green header + royal blue accents).
class AppColors {
  // ---------- Brand — GREEN ----------
  static const Color greenPrimary = Color(0xFF16A34A);        // Header green
  static const Color greenDark = Color(0xFF15803D);           // Green pressed / nav
  static const Color greenLight = Color(0xFF22C55E);          // Green lighter
  static const Color greenAccent = Color(0xFF4ADE80);         // Bright green accent

  // Legacy aliases — kept so existing code keeps working (now GREEN).
  static const Color orangePrimary = greenPrimary;
  static const Color orangeDark = greenDark;
  static const Color orangeLight = greenLight;

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
  static const Color pastelGreen = Color(0xFFE7F8ED);

  // ---------- Accent (icon foreground) ----------
  static const Color accentBlue = Color(0xFF3F51B5);
  static const Color accentPurple = Color(0xFF7E57C2);
  static const Color accentOrange = Color(0xFFF59E0B);
  static const Color accentTeal = Color(0xFF00ACC1);
  static const Color accentPink = Color(0xFFEC407A);

  // ---------- Semantic ----------
  static const Color upColor = Color(0xFFE53935);            // Red (market up)
  static const Color downColor = Color(0xFF2E7D32);          // Green (market down)
  static const Color successGreen = Color(0xFF2E7D32);
  static const Color errorRed = Color(0xFFE53935);
  static const Color warningYellow = Color(0xFFF9A825);
  static const Color infoBlue = Color(0xFF1E88E5);

  // Legacy aliases
  static const Color primaryGold = greenPrimary;
  static const Color primaryGoldDark = greenDark;
  static const Color primaryGoldLight = greenLight;
  static const Color primaryGoldAlpha = Color(0x3316A34A);

  // ---------- Text ----------
  static const Color textPrimary = Color(0xFF15251A);        // Dark ink
  static const Color textSecondary = Color(0xFF52605A);      // Secondary
  static const Color textTertiary = Color(0xFF8A968F);       // Tertiary
  static const Color textDisabled = Color(0xFFBFC5C1);       // Disabled
  static const Color textLink = Color(0xFF15803D);           // Link
  static const Color textOnDark = Color(0xFFFFFFFF);
  static const Color textOnDarkMuted = Color(0xCCFFFFFF);

  // ---------- Borders ----------
  static const Color borderPrimary = Color(0xFFE4E8EE);
  static const Color borderSecondary = Color(0xFFEEF1F5);
  static const Color divider = Color(0xFFEDF0F4);

  // ---------- Gradients ----------
  static LinearGradient get goldGradient => const LinearGradient(
    colors: [greenPrimary, greenLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient get greenGradient => const LinearGradient(
    colors: [greenPrimary, greenDark],
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
    colors: [greenPrimary, greenDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static LinearGradient get darkOverlayGradient => const LinearGradient(
    colors: [Colors.transparent, Color(0x33000000)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // ---------- Tool logo gradients (aesthetic & distinct) ----------
  static const LinearGradient toolGreen = LinearGradient(
    colors: [Color(0xFF22C55E), Color(0xFF16A34A)],
    begin: Alignment.topLeft, end: Alignment.bottomRight,
  );
  static const LinearGradient toolTeal = LinearGradient(
    colors: [Color(0xFF06B6D4), Color(0xFF0891B2)],
    begin: Alignment.topLeft, end: Alignment.bottomRight,
  );
  static const LinearGradient toolAmber = LinearGradient(
    colors: [Color(0xFFFBBF24), Color(0xFFF59E0B)],
    begin: Alignment.topLeft, end: Alignment.bottomRight,
  );
  static const LinearGradient toolViolet = LinearGradient(
    colors: [Color(0xFFA78BFA), Color(0xFF7C3AED)],
    begin: Alignment.topLeft, end: Alignment.bottomRight,
  );
  static const LinearGradient toolBlue = LinearGradient(
    colors: [Color(0xFF60A5FA), Color(0xFF2563EB)],
    begin: Alignment.topLeft, end: Alignment.bottomRight,
  );
  static const LinearGradient toolPink = LinearGradient(
    colors: [Color(0xFFF472B6), Color(0xFFDB2777)],
    begin: Alignment.topLeft, end: Alignment.bottomRight,
  );
  static const LinearGradient toolEmerald = LinearGradient(
    colors: [Color(0xFF34D399), Color(0xFF059669)],
    begin: Alignment.topLeft, end: Alignment.bottomRight,
  );
  static const LinearGradient toolSky = LinearGradient(
    colors: [Color(0xFF38BDF8), Color(0xFF0284C7)],
    begin: Alignment.topLeft, end: Alignment.bottomRight,
  );
  static const LinearGradient toolIndigo = LinearGradient(
    colors: [Color(0xFF818CF8), Color(0xFF4F46E5)],
    begin: Alignment.topLeft, end: Alignment.bottomRight,
  );
}
