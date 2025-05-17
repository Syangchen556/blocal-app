import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxLength: [1000, 'Comment cannot be more than 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxLength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    minLength: [100, 'Content must be at least 100 characters']
  },
  summary: {
    type: String,
    maxLength: [500, 'Summary cannot be more than 500 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide an author'],
    index: true
  },
  media: {
    featuredImage: {
      type: String,
      required: [true, 'Please provide a featured image']
    },
    gallery: [{
      type: String
    }]
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['RECIPES', 'FARMING', 'NUTRITION', 'SUSTAINABILITY', 'OTHER']
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    default: 'DRAFT'
  },
  metadata: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    readTime: {
      type: Number,
      default: 0
    }
  },
  comments: [commentSchema],
  publishedAt: Date,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
BlogSchema.index({ title: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ status: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ 'metadata.views': -1 });

// Pre-save hook to generate slug
BlogSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  next();
});

// Virtual for comment count
BlogSchema.virtual('commentCount').get(function() {
  return this.comments?.length || 0;
});

// Method to check if blog is published
BlogSchema.methods.isPublished = function() {
  return this.status === 'PUBLISHED';
};

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema); 