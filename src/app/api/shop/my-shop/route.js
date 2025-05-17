import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Shop from '@/models/Shop';
import Product from '@/models/Product';
import Order from '@/models/Order';

// Get shop profile
export async function GET(req) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Only sellers can access shop data' },
        { status: 403 }
      );
    }

    await connectDB();

    const shop = await Shop.findOne({ owner: session.user.id });

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    // Get additional statistics
    const totalProducts = await Product.countDocuments({ shop: shop._id });
    const totalOrders = await Order.countDocuments({ 'items.shop': shop._id });
    const orders = await Order.find({ 'items.shop': shop._id });
    const totalSales = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => {
        return itemSum + (item.shop.toString() === shop._id.toString() ? item.price * item.quantity : 0);
      }, 0);
    }, 0);

    return NextResponse.json({
      ...shop.toObject(),
      totalProducts,
      totalOrders,
      totalSales
    });
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json(
      { error: 'Error fetching shop' },
      { status: 500 }
    );
  }
}

// Update shop profile
export async function PUT(req) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Only sellers can update shop data' },
        { status: 403 }
      );
    }

    const data = await req.json();
    await connectDB();

    const shop = await Shop.findOne({ owner: session.user.id });

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    // Update shop data
    shop.name = data.name;
    shop.description = data.description;
    shop.address = data.address;
    shop.phone = data.phone;
    shop.email = data.email;
    shop.updatedAt = new Date();

    await shop.save();

    // Get updated statistics
    const totalProducts = await Product.countDocuments({ shop: shop._id });
    const totalOrders = await Order.countDocuments({ 'items.shop': shop._id });
    const orders = await Order.find({ 'items.shop': shop._id });
    const totalSales = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => {
        return itemSum + (item.shop.toString() === shop._id.toString() ? item.price * item.quantity : 0);
      }, 0);
    }, 0);

    return NextResponse.json({
      ...shop.toObject(),
      totalProducts,
      totalOrders,
      totalSales
    });
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json(
      { error: 'Error updating shop' },
      { status: 500 }
    );
  }
} 