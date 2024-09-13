import mongoose, { Types } from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    amount: {
      type: Number,
      unique: true,
      min: 1,
      max: 100
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    usedBy: [{
      type: Types.ObjectId,
      ref: 'User',
    }],
    fromDate: {
      type: Date,
      required: [true, "fromDate is required"],

    },
    toDate: {
      type: Date,
      required: [true, "toDate is required"],

    },

    customId: String
  },
  {
    timestamps: true,
  }
);

const couponModel = mongoose.model('Coupon', couponSchema);

export default couponModel;
