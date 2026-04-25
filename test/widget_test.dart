import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smart_scan/main.dart';

void main() {
  testWidgets('app renders scanner actions', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: SmartScanApp(),
      ),
    );

    expect(find.text('Deal-Lens'), findsOneWidget);
    expect(find.text('Pure-Scan'), findsOneWidget);
  });
}
