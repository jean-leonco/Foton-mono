import { promisify } from 'util';

import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';

import UserModel from '../modules/user/UserModel';

import { APP_KEY } from './config';

export const authConfig = {
  secret: APP_KEY,
  expiresIn: '10d',
};

export default async (authHeader: string) => {
  if (!authHeader) return { user: null };

  const [, , token] = authHeader.split(' ');
  try {
    const decoded: any = await promisify(jwt.verify)(token, authConfig.secret!);

    const user = await UserModel.findOne({ _id: decoded.id });
    return { user };
  } catch (error) {
    return { user: null };
  }
};

type UserType = {
  _id: string;
};

export function generateToken(user: UserType) {
  return `Bearer JWT ${jwt.sign({ id: user._id }, authConfig.secret!)}`;
}
