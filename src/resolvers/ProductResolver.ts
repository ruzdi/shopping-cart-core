import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql';
import { IProduct, ProductModel } from '@models/Product';
import {
  CreateProductInput,
  ProductType,
  UpdateProductInput,
} from '@schema/ProductType';

function toProductType(productData: IProduct): ProductType {
  const productType = new ProductType();
  productType.id = productData.id;
  productType.name = productData.name;
  productType.price = productData.price;
  productType.description = productData.description;

  return productType;
}

@Resolver()
export class ProductResolver {
  // CREATE
  @Mutation(() => ProductType)
  async createProduct(
    @Arg('data') data: CreateProductInput
  ): Promise<ProductType> {
    const product = new ProductModel(data);
    await product.save();
    return product.toObject({ getters: true, virtuals: true }); // Convert to JavaScript object
  }

  // READ (All Products)
  @Query(() => [ProductType])
  async products(): Promise<ProductType[]> {
    const products = await ProductModel.find();
    return products.map((product) =>
      product.toObject({ getters: true, virtuals: true })
    );
  }

  // READ (Single Product)
  @Query(() => ProductType, { nullable: true })
  async product(@Arg('id', () => ID) id: string): Promise<ProductType | null> {
    const product = await ProductModel.findById(id);
    return product ? product.toObject({ getters: true, virtuals: true }) : null;
  }

  // UPDATE
  @Mutation(() => ProductType)
  async updateProduct(
    @Arg('id', () => ID) id: string,
    @Arg('data') updateData: UpdateProductInput
  ): Promise<ProductType | null> {
    const product = await ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product) {
      throw new Error('Product not found');
    }
    return toProductType(product);
  }

  // DELETE
  @Mutation(() => Boolean)
  async deleteProduct(@Arg('id', () => ID) id: string): Promise<boolean> {
    await ProductModel.findByIdAndDelete(id);
    return true;
  }

  // SEARCH
  @Query(() => [ProductType])
  async searchProducts(
    @Arg('searchString') searchString: string
  ): Promise<ProductType[]> {
    const products = await ProductModel.find({
      $text: { $search: searchString },
    });
    return products.map((product) =>
      product.toObject({ getters: true, virtuals: true })
    );
  }
}
