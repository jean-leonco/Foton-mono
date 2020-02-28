import { graphql } from 'graphql';

import { schema } from '../../../../graphql/schema';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  getContext,
  createUser,
} from '../../../../../test/helpers';
import UserModel from '../../UserModel';

describe('UserRegisterWithEmailMutation', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDbAndRestartCounters);

  afterAll(disconnectMongoose);

  it('should not register with an existing email', async () => {
    const user = await createUser();

    const mutation = `
    mutation M(
      $name: String!
      $email: String!
      $password: String!
    ) {
      UserRegisterWithEmail(input: {
        name: $name
        email: $email
        password: $password
      }) {
        token
        error
      }     
    }
  `;

    const rootValue = {};
    const context = await getContext();
    const variables = {
      name: 'Test',
      email: user.email,
      password: '123',
    };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.UserRegisterWithEmail.token).toBe(null);
    expect(data.UserRegisterWithEmail.error).toBe('Email already in use');
  });

  it('should create a new user when parameters are valid', async () => {
    const email = 'awesome@example.com';

    const mutation = `
    mutation M(
      $name: String!
      $email: String!
      $password: String!
    ) {
      UserRegisterWithEmail(input: {
        name: $name
        email: $email
        password: $password
      }) {
        token
        error
      }
    }
  `;

    const rootValue = {};
    const context = await getContext();
    const variables = {
      name: 'Test',
      email,
      password: '123',
    };

    const { data } = await graphql(schema, mutation, rootValue, context, variables);

    expect(data.UserRegisterWithEmail.token).not.toBe(null);
    expect(data.UserRegisterWithEmail.error).toBe(null);

    const user = await UserModel.findOne({
      email,
    });

    expect(user).not.toBe(null);
  });
});
