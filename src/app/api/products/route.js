import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Shop from '@/models/Shop';
import { writeFile } from 'fs/promises';
import path from 'path';

// Get all products
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const seller = searchParams.get('seller') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    let filter = {};
    if (query) {
      filter = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      };
    }
    if (seller) {
      filter.seller = seller;
    }
    if (category) {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }

    const products = await Product.find(filter)
      .populate('seller', 'name email')
      .populate('shop', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
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

    if (session.user.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Only sellers can create products' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const category = formData.get('category');
    const stock = formData.get('stock');
    const image = formData.get('image');
    const shopId = formData.get('shopId');

    // Validate shop ownership
    const shop = await Shop.findOne({ _id: shopId, owner: session.user.id });
    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found or unauthorized' },
        { status: 404 }
      );
    }

    // Handle image upload
    let imageUrl = '';
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${image.name}`;
      const imagePath = path.join(process.cwd(), 'public', 'images', 'products', category, filename);
      
      await writeFile(imagePath, buffer);
      imageUrl = `/images/products/${category}/${filename}`;
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      imageUrl,
      seller: session.user.id,
      shop: shopId,
      status: 'pending'
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error creating product' },
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

    let product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Only allow sellers to update their own products
    if (
      session.user.role === 'SELLER' &&
      product.seller.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'You can only update your own products' },
        { status: 403 }
      );
    }

    // Only allow admins to update status
    if (session.user.role !== 'ADMIN') {
      delete updateData.status;
    }

    product = await Product.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate('seller', 'name email');

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error updating product' },
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

    // Only allow sellers to delete their own products or admins to delete any product
    if (
      session.user.role === 'SELLER' &&
      product.seller.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'You can only delete your own products' },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error deleting product' },
      { status: 500 }
    );
  }
} 