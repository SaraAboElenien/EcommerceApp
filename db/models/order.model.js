import mongoose, { Types } from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [{
      title: { type: String, required: true },
      productId: {
        type: Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity:
      {
        type: Number,
        required: true
      }, price: {
        type: Number,
        required: true
      }, finalPrice: {
        type: Number,
        required: true
      }
    }],
    subPrice: { type: Number, required: true },
    couponId: { type: Types.ObjectId, ref: "Coupon" },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: {
      type: String, required: true,
      enum: ["Pay with credit or debit card", "Cash on delivery"]
    },
    status: {
      type: String,
      enum: ["Order Placed", "Packed", "Shipped", "Payment", "Delivered",
        "Cancelled", "Rejected"
      ],
      default: "Order Placed"
    },
    cancelledBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    reason: { type: String }
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model('Order', orderSchema);

export default orderModel;
