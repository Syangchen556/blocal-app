import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

// Get user's wishlist
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

    let wishlist = await Wishlist.findOne({ user: session.user.id })
      .populate({
        path: 'items.product',
        select: 'name description price image shop',
        populate: {
          path: 'shop',
          select: 'name'
        }
      });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: session.user.id,
        items: []
      });
    }

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Error fetching wishlist' },
      { status: 500 }
    );
  }
}

// Add item to wishlist
export async function POST(req) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    let wishlist = await Wishlist.findOne({ user: session.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: session.user.id,
        items: []
      });
    }

    // Check if item already exists in wishlist
    const exists = wishlist.items.some(item => 
      item.product.toString() === productId
    );

    if (!exists) {
      wishlist.items.push({
        product: productId,
        addedAt: new Date()
      });
      await wishlist.save();
    }

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Error adding to wishlist' },
      { status: 500 }
    );
  }
} 