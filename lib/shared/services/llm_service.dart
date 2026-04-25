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
      throw Exception('OPENAI_API_KEY is missing.');
    }

    final uri = Uri.parse('https://api.openai.com/v1/chat/completions');
    final payload = {
      'model': 'gpt-4o-mini',
      'temperature': 0.1,
      'response_format': {'type': 'json_object'},
      'messages': [
        {
          'role': 'system',
          'content':
              'Classify ingredient list into danger, warning, safe. Respond as JSON object with key items.',
        },
        {
          'role': 'user',
          'content': text,
        },
      ],
    };

    final response = await _client.post(
      uri,
      headers: {
        'Authorization': 'Bearer $apiKey',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(payload),
    );

    if (response.statusCode >= 400) {
      throw Exception('LLM request failed: ${response.body}');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    final content =
        data['choices'][0]['message']['content'] as String? ?? '{"items": []}';
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
