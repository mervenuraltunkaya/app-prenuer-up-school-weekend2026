import 'package:smart_scan/shared/models/scan_models.dart';

class PriceParser {
  static final RegExp _priceExp = RegExp(
    r'(?:(?:fiyat|price)\s*[:=]?\s*)?(\d+(?:[.,]\d{1,2})?)\s*(?:tl|₺|try|t)',
    caseSensitive: false,
  );
  static final RegExp _amountExp = RegExp(
    r'(\d+(?:[.,]\d+)?)\s*(kg|g|gr|l|lt|ml)',
    caseSensitive: false,
  );

  PriceParseResult? parse(String text) {
    final amountMatches = _amountExp.allMatches(text).toList();
    final priceMatches = _priceExp.allMatches(text).toList();
    if (amountMatches.isEmpty || priceMatches.isEmpty) {
      return null;
    }

    final amountMatch = amountMatches.first;
    final Match priceMatch = priceMatches.reduce((a, b) {
      final distanceA = (a.start - amountMatch.start).abs();
      final distanceB = (b.start - amountMatch.start).abs();
      return distanceA <= distanceB ? a : b;
    });

    final price = _toDouble(priceMatch.group(1));
    final amount = _toDouble(amountMatch.group(1));
    final rawUnit = (amountMatch.group(2) ?? '').toLowerCase();
    final unit = rawUnit == 'lt' ? 'l' : rawUnit;

    if (price <= 0 || amount <= 0) {
      return null;
    }

    return PriceParseResult(priceTry: price, amount: amount, unit: unit);
  }

  double _toDouble(String? value) {
    if (value == null) return 0;
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }
}
