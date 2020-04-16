import signIn from './mutations/signIn';
import signOut from './mutations/signOut';
import signUp from './mutations/signUp';

const resolvers = {
  Query: {
    topics: () => {
      return [];
    },
  },
  Mutation: {
    signIn,
    signOut,
    signUp,
  },
};

export default resolvers;
