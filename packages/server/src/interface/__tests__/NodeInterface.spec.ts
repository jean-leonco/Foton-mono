import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { schema } from '../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createRows,
  //@ts-ignore
} from '../../../test/helper';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('Node interface', () => {
  it('should load User', async () => {
    const user = await createRows.createUser();

    const query = `
    query Q($id: ID!) {
      node(id: $id) {
        id
        ... on User {
          name
        }
      }
    }
    `;

    const rootValue = {};
    const context = getContext();
    const variables = {
      id: toGlobalId('User', user.id),
    };

    const { data } = await graphql(
      schema,
      query,
      rootValue,
      context,
      variables
    );

    expect(data.node.id).toBe(variables.id);
    expect(data.node.name).toBe(user.name);
  });

  it('should load Product', async () => {
    const product = await createRows.createProduct();

    const query = `
    query Q($id: ID!) {
      node(id: $id) {
        id
        ... on Product {
          name
        }
      }
    }
    `;

    const rootValue = {};
    const context = getContext({ user: { name: 'user' } });
    const variables = {
      id: toGlobalId('Product', product.id),
    };

    const { data } = await graphql(
      schema,
      query,
      rootValue,
      context,
      variables
    );

    expect(data.node.id).toBe(variables.id);
    expect(data.node.name).toBe(product.name);
  });

  it('should not load Product without authentication', async () => {
    const product = await createRows.createProduct();

    const query = `
    query Q($id: ID!) {
      node(id: $id) {
        id
        ... on Product {
          name
        }
      }
    }
    `;

    const rootValue = {};
    const context = getContext();
    const variables = {
      id: toGlobalId('Product', product.id),
    };

    const { data } = await graphql(
      schema,
      query,
      rootValue,
      context,
      variables
    );

    expect(data.node).toBe(null);
  });
});
