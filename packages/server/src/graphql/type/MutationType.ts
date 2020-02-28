import { GraphQLObjectType } from 'graphql';

import UserMutations from '../../modules/user/mutation';
import ProductMutation from '../../modules/product/mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...ProductMutation,
  }),
});
