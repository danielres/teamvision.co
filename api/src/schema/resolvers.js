const { combineResolvers } = require("graphql-resolvers");

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
    persons(obj, { search }) {
      if (search) return searchPersons(search);
      return findNodesByLabel("Person");
    },

    person(obj, { id, email }) {
      if (email) return findNodeByLabelAndProperty("Person", "email", email);
      if (id) return findNodeByLabelAndId("Person", id);
      return new Error('Missing argument "email" or "id"');
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
