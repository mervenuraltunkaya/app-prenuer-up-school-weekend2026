import 'package:flutter_test/flutter_test.dart';
import 'package:smart_scan/features/deal_lens/price_parser.dart';

void main() {
  group('PriceParser', () {
    final parser = PriceParser();

    test('parses price and amount from OCR text', () {
      final result = parser.parse('Fiyat 39,95 TL 750 g');
      expect(result, isNotNull);
      expect(result!.priceTry, 39.95);
      expect(result.amount, 750);
      expect(result.unit, 'g');
    });

    test('returns null when amount is missing', () {
      final result = parser.parse('Sadece fiyat 39 TL');
      expect(result, isNull);
    });
  });
}
