import { graphql } from 'graphql';

import { schema } from '../../../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createRows,
  //@ts-ignore
} from '../../../../../test/helper';

describe('UpdateProductMutation', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDbAndRestartCounters);

  afterAll(disconnectMongoose);

  it('should update product', async () => {
    const { id, description, price } = await createRows.createProduct();

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
    const context = getContext({ user: { name: 'user' } });
    const variables = { id, name: 'a new test', description, price };

    const { data } = await graphql(
      schema,
      mutation,
      rootValue,
      context,
      variables
    );

    expect(data.UpdateProductMutation.product.name).toBe('a new test');
    expect(data.UpdateProductMutation.error).toBe(null);
  });

  it('should not update product without authentication', async () => {
    const { id, description, price } = await createRows.createProduct();

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
    const context = getContext();
    const variables = { id, name: 'a new test', description, price };

    const { data } = await graphql(
      schema,
      mutation,
      rootValue,
      context,
      variables
    );

    expect(data.UpdateProductMutation.product).toBe(null);
    expect(data.UpdateProductMutation.error).toBe(
      'You should be authenticated'
    );
  });

  it('should not update product with an invalid id', async () => {
    const { description, price } = await createRows.createProduct();

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
    const context = getContext({ user: { name: 'user' } });
    const variables = { id: '1234568', name: 'a new test', description, price };

    const { data } = await graphql(
      schema,
      mutation,
      rootValue,
      context,
      variables
    );

    expect(data.UpdateProductMutation.product).toBe(null);
    expect(data.UpdateProductMutation.error).toBe('Product does not exists');
  });
});
