import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader,
} from '@entria/graphql-mongoose-loader';
import { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';
import mongoose from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;

import ProductModel, { IProduct } from './ProductModel';

import { GraphQLContext } from '../../TypeDefinition';

export default class Product {
  id: string;

  _id: Types.ObjectId;

  name: string;

  description: string;

  price: number;

  constructor(data: IProduct) {
    this.id = data._id;
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
  }
}

export const getLoader = () =>
  new DataLoader((ids: ReadonlyArray<string>) =>
    mongooseLoader(ProductModel, ids)
  );

const viewerCanSee = (context: GraphQLContext) => !!context.user;

export const load = async (
  context: GraphQLContext,
  id: string | Object | ObjectId
): Promise<Product | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.ProductLoader.load(id as string);
  } catch (err) {
    return null;
  }

  return viewerCanSee(context) ? new Product(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId
) => dataloaders.ProductLoader.clear(id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId,
  data: IProduct
) => dataloaders.ProductLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: IProduct
) => clearCache(context, id) && primeCache(context, id, data);

type ProductArgs = ConnectionArguments & {
  search?: string;
};

export const loadProducts = async (
  context: GraphQLContext,
  args: ProductArgs
) => {
  if (!context.user) {
    return [];
  }

  const where = args.search
    ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const products = ProductModel.find(where, { _id: 1 }).sort({
    createdAt: -1,
  });

  return connectionFromMongoCursor({
    cursor: products,
    context,
    args,
    loader: load,
  });
};
