const express = require('express');
const multer = require('multer');
const path = require('path');
const ForumPost = require('../models/ForumPost');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for forum images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/forum/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @desc    Get all forum posts with filters
// @route   GET /api/forum/posts
// @access  Private
router.get('/posts', protect, async (req, res) => {
  try {
    const {
      category,
      search,
      location,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { isApproved: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (location) {
      filter['location.state'] = new RegExp(location, 'i');
    }

    // Build sort object
    const sort = {};
    if (sortBy === 'popular') {
      sort['votes.score'] = -1;
    } else if (sortBy === 'replies') {
      sort['replies'] = -1;
    } else {
      sort[sortBy] = order === 'desc' ? -1 : 1;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const posts = await ForumPost.find(filter)
      .populate('author', 'name role location.state profile.avatar')
      .populate('replies.author', 'name role profile.avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ForumPost.countDocuments(filter);

    res.json({
      posts,
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

// @desc    Get single forum post
// @route   GET /api/forum/posts/:id
// @access  Private
router.get('/posts/:id', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name role location profile')
      .populate('replies.author', 'name role location profile');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new forum post
// @route   POST /api/forum/posts
// @access  Private
router.post('/posts', protect, upload.array('images', 3), async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.user.id,
      images: []
    };

    // Process uploaded images
    if (req.files && req.files.length > 0) {
      postData.images = req.files.map(file => `/uploads/forum/${file.filename}`);
    }

    // Parse tags if they're sent as string
    if (req.body.tags && typeof req.body.tags === 'string') {
      postData.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    // Parse location if sent as string
    if (req.body.location && typeof req.body.location === 'string') {
      postData.location = JSON.parse(req.body.location);
    }

    const post = new ForumPost(postData);
    const savedPost = await post.save();
    
    await savedPost.populate('author', 'name role location.state profile.avatar');
    
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update forum post
// @route   PUT /api/forum/posts/:id
// @access  Private (Author or Admin)
router.put('/posts/:id', protect, upload.array('images', 3), async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Update post data
    Object.assign(post, req.body);

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/forum/${file.filename}`);
      post.images.push(...newImages);
    }

    const updatedPost = await post.save();
    await updatedPost.populate('author', 'name role location.state profile.avatar');
    
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete forum post
// @route   DELETE /api/forum/posts/:id
// @access  Private (Author or Admin)
router.delete('/posts/:id', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Vote on forum post
// @route   POST /api/forum/posts/:id/vote
// @access  Private
router.post('/posts/:id/vote', protect, async (req, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Remove existing votes by this user
    post.votes.upvotes = post.votes.upvotes.filter(
      vote => vote.user.toString() !== req.user.id
    );
    post.votes.downvotes = post.votes.downvotes.filter(
      vote => vote.user.toString() !== req.user.id
    );

    // Add new vote
    if (type === 'upvote') {
      post.votes.upvotes.push({ user: req.user.id });
    } else if (type === 'downvote') {
      post.votes.downvotes.push({ user: req.user.id });
    }

    // Calculate score
    post.votes.score = post.votes.upvotes.length - post.votes.downvotes.length;

    await post.save();
    res.json({ 
      message: 'Vote recorded',
      votes: {
        upvotes: post.votes.upvotes.length,
        downvotes: post.votes.downvotes.length,
        score: post.votes.score
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add reply to forum post
// @route   POST /api/forum/posts/:id/replies
// @access  Private
router.post('/posts/:id/replies', protect, upload.array('images', 2), async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const replyData = {
      author: req.user.id,
      content: req.body.content,
      images: []
    };

    // Process uploaded images
    if (req.files && req.files.length > 0) {
      replyData.images = req.files.map(file => `/uploads/forum/${file.filename}`);
    }

    post.replies.push(replyData);
    await post.save();
    
    await post.populate('replies.author', 'name role location.state profile.avatar');
    
    const newReply = post.replies[post.replies.length - 1];
    res.status(201).json(newReply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Vote on reply
// @route   POST /api/forum/posts/:postId/replies/:replyId/vote
// @access  Private
router.post('/posts/:postId/replies/:replyId/vote', protect, async (req, res) => {
  try {
    const { type } = req.body;
    const post = await ForumPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = post.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Remove existing votes by this user
    reply.votes.upvotes = reply.votes.upvotes.filter(
      vote => vote.user.toString() !== req.user.id
    );
    reply.votes.downvotes = reply.votes.downvotes.filter(
      vote => vote.user.toString() !== req.user.id
    );

    // Add new vote
    if (type === 'upvote') {
      reply.votes.upvotes.push({ user: req.user.id });
    } else if (type === 'downvote') {
      reply.votes.downvotes.push({ user: req.user.id });
    }

    // Calculate score
    reply.votes.score = reply.votes.upvotes.length - reply.votes.downvotes.length;

    await post.save();
    res.json({ 
      message: 'Vote recorded',
      votes: {
        upvotes: reply.votes.upvotes.length,
        downvotes: reply.votes.downvotes.length,
        score: reply.votes.score
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark reply as accepted (for post author)
// @route   PUT /api/forum/posts/:postId/replies/:replyId/accept
// @access  Private (Post Author)
router.put('/posts/:postId/replies/:replyId/accept', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the post author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only post author can accept replies' });
    }

    const reply = post.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Unmark all other replies as accepted
    post.replies.forEach(r => r.isAccepted = false);
    
    // Mark this reply as accepted
    reply.isAccepted = true;
    post.isResolved = true;

    await post.save();
    res.json({ message: 'Reply marked as accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get forum categories
// @route   GET /api/forum/categories
// @access  Private
router.get('/categories', protect, async (req, res) => {
  try {
    const categories = [
      {
        id: 'crop-diseases',
        name: 'Crop Diseases',
        description: 'Identify and treat crop diseases',
        icon: '🦠'
      },
      {
        id: 'pest-control',
        name: 'Pest Control',
        description: 'Pest management and control methods',
        icon: '🐛'
      },
      {
        id: 'irrigation',
        name: 'Irrigation',
        description: 'Water management and irrigation techniques',
        icon: '💧'
      },
      {
        id: 'fertilizers',
        name: 'Fertilizers',
        description: 'Fertilizer recommendations and usage',
        icon: '🧪'
      },
      {
        id: 'weather',
        name: 'Weather',
        description: 'Weather-related farming discussions',
        icon: '🌤️'
      },
      {
        id: 'market-prices',
        name: 'Market Prices',
        description: 'Crop prices and market trends',
        icon: '💰'
      },
      {
        id: 'government-schemes',
        name: 'Government Schemes',
        description: 'Government policies and subsidies',
        icon: '🏛️'
      },
      {
        id: 'general',
        name: 'General Discussion',
        description: 'General farming topics',
        icon: '💬'
      },
      {
        id: 'success-stories',
        name: 'Success Stories',
        description: 'Share your farming success stories',
        icon: '🏆'
      }
    ];

    // Get post counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await ForumPost.countDocuments({
          category: category.id,
          isApproved: true
        });
        return { ...category, postCount: count };
      })
    );

    res.json(categoriesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get forum statistics
// @route   GET /api/forum/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalPosts = await ForumPost.countDocuments({ isApproved: true });
    const totalReplies = await ForumPost.aggregate([
      { $match: { isApproved: true } },
      { $project: { replyCount: { $size: '$replies' } } },
      { $group: { _id: null, total: { $sum: '$replyCount' } } }
    ]);

    const activeUsers = await ForumPost.distinct('author').countDocuments();
    const resolvedPosts = await ForumPost.countDocuments({ isResolved: true, isApproved: true });

    // Category distribution
    const categoryStats = await ForumPost.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent activity
    const recentPosts = await ForumPost.find({ isApproved: true })
      .populate('author', 'name role location.state')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalPosts,
      totalReplies: totalReplies[0]?.total || 0,
      activeUsers,
      resolvedPosts,
      categoryStats,
      recentPosts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
