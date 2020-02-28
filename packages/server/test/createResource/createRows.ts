import { User, Product } from '../../src/models';
import { IUser } from '../../src/modules/user/UserModel';
import { IProduct } from '../../src/modules/product/ProductModel';

export const createUser = async (payload: Partial<IUser> = {}) => {
  const n = (global.__COUNTERS__.user += 1);

  return new User({
    name: `Normal user ${n}`,
    email: `user-${n}@example.com`,
    password: '123456',
    active: true,
    ...payload,
  }).save();
};

export const createProduct = async (payload: Partial<IProduct> = {}) => {
  const n = (global.__COUNTERS__.product += 1);

  return new Product({
    name: `New product ${n}`,
    description: `a new ${n} product`,
    price: Number(`${n}${n}.${n}`),
    ...payload,
  }).save();
};
