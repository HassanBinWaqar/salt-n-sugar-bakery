import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroPhoto extends Document {
  imageUrl: string;
  title: string;
  order: number;
  active: boolean;
  createdAt: Date;
}

const HeroPhotoSchema = new Schema<IHeroPhoto>({
  imageUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.HeroPhoto || mongoose.model<IHeroPhoto>('HeroPhoto', HeroPhotoSchema);
