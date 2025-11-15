import 'package:flutter/material.dart';
import 'login_screen.dart';

class HomeScreen extends StatelessWidget {
  final String username;
  final String token;

  const HomeScreen({
    super.key,
    required this.username,
    required this.token,
  });

  void _handleLogout(BuildContext context) {
    // Navigate back to login screen
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F17),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B0F17),
        elevation: 0,
        title: const Text(
          'FakeTwitwer',
          style: TextStyle(
            color: Color(0xFFE7ECF3),
            fontWeight: FontWeight.w700,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => _handleLogout(context),
            child: const Text(
              'Log out',
              style: TextStyle(
                color: Color(0xFF6B9CFF),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Gradient logo
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  gradient: const SweepGradient(
                    center: Alignment.center,
                    colors: [
                      Color(0xFF6B9CFF),
                      Color(0xFF9A6BFF),
                      Color(0xFF3DD3B0),
                      Color(0xFF6B9CFF),
                    ],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Welcome message
              const Text(
                'Welcome to',
                style: TextStyle(
                  fontSize: 20,
                  color: Color(0xFFA8B0BD),
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Fake Twitter',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFFE7ECF3),
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 16),

              // Username display
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.white.withOpacity(0.08),
                      Colors.white.withOpacity(0.04),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.14),
                    width: 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.person,
                      color: Color(0xFF6B9CFF),
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '@$username',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFFE7ECF3),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Status message
              Text(
                'You are successfully logged in!',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.green.shade300,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'More features coming soon...',
                style: TextStyle(
                  fontSize: 13,
                  color: Color(0xFFA8B0BD),
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
