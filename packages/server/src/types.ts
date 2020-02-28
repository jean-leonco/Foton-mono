import Dataloader from 'dataloader';
import { Types } from 'mongoose';
import { Context } from 'koa';

import { IUser } from './modules/user/UserModel';
import { IProduct } from './modules/product/ProductModel';

export type DataLoaderKey = Types.ObjectId | string | undefined | null;

export interface GraphQLDataloaders {
  UserLoader: Dataloader<DataLoaderKey, IUser>;
  ProductLoader: Dataloader<DataLoaderKey, IProduct>;
}

export interface GraphQLContext {
  dataloaders: GraphQLDataloaders;
  appplatform: string;
  koaContext: Context;
  user?: IUser;
}
