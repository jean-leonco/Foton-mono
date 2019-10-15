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

describe('DeleteProductMutation', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDbAndRestartCounters);

  afterAll(disconnectMongoose);

  it('should delete product', async () => {
    const { id } = await createRows.createProduct();

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
    const context = getContext({ user: { name: 'user' } });
    const variables = { id };

    const { data } = await graphql(
      schema,
      mutation,
      rootValue,
      context,
      variables
    );

    expect(data.DeleteProductMutation.message).toBe(
      'Product deleted with success'
    );
    expect(data.DeleteProductMutation.error).toBe(null);
  });

  it('should not delete product without authentication', async () => {
    const { id } = await createRows.createProduct();

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
    const context = getContext();
    const variables = { id };

    const { data } = await graphql(
      schema,
      mutation,
      rootValue,
      context,
      variables
    );

    expect(data.DeleteProductMutation.message).toBe(null);
    expect(data.DeleteProductMutation.error).toBe(
      'You should be authenticated'
    );
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

    const rootValue = {};
    const context = getContext({ user: { name: 'user' } });
    const variables = { id: '151dasdasd' };

    const { data } = await graphql(
      schema,
      mutation,
      rootValue,
      context,
      variables
    );

    expect(data.DeleteProductMutation.message).toBe(null);
    expect(data.DeleteProductMutation.error).toBe('Product does not exists');
  });
});
