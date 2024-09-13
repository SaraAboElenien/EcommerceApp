import mongoose, { Types } from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [{
      productId: {
        type: Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity:
      {
        type: Number,
        required: true
      }
    }],

  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.model('Cart', cartSchema);

export default cartModel;
