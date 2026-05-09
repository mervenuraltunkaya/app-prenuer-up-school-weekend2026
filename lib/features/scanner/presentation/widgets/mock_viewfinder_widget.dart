import 'package:flutter/material.dart';
import 'package:smart_scan/core/constants/app_colors.dart';
import 'package:smart_scan/core/constants/app_radius.dart';
import 'package:smart_scan/core/constants/app_spacing.dart';
import 'package:smart_scan/features/scanner/presentation/scanner_layout_tokens.dart';

class MockViewfinderWidget extends StatelessWidget {
  const MockViewfinderWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      constraints: const BoxConstraints(
        minHeight: ScannerLayoutTokens.viewfinderMinHeight,
      ),
      decoration: BoxDecoration(
        color: AppColors.overlay.withValues(alpha: 0.16),
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.emerald.withValues(alpha: 0.4), width: 1.2),
      ),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.camera_alt_outlined,
                size: 42,
                color: AppColors.emeraldDark.withValues(alpha: 0.85),
                semanticLabel: 'Mock kamera vizoru',
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                'Kamera Vizoru (Mock)',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: AppColors.ink900,
                ),
              ),
              const SizedBox(height: AppSpacing.xs),
              Text(
                'Faz 1-2 prototip ekrani',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.ink600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
