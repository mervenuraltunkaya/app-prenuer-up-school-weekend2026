import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import 'package:image_picker/image_picker.dart';

class OcrService {
  final TextRecognizer _recognizer = TextRecognizer();

  Future<String> readText(XFile imageFile) async {
    final inputImage = InputImage.fromFilePath(imageFile.path);
    final recognized = await _recognizer.processImage(inputImage);
    return _normalize(recognized.text);
  }

  String _normalize(String rawText) {
    return rawText
        .replaceAll(',', '.')
        .replaceAll('GR', 'g')
        .replaceAll('Kg', 'kg')
        .replaceAll('LT', 'L')
        .trim();
  }

  void dispose() {
    _recognizer.close();
  }
}
