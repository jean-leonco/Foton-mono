import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

import ProductModel from '../ProductModel';

export default mutationWithClientMutationId({
  name: 'DeleteProduct',
  inputFields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async ({ id }, { user }) => {
    if (!user) return { error: 'You should be authenticated' };

    let product;

    try {
      product = await ProductModel.findById(id);
    } catch (error) {
      return { error: 'Product does not exists' };
    }

    if (!product) return { error: 'Product does not exists' };

    await product.remove();

    return { message: 'Product deleted with success' };
  },
  outputFields: {
    message: {
      type: GraphQLString,
      resolve: ({ message }) => message,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
