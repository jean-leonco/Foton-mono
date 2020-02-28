import { graphql } from 'graphql';

import { schema } from '../../../../graphql/schema';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  getContext,
  createProduct,
  createUser,
} from '../../../../../test/helpers';

describe('UpdateProductMutation', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDbAndRestartCounters);

  afterAll(disconnectMongoose);

  it('should update product', async () => {
    const { id, description, price } = await createProduct();

    const mutation = `
    mutation M(
      $id: ID!
      $name: String!
      $description: String!
      $price: Float!
    ) {
      UpdateProductMutation(input: {
        id: $id
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
    const variables = { id, name: 'a new test', description, price };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.UpdateProductMutation.product.name).toBe('a new test');
    expect(data.UpdateProductMutation.error).toBe(null);
  });

  it('should not update product without authentication', async () => {
    const { id, description, price } = await createProduct();

    const mutation = `
    mutation M(
      $id: ID!
      $name: String!
      $description: String!
      $price: Float!
    ) {
      UpdateProductMutation(input: {
        id: $id
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
    const context = await getContext();
    const variables = { id, name: 'a new test', description, price };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.UpdateProductMutation.product).toBe(null);
    expect(data.UpdateProductMutation.error).toBe('You should be authenticated');
  });

  it('should not update product with an invalid id', async () => {
    const { description, price } = await createProduct();

    const mutation = `
    mutation M(
      $id: ID!
      $name: String!
      $description: String!
      $price: Float!
    ) {
      UpdateProductMutation(input: {
        id: $id
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
    const variables = { id: '1234568', name: 'a new test', description, price };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.UpdateProductMutation.product).toBe(null);
    expect(data.UpdateProductMutation.error).toBe('Product does not exists');
  });
});
