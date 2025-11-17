import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'login_screen.dart';
import 'following_screen.dart';
import 'profile_screen.dart';

const API_BASE_URL = 'http://192.168.1.230:5001';

class HomeScreen extends StatefulWidget {
  final String username;
  final String token;

  const HomeScreen({
    super.key,
    required this.username,
    required this.token,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _loggingOut = false;
  List<Post> _posts = [];
  bool _loadingPosts = false;
  String? _loadError;

  // Post composer state
  final TextEditingController _postController = TextEditingController();
  bool _creatingPost = false;
  String? _createError;

  @override
  void initState() {
    super.initState();
    _loadAllPosts();
  }

  @override
  void dispose() {
    _postController.dispose();
    super.dispose();
  }

  Future<void> _loadAllPosts() async {
    setState(() {
      _loadingPosts = true;
      _loadError = null;
    });

    try {
      // Fetch all posts
      final postsResponse = await http.get(
        Uri.parse('$API_BASE_URL/post/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}',
        },
      );

      // Fetch all users to map userId to username
      final usersResponse = await http.get(
        Uri.parse('$API_BASE_URL/user/all'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}',
        },
      );

      if (postsResponse.statusCode == 200 && usersResponse.statusCode == 200) {
        final postsData = jsonDecode(postsResponse.body);
        final usersData = jsonDecode(usersResponse.body);

        final rawPosts = (postsData['posts'] as List?) ?? [];
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
        throw Exception('Failed to load posts');
      }
    } catch (e) {
      setState(() {
        _loadError = 'Failed to load posts: ${e.toString()}';
        _loadingPosts = false;
      });
    }
  }

  Future<void> _createPost() async {
    final text = _postController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _creatingPost = true;
      _createError = null;
    });

    try {
      final response = await http.post(
        Uri.parse('$API_BASE_URL/post/create'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}',
        },
        body: jsonEncode({
          'title': text,
          'description': '',
        }),
      );

      if (response.statusCode == 201) {
        _postController.clear();
        await _loadAllPosts(); // Reload posts
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['error'] ?? 'Failed to create post');
      }
    } catch (e) {
      setState(() {
        _createError = e.toString();
      });
    } finally {
      setState(() {
        _creatingPost = false;
      });
    }
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
          _buildTopNavbar(),
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    _buildNavigationCard(),
                    const SizedBox(height: 16),
                    _buildPostComposer(),
                    const SizedBox(height: 16),
                    _buildPostFeed(),
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
          _buildNavLink('Home', isActive: true, onTap: () {}),
          const SizedBox(height: 8),
          _buildNavLink('Following', onTap: _navigateToFollowing),
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

  Widget _buildPostComposer() {
    final maxChars = 300;
    final charsLeft = maxChars - _postController.text.length;

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
            'What\'s happening?',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Color(0xFFE7ECF3),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _postController,
            maxLines: 3,
            maxLength: maxChars,
            onChanged: (_) => setState(() {}),
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFFE7ECF3),
            ),
            decoration: InputDecoration(
              hintText: 'Share your thoughts with the pond...',
              hintStyle: const TextStyle(
                fontSize: 14,
                color: Color(0xFFA8B0BD),
              ),
              filled: true,
              fillColor: const Color(0xFF0B0F17).withOpacity(0.7),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide(
                  color: Colors.white.withOpacity(0.1),
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide(
                  color: Colors.white.withOpacity(0.1),
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(
                  color: Color(0xFF7aa7ff),
                  width: 2,
                ),
              ),
              counterText: '',
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$charsLeft characters left',
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFFA8B0BD),
                ),
              ),
              ElevatedButton(
                onPressed: (_creatingPost || _postController.text.trim().isEmpty)
                    ? null
                    : _createPost,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  disabledBackgroundColor: Colors.grey.withOpacity(0.3),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ).copyWith(
                  backgroundColor: MaterialStateProperty.resolveWith((states) {
                    if (states.contains(MaterialState.disabled)) {
                      return Colors.grey.withOpacity(0.3);
                    }
                    return null;
                  }),
                ),
                child: Ink(
                  decoration: BoxDecoration(
                    gradient: (_creatingPost || _postController.text.trim().isEmpty)
                        ? null
                        : const LinearGradient(
                            colors: [Color(0xFF4f8cff), Color(0xFF8b5dff)],
                          ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Text(
                      _creatingPost ? 'Posting...' : 'Post',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
          if (_createError != null)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(
                _createError!,
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.red,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildPostFeed() {
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
            'Post Feed',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFFE7ECF3),
            ),
          ),
          const SizedBox(height: 16),

          if (_loadError != null)
            Text(
              _loadError!,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.red,
              ),
            ),

          if (_loadingPosts && _posts.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(20.0),
                child: CircularProgressIndicator(
                  color: Color(0xFF6B9CFF),
                ),
              ),
            ),

          if (!_loadingPosts && _posts.isEmpty && _loadError == null)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(20.0),
                child: Text(
                  'No posts yet. Be the first to post something!',
                  style: TextStyle(
                    fontSize: 14,
                    color: Color(0xFFA8B0BD),
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),

          // Posts list
          ...List.generate(_posts.length, (index) {
            final post = _posts[index];
            return Column(
              children: [
                if (index > 0)
                  const Divider(
                    color: Color(0xFF2A3444),
                    height: 32,
                  ),
                _buildPostCard(post),
              ],
            );
          }),

          if (_posts.isNotEmpty) ...[
            const SizedBox(height: 16),
            const Center(
              child: Text(
                'You\'re all caught up.',
                style: TextStyle(
                  fontSize: 12,
                  color: Color(0xFFA8B0BD),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildPostCard(Post post) {
    final timeAgo = _formatTimeAgo(post.date);

    return InkWell(
      onTap: () => _navigateToProfile(profileUsername: post.authorUsername),
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
                    post.authorUsername[0].toUpperCase(),
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
                      post.authorUsername,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFFE7ECF3),
                      ),
                    ),
                    Text(
                      '@${post.authorUsername}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFFA8B0BD),
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                timeAgo,
                style: const TextStyle(
                  fontSize: 11,
                  color: Color(0xFFA8B0BD),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            post.title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFFE7ECF3),
            ),
          ),
          if (post.description.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              post.description,
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

  String _formatTimeAgo(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      final now = DateTime.now();
      final diff = now.difference(date);

      if (diff.inSeconds < 60) return 'Just now';
      if (diff.inMinutes < 60) return '${diff.inMinutes}m';
      if (diff.inHours < 24) return '${diff.inHours}h';
      if (diff.inDays == 1) return '1d';
      return '${diff.inDays}d';
    } catch (e) {
      return '';
    }
  }
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
