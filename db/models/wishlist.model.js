import mongoose, { Types } from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
   products: [{
      type: Types.ObjectId,
      ref: 'Product',
      required: true
    }],

  },
  {
    timestamps: true,
    versionKey: false
  }
);

const wishlistModel = mongoose.model('Wishlist', wishlistSchema);

export default wishlistModel;
