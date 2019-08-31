const { combineResolvers } = require("graphql-resolvers");
const { AuthenticationError } = require("apollo-server-express");
// TODO: replace by user data coming from auth
const TEMP_EMAIL = "TODO@example.com";

const {
  findNodeByLabelAndId,
  findNodeByLabelAndProperty,
  findNodesByLabel,
  searchPersons,
  createCurrentUserPerson,
  updateCurrentUserPersonName
} = require("./queries");

const resolvers = {
  Query: {
    persons(obj, { search }, { isAuthenticated }) {
      if (!isAuthenticated) return new AuthenticationError("Forbidden");
      if (search) return searchPersons(search);
      return findNodesByLabel("Person");
    },

    person(obj, { id, email }, { isAuthenticated }) {
      if (!isAuthenticated) return new AuthenticationError("Forbidden");
      if (email) return findNodeByLabelAndProperty("Person", "email", email);
      if (id) return findNodeByLabelAndId("Person", id);
      return new Error('Missing argument "email" or "id"');
    },

    userInfo(obj, {}, { isAuthenticated, userInfo }) {
      if (!isAuthenticated) return new AuthenticationError("Forbidden");
      return userInfo;
    }
  },

  Person: {
    created({ created }) {
      return created.toString();
    }
  },

  Mutation: {
    createCurrentUserPerson: combineResolvers(
      // TODO: isAuthenticated,
      (obj, args, { user }) => {
        // FIXME
        console.log({ user });
        return createCurrentUserPerson(TEMP_EMAIL);
      }
    ),

    updateCurrentUserPersonName: combineResolvers(
      // TODO: isAuthenticated,
      (obj, { name }, { user }) => {
        // FIXME
        console.log({ user });
        return updateCurrentUserPersonName({ name }, TEMP_EMAIL);
      }
    )
  }
};

module.exports = resolvers;
