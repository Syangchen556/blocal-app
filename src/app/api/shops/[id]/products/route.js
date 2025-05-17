import { NextResponse } from 'next/server';
import Product from '@/models/Product.js';
import dbConnect from '@/lib/dbConnect';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const products = await Product.find({ shop: params.id })
      .select('-__v')
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 