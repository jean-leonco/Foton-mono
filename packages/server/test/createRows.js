// @flow
/* eslint-disable no-multi-assign,prefer-const */

import { User, Product } from '../src/model';

export const restartCounters = () => {
  global.__COUNTERS__ = Object.keys(global.__COUNTERS__).reduce(
    (prev, curr) => ({ ...prev, [curr]: 0 }),
    {},
  );
};

export const createUser = async (payload: Object = {}) => {
  const n = (global.__COUNTERS__.user += 1);

  return new User({
    name: `Normal user ${n}`,
    email: `user-${n}@example.com`,
    password: '123456',
    active: true,
    ...payload,
  }).save();
};

export const createProduct = async (payload: Object = {}) => {
  const n = (global.__COUNTERS__.product += 1);

  return new Product({
    name: `New product ${n}`,
    description: `a new ${n} product`,
    price: Number(`${n}${n}.${n}`),
    ...payload,
  }).save();
};
