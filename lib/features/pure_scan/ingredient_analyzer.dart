import 'package:smart_scan/shared/models/scan_models.dart';

class IngredientAnalyzer {
  List<IngredientAnalysis> prioritize(List<IngredientAnalysis> items) {
    final sorted = [...items];
    sorted.sort((a, b) => _score(b.status).compareTo(_score(a.status)));
    return sorted;
  }

  IngredientStatus worstStatus(List<IngredientAnalysis> items) {
    if (items.any((e) => e.status == IngredientStatus.danger)) {
      return IngredientStatus.danger;
    }
    if (items.any((e) => e.status == IngredientStatus.warning)) {
      return IngredientStatus.warning;
    }
    return IngredientStatus.safe;
  }

  int _score(IngredientStatus status) {
    return switch (status) {
      IngredientStatus.safe => 1,
      IngredientStatus.warning => 2,
      IngredientStatus.danger => 3,
    };
  }
}
