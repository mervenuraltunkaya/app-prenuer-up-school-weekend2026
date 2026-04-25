import 'package:flutter/material.dart';
import 'package:smart_scan/core/constants/app_colors.dart';

class AppTextStyles {
  static const TextStyle heading = TextStyle(
    fontSize: 22,
    height: 1.36,
    fontWeight: FontWeight.w600,
    color: AppColors.inkBlack,
  );

  static const TextStyle body = TextStyle(
    fontSize: 14,
    height: 1.57,
    fontWeight: FontWeight.w400,
    color: AppColors.charcoal,
  );

  static const TextStyle label = TextStyle(
    fontSize: 12,
    height: 1.5,
    fontWeight: FontWeight.w500,
  );

  static const TextStyle priceHero = TextStyle(
    fontSize: 36,
    height: 1.22,
    fontWeight: FontWeight.w700,
    color: AppColors.crimsonRed,
  );
}
