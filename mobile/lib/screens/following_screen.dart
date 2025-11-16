import 'package:flutter/material.dart';
import 'login_screen.dart';

class FollowingScreen extends StatefulWidget {
  final String username;
  final String token;

  const FollowingScreen({
    super.key,
    required this.username,
    required this.token,
  });

  @override
  State<FollowingScreen> createState() => _FollowingScreenState();
}

class _FollowingScreenState extends State<FollowingScreen> {
  bool _loggingOut = false;

  Future<void> _handleLogout() async {
    setState(() => _loggingOut = true);

    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F17),
      body: Column(
        children: [
          // TOP NAVBAR
          _buildTopNavbar(),

          // MAIN CONTENT
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // Navigation Card
                    _buildNavigationCard(),

                    const SizedBox(height: 16),

                    // Following Feed Info Card
                    _buildFollowingInfoCard(),

                    const SizedBox(height: 16),

                    // Following Posts Feed
                    _buildFollowingPostsCard(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopNavbar() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF141B28).withOpacity(0.6),
        border: Border(
          bottom: BorderSide(
            color: Colors.white.withOpacity(0.1),
            width: 1,
          ),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              // Logo and App Name
              Container(
                width: 40,
                height: 40,
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
                ),
              ),
              const SizedBox(width: 12),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'FakeTwitwer',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFE7ECF3),
                      letterSpacing: 0.5,
                    ),
                  ),
                  Text(
                    'Where the ducks come to post.',
                    style: TextStyle(
                      fontSize: 10,
                      color: Color(0xFFA8B0BD),
                    ),
                  ),
                ],
              ),

              const Spacer(),

              // User Info and Logout
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    widget.username,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFFE7ECF3),
                    ),
                  ),
                  Text(
                    '@${widget.username}',
                    style: const TextStyle(
                      fontSize: 10,
                      color: Color(0xFFA8B0BD),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 12),

              // Logout Button
              TextButton(
                onPressed: _loggingOut ? null : _handleLogout,
                style: TextButton.styleFrom(
                  backgroundColor: const Color(0xFF141B28).withOpacity(0.6),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  _loggingOut ? 'Logging out...' : 'Log out',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFFA8B0BD),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavigationCard() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.white.withOpacity(0.08),
            Colors.white.withOpacity(0.04),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.6),
            blurRadius: 35,
            offset: const Offset(0, 18),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Navigation',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Color(0xFFE7ECF3),
            ),
          ),
          const SizedBox(height: 12),
          _buildNavLink('Home'),
          const SizedBox(height: 8),
          _buildNavLink('Explore'),
          const SizedBox(height: 8),
          _buildNavLink('Following', isActive: true),
          const SizedBox(height: 8),
          _buildNavLink('Profile'),
        ],
      ),
    );
  }

  Widget _buildNavLink(String label, {bool isActive = false}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 14,
          fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
          color: isActive ? const Color(0xFFE7ECF3) : const Color(0xFFA8B0BD),
        ),
      ),
    );
  }

  Widget _buildFollowingInfoCard() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.white.withOpacity(0.08),
            Colors.white.withOpacity(0.04),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.6),
            blurRadius: 35,
            offset: const Offset(0, 18),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Following feed',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Color(0xFFE7ECF3),
            ),
          ),
          SizedBox(height: 8),
          Text(
            'This page shows posts only from accounts you follow.',
            style: TextStyle(
              fontSize: 12,
              color: Color(0xFFA8B0BD),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFollowingPostsCard() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.white.withOpacity(0.08),
            Colors.white.withOpacity(0.04),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.6),
            blurRadius: 35,
            offset: const Offset(0, 18),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Posts from people you follow',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFFE7ECF3),
            ),
          ),
          const SizedBox(height: 16),

          // Sample post 1
          _buildPostPlaceholder(
            username: 'user1',
            title: 'Amazing day!',
            description: 'Just had a great experience working on this project',
            date: '1 hour ago',
          ),

          const Divider(
            color: Color(0xFF2A3444),
            height: 32,
          ),

          // Sample post 2
          _buildPostPlaceholder(
            username: 'user2',
            title: 'New feature released',
            description: 'Check out our latest update!',
            date: '3 hours ago',
          ),

          const Divider(
            color: Color(0xFF2A3444),
            height: 32,
          ),

          // Sample post 3
          _buildPostPlaceholder(
            username: 'user3',
            title: 'Weekend plans',
            description: 'Looking forward to the weekend',
            date: '5 hours ago',
          ),

          const SizedBox(height: 16),

          const Center(
            child: Text(
              'No posts yet from people you follow. Once they start posting, their posts will show up here.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFFA8B0BD),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPostPlaceholder({
    required String username,
    required String title,
    required String description,
    required String date,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            // Avatar
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF6B9CFF),
                    Color(0xFF9A6BFF),
                  ],
                ),
              ),
              child: Center(
                child: Text(
                  username[0].toUpperCase(),
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    username,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFFE7ECF3),
                    ),
                  ),
                  Text(
                    '@$username',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFFA8B0BD),
                    ),
                  ),
                ],
              ),
            ),
            Text(
              date,
              style: const TextStyle(
                fontSize: 11,
                color: Color(0xFFA8B0BD),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFFE7ECF3),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          description,
          style: const TextStyle(
            fontSize: 14,
            color: Color(0xFFA8B0BD),
          ),
        ),
      ],
    );
  }
}
