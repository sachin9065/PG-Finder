import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | any;
  owner: mongoose.Types.ObjectId | any;
  property: mongoose.Types.ObjectId | any;
  message: string;
  phone?: string;
  visitDate?: string;
  status: 'Pending' | 'Contacted' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema: Schema<IEnquiry> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Enquiry message is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    visitDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Closed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
