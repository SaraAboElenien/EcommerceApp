import mongoose, { Types } from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: true

    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const reviewModel = mongoose.model('Review', reviewSchema);

export default reviewModel;
