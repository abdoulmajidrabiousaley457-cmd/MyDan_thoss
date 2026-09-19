import 'package:flutter/material.dart';
import 'app_colors.dart';

/// MyDan_thoss App Theme — light, mobile-money style.
class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,

      colorScheme: const ColorScheme.light(
        primary: AppColors.bluePrimary,
        secondary: AppColors.orangePrimary,
        surface: AppColors.backgroundSecondary,
        error: AppColors.errorRed,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textPrimary,
        onError: Colors.white,
      ),

      scaffoldBackgroundColor: AppColors.backgroundPrimary,

      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.orangePrimary,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: Colors.white),
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),

      cardTheme: CardThemeData(
        color: AppColors.backgroundSecondary,
        elevation: 2,
        shadowColor: const Color(0x14000000),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      ),

      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: AppColors.blueDark,
        indicatorColor: Colors.white.withValues(alpha: 0.15),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return TextStyle(
            fontSize: 11,
            fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
            color: selected ? Colors.white : Colors.white70,
          );
        }),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return IconThemeData(
            color: selected ? Colors.white : Colors.white70,
            size: 24,
          );
        }),
      ),

      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.blueDark,
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.white70,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        selectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
        unselectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.bluePrimary,
          foregroundColor: Colors.white,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
        ),
      ),

      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.bluePrimary,
          textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.backgroundElevated,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.borderPrimary),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.borderPrimary),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.bluePrimary, width: 2),
        ),
        hintStyle: const TextStyle(color: AppColors.textTertiary),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),

      dividerTheme: const DividerThemeData(
        color: AppColors.divider,
        thickness: 1,
        space: 1,
      ),

      iconTheme: const IconThemeData(
        color: AppColors.textSecondary,
        size: 24,
      ),

      textTheme: const TextTheme(
        displayLarge: TextStyle(fontSize: 34, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
        displayMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
        displaySmall: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
        headlineLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
        headlineMedium: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
        headlineSmall: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
        titleLarge: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
        titleMedium: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
        titleSmall: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
        bodyLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.normal, color: AppColors.textPrimary),
        bodyMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.normal, color: AppColors.textSecondary),
        bodySmall: TextStyle(fontSize: 12, fontWeight: FontWeight.normal, color: AppColors.textSecondary),
        labelLarge: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textSecondary),
        labelMedium: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textSecondary),
        labelSmall: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: AppColors.textTertiary),
      ),
    );
  }

  /// Kept as alias so legacy code referencing `darkTheme` still compiles.
  static ThemeData get darkTheme => lightTheme;
}
