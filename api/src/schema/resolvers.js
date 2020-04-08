import signUp from './mutations/signUp';

const resolvers = {
  Query: {
    topics: (parent, args, context) => {
      return [];
    },
  },
  Mutation: {
    signUp,
  },
};

export default resolvers;
