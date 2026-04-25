import 'package:flutter/material.dart';
import 'package:smart_scan/core/constants/app_spacing.dart';
import 'package:smart_scan/shared/models/scan_models.dart';

class TrafficLightBadgeWidget extends StatelessWidget {
  const TrafficLightBadgeWidget({super.key, required this.status});

  final IngredientStatus status;

  @override
  Widget build(BuildContext context) {
    final (color, icon, label) = switch (status) {
      IngredientStatus.safe => (Colors.green, Icons.check_circle, 'Guvenli'),
      IngredientStatus.warning =>
        (Colors.orange, Icons.warning_amber, 'Dikkat'),
      IngredientStatus.danger => (Colors.red, Icons.dangerous, 'Zararli'),
    };

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(9999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, semanticLabel: label),
          const SizedBox(width: AppSpacing.sm),
          Text(label, style: TextStyle(color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
