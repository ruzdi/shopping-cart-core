import { IUser } from '@/models/User';
import { toUserType } from '@/resolvers/UserResolver';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getHashedPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  inputPasword: string,
  storedPassword: string
) => {
  return await bcrypt.compare(inputPasword, storedPassword);
};

export function generateToken(user: IUser): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not defined');
  }

  return jwt.sign(toUserType(user), process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}
