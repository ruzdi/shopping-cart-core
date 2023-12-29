import { IsNumber, IsString } from 'class-validator';
import { ObjectType, Field, ID, InputType } from 'type-graphql';

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

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNumber()
  price: number;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  // Add other required fields for product creation
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsNumber()
  price?: number;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  // Add other optional fields for product update
}
