import 'package:flutter_test/flutter_test.dart';
import 'package:smart_scan/features/deal_lens/unit_price_calculator.dart';
import 'package:smart_scan/shared/models/scan_models.dart';

void main() {
  group('UnitPriceCalculator', () {
    final calculator = UnitPriceCalculator();

    test('calculates TL/kg from gram input', () {
      const input = PriceParseResult(priceTry: 50, amount: 500, unit: 'g');
      final result = calculator.calculatePerBaseUnit(input);
      expect(result, 100);
      expect(calculator.baseUnit(input), 'kg');
    });

    test('calculates TL/L from ml input', () {
      const input = PriceParseResult(priceTry: 30, amount: 250, unit: 'ml');
      final result = calculator.calculatePerBaseUnit(input);
      expect(result, 120);
      expect(calculator.baseUnit(input), 'L');
    });
  });
}
