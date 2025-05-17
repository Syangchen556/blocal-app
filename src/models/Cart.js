import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
}, {
  timestamps: true // This will add createdAt and updatedAt automatically
});

// Calculate total cart value
cartSchema.virtual('total').get(function() {
  return this.items.reduce((total, item) => {
    // We'll need to ensure the product is populated to get the price
    if (item.product && typeof item.product === 'object') {
      return total + (item.product.price * item.quantity);
    }
    return total;
  }, 0);
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart; 