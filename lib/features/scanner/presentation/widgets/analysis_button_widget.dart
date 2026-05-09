import 'package:flutter/material.dart';
import 'package:smart_scan/core/constants/app_colors.dart';
import 'package:smart_scan/core/constants/app_radius.dart';
import 'package:smart_scan/core/constants/app_spacing.dart';
import 'package:smart_scan/features/scanner/presentation/scanner_layout_tokens.dart';

class AnalysisButtonWidget extends StatelessWidget {
  const AnalysisButtonWidget({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onPressed,
    required this.isLoading,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback? onPressed;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: ScannerLayoutTokens.actionButtonHeight,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(double.infinity, ScannerLayoutTokens.actionButtonHeight),
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
          backgroundColor: AppColors.emerald,
          disabledBackgroundColor: AppColors.neutral400,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.full),
          ),
        ),
        child: Row(
          children: [
            Icon(icon, size: 24, semanticLabel: title),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(
                      color: AppColors.pureWhite,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.pureWhite.withValues(alpha: 0.85),
                    ),
                  ),
                ],
              ),
            ),
            if (!isLoading) const Icon(Icons.arrow_forward_rounded, size: 20),
          ],
        ),
      ),
    );
  }
}
