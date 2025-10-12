const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { protect, sellerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for product images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
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

// @desc    Get all products with filters
// @route   GET /api/market/products
// @access  Private
router.get('/products', protect, async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      location,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    const filter = { isActive: true, isApproved: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['price.amount'].$lte = parseFloat(maxPrice);
    }

    if (location) {
      filter['location.state'] = new RegExp(location, 'i');
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .populate('seller', 'name location.state location.district')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
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

// @desc    Get single product
// @route   GET /api/market/products/:id
// @access  Private
router.get('/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email phone location profile')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new product
// @route   POST /api/market/products
// @access  Private (Seller or Admin)
router.post('/products', protect, sellerOrAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user.id,
      images: []
    };

    // Process uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => ({
        url: `/uploads/products/${file.filename}`,
        alt: req.body.name
      }));
    }

    // Parse nested objects
    if (req.body.price) {
      productData.price = typeof req.body.price === 'string' 
        ? JSON.parse(req.body.price) 
        : req.body.price;
    }

    if (req.body.inventory) {
      productData.inventory = typeof req.body.inventory === 'string' 
        ? JSON.parse(req.body.inventory) 
        : req.body.inventory;
    }

    if (req.body.location) {
      productData.location = typeof req.body.location === 'string' 
        ? JSON.parse(req.body.location) 
        : req.body.location;
    }

    if (req.body.specifications) {
      productData.specifications = typeof req.body.specifications === 'string' 
        ? JSON.parse(req.body.specifications) 
        : req.body.specifications;
    }

    if (req.body.shipping) {
      productData.shipping = typeof req.body.shipping === 'string' 
        ? JSON.parse(req.body.shipping) 
        : req.body.shipping;
    }

    const product = new Product(productData);
    const savedProduct = await product.save();
    
    await savedProduct.populate('seller', 'name location.state location.district');
    
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update product
// @route   PUT /api/market/products/:id
// @access  Private (Owner or Admin)
router.put('/products/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Update product data
    Object.assign(product, req.body);

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/products/${file.filename}`,
        alt: product.name
      }));
      product.images.push(...newImages);
    }

    const updatedProduct = await product.save();
    await updatedProduct.populate('seller', 'name location.state location.district');
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete product
// @route   DELETE /api/market/products/:id
// @access  Private (Owner or Admin)
router.delete('/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add product review
// @route   POST /api/market/products/:id/reviews
// @access  Private
router.post('/products/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user.id,
      rating: parseInt(rating),
      comment,
      date: new Date()
    };

    product.reviews.push(review);

    // Update average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.ratings.average = totalRating / product.reviews.length;
    product.ratings.count = product.reviews.length;

    await product.save();
    await product.populate('reviews.user', 'name');

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get product categories
// @route   GET /api/market/categories
// @access  Private
router.get('/categories', protect, async (req, res) => {
  try {
    const categories = [
      {
        id: 'seeds',
        name: 'Seeds',
        description: 'High-quality seeds for various crops',
        icon: '🌱'
      },
      {
        id: 'fertilizers',
        name: 'Fertilizers',
        description: 'Organic and chemical fertilizers',
        icon: '🧪'
      },
      {
        id: 'pesticides',
        name: 'Pesticides',
        description: 'Pest control solutions',
        icon: '🐛'
      },
      {
        id: 'tools',
        name: 'Tools',
        description: 'Farming tools and equipment',
        icon: '🔧'
      },
      {
        id: 'machinery',
        name: 'Machinery',
        description: 'Agricultural machinery and equipment',
        icon: '🚜'
      },
      {
        id: 'crops',
        name: 'Crops',
        description: 'Fresh produce and harvested crops',
        icon: '🌾'
      },
      {
        id: 'organic',
        name: 'Organic Products',
        description: 'Certified organic products',
        icon: '🌿'
      }
    ];

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({
          category: category.id,
          isActive: true,
          isApproved: true
        });
        return { ...category, productCount: count };
      })
    );

    res.json(categoriesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get seller's products
// @route   GET /api/market/my-products
// @access  Private (Seller or Admin)
router.get('/my-products', protect, sellerOrAdmin, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get market statistics
// @route   GET /api/market/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true, isApproved: true });
    const totalSellers = await Product.distinct('seller').countDocuments();
    
    // Category distribution
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true, isApproved: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Price ranges
    const priceStats = await Product.aggregate([
      { $match: { isActive: true, isApproved: true } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price.amount' },
          minPrice: { $min: '$price.amount' },
          maxPrice: { $max: '$price.amount' }
        }
      }
    ]);

    // Recent products
    const recentProducts = await Product.find({ isActive: true, isApproved: true })
      .populate('seller', 'name location.state')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalProducts,
      totalSellers,
      categoryStats,
      priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
      recentProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
