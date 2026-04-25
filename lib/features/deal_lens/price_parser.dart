import 'package:smart_scan/shared/models/scan_models.dart';

class PriceParser {
  static final RegExp _priceExp = RegExp(r'(\d+[.,]?\d*)\s?(tl|₺)', caseSensitive: false);
  static final RegExp _amountExp = RegExp(
    r'(\d+[.,]?\d*)\s?(kg|g|gr|l|ml)',
    caseSensitive: false,
  );

  PriceParseResult? parse(String text) {
    final priceMatch = _priceExp.firstMatch(text);
    final amountMatch = _amountExp.firstMatch(text);
    if (priceMatch == null || amountMatch == null) {
      return null;
    }

    final price =
        double.tryParse(priceMatch.group(1)!.replaceAll(',', '.')) ?? 0;
    final amount =
        double.tryParse(amountMatch.group(1)!.replaceAll(',', '.')) ?? 0;
    final unit = amountMatch.group(2)!.toLowerCase();

    if (price <= 0 || amount <= 0) {
      return null;
    }

    return PriceParseResult(priceTry: price, amount: amount, unit: unit);
  }
}
