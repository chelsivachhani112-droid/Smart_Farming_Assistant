const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['seeds', 'fertilizers', 'pesticides', 'tools', 'machinery', 'crops', 'organic']
  },
  subcategory: String,
  description: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    alt: String
  }],
  price: {
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  specifications: {
    brand: String,
    model: String,
    weight: String,
    dimensions: String,
    composition: String,
    usage: String,
    benefits: [String]
  },
  inventory: {
    quantity: {
      type: Number,
      required: true
    },
    unit: String,
    lowStockAlert: Number
  },
  location: {
    state: String,
    district: String,
    city: String,
    pincode: String
  },
  shipping: {
    available: {
      type: Boolean,
      default: true
    },
    cost: Number,
    freeShippingAbove: Number,
    estimatedDays: Number
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    images: [String],
    date: {
      type: Date,
      default: Date.now
    },
    helpful: {
      type: Number,
      default: 0
    }
  }],
  tags: [String],
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
