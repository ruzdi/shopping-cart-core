import mongoose from '@config/database';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: false },
});

export const ProductModel = mongoose.model('Product', productSchema);
