import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Shop from '@/models/Shop';

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { shopId } = params;
    const { isActive } = await request.json();

    await connectDB();

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      { 
        isActive,
        statusHistory: [
          ...shop.statusHistory,
          {
            status: isActive ? 'active' : 'inactive',
            timestamp: new Date(),
            message: `Shop ${isActive ? 'activated' : 'deactivated'} by admin`,
            updatedBy: session.user.id
          }
        ]
      },
      { new: true }
    );

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error('Error updating shop status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 