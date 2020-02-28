import { fromGlobalId } from 'graphql-relay';

import User, * as UserLoader from '../modules/user/UserLoader';
import UserType from '../modules/user/UserType';

import Product, * as ProductLoader from '../modules/product/ProductLoader';
import ProductType from '../modules/product/ProductType';

import { GraphQLContext } from '../types';

import { nodeDefinitions } from './node';
const { nodeField, nodesField, nodeInterface } = nodeDefinitions(
  // A method that maps from a global id to an object
  async (globalId, context: GraphQLContext) => {
    const { id, type } = fromGlobalId(globalId);

    switch (type) {
      case 'Product':
        return ProductLoader.load(context, id);

      case 'User':
        return UserLoader.load(context, id);

      default:
        // it should not get here
        return null;
    }
  },

  // A method that maps from an object to a type
  obj => {
    if (obj instanceof Product) {
      return ProductType;
    } else if (obj instanceof User) {
      return UserType;
    }
    // it should not get here
    return null;
  },
);

export const NodeInterface = nodeInterface;
export const NodeField = nodeField;
export const NodesField = nodesField;
