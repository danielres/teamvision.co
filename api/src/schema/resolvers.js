import me from './resolvers/me';
import resetPassword from './resolvers/resetPassword';
import resetPasswordRequest from './resolvers/resetPasswordRequest';
import signIn from './resolvers/signIn';
import signOut from './resolvers/signOut';
import signUp from './resolvers/signUp';

const resolvers = {
  Query: {
    me,
    topics: () => {
      return [];
    },
  },
  Mutation: {
    resetPassword,
    resetPasswordRequest,
    signIn,
    signOut,
    signUp,
  },
};

export default resolvers;
