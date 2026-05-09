import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smart_scan/core/constants/app_colors.dart';
import 'package:smart_scan/core/constants/app_radius.dart';
import 'package:smart_scan/core/constants/app_spacing.dart';
import 'package:smart_scan/features/scanner/application/mock_scan_controller.dart';
import 'package:smart_scan/features/scanner/presentation/widgets/analysis_button_widget.dart';
import 'package:smart_scan/features/scanner/presentation/widgets/mock_result_sheet.dart';
import 'package:smart_scan/features/scanner/presentation/widgets/mock_viewfinder_widget.dart';
import 'package:smart_scan/features/scanner/presentation/widgets/skeleton_loading_widget.dart';

class ScannerScreen extends ConsumerStatefulWidget {
  const ScannerScreen({super.key});

  @override
  ConsumerState<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends ConsumerState<ScannerScreen> {
  @override
  void initState() {
    super.initState();
    ref.listenManual(mockScanControllerProvider, (previous, next) async {
      final result = next.result;
      if (result == null || !mounted || previous?.result == result) return;
      await showModalBottomSheet<void>(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (_) => MockResultSheet(result: result),
      );
      if (mounted) {
        ref.read(mockScanControllerProvider.notifier).reset();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(mockScanControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SmartScan'),
        centerTitle: false,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Akilli Alisveris Asistani', style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: AppSpacing.xs),
              Text(
                'Bu sprintte sadece mock veri ile calisan prototip akisi aktif.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: AppSpacing.lg),
              const Expanded(child: MockViewfinderWidget()),
              const SizedBox(height: AppSpacing.md),
              if (state.isLoading) ...[
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Yukleniyor...'),
                      SizedBox(height: AppSpacing.sm),
                      SkeletonLoadingWidget(),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
              ],
              AnalysisButtonWidget(
                title: 'Fiyat Analizi',
                subtitle: 'Mock tarama ve fiyat sonucu',
                icon: Icons.price_check_rounded,
                isLoading: state.isLoading,
                onPressed: state.isLoading
                    ? null
                    : () => ref.read(mockScanControllerProvider.notifier).runPriceAnalysis(),
              ),
              const SizedBox(height: AppSpacing.sm),
              AnalysisButtonWidget(
                title: 'Icerik Analizi',
                subtitle: 'Mock icerik ve risk degerlendirmesi',
                icon: Icons.eco_outlined,
                isLoading: state.isLoading,
                onPressed: state.isLoading
                    ? null
                    : () => ref.read(mockScanControllerProvider.notifier).runIngredientAnalysis(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
