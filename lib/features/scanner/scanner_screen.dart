import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smart_scan/core/constants/app_colors.dart';
import 'package:smart_scan/core/constants/app_spacing.dart';
import 'package:smart_scan/features/deal_lens/deal_lens_result_sheet.dart';
import 'package:smart_scan/features/pure_scan/pure_scan_result_sheet.dart';
import 'package:smart_scan/features/scanner/scanner_controller.dart';
import 'package:smart_scan/shared/models/scan_models.dart';

class ScannerScreen extends ConsumerStatefulWidget {
  const ScannerScreen({super.key});

  @override
  ConsumerState<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends ConsumerState<ScannerScreen>
    with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    Future.microtask(
      () => ref.read(scannerControllerProvider).initializeCamera(),
    );
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    final controller = ref.read(scannerControllerProvider).cameraController;
    if (controller == null || !controller.value.isInitialized) {
      return;
    }
    if (state == AppLifecycleState.inactive) {
      controller.dispose();
    }
    if (state == AppLifecycleState.resumed) {
      ref.read(scannerControllerProvider).initializeCamera();
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(scannerControllerProvider);

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          _buildBackground(state),
          Positioned(
            left: 20,
            right: 20,
            bottom: 100,
            child: _buildModeSwitcher(state),
          ),
          Positioned(
            left: 20,
            bottom: 20,
            child: Semantics(
              button: true,
              label: 'Galeri',
              child: _circleIconButton(
                icon: Icons.photo_library,
                onTap: () => ref
                    .read(scannerControllerProvider)
                    .pickImageFromGallery(),
              ),
            ),
          ),
          Positioned(
            right: 20,
            bottom: 20,
            child: Semantics(
              button: true,
              label: 'Analiz et',
              child: _circleIconButton(
                icon: Icons.camera_alt,
                onTap: state.isAnalyzing ? null : () => _onAnalyzePressed(state),
              ),
            ),
          ),
          if (state.errorMessage != null)
            Positioned(
              top: 50,
              left: 16,
              right: 16,
              child: Material(
                color: AppColors.crimsonRed,
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(
                    state.errorMessage!,
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              ),
            ),
          if (state.isAnalyzing)
            const Center(child: CircularProgressIndicator()),
        ],
      ),
    );
  }

  Widget _buildBackground(ScannerController state) {
    if (state.selectedImageBytes != null) {
      return Image.memory(state.selectedImageBytes!, fit: BoxFit.cover);
    }
    final CameraController? camera = state.cameraController;
    if (camera == null || !camera.value.isInitialized) {
      return const ColoredBox(
        color: Colors.black,
        child: Center(
          child: Text(
            'Kamera hazirlaniyor...',
            style: TextStyle(color: Colors.white),
          ),
        ),
      );
    }
    return CameraPreview(camera);
  }

  Widget _buildModeSwitcher(ScannerController state) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.xs),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(9999),
      ),
      child: Row(
        children: [
          Expanded(
            child: _modeButton(
              title: 'Deal-Lens',
              icon: Icons.price_check,
              selected: state.mode == ScanMode.dealLens,
              onTap: () => ref.read(scannerControllerProvider).setMode(ScanMode.dealLens),
            ),
          ),
          Expanded(
            child: _modeButton(
              title: 'Pure-Scan',
              icon: Icons.eco,
              selected: state.mode == ScanMode.pureScan,
              onTap: () => ref.read(scannerControllerProvider).setMode(ScanMode.pureScan),
            ),
          ),
        ],
      ),
    );
  }

  Widget _modeButton({
    required String title,
    required IconData icon,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return SizedBox(
      height: 48,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(9999),
            gradient: selected
                ? const LinearGradient(
                    colors: [AppColors.crimsonRed, AppColors.fireOrange],
                  )
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: selected ? Colors.white : Colors.grey),
              const SizedBox(width: AppSpacing.sm),
              Text(
                title,
                style: TextStyle(
                  color: selected ? Colors.white : Colors.grey,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _circleIconButton({
    required IconData icon,
    required VoidCallback? onTap,
  }) {
    return SizedBox(
      width: 56,
      height: 56,
      child: Material(
        color: Colors.black.withOpacity(0.35),
        shape: const CircleBorder(),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onTap,
          child: Icon(icon, color: Colors.white),
        ),
      ),
    );
  }

  Future<void> _onAnalyzePressed(ScannerController state) async {
    if (state.selectedImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lutfen galeri veya kameradan goruntu secin.')),
      );
      return;
    }

    if (state.mode == ScanMode.dealLens) {
      final result = await ref.read(scannerControllerProvider).analyzePrice();
      if (result == null || !mounted) return;
      await showModalBottomSheet<void>(
        context: context,
        isScrollControlled: true,
        builder: (_) => DealLensResultSheet(
          unitPrice: result.price,
          unitLabel: result.unit,
          rawText: result.rawText,
        ),
      );
      return;
    }

    final result = await ref.read(scannerControllerProvider).analyzeIngredients();
    if (result == null || !mounted) return;
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (_) => PureScanResultSheet(
        items: result.items,
        worst: result.worst,
      ),
    );
  }
}
