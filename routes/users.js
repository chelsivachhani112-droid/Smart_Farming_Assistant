const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const {
      role,
      search,
      isActive,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can view this profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      // Return limited public info for other users
      const publicInfo = {
        _id: user._id,
        name: user.name,
        role: user.role,
        location: user.location,
        profile: {
          avatar: user.profile?.avatar,
          bio: user.profile?.bio,
          specialization: user.profile?.specialization,
          experience: user.profile?.experience
        },
        createdAt: user.createdAt
      };
      return res.json(publicInfo);
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    const allowedUpdates = [
      'name', 'email', 'role', 'phone', 'location', 
      'profile', 'preferences', 'isActive', 'isVerified'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'location' || field === 'profile' || field === 'preferences') {
          user[field] = { ...user[field], ...req.body[field] };
        } else {
          user[field] = req.body[field];
        }
      }
    });

    const updatedUser = await user.save();
    
    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Soft delete - deactivate user instead of removing
    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // Role distribution
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Location distribution (top 10 states)
    const locationStats = await User.aggregate([
      { $match: { 'location.state': { $exists: true, $ne: '' } } },
      { $group: { _id: '$location.state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Monthly registration trend (last 12 months)
    const monthlyStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      verifiedUsers,
      recentRegistrations,
      roleStats,
      locationStats,
      monthlyStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
router.get('/search/query', protect, async (req, res) => {
  try {
    const { q, role, location, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const filter = {
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { 'profile.specialization': { $regex: q, $options: 'i' } }
      ]
    };

    if (role) {
      filter.role = role;
    }

    if (location) {
      filter['location.state'] = { $regex: location, $options: 'i' };
    }

    const users = await User.find(filter)
      .select('name role location.state location.district profile.avatar profile.specialization profile.experience')
      .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user activity summary
// @route   GET /api/users/:id/activity
// @access  Private
router.get('/:id/activity', protect, async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user can view this activity
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this activity' });
    }

    // Import models for activity calculation
    const Crop = require('../models/Crop');
    const Product = require('../models/Product');
    const ForumPost = require('../models/ForumPost');

    // Get activity counts
    const [cropCount, productCount, forumPostCount, forumReplyCount] = await Promise.all([
      Crop.countDocuments({ farmer: userId, isActive: true }),
      Product.countDocuments({ seller: userId, isActive: true }),
      ForumPost.countDocuments({ author: userId, isApproved: true }),
      ForumPost.aggregate([
        { $match: { 'replies.author': userId } },
        { $unwind: '$replies' },
        { $match: { 'replies.author': userId } },
        { $count: 'total' }
      ])
    ]);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = {
      crops: await Crop.countDocuments({ 
        farmer: userId, 
        createdAt: { $gte: thirtyDaysAgo },
        isActive: true 
      }),
      products: await Product.countDocuments({ 
        seller: userId, 
        createdAt: { $gte: thirtyDaysAgo },
        isActive: true 
      }),
      forumPosts: await ForumPost.countDocuments({ 
        author: userId, 
        createdAt: { $gte: thirtyDaysAgo },
        isApproved: true 
      })
    };

    res.json({
      totalActivity: {
        crops: cropCount,
        products: productCount,
        forumPosts: forumPostCount,
        forumReplies: forumReplyCount[0]?.total || 0
      },
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle user verification status (Admin only)
// @route   PUT /api/users/:id/verify
// @access  Private/Admin
router.put('/:id/verify', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({ 
      message: `User ${user.isVerified ? 'verified' : 'unverified'} successfully`,
      isVerified: user.isVerified
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle user active status (Admin only)
// @route   PUT /api/users/:id/toggle-active
// @access  Private/Admin
router.put('/:id/toggle-active', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
