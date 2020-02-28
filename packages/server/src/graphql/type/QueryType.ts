import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { connectionArgs, fromGlobalId, globalIdField } from 'graphql-relay';

import { NodeField, NodesField } from '../../interface/NodeInterface';

import { UserLoader, ProductLoader } from '../../loader';

import UserType from '../../modules/user/UserType';
import ProductType, { ProductConnection } from '../../modules/product/ProductType';
import { GraphQLContext } from '../../types';

export default new GraphQLObjectType<any, GraphQLContext, any>({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    id: globalIdField('Query'),
    node: NodeField,
    nodes: NodesField,
    me: {
      type: UserType,
      resolve: (obj, args, context) => (context.user ? UserLoader.load(context, context.user._id) : null),
    },

    products: {
      type: GraphQLNonNull(ProductConnection.connectionType),
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: async (_, args, context) => await ProductLoader.LoadProducts(context, args),
    },
    product: {
      type: ProductType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, { id }, context) => await ProductLoader.load(context, fromGlobalId(id).id),
    },
  }),
});
