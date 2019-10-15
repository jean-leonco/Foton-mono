import { GraphQLString, GraphQLFloat, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import ProductModel from '../ProductModel';
import * as ProductLoader from '../ProductLoader';
import ProductType from '../ProductType';

export default mutationWithClientMutationId({
  name: 'CreateProduct',
  inputFields: {
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLNonNull(GraphQLString),
    },
    price: {
      type: GraphQLNonNull(GraphQLFloat),
    },
  },
  mutateAndGetPayload: async ({ name, description, price }, { user }) => {
    if (!user) return { error: 'You should be authenticated' };

    const { id } = await ProductModel.create({ name, description, price });

    return { id };
  },
  outputFields: {
    product: {
      type: ProductType,
      resolve: async ({ id }, args, context) => ProductLoader.load(context, id),
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
