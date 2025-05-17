import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Shop from '@/models/Shop';

// Get shop data
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

    const shop = await Shop.findOne({ owner: session.user.id });
    return NextResponse.json(shop);
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json(
      { error: 'Error fetching shop' },
      { status: 500 }
    );
  }
}

// Create or update shop
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

// Delete shop
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