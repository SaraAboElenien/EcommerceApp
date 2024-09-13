import mongoose, { Types } from 'mongoose';

const categorySchema = new mongoose.Schema(
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

const categoryModel = mongoose.model('Category', categorySchema);

export default categoryModel;
