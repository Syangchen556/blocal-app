import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Shop from '@/models/Shop';
import User from '@/models/User';

// GET /api/shops - Get all active shops
export async function GET(request) {
  try {
    const session = await getServerSession();
    await connectDB();
    
    // If admin, return all shops including pending ones
    if (session?.user?.role === 'ADMIN') {
      const shops = await Shop.find()
        .populate({
          path: 'owner',
          select: 'id name email image'
        })
        .populate('products')
        .sort({ createdAt: -1 });
      
      return NextResponse.json(shops);
    }

    // For non-admin users, only return approved and active shops
    const shops = await Shop.find({
      isActive: true,
      status: 'APPROVED'
    })
      .populate({
        path: 'owner',
        select: 'id name email image'
      })
      .populate('products')
      .sort({ createdAt: -1 });

    return NextResponse.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    );
  }
}

// POST /api/shops - Create a new shop
export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if user already has a shop
    const existingShop = await Shop.findOne({
      owner: session.user.id
    });

    if (existingShop) {
      return NextResponse.json(
        { error: 'User already has a shop' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { name, description, logo, address } = data;

    // Create shop with PENDING status
    const shop = await Shop.create({
      name,
      description,
      logo,
      address,
      status: 'PENDING',
      owner: session.user.id
    });

    // Populate owner details
    await shop.populate({
      path: 'owner',
      select: 'id name email image'
    });

    return NextResponse.json(shop);
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json(
      { error: 'Failed to create shop' },
      { status: 500 }
    );
  }
} 