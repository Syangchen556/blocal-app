import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Shop from '@/models/Shop';

// Get shop by ID
export async function GET(req, { params }) {
  try {
    await connectDB();

    const shop = await Shop.findById(params.shopId)
      .populate({
        path: 'owner',
        select: 'id name email image'
      })
      .populate('products');

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    // If shop is not active or approved, only owner and admin can view it
    if (!shop.isActive || shop.status !== 'APPROVED') {
      const session = await getServerSession();
      const isOwner = session?.user?.id === shop.owner.id;
      const isAdmin = session?.user?.role === 'ADMIN';

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { error: 'Shop not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shop' },
      { status: 500 }
    );
  }
}

// Update shop by ID
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const shop = await Shop.findById(params.shopId);
    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    // Only shop owner and admin can update
    const isOwner = session.user.id === shop.owner.toString();
    const isAdmin = session.user.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const data = await req.json();
    
    // If admin is updating status, add to status history
    if (isAdmin && data.status && data.status !== shop.status) {
      data.statusHistory = [
        ...shop.statusHistory,
        {
          status: data.status,
          timestamp: new Date(),
          message: data.statusMessage || `Shop status updated to ${data.status}`,
          updatedBy: session.user.id
        }
      ];
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      params.shopId,
      { $set: data },
      { new: true }
    ).populate({
      path: 'owner',
      select: 'id name email image'
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    );
  }
}

// Delete shop by ID (Admin only)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await connectDB();

    const shop = await Shop.findByIdAndDelete(params.shopId);
    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json(
      { error: 'Failed to delete shop' },
      { status: 500 }
    );
  }
} 