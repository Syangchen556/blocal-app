import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

// Get orders for the current user
export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    let filter = {};
    if (session.user.role === 'BUYER') {
      filter.buyer = session.user.id;
    } else if (session.user.role === 'SELLER') {
      // For sellers, find orders containing their products
      const sellerProducts = await Product.find({ seller: session.user.id });
      const productIds = sellerProducts.map(p => p._id);
      filter = { 'items.product': { $in: productIds } };
    }

    const orders = await Order.find(filter)
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        populate: {
          path: 'seller',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    await connectDB();

    // Validate products and calculate total
    const productIds = data.items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Some products not found' },
        { status: 400 }
      );
    }

    // Check stock and calculate total
    let total = 0;
    for (const item of data.items) {
      const product = products.find(p => p._id.toString() === item.product);
      if (product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
      total += product.price * item.quantity;

      // Update product quantity
      await Product.findByIdAndUpdate(product._id, {
        $inc: { quantity: -item.quantity }
      });
    }

    const order = await Order.create({
      buyer: session.user.id,
      items: data.items.map(item => ({
        ...item,
        price: products.find(p => p._id.toString() === item.product).price
      })),
      total,
    });

    const populatedOrder = await order
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        populate: {
          path: 'seller',
          select: 'name email'
        }
      });

    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    );
  }
} 