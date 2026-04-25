import 'package:flutter/material.dart';
import 'package:smart_scan/core/constants/app_spacing.dart';
import 'package:smart_scan/shared/models/scan_models.dart';
import 'package:smart_scan/shared/widgets/ingredient_card_widget.dart';
import 'package:smart_scan/shared/widgets/traffic_light_badge_widget.dart';

class PureScanResultSheet extends StatelessWidget {
  const PureScanResultSheet({super.key, required this.items, required this.worst});

  final List<IngredientAnalysis> items;
  final IngredientStatus worst;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Icerik Analizi'),
            const SizedBox(height: AppSpacing.sm),
            TrafficLightBadgeWidget(status: worst),
            const SizedBox(height: AppSpacing.md),
            Flexible(
              child: ListView.separated(
                shrinkWrap: true,
                itemBuilder: (_, index) => IngredientCardWidget(item: items[index]),
                separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                itemCount: items.length,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            const Text('Bu icerik tibbi tavsiye degildir.'),
          ],
        ),
      ),
    );
  }
}
