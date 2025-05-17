import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import User from '@/models/User';

// POST /api/posts/[postId]/comments - Create a new comment
export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
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

    const post = await Post.findById(params.postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const { text } = await request.json();
    const comment = await Comment.create({
      text,
      author: session.user.id,
      post: params.postId
    });

    await comment.populate([
      {
        path: 'author',
        select: 'name email image'
      },
      {
        path: 'post',
        select: 'title content'
      }
    ]);

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// GET /api/posts/[postId]/comments - Get all comments for a post
export async function GET(request, { params }) {
  try {
    await connectDB();

    const post = await Post.findById(params.postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const comments = await Comment.find({ post: params.postId })
      .populate({
        path: 'author',
        select: 'name email image'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
} 