import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import { connectionArgs, fromGlobalId } from 'graphql-relay';

import UserType from '../modules/user/UserType';
import { nodeField } from '../interface/NodeInterface';
import { UserLoader, ProductLoader } from '../loader';
import ProductType, { ProductConnection } from '../modules/product/ProductType';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    me: {
      type: UserType,
      resolve: (obj, args, context) =>
        context.user ? UserLoader.load(context, context.user._id) : null,
    },
    products: {
      type: ProductConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: async (obj, args, context) =>
        ProductLoader.loadProducts(context, args),
    },
    product: {
      type: ProductType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return ProductLoader.load(context, id);
      },
    },
  }),
});
