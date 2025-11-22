import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroPhoto from '@/models/HeroPhoto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-admin-key-change-in-production';

function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// GET - Fetch all hero photos
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if admin is authenticated to show all photos (including inactive)
    const admin = verifyAdmin(request);
    const query = admin ? {} : { active: true };
    
    const photos = await HeroPhoto.find(query).sort({ order: 1 });
    
    return NextResponse.json({
      success: true,
      photos
    });
  } catch (error) {
    console.error('Fetch hero photos error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Add new hero photo (Admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { imageUrl, title, order } = await request.json();

    if (!imageUrl || !title) {
      return NextResponse.json(
        { success: false, message: 'Image URL and title are required' },
        { status: 400 }
      );
    }

    const photo = await HeroPhoto.create({
      imageUrl,
      title,
      order: order || 0,
      active: true
    });

    return NextResponse.json({
      success: true,
      message: 'Hero photo added successfully',
      photo
    }, { status: 201 });

  } catch (error) {
    console.error('Add hero photo error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete hero photo (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Photo ID is required' },
        { status: 400 }
      );
    }

    await HeroPhoto.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Hero photo deleted successfully'
    });

  } catch (error) {
    console.error('Delete hero photo error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Toggle hero photo active status (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { id, active } = await request.json();

    if (!id || typeof active !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Photo ID and active status are required' },
        { status: 400 }
      );
    }

    const photo = await HeroPhoto.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!photo) {
      return NextResponse.json(
        { success: false, message: 'Hero photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Hero photo ${active ? 'activated' : 'deactivated'} successfully`,
      photo
    });

  } catch (error) {
    console.error('Toggle hero photo error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
