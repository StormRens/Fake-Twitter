import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // iOS Simulator uses localhost, Android emulator uses 10.0.2.2
  // Backend runs on port 5000
  static const String baseUrl = 'http://localhost:5000';

  static Future<Map<String, dynamic>> login(String username, String password) async {
    final url = Uri.parse('$baseUrl/auth/login/mobile');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Login failed');
    }
  }

  static Future<Map<String, dynamic>> register(
    String email,
    String username,
    String password,
  ) async {
    final url = Uri.parse('$baseUrl/auth/register/mobile');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Registration failed');
    }
  }
}
