import signIn from './mutations/signIn';
import signUp from './mutations/signUp';

const resolvers = {
  Query: {
    topics: () => {
      return [];
    },
  },
  Mutation: {
    signIn,
    signUp,
  },
};

export default resolvers;
