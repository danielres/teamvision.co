import store from '../../store/store';

const resolvers = {
  Query: {
    topics: (parent, args, context) => {
      return [];
    },
  },
};

export default resolvers;
