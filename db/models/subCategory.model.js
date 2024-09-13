import mongoose, { Types } from 'mongoose';

const subCategorySchema = new mongoose.Schema(
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
    category:{
        type: Types.ObjectId,
        ref: 'Category', 
        required: true,
  
    },
    customId: String
  },
  {
    timestamps: true,
  }
);

const subCategoryModel = mongoose.model('SubCategory', subCategorySchema);

export default subCategoryModel;
