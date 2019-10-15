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

    const product = await ProductModel.findById(id);

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
