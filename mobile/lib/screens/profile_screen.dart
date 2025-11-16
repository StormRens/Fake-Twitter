import 'package:flutter/material.dart';
import 'login_screen.dart';

class ProfileScreen extends StatefulWidget {
  final String username;
  final String token;
  final String? profileUsername; // whose profile to view (null = own profile)

  const ProfileScreen({
    super.key,
    required this.username,
    required this.token,
    this.profileUsername,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _loggingOut = false;
  int _followersCount = 0;
  int _followingCount = 0;
  bool _isFollowing = false;

  String get _displayUsername => widget.profileUsername ?? widget.username;
  bool get _isOwnProfile => widget.profileUsername == null ||
                            widget.profileUsername == widget.username;

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

                    // Profile Stats Card
                    _buildProfileStatsCard(),

                    const SizedBox(height: 16),

                    // User Posts
                    _buildUserPostsCard(),
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
          _buildNavLink('Following'),
          const SizedBox(height: 8),
          _buildNavLink('Profile', isActive: true),
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

  Widget _buildProfileStatsCard() {
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
        children: [
          // Profile Avatar
          Container(
            width: 80,
            height: 80,
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
                _displayUsername[0].toUpperCase(),
                style: const TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Username
          Text(
            _displayUsername,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: Color(0xFFE7ECF3),
            ),
          ),
          Text(
            '@$_displayUsername',
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFFA8B0BD),
            ),
          ),

          const SizedBox(height: 20),

          // Stats Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildStatColumn('Posts', '12'),
              Container(
                width: 1,
                height: 40,
                color: Colors.white.withOpacity(0.1),
              ),
              _buildStatColumn('Followers', _followersCount.toString()),
              Container(
                width: 1,
                height: 40,
                color: Colors.white.withOpacity(0.1),
              ),
              _buildStatColumn('Following', _followingCount.toString()),
            ],
          ),

          // Follow button (only if viewing someone else's profile)
          if (!_isOwnProfile) ...[
            const SizedBox(height: 20),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                gradient: _isFollowing
                    ? null
                    : const LinearGradient(
                        colors: [
                          Color(0xFF4f8cff),
                          Color(0xFF8b5dff),
                        ],
                      ),
                color: _isFollowing ? const Color(0xFF2A3444) : null,
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () {
                    setState(() {
                      _isFollowing = !_isFollowing;
                      if (_isFollowing) {
                        _followersCount++;
                      } else {
                        _followersCount--;
                      }
                    });
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 32,
                      vertical: 12,
                    ),
                    child: Text(
                      _isFollowing ? 'Unfollow' : 'Follow',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStatColumn(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Color(0xFFE7ECF3),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Color(0xFFA8B0BD),
          ),
        ),
      ],
    );
  }

  Widget _buildUserPostsCard() {
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
          Text(
            _isOwnProfile ? 'Your Posts' : '$_displayUsername\'s Posts',
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFFE7ECF3),
            ),
          ),
          const SizedBox(height: 16),

          // Sample post 1
          _buildPostPlaceholder(
            title: 'First post!',
            description: 'This is my first post on FakeTwitwer',
            date: '2 hours ago',
          ),

          const Divider(
            color: Color(0xFF2A3444),
            height: 32,
          ),

          // Sample post 2
          _buildPostPlaceholder(
            title: 'Another great day',
            description: 'Working on some exciting features',
            date: '1 day ago',
          ),

          const Divider(
            color: Color(0xFF2A3444),
            height: 32,
          ),

          // Sample post 3
          _buildPostPlaceholder(
            title: 'Weekend vibes',
            description: 'Enjoying the weekend!',
            date: '3 days ago',
          ),

          const SizedBox(height: 16),

          const Center(
            child: Text(
              'No more posts to show.',
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
    required String title,
    required String description,
    required String date,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFFE7ECF3),
                ),
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
        const SizedBox(height: 8),
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
