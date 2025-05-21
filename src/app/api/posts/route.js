import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';

// GET /api/posts - Get all posts
export async function GET(request) {
  try {
    await connectDB();
    
    const posts = await Post.find()
      .populate({
        path: 'author',
        select: 'name email image'
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name email image'
        }
      })
      .populate('likes')
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { title, content, excerpt, imageUrl } = data;

    const post = await Post.create({
      title,
      content,
      excerpt,
      imageUrl,
      author: session.user.id
    });

    await post.populate({
      path: 'author',
      select: 'name email image'
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 