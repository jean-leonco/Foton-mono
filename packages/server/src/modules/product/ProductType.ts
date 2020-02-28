import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLObjectTypeConfig,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../graphql/connection/CustomConnectionType';

import { NodeInterface } from '../../interface/NodeInterface';

import { GraphQLContext } from '../../types';

import Product from './ProductLoader';

type ConfigType = GraphQLObjectTypeConfig<Product, GraphQLContext>;

const ProductTypeConfig: ConfigType = {
  name: 'Product',
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
    createdAt: {
      type: GraphQLString,
      resolve: product => product.createdAt,
    },
  },
  interfaces: () => [NodeInterface],
};

const ProductType = new GraphQLObjectType(ProductTypeConfig);

export const ProductConnection = connectionDefinitions({
  name: 'Product',
  nodeType: GraphQLNonNull(ProductType),
});

export default ProductType;
