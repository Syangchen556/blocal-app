<<<<<<< HEAD
const { NextResponse } = require('next/server');
const { getServerSession } = require('next-auth/next');
const { authOptions } = require('../../lib/auth');
const { connectDB } = require('../../lib/mongodb');
const Product = require('../../models/Product');
const Shop = require('../../models/Shop');
const { writeFile } = require('fs/promises');
const path = require('path');
=======
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Shop from '@/models/Shop';
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3

// Get all products
async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
<<<<<<< HEAD
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    const db = await connectDB();
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
=======
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
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3

    const products = await db.collection('products')
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await db.collection('products').countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
<<<<<<< HEAD
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
=======
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
  }
}

// Create new product
async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

<<<<<<< HEAD
    const { name, description, price, category, images, stock } = await req.json();
    if (!name || !description || !price || !category || !images || !stock) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await connectDB();
    const product = {
      name,
      description,
      price,
      category,
      images,
      stock,
      sellerId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('products').insertOne(product);

    return NextResponse.json({
      message: 'Product created successfully',
      productId: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
=======
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
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
  }
}

// Update product
async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const data = await req.json();
    const { id, ...updateData } = data;

<<<<<<< HEAD
    let product = await db.collection('products').findOne({ _id: id });
=======
    const product = await Product.findById(id);
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check authorization
    if (
<<<<<<< HEAD
      session.user.role === 'SELLER' &&
      product.sellerId !== session.user.id
    ) {
      return NextResponse.json({ error: 'You can only update your own products' }, { status: 403 });
    }

    // Only allow admins to update status
    if (session.user.role !== 'ADMIN') {
      delete updateData.status;
    }

    const updatedProduct = await db.collection('products').findOneAndUpdate(
      { _id: id },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
=======
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
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
<<<<<<< HEAD
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
=======
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
  }
}

// Delete product
async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const product = await db.collection('products').findOne({ _id: id });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check authorization
    if (
<<<<<<< HEAD
      session.user.role === 'SELLER' &&
      product.sellerId !== session.user.id
    ) {
      return NextResponse.json({ error: 'You can only delete your own products' }, { status: 403 });
=======
      session.user.role !== 'ADMIN' && 
      product.seller.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Not authorized to delete this product' },
        { status: 403 }
      );
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
    }

    await db.collection('products').deleteOne({ _id: id });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
<<<<<<< HEAD
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
=======
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
  }
}

module.exports = { GET, POST, PUT, DELETE }; 