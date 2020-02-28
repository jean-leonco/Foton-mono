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

describe('DeleteProductMutation', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDbAndRestartCounters);

  afterAll(disconnectMongoose);

  it('should delete product', async () => {
    const { id } = await createProduct();

    const mutation = `
    mutation M(
      $id: ID!
    ) {
      DeleteProductMutation(input: {
        id: $id
      }) {
        message
        error
      }
    }
  `;

    const user = await createUser();

    const rootValue = {};
    const context = await getContext({ user });
    const variables = { id };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.DeleteProductMutation.message).toBe('Product deleted with success');
    expect(data.DeleteProductMutation.error).toBe(null);
  });

  it('should not delete product without authentication', async () => {
    const { id } = await createProduct();

    const mutation = `
    mutation M(
      $id: ID!
    ) {
      DeleteProductMutation(input: {
        id: $id
      }) {
        message
        error
      }
    }
  `;

    const rootValue = {};
    const context = await getContext();
    const variables = { id };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.DeleteProductMutation.message).toBe(null);
    expect(data.DeleteProductMutation.error).toBe('You should be authenticated');
  });

  it('should not delete product with invalid id', async () => {
    const mutation = `
    mutation M(
      $id: ID!
    ) {
      DeleteProductMutation(input: {
        id: $id
      }) {
        message
        error
      }
    }
  `;

    const user = await createUser();

    const rootValue = {};
    const context = await getContext({ user });
    const variables = { id: '151dasdasd' };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.DeleteProductMutation.message).toBe(null);
    expect(data.DeleteProductMutation.error).toBe('Product does not exists');
  });
});
