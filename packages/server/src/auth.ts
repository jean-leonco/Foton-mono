import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { User } from './model';
import { jwtSecret } from './config';

export async function getUser(encoded: string) {
  if (!encoded) return { user: null };

  const [, , token] = encoded.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, jwtSecret);
    const user = await User.findOne({ _id: decoded.id });

    return {
      user,
    };
  } catch (err) {
    console.log(err);
    return { user: null };
  }
}

type UserType = {
  _id: string;
};

export function generateToken(user: UserType) {
  return `JWT ${jwt.sign({ id: user._id }, jwtSecret)}`;
}
