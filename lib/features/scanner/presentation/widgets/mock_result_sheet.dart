import 'package:flutter/material.dart';
import 'package:smart_scan/core/constants/app_colors.dart';
import 'package:smart_scan/core/constants/app_radius.dart';
import 'package:smart_scan/core/constants/app_spacing.dart';
import 'package:smart_scan/features/scanner/domain/mock_scan_result.dart';

class MockResultSheet extends StatelessWidget {
  const MockResultSheet({super.key, required this.result});

  final MockScanResult result;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.fromLTRB(
          AppSpacing.lg,
          AppSpacing.md,
          AppSpacing.lg,
          AppSpacing.xl,
        ),
        decoration: const BoxDecoration(
          color: AppColors.pureWhite,
          borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.neutral400.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(result.title, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: AppSpacing.sm),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.mint,
                borderRadius: BorderRadius.circular(AppRadius.lg),
              ),
              child: Text(result.summary, style: Theme.of(context).textTheme.titleMedium),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(result.details, style: Theme.of(context).textTheme.bodyLarge),
          ],
        ),
      ),
    );
  }
}
