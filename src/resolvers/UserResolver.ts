import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User, { IUser } from '@models/User';
import {
  RegisterInput,
  LoginInput,
  UserType,
  UpdateUserInput,
} from '@schema/UserType';
import { log } from '@/utils/logger/log';
import { Token } from 'graphql';
import { TokenType } from '@/types/Types';

function generateToken(user: IUser): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not defined');
  }

  return jwt.sign(toUserType(user), process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

function toUserType(user: IUser): UserType {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    state: user.state,
    zipcode: user.zipcode,
    createdBy: user?.createdBy,
    updatedBy: user?.updatedBy,
  };
}

@Resolver()
export class UserResolver {
  // Existing registration and login mutations

  @Query(() => [UserType])
  async users(): Promise<UserType[]> {
    return await User.find();
  }

  @Query(() => UserType, { nullable: true })
  async user(@Arg('id', () => ID) id: string): Promise<UserType | null> {
    return await User.findById(id);
  }

  @Mutation(() => UserType)
  async createUser(@Arg('data') userData: RegisterInput): Promise<UserType> {
    log.debug('Creating user' + JSON.stringify(userData));

    const newUser = new User(userData);
    await newUser.save();
    const token = generateToken(newUser);
    const userType = toUserType(newUser);
    userType.token = token;
    return userType;
  }

  @Mutation(() => UserType, { nullable: true })
  async updateUser(
    @Arg('id', () => ID) id: string,
    @Arg('data') updateData: UpdateUserInput
  ): Promise<UserType | null> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      throw new Error('User not found');
    }
    return toUserType(user);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => ID) id: string): Promise<boolean> {
    const user = await User.findByIdAndDelete(id);
    return !!user;
  }

  @Mutation(() => UserType)
  async register(@Arg('data') registerData: RegisterInput): Promise<UserType> {
    const newUser = new User(registerData);
    await newUser.save();
    const token = generateToken(newUser);
    const userType = toUserType(newUser);
    userType.token = token;
    return userType;
  }

  @Mutation(() => UserType)
  async login(@Arg('data') loginData: LoginInput): Promise<TokenType> {
    const user = await User.findOne({ email: loginData.email }).select(
      '+password'
    );

    console.log('login >>> ', user);

    if (!user) {
      throw new Error('User not found');
    }

    const valid = await bcrypt.compare(loginData.password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user);
    return { token };
  }
}
