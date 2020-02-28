import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import DataLoader from 'dataloader';
import { ConnectionArguments } from 'graphql-relay';
import { Types } from 'mongoose';

import { DataLoaderKey, GraphQLContext } from '../../types';

import { escapeRegex } from '../../common/utils';

import ProductModel, { IProduct } from './ProductModel';

export default class Product {
  id: string;
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  createdAt: string;

  constructor(data: IProduct) {
    this.id = data._id;
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.createdAt = new Date(data.createdAt).toISOString();
  }
}
const viewerCanSee = () => true;

export const getLoader = () => new DataLoader<DataLoaderKey, IProduct>(ids => mongooseLoader(ProductModel, ids as any));

export const load = async (context: GraphQLContext, id: DataLoaderKey) => {
  if (!id) {
    return null;
  }

  try {
    const data = await context.dataloaders.ProductLoader.load(id);

    if (!data) {
      return null;
    }

    return viewerCanSee() ? new Product(data) : null;
  } catch (err) {
    return null;
  }
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.ProductLoader.clear(id.toString());

export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: IProduct) =>
  dataloaders.ProductLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: IProduct) =>
  clearCache(context, id) && primeCache(context, id, data);

interface LoadProductArgs extends ConnectionArguments {
  search?: string;
}

export const LoadProducts = async (context: GraphQLContext, args: LoadProductArgs) => {
  const conditions: any = {};

  if (args.search) {
    const searchRegex = new RegExp(`${escapeRegex(args.search)}`, 'ig');
    conditions.$or = [{ title: { $regex: searchRegex } }, { description: { $regex: searchRegex } }];
  }

  return connectionFromMongoCursor({
    cursor: ProductModel.find(conditions).sort({ date: 1 }),
    context,
    args,
    loader: load,
  });
};
