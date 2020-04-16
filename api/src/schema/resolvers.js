import signIn from './mutations/signIn';
import signOut from './mutations/signOut';
import signUp from './mutations/signUp';
import me from './queries/me';

const resolvers = {
  Query: {
    me,
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
