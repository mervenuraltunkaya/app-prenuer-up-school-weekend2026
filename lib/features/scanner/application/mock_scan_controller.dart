import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smart_scan/features/scanner/domain/mock_scan_result.dart';

final mockScanControllerProvider =
    AutoDisposeNotifierProvider<MockScanController, MockScanState>(
      MockScanController.new,
    );

class MockScanController extends AutoDisposeNotifier<MockScanState> {
  @override
  MockScanState build() => const MockScanState.idle();

  Future<void> runPriceAnalysis() async {
    state = const MockScanState.loading(MockScanType.priceAnalysis);
    await Future<void>.delayed(const Duration(seconds: 2));
    state = MockScanState.result(
      const MockScanResult(
        title: 'Fiyat Analizi',
        summary: 'Urun: Organik Yulaf',
        details: 'En uygun fiyat 45 TL - 500 g paket (market kampanyasi).',
        type: MockScanType.priceAnalysis,
      ),
    );
  }

  Future<void> runIngredientAnalysis() async {
    state = const MockScanState.loading(MockScanType.ingredientAnalysis);
    await Future<void>.delayed(const Duration(seconds: 2));
    state = MockScanState.result(
      const MockScanResult(
        title: 'Icerik Analizi',
        summary: 'Seker orani yuksek',
        details: 'Diyete uygun degil. Lif orani dusuk, ilave tatlandirici iceriyor.',
        type: MockScanType.ingredientAnalysis,
      ),
    );
  }

  void reset() {
    state = const MockScanState.idle();
  }
}

class MockScanState {
  const MockScanState._({
    required this.isLoading,
    required this.activeType,
    required this.result,
  });

  const MockScanState.idle() : this._(isLoading: false, activeType: null, result: null);

  const MockScanState.loading(MockScanType type)
    : this._(isLoading: true, activeType: type, result: null);

  MockScanState.result(MockScanResult result)
    : this._(isLoading: false, activeType: result.type, result: result);

  final bool isLoading;
  final MockScanType? activeType;
  final MockScanResult? result;
}
