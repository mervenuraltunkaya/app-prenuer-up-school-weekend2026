import 'package:smart_scan/shared/models/scan_models.dart';

class UnitPriceCalculator {
  double? calculatePerBaseUnit(PriceParseResult input) {
    final normalizedAmount = switch (input.unit) {
      'kg' => input.amount,
      'g' || 'gr' => input.amount / 1000,
      'l' => input.amount,
      'ml' => input.amount / 1000,
      _ => -1,
    };

    if (normalizedAmount <= 0) {
      return null;
    }

    return input.priceTry / normalizedAmount;
  }

  String baseUnit(PriceParseResult input) {
    return (input.unit == 'ml' || input.unit == 'l') ? 'L' : 'kg';
  }
}
