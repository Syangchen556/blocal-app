import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a shop name'],
    trim: true,
    maxLength: [100, 'Shop name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [1000, 'Description cannot be more than 1000 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please provide a street address'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide a city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide a state'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide a ZIP code'],
      trim: true
    }
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true,
    match: [/^\+?[\d\s-]+$/, 'Please provide a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'suspended'],
    default: 'pending'
  },
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
  statistics: {
    totalSales: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalProducts: {
      type: Number,
      default: 0
    }
  },
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  media: {
    logo: {
      type: String,
      default: '/images/default-shop.png'
    },
    coverImage: {
      type: String,
      default: '/images/default-shop-cover.png'
    }
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
shopSchema.index({ name: 1 });
shopSchema.index({ 'address.city': 1 });
shopSchema.index({ status: 1 });
shopSchema.index({ 'verification.isVerified': 1 });

// Virtual for full address
shopSchema.virtual('fullAddress').get(function() {
  const { street, city, state, zipCode } = this.address;
  return `${street}, ${city}, ${state} ${zipCode}`;
});

const Shop = mongoose.models.Shop || mongoose.model('Shop', shopSchema);

export default Shop; 