enum MockScanType { priceAnalysis, ingredientAnalysis }

class MockScanResult {
  const MockScanResult({
    required this.title,
    required this.summary,
    required this.details,
    required this.type,
  });

  final String title;
  final String summary;
  final String details;
  final MockScanType type;
}
