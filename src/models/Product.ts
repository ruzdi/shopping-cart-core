import mongoose from '@config/database';

export interface IProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: false },
});

export const ProductModel = mongoose.model<IProduct>('Product', productSchema);
