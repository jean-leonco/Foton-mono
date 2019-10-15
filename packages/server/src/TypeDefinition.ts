import Dataloader from 'dataloader';

import { IUser } from './modules/user/UserModel';
import { IProduct } from './modules/product/ProductModel';

type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>;
  ProductLoader: Dataloader<Key, IProduct>;
};

export type GraphQLContext = {
  user?: IUser;
  dataloaders: Dataloaders;
};
