import 'package:flutter/material.dart';
import 'package:smart_scan/core/constants/app_colors.dart';
import 'package:smart_scan/core/constants/app_spacing.dart';
import 'package:smart_scan/core/constants/app_text_styles.dart';

class DealLensResultSheet extends StatelessWidget {
  const DealLensResultSheet({
    super.key,
    required this.unitPrice,
    required this.unitLabel,
    required this.rawText,
  });

  final double unitPrice;
  final String unitLabel;
  final String rawText;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Birim Fiyat', style: AppTextStyles.heading),
            const SizedBox(height: AppSpacing.sm),
            Text(
              '${unitPrice.toStringAsFixed(2)} TL/$unitLabel',
              style: AppTextStyles.priceHero,
            ),
            const SizedBox(height: AppSpacing.sm),
            Text('Ham OCR metni: $rawText', style: AppTextStyles.body),
            const SizedBox(height: AppSpacing.md),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: BoxDecoration(
                color: AppColors.softBlush,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                'AI tarafindan okunmustur, lutfen kontrol ediniz.',
                style: AppTextStyles.body,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
