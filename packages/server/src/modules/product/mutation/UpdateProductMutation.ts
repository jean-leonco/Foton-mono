import { mutationWithClientMutationId } from 'graphql-relay';
import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
} from 'graphql';

import ProductModel from '../ProductModel';
import * as ProductLoader from '../ProductLoader';
import ProductType from '../ProductType';

export default mutationWithClientMutationId({
  name: 'UpdateProduct',
  inputFields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
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
  mutateAndGetPayload: async ({ id, name, description, price }, { user }) => {
    if (!user) return { error: 'You should be authenticated' };

    const product = await ProductModel.findById(id);

    if (!product) return { error: 'Product does not exists' };

    product.name = name;
    product.description = description;
    product.price = price;

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
