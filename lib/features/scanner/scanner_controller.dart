import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:smart_scan/features/deal_lens/price_parser.dart';
import 'package:smart_scan/features/deal_lens/unit_price_calculator.dart';
import 'package:smart_scan/features/pure_scan/ingredient_analyzer.dart';
import 'package:smart_scan/shared/models/scan_models.dart';
import 'package:smart_scan/shared/services/image_picker_service.dart';
import 'package:smart_scan/shared/services/llm_service.dart';
import 'package:smart_scan/shared/services/ocr_service.dart';

final scannerControllerProvider =
    ChangeNotifierProvider<ScannerController>((ref) => ScannerController());

class ScannerController extends ChangeNotifier {
  final ImagePickerService _imagePickerService = ImagePickerService();
  final OcrService _ocrService = OcrService();
  final PriceParser _priceParser = PriceParser();
  final UnitPriceCalculator _calculator = UnitPriceCalculator();
  final IngredientAnalyzer _ingredientAnalyzer = IngredientAnalyzer();
  final LlmService _llmService = LlmService(
    apiKey: const String.fromEnvironment('OPENAI_API_KEY'),
  );

  CameraController? cameraController;
  bool isInitializing = false;
  bool isAnalyzing = false;
  String? errorMessage;
  XFile? selectedImage;
  Uint8List? selectedImageBytes;
  ScanMode mode = ScanMode.dealLens;

  Future<void> initializeCamera() async {
    if (isInitializing) return;
    isInitializing = true;
    errorMessage = null;
    notifyListeners();

    try {
      final cameras = await availableCameras();
      if (cameras.isEmpty) {
        throw Exception('No camera found.');
      }
      cameraController = CameraController(
        cameras.first,
        ResolutionPreset.medium,
        enableAudio: false,
      );
      await cameraController!.initialize();
    } catch (e) {
      errorMessage = 'Kamera baslatilamadi: $e';
    } finally {
      isInitializing = false;
      notifyListeners();
    }
  }

  Future<void> pickImageFromGallery() async {
    selectedImage = await _imagePickerService.pickFromGallery();
    selectedImageBytes = await selectedImage?.readAsBytes();
    notifyListeners();
  }

  void setMode(ScanMode newMode) {
    mode = newMode;
    notifyListeners();
  }

  Future<({double price, String unit, String rawText})?> analyzePrice() async {
    if (kIsWeb) {
      errorMessage = 'Web ortaminda OCR analizi su an desteklenmiyor.';
      notifyListeners();
      return null;
    }

    final image = selectedImage;
    if (image == null) return null;

    isAnalyzing = true;
    errorMessage = null;
    notifyListeners();
    try {
      final text = await _ocrService.readText(image);
      final parsed = _priceParser.parse(text);
      if (parsed == null) {
        errorMessage = 'Fiyat/gramaj okunamadi.';
        return null;
      }
      final unitPrice = _calculator.calculatePerBaseUnit(parsed);
      if (unitPrice == null) {
        errorMessage = 'Birim fiyat hesaplanamadi.';
        return null;
      }
      return (price: unitPrice, unit: _calculator.baseUnit(parsed), rawText: text);
    } catch (e) {
      errorMessage = 'Analiz basarisiz: $e';
      return null;
    } finally {
      isAnalyzing = false;
      notifyListeners();
    }
  }

  Future<({List<IngredientAnalysis> items, IngredientStatus worst})?> analyzeIngredients() async {
    if (kIsWeb) {
      errorMessage = 'Web ortaminda OCR/AI analizi su an desteklenmiyor.';
      notifyListeners();
      return null;
    }

    final image = selectedImage;
    if (image == null) return null;

    isAnalyzing = true;
    errorMessage = null;
    notifyListeners();
    try {
      final text = await _ocrService.readText(image);
      final items = await _llmService.analyzeIngredients(text);
      final sorted = _ingredientAnalyzer.prioritize(items);
      final worst = _ingredientAnalyzer.worstStatus(sorted);
      return (items: sorted, worst: worst);
    } catch (e) {
      errorMessage = 'Icerik analizi basarisiz: $e';
      return null;
    } finally {
      isAnalyzing = false;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    cameraController?.dispose();
    _ocrService.dispose();
    super.dispose();
  }
}
