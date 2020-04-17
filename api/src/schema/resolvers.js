import signIn from './resolvers/signIn';
import signOut from './resolvers/signOut';
import signUp from './resolvers/signUp';
import me from './resolvers/me';

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
