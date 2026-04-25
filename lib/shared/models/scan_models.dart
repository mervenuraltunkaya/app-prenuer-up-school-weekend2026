enum ScanMode { dealLens, pureScan }

enum IngredientStatus { safe, warning, danger }

class IngredientAnalysis {
  const IngredientAnalysis({
    required this.name,
    required this.reason,
    required this.status,
  });

  final String name;
  final String reason;
  final IngredientStatus status;
}

class PriceParseResult {
  const PriceParseResult({
    required this.priceTry,
    required this.amount,
    required this.unit,
  });

  final double priceTry;
  final double amount;
  final String unit;
}
