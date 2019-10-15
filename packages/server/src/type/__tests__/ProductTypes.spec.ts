import { graphql } from 'graphql';

import { schema } from '../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createRows,
  //@ts-ignore
} from '../../../test/helper';
import { toGlobalId } from 'graphql-relay';

describe('SingleProduct', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDbAndRestartCounters);

  afterAll(disconnectMongoose);

  it('should return a product', async () => {
    const { id } = await createRows.createProduct();

    const query = `
    query Q($id: ID!) {
      product(id: $id) {
        name
        description
        price
      }
    }
  `;

    const rootValue = {};
    const variables = {
      id: toGlobalId('Product', id),
    };
    const context = getContext({ user: { name: 'user' } });

    const { data } = await graphql(
      schema,
      query,
      rootValue,
      context,
      variables
    );

    if (data) {
      expect(data.product).not.toBe(null);
    }
  });

  it('shoudl not return any product without authentication', async () => {
    const { id } = await createRows.createProduct();

    const query = `
    query Q($id: ID!) {
      product(id: $id) {
        name
        description
        price
      }
    }
  `;

    const rootValue = {};
    const variables = {
      id: toGlobalId('Product', id),
    };
    const context = getContext();

    const { data } = await graphql(
      schema,
      query,
      rootValue,
      context,
      variables
    );

    if (data) {
      expect(data.product).toBe(null);
    }
  });

  it('should not return product with invalid id', async () => {
    await createRows.createProduct();

    const query = `
    query Q($id: ID!) {
      product(id: $id) {
        name
        description
        price
      }
    }
  `;

    const rootValue = {};
    const variables = { id: '123456' };
    const context = getContext();

    const { data } = await graphql(
      schema,
      query,
      rootValue,
      context,
      variables
    );

    if (data) {
      expect(data.product).toBe(null);
    }
  });
});
