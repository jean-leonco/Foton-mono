import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

const ProductType = registerType(
  new GraphQLObjectType({
    name: 'ProductType',
    description: 'Product data',
    fields: {
      id: globalIdField('Product'),
      _id: {
        type: GraphQLID,
        resolve: product => product.id,
      },
      name: {
        type: GraphQLString,
        resolve: product => product.name,
      },
      description: {
        type: GraphQLString,
        resolve: product => product.description,
      },
      price: {
        type: GraphQLFloat,
        resolve: product => product.price,
      },
    },
    interfaces: () => [nodeInterface],
  })
);

export default ProductType;

export const ProductConnection = connectionDefinitions({
  name: 'Product',
  // @ts-ignore
  nodeType: GraphQLNonNull(ProductType),
});
