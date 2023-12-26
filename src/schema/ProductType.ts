import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class ProductType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  description?: string;

  // Add other fields corresponding to your model
}
