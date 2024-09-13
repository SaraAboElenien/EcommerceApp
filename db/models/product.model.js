import mongoose, { Types } from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
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
    description: {
      type: String,
      trim: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    coverImage: [{
      secure_url: String,
      public_id: String,
    }],
    category:{
        type: Types.ObjectId,
        ref: 'Category', 
        required: true,
  
    },
    subCategory:{
        type: Types.ObjectId,
        ref: 'SubCategory', 
        required: true,
  
    },
    brand:{
      type: Types.ObjectId,
      ref: 'Brand', 
      required: true,

  },
    customId: String,
    price:{
      type: Number,
      required: true,
      min: 1
    },
    discount:{
      type: Number,
      default: 1,
      min: 1,
      max: 100
    },
    subPrice:{
      type: Number,
      default: 1,
    },
     stock:{
      type: Number,
      default: 1,
      required: true,
    },
    rateAvg:{
      type: Number,
      default: 0,
    },
    rateNumber:{
      type: Number,
      default: 0,
    }


  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model('Product', productSchema);

export default productModel;
