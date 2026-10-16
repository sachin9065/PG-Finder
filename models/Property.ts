import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProperty extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId | any;
  propertyType: 'PG' | 'Hostel' | 'Flat' | 'Room';
  gender: 'Boys' | 'Girls' | 'Co-Living';
  address: string;
  city: string;
  locality: string;
  rent: number;
  securityDeposit: number;
  roomType: 'Single' | 'Double' | 'Triple' | 'Four Sharing';
  availableRooms: number;
  amenities: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  status: 'Active' | 'Inactive' | 'Pending';
  houseRules?: string[];
  nearbyPlaces?: Array<{ name: string; distance: string }>;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema<IProperty> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyType: {
      type: String,
      enum: ['PG', 'Hostel', 'Flat', 'Room'],
      default: 'PG',
    },
    gender: {
      type: String,
      enum: ['Boys', 'Girls', 'Co-Living'],
      required: [true, 'Gender categorization is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      index: true,
    },
    locality: {
      type: String,
      required: [true, 'Locality is required'],
      index: true,
    },
    rent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Four Sharing'],
      required: true,
    },
    availableRooms: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Pending'],
      default: 'Active',
    },
    houseRules: {
      type: [String],
      default: [
        'Notice period of 30 days before vacating',
        'Visitor entry permitted until 9:00 PM',
        'Quiet hours between 11:00 PM and 6:00 AM',
        'Keep common areas clean and organized',
      ],
    },
    nearbyPlaces: {
      type: [
        {
          name: String,
          distance: String,
        },
      ],
      default: [],
    },
    coordinates: {
      lat: { type: Number, default: 12.9716 },
      lng: { type: Number, default: 77.5946 },
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes
PropertySchema.index({ title: 'text', locality: 'text', city: 'text' });
PropertySchema.index({ city: 1, rent: 1 });

const Property: Model<IProperty> = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;
