import mongoose from 'mongoose';

export interface IReview {
  name: string;
  email: string;
  rating: number;
  review: string;
  profileImage?: string;
  gender?: string;
  approved: boolean;
  createdAt: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  review: {
    type: String,
    required: [true, 'Please provide your review'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  profileImage: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: false
  },
  approved: {
    type: Boolean,
    default: true // Auto-approve for now, can add moderation later
  }
}, {
  timestamps: true
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
