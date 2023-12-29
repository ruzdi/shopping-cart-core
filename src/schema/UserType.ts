import { ObjectType, Field, ID, InputType } from 'type-graphql';
import { IsEmail, IsString, Length, IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: ObjectId;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  middleName?: string;

  @Field()
  lastName: string;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field({ nullable: true })
  state?: string;

  @Field()
  zipcode: string;

  @Field(() => ID, { nullable: true })
  createdBy?: ObjectId;

  @Field(() => ID, { nullable: true })
  updatedBy?: ObjectId;

  @Field({ nullable: true })
  token?: string;
}

@InputType()
export class UserInput {
  @Field()
  @IsString()
  firstName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  middleName?: string;

  @Field()
  @IsString()
  lastName: string;

  @Field()
  @IsString()
  address: string;

  @Field()
  @IsString()
  city: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  state?: string;

  @Field()
  @IsString()
  zipcode: string;
}

@InputType()
export class RegisterInput extends UserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(6, 20)
  password: string;
}

export type Optionalize<T extends Record<string, any>> = {
  [P in keyof T]?: T[P];
};

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(6, 20)
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  middleName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  state?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  zipcode?: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(6, 20)
  password: string;
}
