import mongoose from 'mongoose';

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
    maxLength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    short: {
      type: String,
      required: [true, 'Short description is required'],
      maxLength: [300, 'Short description cannot exceed 300 characters']
    },
    full: {
      type: String,
      required: [true, 'Full description is required']
    }
  },
  media: {
    mainImage: {
      type: String,
      required: [true, 'Main product image is required'],
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'Invalid main image URL format'
      }
    },
    gallery: [{
      type: String,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'Invalid gallery image URL format'
      }
    }]
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
      default: 'BTN'
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
    required: true,
    index: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'rejected', 'archived'],
    default: 'draft'
  },
  varieties: [varietySchema],
  specifications: [specificationSchema],
  reviews: [reviewSchema],
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
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', 'description.short': 'text', 'description.full': 'text' });
productSchema.index({ 'category.main': 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'pricing.base': 1 });
productSchema.index({ 'rating.average': -1 });

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.pricing.base && this.pricing.discounted) {
    return Math.round(((this.pricing.base - this.pricing.discounted) / this.pricing.base) * 100);
  }
  return 0;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
  return this.inventory.stock > 0;
};

// Method to check if product needs restock
productSchema.methods.needsRestock = function() {
  return this.inventory.stock <= this.inventory.minStock;
};

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product; 