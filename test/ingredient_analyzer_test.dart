import 'package:flutter_test/flutter_test.dart';
import 'package:smart_scan/features/pure_scan/ingredient_analyzer.dart';
import 'package:smart_scan/shared/models/scan_models.dart';

void main() {
  group('IngredientAnalyzer', () {
    final analyzer = IngredientAnalyzer();

    test('sorts danger first', () {
      const items = [
        IngredientAnalysis(
          name: 'A',
          reason: 'safe',
          status: IngredientStatus.safe,
        ),
        IngredientAnalysis(
          name: 'B',
          reason: 'warning',
          status: IngredientStatus.warning,
        ),
        IngredientAnalysis(
          name: 'C',
          reason: 'danger',
          status: IngredientStatus.danger,
        ),
      ];

      final sorted = analyzer.prioritize(items);
      expect(sorted.first.status, IngredientStatus.danger);
      expect(analyzer.worstStatus(sorted), IngredientStatus.danger);
    });
  });
}
