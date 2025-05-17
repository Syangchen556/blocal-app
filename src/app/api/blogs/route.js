import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// GET /api/blogs - Get all published blogs
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'latest';

    // Build query
    const query = { status: 'PUBLISHED' };
    if (category) query.category = category;
    if (tag) query.tags = tag;

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'popular':
        sortOptions = { 'metadata.views': -1 };
        break;
      case 'mostLiked':
        sortOptions = { 'metadata.likes': -1 };
        break;
      default:
        sortOptions = { publishedAt: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate({
          path: 'author',
          select: 'name image'
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select('-content'), // Exclude full content for list view
      Blog.countDocuments(query)
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
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

    const data = await request.json();
    const {
      title,
      content,
      summary,
      category,
      tags,
      media,
      status,
      seo
    } = data;

    // Create blog
    const blog = await Blog.create({
      title,
      content,
      summary,
      category,
      tags,
      media,
      status,
      seo,
      author: session.user.id,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      metadata: {
        readTime: Math.ceil(content.split(' ').length / 200) // Assuming 200 words per minute
      }
    });

    await blog.populate({
      path: 'author',
      select: 'name image'
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
} 