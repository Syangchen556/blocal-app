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

// Create or update my shop
export async function POST(req) {
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
        { error: 'Only sellers can create shops' },
        { status: 403 }
      );
    }

    await connectDB();

    // Check if seller already has a shop
    const existingShop = await Shop.findOne({ owner: session.user.id });
    if (existingShop) {
      return NextResponse.json(
        { error: 'You already have a shop' },
        { status: 400 }
      );
    }

    const data = await req.json();
    
    // Create shop with default values
    const shop = await Shop.create({
      ...data,
      owner: session.user.id,
      media: {
        logo: '/images/default-shop.png',
        coverImage: '/images/default-shop-cover.png'
      },
      verification: {
        isVerified: false,
        verifiedAt: null,
        verifiedBy: null
      },
      status: 'pending',
      statistics: {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0
      },
      rating: {
        average: 0,
        count: 0
      },
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        message: 'Shop registration submitted',
        updatedBy: session.user.id
      }]
    });

    return NextResponse.json(shop, { status: 201 });
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json(
      { error: 'Error creating shop' },
      { status: 500 }
    );
  }
}

// Delete my shop
export async function DELETE(req) {
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
        { error: 'Only sellers can manage shops' },
        { status: 403 }
      );
    }

    await connectDB();

    await Shop.findOneAndDelete({ owner: session.user.id });

    return NextResponse.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json(
      { error: 'Error deleting shop' },
      { status: 500 }
    );
  }
} 