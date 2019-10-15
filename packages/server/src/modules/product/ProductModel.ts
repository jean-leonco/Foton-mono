import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'product',
  }
);

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
}

const ProductModel: Model<IProduct> = mongoose.model('Product', schema);

export default ProductModel;
