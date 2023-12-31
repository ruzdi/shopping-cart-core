import { ProductResolver } from './ProductResolver';
import { ProductModel } from '@models/Product';
import { CreateProductInput, UpdateProductInput } from '@schema/ProductType';
import mongoose from 'mongoose';

jest.mock('@models/Product', () => ({
  ProductModel: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  })),
}));

describe('ProductResolver', () => {
  let resolver: ProductResolver;

  beforeEach(() => {
    resolver = new ProductResolver();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      // Arrange
      const createInput = {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
      };

      const expectedProduct = {
        id: new mongoose.Types.ObjectId(),
        ...createInput,
      };

      const mockProductInstance = {
        ...expectedProduct,
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue(expectedProduct),
      };

      jest
        .spyOn(ProductModel.prototype, 'constructor')
        .mockImplementationOnce(() => mockProductInstance);
      ProductModel.prototype.save = jest
        .fn()
        .mockResolvedValueOnce(mockProductInstance);

      // Act
      const result = await resolver.createProduct(createInput);

      // Assert
      expect(ProductModel.prototype.constructor).toHaveBeenCalledWith(
        createInput
      );
      expect(mockProductInstance.save).toHaveBeenCalled();
      expect(result).toEqual(expectedProduct);
    });

    it('throws an error when creating a product fails', async () => {
      const input = {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
      };

      // Mock the ProductModel instance
      const mockProductInstance = {
        save: jest.fn().mockRejectedValue(new Error('Save failed')),
        toObject: jest.fn(),
      };

      jest
        .spyOn(ProductModel.prototype, 'constructor')
        .mockImplementation(() => mockProductInstance);

      await expect(resolver.createProduct(input)).rejects.toThrow(
        'Save failed'
      );
    });
  });

  describe('updateProduct', () => {
    it('should updates a product successfully', async () => {
      // Arrange
      const productId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Product',
        price: 20,
        description: 'Updated Description',
      };

      const expectedUpdatedProduct = {
        id: productId,
        ...updateData,
        toObject: () => ({
          id: productId,
          ...updateData,
        }),
      };

      ProductModel.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValueOnce(expectedUpdatedProduct);

      // Act
      const result = await resolver.updateProduct(productId, updateData);

      // Assert
      expect(ProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        productId,
        updateData,
        {
          new: true,
        }
      );
      expect(result).toEqual({
        id: productId,
        ...updateData,
      });
    });

    it('throws an error when the product to update is not found', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Product',
        price: 20,
        description: 'Updated Description',
      };
      ProductModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(
        resolver.updateProduct(productId, updateData)
      ).rejects.toThrow('Product not found');
    });

    it('throws an error when updating a product fails', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Product',
        price: 20,
        description: 'Updated Description',
      };
      ProductModel.findByIdAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error('Update failed'));

      await expect(
        resolver.updateProduct(productId, updateData)
      ).rejects.toThrow('Update failed');
    });
  });

  describe('findAllProducts', () => {
    it('should find all products successfully', async () => {
      // Arrange
      const productData = {
        id: new mongoose.Types.ObjectId().toString(),
        name: 'Product',
        price: 20,
        description: 'Description',
      };

      const mockProduct = {
        ...productData,
        toObject: () => ({
          ...productData,
        }),
      };

      const mockProducts = [mockProduct];

      ProductModel.find = jest.fn().mockResolvedValue(mockProducts);

      // Act
      const result = await resolver.products();

      // Assert
      expect(ProductModel.find).toHaveBeenCalledWith();
      expect(result).toEqual([productData]);
    });

    it('throws an error when fetching all products fails', async () => {
      ProductModel.find = jest.fn().mockRejectedValue(new Error('Find failed'));

      await expect(resolver.products()).rejects.toThrow('Find failed');
    });
  });

  describe('findOneProduct', () => {
    it('should find one product successfully', async () => {
      // Arrange
      const productId = new mongoose.Types.ObjectId().toString();
      const productData = {
        id: productId,
        name: 'Product',
        price: 20,
        description: 'Description',
      };

      const mockProduct = {
        ...productData,
        toObject: () => ({
          ...productData,
        }),
      };

      ProductModel.findById = jest.fn().mockResolvedValue(mockProduct);

      // Act
      const result = await resolver.product(productId);

      // Assert
      expect(ProductModel.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(productData);
    });

    it('returns null when a single product is not found', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      ProductModel.findById = jest.fn().mockResolvedValue(null);

      const result = await resolver.product(productId);
      expect(result).toBeNull();
    });
  });

  describe('deleteProduct', () => {
    it('should delete one product successfully', async () => {
      // Arrange
      const productId = new mongoose.Types.ObjectId().toString();

      ProductModel.findByIdAndDelete = jest.fn();

      // Act
      const result = await resolver.deleteProduct(productId);

      // Assert
      expect(ProductModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
    });

    it('throws an error when deleting a product fails', async () => {
      const productId = new mongoose.Types.ObjectId().toString();
      ProductModel.findByIdAndDelete = jest
        .fn()
        .mockRejectedValue(new Error('Delete failed'));

      await expect(resolver.deleteProduct(productId)).rejects.toThrow(
        'Delete failed'
      );
    });
  });

  describe('searchProduct', () => {
    it('searches products successfully', async () => {
      const searchString = 'test';

      const mockProducts = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Test Product 1',
          price: 100,
          description: 'Description 1',
          toObject() {
            return {
              ...this,
            };
          },
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Test Product 2',
          price: 200,
          description: 'Description 2',
          toObject() {
            return {
              id: this._id.toString(),
              ...this,
            };
          },
        },
      ];

      ProductModel.find = jest.fn().mockResolvedValue(mockProducts);

      // Act
      const result = await resolver.searchProducts(searchString);

      // Assert
      expect(ProductModel.find).toHaveBeenCalledWith({
        $text: { $search: searchString },
      });
      expect(result).toEqual(mockProducts.map((product) => product.toObject()));
    });

    it('throws an error when searching for products fails', async () => {
      const searchString = 'test';
      ProductModel.find = jest
        .fn()
        .mockRejectedValue(new Error('Search failed'));

      await expect(resolver.searchProducts(searchString)).rejects.toThrow(
        'Search failed'
      );
    });
  });
});
