import 'package:flutter/material.dart';
import 'package:smart_scan/core/constants/app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.warmWhite,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.crimsonRed,
        primary: AppColors.crimsonRed,
        secondary: AppColors.fireOrange,
        tertiary: AppColors.goldenAmber,
        surface: AppColors.pureWhite,
      ),
      textTheme: const TextTheme(
        bodyMedium: TextStyle(fontSize: 14, height: 1.57),
      ),
    );
  }
}
