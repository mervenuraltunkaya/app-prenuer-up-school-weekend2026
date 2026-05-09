import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:smart_scan/shared/models/scan_models.dart';

class LlmService {
  LlmService({
    required this.apiKey,
    http.Client? client,
  }) : _client = client ?? http.Client();

  final String apiKey;
  final http.Client _client;

  Future<List<IngredientAnalysis>> analyzeIngredients(String text) async {
    if (apiKey.isEmpty) {
      throw Exception('GEMINI_API_KEY is missing.');
    }

    final uri = Uri.parse(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey',
    );
    final instruction = '''
Analyze the ingredient list and classify each ingredient into one of:
- danger
- warning
- safe

Return ONLY valid JSON with this exact shape:
{
  "items": [
    {
      "name": "Ingredient name",
      "reason": "Short reason in Turkish",
      "status": "danger|warning|safe"
    }
  ]
}
''';
    final payload = {
      'systemInstruction': {
        'parts': [
          {'text': instruction},
        ],
      },
      'contents': [
        {
          'parts': [
            {'text': text},
          ],
        },
      ],
      'generationConfig': {
        'temperature': 0.1,
        'responseMimeType': 'application/json',
      },
    };

    final response = await _client.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(payload),
    );

    if (response.statusCode >= 400) {
      throw Exception('LLM request failed: ${response.body}');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    final candidates = data['candidates'] as List<dynamic>? ?? <dynamic>[];
    if (candidates.isEmpty) {
      return <IngredientAnalysis>[];
    }
    final firstCandidate = candidates.first as Map<String, dynamic>;
    final contentMap =
        firstCandidate['content'] as Map<String, dynamic>? ??
        <String, dynamic>{};
    final parts = contentMap['parts'] as List<dynamic>? ?? <dynamic>[];
    final firstPart = parts.isNotEmpty ? parts.first as Map<String, dynamic> : null;
    final content = firstPart?['text'] as String? ?? '{"items": []}';
    final parsed = jsonDecode(content) as Map<String, dynamic>;
    final items = (parsed['items'] as List<dynamic>? ?? <dynamic>[]);

    return items.map((dynamic item) {
      final map = item as Map<String, dynamic>;
      final rawStatus = (map['status'] as String? ?? 'warning').toLowerCase();
      final status = switch (rawStatus) {
        'safe' => IngredientStatus.safe,
        'danger' => IngredientStatus.danger,
        _ => IngredientStatus.warning,
      };
      return IngredientAnalysis(
        name: map['name'] as String? ?? 'Unknown',
        reason: map['reason'] as String? ?? 'No description',
        status: status,
      );
    }).toList();
  }
}
