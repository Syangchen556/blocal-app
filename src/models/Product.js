import mongoose from 'mongoose';
import { autoGenerateSlug } from '../utils/slugGenerator.js';
import { generateUniqueSlug } from '../utils/slugGenerator.js';

const varietySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Variety name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    current: {
      type: Number,
      required: true,
      min: 0
    },
    minimum: {
      type: Number,
      required: true,
      min: 0
    }
  },
  attributes: {
    size: String,
    color: String,
    weight: Number,
    unit: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  }
});

const specificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Specification name is required'],
    trim: true
  },
  value: {
    type: String,
    required: [true, 'Specification value is required'],
    trim: true
  },
  unit: String,
  group: String
});

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxLength: [500, 'Review comment cannot exceed 500 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true
  },
  description: {
    short: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [300, 'Short description cannot exceed 300 characters']
    },
    full: {
      type: String,
      required: [true, 'Full description is required']
    }
  },
  media: {
    mainImage: {
      type: String,
      required: [true, 'Main product image is required']
    },
    gallery: [String]
  },
  pricing: {
    base: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    discounted: Number,
    discount: {
      type: Number,
      min: 0,
      max: 100
    },
    currency: {
      type: String,
      default: 'Nu.'
    }
  },
  inventory: {
    sku: {
      type: String,
      required: true,
      unique: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    minStock: {
      type: Number,
      required: true,
      min: 0
    },
    reserved: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  category: {
    main: {
      type: String,
      required: [true, 'Main category is required'],
      enum: ['VEGETABLES', 'FRUITS', 'HERBS', 'GRAINS', 'OTHER']
    },
    sub: String,
    tags: [String]
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'rejected', 'archived'],
    default: 'draft'
  },
  varieties: [varietySchema],
  specifications: [specificationSchema],
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    sales: {
      total: {
        type: Number,
        default: 0
      },
      lastMonth: {
        type: Number,
        default: 0
      }
    },
    conversion: {
      type: Number,
      default: 0
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  certifications: [{
    name: String,
    issuer: String,
    validUntil: Date,
    documentUrl: String
  }],
  averageRating: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', 'description.short': 'text', 'description.full': 'text' });
productSchema.index({ 'category.main': 1, status: 1 });
productSchema.index({ shop: 1, status: 1 });
productSchema.index({ seller: 1, createdAt: -1 });
productSchema.index({ 'pricing.base': 1, status: 1 });
productSchema.index({ featured: 1, status: 1 });

// Auto-generate slug from name
productSchema.pre('save', async function(next) {
  if (!this.slug) {
    this.slug = autoGenerateSlug(this.name);
  }
  next();
});

// Virtual for current price
productSchema.virtual('currentPrice').get(function() {
  return this.pricing.discounted || this.pricing.base;
});

// Method to check stock availability
productSchema.methods.checkAvailability = function(quantity) {
  return this.inventory.stock >= quantity;
};

// Method to update stock
productSchema.methods.updateStock = async function(quantity, operation = 'decrease') {
  if (operation === 'decrease') {
    if (this.inventory.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    this.inventory.stock -= quantity;
  } else {
    this.inventory.stock += quantity;
  }
  await this.save();
};

// Method to add review
productSchema.methods.addReview = async function(userId, rating, comment) {
  this.reviews.push({ user: userId, rating, comment });
  
  // Update average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = totalRating / this.reviews.length;
  this.rating.count = this.reviews.length;
  
  await this.save();
};

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product; 