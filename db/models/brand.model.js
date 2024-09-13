import mongoose, { Types } from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    customId: String
  },
  {
    timestamps: true,
  }
);

const brandModel = mongoose.model('Brand', brandSchema);

export default brandModel;
