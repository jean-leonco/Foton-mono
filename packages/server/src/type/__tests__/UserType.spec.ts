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

describe('UserType', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDbAndRestartCounters);

  afterAll(disconnectMongoose);

  it('should return the current user when user is logged in', async () => {
    const user = await createRows.createUser();

    const query = `
    query Q {
      me {
        id
        name
        email
      }
    }
  `;

    const rootValue = {};
    const context = getContext({ user });

    const result = await graphql(schema, query, rootValue, context);
    const { data } = result;

    expect(data.me.name).toBe(user.name);
    expect(data.me.email).toBe(user.email);
  });
});
