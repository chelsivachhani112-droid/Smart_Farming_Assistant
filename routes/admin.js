const express = require('express');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Product = require('../models/Product');
const ForumPost = require('../models/ForumPost');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    // Get current date and calculate periods
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const newUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Crop statistics
    const totalCrops = await Crop.countDocuments({ isActive: true });
    const healthyCrops = await Crop.countDocuments({ 
      isActive: true, 
      'healthStatus.status': 'healthy' 
    });
    const cropsWithIssues = await Crop.countDocuments({ 
      isActive: true, 
      'healthStatus.status': { $in: ['warning', 'critical'] }
    });

    // Product statistics
    const totalProducts = await Product.countDocuments({ isActive: true });
    const approvedProducts = await Product.countDocuments({ 
      isActive: true, 
      isApproved: true 
    });
    const pendingProducts = await Product.countDocuments({ 
      isActive: true, 
      isApproved: false 
    });

    // Forum statistics
    const totalPosts = await ForumPost.countDocuments({ isApproved: true });
    const resolvedPosts = await ForumPost.countDocuments({ 
      isApproved: true, 
      isResolved: true 
    });
    const pendingPosts = await ForumPost.countDocuments({ isApproved: false });

    // Calculate growth rates
    const userGrowthRate = newUsersLastMonth > 0 
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1)
      : 0;

    // Role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent activity
    const recentUsers = await User.find({ isActive: true })
      .select('name email role createdAt location.state')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProducts = await Product.find({ isActive: true })
      .populate('seller', 'name')
      .select('name category price.amount seller createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPosts = await ForumPost.find({ isApproved: true })
      .populate('author', 'name role')
      .select('title category author createdAt views replies')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyUserTrend = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
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

    const monthlyProductTrend = await Product.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
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

    // Top performing content
    const topProducts = await Product.find({ isActive: true, isApproved: true })
      .populate('seller', 'name')
      .select('name category views sales ratings seller')
      .sort({ views: -1 })
      .limit(5);

    const topForumPosts = await ForumPost.find({ isApproved: true })
      .populate('author', 'name')
      .select('title category views votes.score replies author')
      .sort({ views: -1 })
      .limit(5);

    res.json({
      overview: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: newUsersThisMonth,
          growthRate: userGrowthRate
        },
        crops: {
          total: totalCrops,
          healthy: healthyCrops,
          withIssues: cropsWithIssues,
          healthRate: totalCrops > 0 ? ((healthyCrops / totalCrops) * 100).toFixed(1) : 0
        },
        products: {
          total: totalProducts,
          approved: approvedProducts,
          pending: pendingProducts,
          approvalRate: totalProducts > 0 ? ((approvedProducts / totalProducts) * 100).toFixed(1) : 0
        },
        forum: {
          total: totalPosts,
          resolved: resolvedPosts,
          pending: pendingPosts,
          resolutionRate: totalPosts > 0 ? ((resolvedPosts / totalPosts) * 100).toFixed(1) : 0
        }
      },
      roleDistribution,
      recentActivity: {
        users: recentUsers,
        products: recentProducts,
        posts: recentPosts
      },
      trends: {
        users: monthlyUserTrend,
        products: monthlyProductTrend
      },
      topContent: {
        products: topProducts,
        posts: topForumPosts
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get pending approvals
// @route   GET /api/admin/pending
// @access  Private/Admin
router.get('/pending', protect, admin, async (req, res) => {
  try {
    const pendingProducts = await Product.find({ 
      isActive: true, 
      isApproved: false 
    })
      .populate('seller', 'name email location.state')
      .select('name category description price images seller createdAt')
      .sort({ createdAt: -1 });

    const pendingPosts = await ForumPost.find({ isApproved: false })
      .populate('author', 'name email role location.state')
      .select('title content category author createdAt')
      .sort({ createdAt: -1 });

    const reportedContent = []; // Placeholder for reported content system

    res.json({
      products: pendingProducts,
      posts: pendingPosts,
      reports: reportedContent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Approve/Reject product
// @route   PUT /api/admin/products/:id/approve
// @access  Private/Admin
router.put('/products/:id/approve', protect, admin, async (req, res) => {
  try {
    const { approved, reason } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isApproved = approved;
    
    if (!approved && reason) {
      // In a real app, you might want to send notification to seller
      console.log(`Product rejected: ${reason}`);
    }

    await product.save();

    res.json({ 
      message: `Product ${approved ? 'approved' : 'rejected'} successfully`,
      product 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Approve/Reject forum post
// @route   PUT /api/admin/posts/:id/approve
// @access  Private/Admin
router.put('/posts/:id/approve', protect, admin, async (req, res) => {
  try {
    const { approved, reason } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.isApproved = approved;
    
    if (!approved && reason) {
      // In a real app, you might want to send notification to author
      console.log(`Post rejected: ${reason}`);
    }

    await post.save();

    res.json({ 
      message: `Post ${approved ? 'approved' : 'rejected'} successfully`,
      post 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get system health metrics
// @route   GET /api/admin/system-health
// @access  Private/Admin
router.get('/system-health', protect, admin, async (req, res) => {
  try {
    // Database connection status
    const dbStatus = 'connected'; // In real app, check actual DB connection

    // Get collection sizes
    const collections = {
      users: await User.countDocuments(),
      crops: await Crop.countDocuments(),
      products: await Product.countDocuments(),
      forumPosts: await ForumPost.countDocuments()
    };

    // Calculate storage usage (mock data)
    const storageUsage = {
      images: '2.5 GB',
      database: '150 MB',
      logs: '50 MB',
      total: '2.7 GB'
    };

    // Performance metrics (mock data)
    const performance = {
      avgResponseTime: '120ms',
      uptime: '99.9%',
      errorRate: '0.1%',
      activeConnections: 45
    };

    // Recent errors (mock data)
    const recentErrors = [
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        level: 'warning',
        message: 'High memory usage detected',
        count: 3
      },
      {
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        level: 'error',
        message: 'Failed to send email notification',
        count: 1
      }
    ];

    res.json({
      database: {
        status: dbStatus,
        collections
      },
      storage: storageUsage,
      performance,
      recentErrors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user management data
// @route   GET /api/admin/users-management
// @access  Private/Admin
router.get('/users-management', protect, admin, async (req, res) => {
  try {
    const {
      role,
      status,
      search,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter
    const filter = {};
    
    if (role) filter.role = role;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (status === 'verified') filter.isVerified = true;
    if (status === 'unverified') filter.isVerified = false;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    // Get summary stats
    const stats = {
      total: await User.countDocuments(),
      active: await User.countDocuments({ isActive: true }),
      verified: await User.countDocuments({ isVerified: true }),
      farmers: await User.countDocuments({ role: 'farmer' }),
      sellers: await User.countDocuments({ role: 'seller' }),
      advisors: await User.countDocuments({ role: 'advisor' })
    };

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Bulk user actions
// @route   POST /api/admin/users/bulk-action
// @access  Private/Admin
router.post('/users/bulk-action', protect, admin, async (req, res) => {
  try {
    const { userIds, action } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs are required' });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'activate':
        updateData = { isActive: true };
        message = 'Users activated successfully';
        break;
      case 'deactivate':
        updateData = { isActive: false };
        message = 'Users deactivated successfully';
        break;
      case 'verify':
        updateData = { isVerified: true };
        message = 'Users verified successfully';
        break;
      case 'unverify':
        updateData = { isVerified: false };
        message = 'Users unverified successfully';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      updateData
    );

    res.json({
      message,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Export data
// @route   GET /api/admin/export/:type
// @access  Private/Admin
router.get('/export/:type', protect, admin, async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'json' } = req.query;

    let data = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = await User.find().select('-password');
        filename = 'users_export';
        break;
      case 'products':
        data = await Product.find().populate('seller', 'name email');
        filename = 'products_export';
        break;
      case 'forum-posts':
        data = await ForumPost.find().populate('author', 'name email');
        filename = 'forum_posts_export';
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    if (format === 'csv') {
      // In a real app, you'd convert to CSV format
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
      res.send('CSV export not implemented yet');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
