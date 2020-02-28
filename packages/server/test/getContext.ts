import { getDataloaders } from '../src/graphql/helper';

import * as graphqlLoaders from '../src/loader';
import { GraphQLContext } from '../src/types';
import { IUser } from '../src/modules/user/UserModel';
import User from '../src/modules/user/UserLoader';

interface ContextVars {
  graphql?: string;
  user?: IUser;
}
export const getContext = async (ctx: ContextVars = {}): Promise<GraphQLContext> => {
  let context = {
    ...ctx,
  };

  const graphql = context.graphql;

  context = {
    ...context,
    graphql,
  };

  const loaders = graphqlLoaders;
  const dataloaders = getDataloaders(loaders);

  if (context.user) {
    const LoaderClass = User;

    context.user = !(context.user instanceof LoaderClass) ? new LoaderClass(context.user, context) : context.user;
  }

  return {
    req: {},
    dataloaders,
    graphql,
    koaContext: {
      request: {
        ip: '::ffff:127.0.0.1',
      },
      cookies: {
        set: jest.fn(),
      },
    },
    ...context,
  };
};
