import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'register_screen.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _rememberMe = false;
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 16),
    )..repeat();
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final response = await ApiService.login(
        _usernameController.text.trim(),
        _passwordController.text,
      );

      if (!mounted) return;

      if (response['token'] != null) {
        // Navigate to home screen with username and token
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => HomeScreen(
              username: _usernameController.text.trim(),
              token: response['token'],
            ),
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Login failed: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F17),
      body: Stack(
        children: [
          // Animated gradient orbs background
          Positioned.fill(
            child: AnimatedBuilder(
              animation: _animationController,
              builder: (context, child) {
                return CustomPaint(
                  painter: OrbsPainter(_animationController.value),
                );
              },
            ),
          ),

          // Main content
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 440),
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.white.withOpacity(0.08),
                        Colors.white.withOpacity(0.04),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.14),
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.45),
                        blurRadius: 50,
                        offset: const Offset(0, 20),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(28),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Header with gradient logo dot
                        Column(
                          children: [
                            Container(
                              width: 42,
                              height: 42,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
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
                            const SizedBox(height: 12),
                            const Text(
                              'Welcome back',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFFE7ECF3),
                                letterSpacing: 0.2,
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'Sign in to continue',
                              style: TextStyle(
                                fontSize: 15,
                                color: Color(0xFFA8B0BD),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // Username field
                        const Text(
                          'Username',
                          style: TextStyle(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFFE7ECF3),
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _usernameController,
                          style: const TextStyle(color: Color(0xFFE7ECF3)),
                          decoration: InputDecoration(
                            hintText: 'yourname',
                            hintStyle: TextStyle(
                              color: Colors.white.withOpacity(0.3),
                            ),
                            filled: true,
                            fillColor: const Color(
                              0xFF0A0D14,
                            ).withOpacity(0.55),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(
                                color: Colors.white.withOpacity(0.12),
                              ),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(
                                color: Colors.white.withOpacity(0.12),
                              ),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                color: Color(0xFF7AA7FF),
                              ),
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 12,
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your username';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 12),

                        // Password field
                        const Text(
                          'Password',
                          style: TextStyle(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFFE7ECF3),
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _passwordController,
                          obscureText: _obscurePassword,
                          style: const TextStyle(color: Color(0xFFE7ECF3)),
                          decoration: InputDecoration(
                            hintText: '••••••••',
                            hintStyle: TextStyle(
                              color: Colors.white.withOpacity(0.3),
                            ),
                            filled: true,
                            fillColor: const Color(
                              0xFF0A0D14,
                            ).withOpacity(0.55),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(
                                color: Colors.white.withOpacity(0.12),
                              ),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(
                                color: Colors.white.withOpacity(0.12),
                              ),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                color: Color(0xFF7AA7FF),
                              ),
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 12,
                            ),
                            suffixIcon: TextButton(
                              onPressed: () => setState(
                                () => _obscurePassword = !_obscurePassword,
                              ),
                              child: Text(
                                _obscurePassword ? 'Show' : 'Hide',
                                style: const TextStyle(
                                  color: Color(0xFFA8B0BD),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your password';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 12),

                        // Remember me and forgot password row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Flexible(
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Checkbox(
                                    value: _rememberMe,
                                    onChanged: (value) => setState(
                                      () => _rememberMe = value ?? false,
                                    ),
                                    activeColor: const Color(0xFF6B9CFF),
                                  ),
                                  const Text(
                                    'Remember me',
                                    style: TextStyle(
                                      color: Color(0xFFA8B0BD),
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Flexible(
                              child: TextButton(
                                onPressed: () {
                                  // TODO: Forgot password
                                },
                                child: const Text(
                                  'Forgot password?',
                                  style: TextStyle(
                                    color: Color(0xFF6B9CFF),
                                    fontWeight: FontWeight.w600,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),

                        // Sign in button
                        Container(
                          height: 48,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF6B9CFF), Color(0xFF9A6BFF)],
                            ),
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.35),
                                blurRadius: 24,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _handleLogin,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: _isLoading
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : const Text(
                                    'Sign in',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white,
                                      letterSpacing: 0.2,
                                    ),
                                  ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Footer
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Do not have an account? ',
                              style: TextStyle(
                                color: Color(0xFFA8B0BD),
                                fontSize: 15,
                              ),
                            ),
                            TextButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        const RegisterScreen(),
                                  ),
                                );
                              },
                              style: TextButton.styleFrom(
                                padding: EdgeInsets.zero,
                                minimumSize: const Size(0, 0),
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                              child: const Text(
                                'Create one',
                                style: TextStyle(
                                  color: Color(0xFF6B9CFF),
                                  fontWeight: FontWeight.w600,
                                  fontSize: 15,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Custom painter for animated gradient orbs
class OrbsPainter extends CustomPainter {
  final double animation;

  OrbsPainter(this.animation);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 80);

    // Orb 1 - Blue
    final orb1Offset = Offset(
      size.width * 0.1 + (size.width * 0.02 * animation),
      size.height * 0.1 - (size.height * 0.02 * animation),
    );
    paint.shader =
        RadialGradient(
          colors: [
            const Color(0xFF6B9CFF).withOpacity(0.55),
            Colors.transparent,
          ],
          stops: const [0.0, 0.6],
        ).createShader(
          Rect.fromCircle(center: orb1Offset, radius: size.width * 0.45),
        );
    canvas.drawCircle(orb1Offset, size.width * 0.45, paint);

    // Orb 2 - Purple
    final orb2Offset = Offset(
      size.width * 0.85 - (size.width * 0.02 * animation),
      size.height * 0.25 + (size.height * 0.02 * animation),
    );
    paint.shader =
        RadialGradient(
          colors: [
            const Color(0xFF9A6BFF).withOpacity(0.55),
            Colors.transparent,
          ],
          stops: const [0.0, 0.6],
        ).createShader(
          Rect.fromCircle(center: orb2Offset, radius: size.width * 0.45),
        );
    canvas.drawCircle(orb2Offset, size.width * 0.45, paint);

    // Orb 3 - Teal
    final orb3Offset = Offset(
      size.width * 0.3 + (size.width * 0.015 * animation),
      size.height * 0.85 + (size.height * 0.015 * animation),
    );
    paint.shader =
        RadialGradient(
          colors: [
            const Color(0xFF3DD3B0).withOpacity(0.55),
            Colors.transparent,
          ],
          stops: const [0.0, 0.6],
        ).createShader(
          Rect.fromCircle(center: orb3Offset, radius: size.width * 0.45),
        );
    canvas.drawCircle(orb3Offset, size.width * 0.45, paint);
  }

  @override
  bool shouldRepaint(OrbsPainter oldDelegate) =>
      animation != oldDelegate.animation;
}
