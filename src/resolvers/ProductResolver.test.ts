import { ProductResolver } from './ProductResolver';
import { ProductModel } from '@models/Product';
import { CreateProductInput, UpdateProductInput } from '@schema/ProductType';
import mongoose from 'mongoose';

jest.mock('@models/Product', () => ({
  ProductModel: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  })),
}));

describe('ProductResolver', () => {
  let resolver: ProductResolver;

  beforeEach(() => {
    resolver = new ProductResolver();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const product = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
      };

      const mockProduct = {
        ...product,
        save: jest.fn().mockResolvedValue(undefined),
        toObject: jest.fn().mockReturnValue({
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          description: product.description,
        }),
      };

      // Mock the constructor and save method
      jest
        .spyOn(ProductModel.prototype, 'constructor')
        .mockImplementationOnce(() => mockProduct);

      ProductModel.prototype.save = jest
        .fn()
        .mockResolvedValueOnce(mockProduct);

      // jest
      //   .spyOn(ProductModel.prototype, 'save')
      //   .mockResolvedValueOnce(mockProduct);

      const input = {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
      };
      const result = await resolver.createProduct(input);

      expect(ProductModel.prototype.constructor).toHaveBeenCalledWith(input);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockProduct._id.toString(),
        name: mockProduct.name,
        price: mockProduct.price,
        description: mockProduct.description,
      });
    });

    // ... other test cases
  });

  // ... tests for other methods in the resolver
});
