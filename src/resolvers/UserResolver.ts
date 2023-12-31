import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql';

import { UserModel, IUser } from '@models/User';
import {
  RegisterInput,
  LoginInput,
  UserType,
  UpdateUserInput,
} from '@schema/UserType';
import { log } from '@utils/logger/log';
import {
  comparePassword,
  generateToken,
  getHashedPassword,
} from '@utils/security';

import { Token } from 'graphql';
import { TokenType } from '@/types/Types';

export function toUserType(user: IUser): UserType {
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
    return (await UserModel.find()).map(toUserType);
  }

  @Query(() => UserType, { nullable: true })
  async user(@Arg('id', () => ID) id: string): Promise<UserType | null> {
    const result = await UserModel.findById(id);
    return result ? toUserType(result as IUser) : null;
  }

  @Mutation(() => UserType)
  async createUser(@Arg('data') userData: RegisterInput): Promise<UserType> {
    log.debug('Creating user' + JSON.stringify(userData));

    const newUser = new UserModel(userData);
    await newUser.save();
    return toUserType(newUser);
  }

  @Mutation(() => UserType, { nullable: true })
  async updateUser(
    @Arg('id', () => ID) id: string,
    @Arg('data') updateData: UpdateUserInput
  ): Promise<UserType | null> {
    // TODO: Add authorization and change password will be a different graphql request
    if (updateData.password) {
      updateData.password = await getHashedPassword(updateData.password);
    }
    const user = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!user) {
      throw new Error('User not found');
    }
    return toUserType(user);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => ID) id: string): Promise<boolean> {
    const user = await UserModel.findByIdAndDelete(id);
    return !!user;
  }

  @Mutation(() => UserType)
  async register(@Arg('data') registerData: RegisterInput): Promise<UserType> {
    const newUser = new UserModel(registerData);
    await newUser.save();
    const token = generateToken(newUser);
    const userType = toUserType(newUser);
    userType.token = token;
    return userType;
  }

  @Mutation(() => UserType)
  async login(@Arg('data') loginData: LoginInput): Promise<TokenType> {
    const user = await UserModel.findOne({ email: loginData.email }).select(
      '+password'
    );

    if (!user) {
      throw new Error('User not found');
    }

    const valid = await comparePassword(loginData.password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user);
    return { token };
  }
}
