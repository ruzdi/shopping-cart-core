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

  it('should delete one product successfully', async () => {
    // Arrange
    const productId = new mongoose.Types.ObjectId().toString();

    ProductModel.findByIdAndDelete = jest.fn();

    // Act
    const result = await resolver.deleteProduct(productId);

    // Assert
    expect(ProductModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
  });

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
});
