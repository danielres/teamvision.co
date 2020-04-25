import { compose } from 'lodash/fp';
import me from './resolvers/me';
import benchmark from './resolvers/middlewares/benchmark';
import ensureAuth from './resolvers/middlewares/ensureAuth';
import findMe from './resolvers/middlewares/findMe';
import applyAll from './resolvers/middlewares/utils/applyAll';
import resetPassword from './resolvers/resetPassword';
import resetPasswordRequest from './resolvers/resetPasswordRequest';
import signIn from './resolvers/signIn';
import signOut from './resolvers/signOut';
import signUp from './resolvers/signUp';
import verifyEmail from './resolvers/verifyEmail';

const resolvers = {
  Query: {
    me: compose(ensureAuth, findMe)(me),
    topics: compose(ensureAuth)(() => {
      return [];
    }),
  },
  Mutation: {
    resetPassword,
    resetPasswordRequest,
    signIn,
    signOut,
    signUp,
    verifyEmail,
  },
};

export default applyAll(benchmark)(resolvers);
