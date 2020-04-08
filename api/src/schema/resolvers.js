import signUp from './mutations/signUp';

const resolvers = {
  Query: {
    topics: () => {
      return [];
    },
  },
  Mutation: {
    signUp,
  },
};

export default resolvers;
