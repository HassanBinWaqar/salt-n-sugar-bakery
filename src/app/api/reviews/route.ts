import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';

// GET - Fetch all approved reviews
export async function GET() {
  try {
    await connectDB();
    
    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-email -__v');
    
    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, rating, review, profileImage, gender } = body;

    // Validation
    if (!name || !email || !rating || !review) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (review.length < 10) {
      return NextResponse.json(
        { error: 'Review must be at least 10 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already submitted a review recently (within 24 hours)
    const existingReview = await Review.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already submitted a review in the last 24 hours' },
        { status: 429 }
      );
    }

    // Create new review
    const newReview = await Review.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      rating: Number(rating),
      review: review.trim(),
      profileImage: profileImage || '',
      gender: gender || 'male',
      approved: false // Requires admin approval
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your review!',
      review: {
        id: newReview._id,
        name: newReview.name,
        rating: newReview.rating,
        review: newReview.review,
        profileImage: newReview.profileImage,
        createdAt: newReview.createdAt
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating review:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}
