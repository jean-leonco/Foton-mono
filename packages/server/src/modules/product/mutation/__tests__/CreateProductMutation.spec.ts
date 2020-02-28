import { graphql } from 'graphql';

import { schema } from '../../../../graphql/schema';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  getContext,
  createUser,
} from '../../../../../test/helpers';

describe('CreateProductMutation', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDbAndRestartCounters);

  afterAll(disconnectMongoose);

  it('should create product', async () => {
    const mutation = `
    mutation M(
      $name: String!
      $description: String!
      $price: Float!
    ) {
      CreateProductMutation(input: {
        name: $name
        description: $description
        price: $price
      }) {
        product {
          _id
          name
        }
        error
      }
    }
  `;

    const user = await createUser();

    const rootValue = {};
    const context = await getContext({ user });
    const variables = {
      name: 'product',
      description: 'a new product',
      price: 12.5,
    };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.CreateProductMutation.product).not.toBe(null);
    expect(data.CreateProductMutation.error).toBe(null);
  });

  it('should not create product without authentication', async () => {
    const mutation = `
    mutation M(
      $name: String!
      $description: String!
      $price: Float!
    ) {
      CreateProductMutation(input: {
        name: $name
        description: $description
        price: $price
      }) {
        product {
          _id
          name
        }
        error
      }
    }
  `;

    const rootValue = {};
    const context = getContext();
    const variables = {
      name: 'product',
      description: 'a new product',
      price: 12.5,
    };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.CreateProductMutation.product).toBe(null);
    expect(data.CreateProductMutation.error).toBe('You should be authenticated');
  });
});
