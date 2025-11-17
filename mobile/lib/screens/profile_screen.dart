import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'login_screen.dart';
import 'home_screen.dart';
import 'following_screen.dart';

const API_BASE_URL = 'http://192.168.1.230:5001';

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

class Post {
  final String id;
  final String userId;
  final String title;
  final String description;
  final String date;

  Post({
    required this.id,
    required this.userId,
    required this.title,
    required this.description,
    required this.date,
  });
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _loggingOut = false;
  int _followersCount = 0;
  int _followingCount = 0;
  int _postsCount = 0;
  bool _isFollowing = false;
  bool _loadingProfile = false;
  bool _loadingPosts = false;
  String? _loadError;
  List<Post> _posts = [];

  String get _displayUsername => widget.profileUsername ?? widget.username;
  bool get _isOwnProfile => widget.profileUsername == null ||
                            widget.profileUsername == widget.username;

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  Future<void> _loadProfileData() async {
    setState(() {
      _loadingProfile = true;
      _loadingPosts = true;
      _loadError = null;
    });

    try {
      final response = await http.get(
        Uri.parse('$API_BASE_URL/user/$_displayUsername/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        // Backend returns: { username, followersCount, followingCount, posts, isFollowing }
        final rawPosts = (data['posts'] as List?) ?? [];

        final posts = rawPosts.map((p) {
          return Post(
            id: p['_id'] ?? '',
            userId: p['userId'] ?? '',
            title: p['title'] ?? '',
            description: p['description'] ?? '',
            date: p['date'] ?? DateTime.now().toIso8601String(),
          );
        }).toList();

        setState(() {
          _followersCount = data['followersCount'] ?? 0;
          _followingCount = data['followingCount'] ?? 0;
          _isFollowing = data['isFollowing'] ?? false;
          _posts = posts;
          _postsCount = posts.length;
          _loadingProfile = false;
          _loadingPosts = false;
        });
      } else {
        throw Exception('Failed to load profile');
      }
    } catch (e) {
      setState(() {
        _loadError = 'Failed to load profile: ${e.toString()}';
        _loadingProfile = false;
        _loadingPosts = false;
      });
    }
  }

  Future<void> _toggleFollow() async {
    try {
      final endpoint = _isFollowing ? 'unfollow' : 'follow';
      final response = await http.post(
        Uri.parse('$API_BASE_URL/user/$_displayUsername/$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}',
        },
      );

      if (response.statusCode == 200) {
        setState(() {
          _isFollowing = !_isFollowing;
          if (_isFollowing) {
            _followersCount++;
          } else {
            _followersCount--;
          }
        });
      }
    } catch (e) {
      // Handle error silently or show snackbar
    }
  }

  String _formatTimeAgo(String dateStr) {
    final date = DateTime.parse(dateStr);
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inSeconds < 60) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m';
    if (diff.inHours < 24) return '${diff.inHours}h';
    if (diff.inDays == 1) return '1d';
    if (diff.inDays < 7) return '${diff.inDays}d';
    if (diff.inDays < 30) return '${(diff.inDays / 7).floor()}w';
    if (diff.inDays < 365) return '${(diff.inDays / 30).floor()}mo';
    return '${(diff.inDays / 365).floor()}y';
  }

  Future<void> _handleLogout() async {
    setState(() => _loggingOut = true);

    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  void _navigateToHome() {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (context) => HomeScreen(
          username: widget.username,
          token: widget.token,
        ),
      ),
      (route) => false,
    );
  }

  void _navigateToFollowing() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FollowingScreen(
          username: widget.username,
          token: widget.token,
        ),
      ),
    );
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
              SvgPicture.asset(
                'assets/DuckIcon.svg',
                width: 40,
                height: 40,
              ),
              const SizedBox(width: 12),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Ducky',
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
          _buildNavLink('Home', onTap: _navigateToHome),
          const SizedBox(height: 8),
          _buildNavLink('Following', onTap: _navigateToFollowing),
          const SizedBox(height: 8),
          _buildNavLink('Profile', isActive: true),
        ],
      ),
    );
  }

  Widget _buildNavLink(String label, {bool isActive = false, VoidCallback? onTap}) {
    return InkWell(
      onTap: onTap,
      child: Container(
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
      ),
    );
  }

  Widget _buildProfileStatsCard() {
    if (_loadingProfile) {
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
        ),
        padding: const EdgeInsets.all(40),
        child: const Center(
          child: CircularProgressIndicator(
            color: Color(0xFF6B9CFF),
          ),
        ),
      );
    }

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
              _buildStatColumn('Posts', _postsCount.toString()),
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
                  onTap: _toggleFollow,
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
    if (_loadingPosts) {
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
        ),
        padding: const EdgeInsets.all(40),
        child: const Center(
          child: CircularProgressIndicator(
            color: Color(0xFF6B9CFF),
          ),
        ),
      );
    }

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

          if (_posts.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(20.0),
                child: Text(
                  'No posts yet.',
                  style: TextStyle(
                    fontSize: 12,
                    color: Color(0xFFA8B0BD),
                  ),
                ),
              ),
            )
          else
            ...List.generate(_posts.length, (index) {
              final post = _posts[index];
              return Column(
                children: [
                  if (index > 0)
                    const Divider(
                      color: Color(0xFF2A3444),
                      height: 32,
                    ),
                  _buildPostPlaceholder(
                    title: post.title,
                    description: post.description,
                    date: _formatTimeAgo(post.date),
                  ),
                ],
              );
            }),
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
        if (description.isNotEmpty) ...[
          const SizedBox(height: 8),
          Text(
            description,
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFFA8B0BD),
            ),
          ),
        ],
      ],
    );
  }
}
