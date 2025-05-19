import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Shop from '@/models/Shop';

// Get all products
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const shop = searchParams.get('shop') || '';
    const status = searchParams.get('status') || 'active';

    let filter = { status };
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { 'description.short': { $regex: query, $options: 'i' } },
        { 'description.full': { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter['category.main'] = category.toUpperCase();
    }
    
    if (shop) {
      filter.shop = shop;
    }

    const products = await Product.find(filter)
      .populate('seller', 'name email image')
      .populate('shop', 'name logo')
      .sort({ 'analytics.views': -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Create new product
export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await req.json();
    
    // Validate shop ownership
    const shop = await Shop.findOne({ 
      _id: data.shop, 
      owner: session.user.id,
      status: 'APPROVED'
    });
    
    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found or unauthorized' },
        { status: 404 }
      );
    }

    // Create product with proper schema
    const product = await Product.create({
      ...data,
      seller: session.user.id,
      status: 'active',
      analytics: {
        views: 0,
        sales: {
          total: 0,
          lastMonth: 0
        },
        conversion: 0
      }
    });

    await product.populate('seller', 'name email image');
    await product.populate('shop', 'name logo');

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// Update product
export async function PUT(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await req.json();
    const { id, ...updateData } = data;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      session.user.role !== 'ADMIN' && 
      product.seller.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Not authorized to update this product' },
        { status: 403 }
      );
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    )
    .populate('seller', 'name email image')
    .populate('shop', 'name logo');

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      session.user.role !== 'ADMIN' && 
      product.seller.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Not authorized to delete this product' },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 