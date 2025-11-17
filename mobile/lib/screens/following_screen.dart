import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'login_screen.dart';
import 'home_screen.dart';
import 'profile_screen.dart';

const API_BASE_URL = 'http://192.168.1.230:5001';

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

class Post {
  final String id;
  final String userId;
  final String title;
  final String description;
  final String date;
  final String authorUsername;

  Post({
    required this.id,
    required this.userId,
    required this.title,
    required this.description,
    required this.date,
    required this.authorUsername,
  });
}

class _FollowingScreenState extends State<FollowingScreen> {
  bool _loggingOut = false;
  List<Post> _posts = [];
  bool _loadingPosts = false;
  String? _loadError;
  String? _userId;

  @override
  void initState() {
    super.initState();
    _loadFollowingFeed();
  }

  Future<void> _loadFollowingFeed() async {
    setState(() {
      _loadingPosts = true;
      _loadError = null;
    });

    try {
      // Get current user's ID first
      final userResponse = await http.get(
        Uri.parse('$API_BASE_URL/user/${widget.username}/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}',
        },
      );

      if (userResponse.statusCode == 200) {
        final userData = jsonDecode(userResponse.body);
        _userId = userData['user']['_id'];

        // Fetch following posts
        final response = await http.get(
          Uri.parse('$API_BASE_URL/post/$_userId/following'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${widget.token}',
          },
        );

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          final rawPosts = (data['posts'] as List?) ?? [];

          // Fetch all users to map userId to username
          final usersResponse = await http.get(
            Uri.parse('$API_BASE_URL/user/all'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ${widget.token}',
            },
          );

          final usersData = jsonDecode(usersResponse.body);
          final rawUsers = (usersData['users'] as List?) ?? [];

          // Create user map
          final userMap = <String, String>{};
          for (final user in rawUsers) {
            userMap[user['_id']] = user['username'];
          }

          // Map posts with usernames
          final posts = rawPosts.map((p) {
            return Post(
              id: p['_id'],
              userId: p['userId'],
              title: p['title'],
              description: p['description'] ?? '',
              date: p['date'],
              authorUsername: userMap[p['userId']] ?? 'Unknown',
            );
          }).toList();

          setState(() {
            _posts = posts;
            _loadingPosts = false;
          });
        } else {
          throw Exception('Failed to load following feed');
        }
      }
    } catch (e) {
      setState(() {
        _loadError = 'Failed to load posts: ${e.toString()}';
        _loadingPosts = false;
      });
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

  void _navigateToProfile({String? profileUsername}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ProfileScreen(
          username: widget.username,
          token: widget.token,
          profileUsername: profileUsername,
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
          _buildNavLink('Home', onTap: _navigateToHome),
          const SizedBox(height: 8),
          _buildNavLink('Following', isActive: true),
          const SizedBox(height: 8),
          _buildNavLink('Profile', onTap: () => _navigateToProfile()),
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

    if (_loadError != null) {
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
        padding: const EdgeInsets.all(20),
        child: Center(
          child: Text(
            _loadError!,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFFFF6B6B),
            ),
            textAlign: TextAlign.center,
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
          const Text(
            'Posts from people you follow',
            style: TextStyle(
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
                  'No posts yet from people you follow. Once they start posting, their posts will show up here.',
                  textAlign: TextAlign.center,
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
                    username: post.authorUsername,
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
    required String username,
    required String title,
    required String description,
    required String date,
  }) {
    return InkWell(
      onTap: () => _navigateToProfile(profileUsername: username),
      child: Column(
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
          if (description.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              description,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFFA8B0BD),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
