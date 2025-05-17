import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxLength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: ['ADMIN', 'SELLER', 'BUYER'],
    default: 'BUYER'
  },
  profile: {
    avatar: {
      type: String,
      default: '/images/default-avatar.png'
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-]+$/, 'Please provide a valid phone number']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    bio: {
      type: String,
      maxLength: [500, 'Bio cannot be more than 500 characters']
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: Date,
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
// userSchema.index({ email: 1 }); // Removed as email already has unique: true
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Virtual for full name (if we add firstName/lastName later)
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to check if user is active
userSchema.methods.isActive = function() {
  return this.status === 'active';
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 