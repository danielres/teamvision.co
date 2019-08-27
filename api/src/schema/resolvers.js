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
      (obj, args, { user = { email: TEMP_EMAIL } }) =>
        createCurrentUserPerson(user.email)
    ),

    updateCurrentUserPersonName: combineResolvers(
      // TODO: isAuthenticated,
      (obj, { name }, { user = { email: TEMP_EMAIL } }) =>
        updateCurrentUserPersonName({ name }, user.email)
    )
  }
};

module.exports = resolvers;
