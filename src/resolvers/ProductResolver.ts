import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql';
import { ProductModel } from '@models/Product';
import { ProductType } from '@schema/ProductType';

@Resolver()
export class ProductResolver {
  // CREATE
  @Mutation(() => ProductType)
  async createProduct(
    @Arg('name') name: string,
    @Arg('price') price: number,
    @Arg('description', { nullable: true }) description: string,
  ): Promise<ProductType> {
    const product = new ProductModel({ name, price, description });
    await product.save();
    return product.toObject({ getters: true, virtuals: true }); // Convert to JavaScript object
  }

  // READ (All Products)
  @Query(() => [ProductType])
  async products(): Promise<ProductType[]> {
    const products = await ProductModel.find();
    return products.map(product => product.toObject({ getters: true, virtuals: true }));
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
    @Arg('name', { nullable: true }) name: string,
    @Arg('price', { nullable: true }) price: number,
    @Arg('description', { nullable: true }) description: string,
  ): Promise<ProductType | null> {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true },
    );
    return product ? product.toObject({ getters: true, virtuals: true }) : null;
  }

  // DELETE
  @Mutation(() => Boolean)
  async deleteProduct(@Arg('id', () => ID) id: string): Promise<boolean> {
    await ProductModel.findByIdAndDelete(id);
    return true;
  }

  // SEARCH
  @Query(() => [ProductType])
  async searchProducts(@Arg('searchString') searchString: string): Promise<ProductType[]> {
    const products = await ProductModel.find({
      $text: { $search: searchString }
    });
    return products.map(product => product.toObject({ getters: true, virtuals: true }));
  }
}