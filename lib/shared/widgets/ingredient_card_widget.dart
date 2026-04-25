import 'package:flutter/material.dart';
import 'package:smart_scan/core/constants/app_spacing.dart';
import 'package:smart_scan/shared/models/scan_models.dart';
import 'package:smart_scan/shared/widgets/traffic_light_badge_widget.dart';

class IngredientCardWidget extends StatelessWidget {
  const IngredientCardWidget({
    super.key,
    required this.item,
  });

  final IngredientAnalysis item;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TrafficLightBadgeWidget(status: item.status),
            const SizedBox(height: AppSpacing.sm),
            Text(item.name, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: AppSpacing.xs),
            Text(item.reason),
          ],
        ),
      ),
    );
  }
}
