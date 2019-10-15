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

describe('AllProducts', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDbAndRestartCounters);

  afterAll(disconnectMongoose);

  it('should return all products', async () => {
    await createRows.createProduct();
    await createRows.createProduct();

    const query = `
    query Q {
      products {
        edges {
          node {
            id
            name
          }
        }
        pageInfo {
          hasNextPage,
          endCursor
        }
      }
    }
  `;

    const rootValue = {};
    const context = getContext({ user: { name: 'user' } });

    const result = await graphql(schema, query, rootValue, context);
    const { data } = result;

    if (data) {
      expect(data.products.edges).not.toBe(null);
    }
  });

  it('should not return any product without authentication', async () => {
    await createRows.createProduct();
    await createRows.createProduct();

    const query = `
    query Q {
      products {
        edges {
          node {
            id
            name
          }
        }
        pageInfo {
          hasNextPage,
          endCursor
        }
      }
    }
  `;

    const rootValue = {};
    const context = getContext();

    const result = await graphql(schema, query, rootValue, context);
    const { data } = result;

    if (data) {
      expect(data.products).toBe(null);
    }
  });
});
