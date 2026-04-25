import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smart_scan/core/theme/app_theme.dart';
import 'package:smart_scan/features/scanner/scanner_screen.dart';

void main() {
  runApp(const ProviderScope(child: SmartScanApp()));
}

class SmartScanApp extends StatelessWidget {
  const SmartScanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmartScan',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const ScannerScreen(),
    );
  }
}
