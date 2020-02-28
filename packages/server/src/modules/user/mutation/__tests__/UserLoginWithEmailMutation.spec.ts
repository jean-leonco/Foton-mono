import { graphql } from 'graphql';

import { schema } from '../../../../graphql/schema';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  getContext,
  createUser,
} from '../../../../../test/helpers';

describe('UserLoginWithEmailMutation', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDbAndRestartCounters);

  afterAll(disconnectMongoose);

  it('should not login if email is not in the database', async () => {
    const mutation = `
    mutation M(
      $email: String!
      $password: String!
    ) {
      UserLoginWithEmail(input: {
        email: $email
        password: $password
      }) {
        clientMutationId
        token
        error
      }
    }
  `;

    const rootValue = {};
    const context = await getContext();
    const variables = {
      email: 'awesome@example.com',
      password: 'awesome',
    };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.UserLoginWithEmail.token).toBe(null);
    expect(data.UserLoginWithEmail.error).toBe('Invalid credentials');
  });

  it('should not login with wrong password', async () => {
    const user = await createUser();

    const mutation = `
    mutation M(
      $email: String!
      $password: String!
    ) {
      UserLoginWithEmail(input: {
        email: $email
        password: $password
      }) {
        clientMutationId
        token
        error
      }
    }
  `;

    const rootValue = {};
    const context = await getContext();
    const variables = {
      email: user.email,
      password: 'awesome',
    };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.UserLoginWithEmail.token).toBe(null);
    expect(data.UserLoginWithEmail.error).toBe('Invalid credentials');
  });

  it('should generate token when email and password is correct', async () => {
    const password = 'awesome';
    const user = await createUser({ password });

    const mutation = `
    mutation M(
      $email: String!
      $password: String!
    ) {
      UserLoginWithEmail(input: {
        email: $email
        password: $password
      }) {
        clientMutationId
        token
        error
      }
    }
  `;

    const rootValue = {};
    const context = await getContext();
    const variables = {
      email: user.email,
      password: 'awesome',
    };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    if (data) {
      expect(data.UserLoginWithEmail.token).not.toBe(null);
      expect(data.UserLoginWithEmail.error).toBe(null);
    }
  });
});
