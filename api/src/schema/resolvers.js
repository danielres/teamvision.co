const { combineResolvers } = require("graphql-resolvers");
const { AuthenticationError } = require("apollo-server-express");
// TODO: replace by user data coming from auth
const TEMP_EMAIL = "TODO@example.com";

const {
  findNodeByLabelAndId,
  findNodeByLabelAndProperty,
  findNodesByLabel,
  getTagTreeData,
  searchPersons,
  createPerson,
  createCurrentUserPerson,
  searchTags,
  createTag,
  applyTagging,
  setTagParent,
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

    tags(obj, { search }, { isAuthenticated }) {
      if (!isAuthenticated) return new AuthenticationError("Forbidden");
      if (search) return searchTags(search);
      return findNodesByLabel("Tag");
    },

    tag(obj, { id, name }, { isAuthenticated }) {
      if (!isAuthenticated) return new AuthenticationError("Forbidden");
      if (name) return findNodeByLabelAndProperty("Tag", "name", name);
      if (id) return findNodeByLabelAndId("Tag", id);
      return new Error('Missing argument "name" or "id"');
    },

    tagTreeData(obj, args, { isAuthenticated }) {
      if (!isAuthenticated) return new AuthenticationError("Forbidden");
      return getTagTreeData();
    },

    userInfo(obj, {}, { isAuthenticated, userInfo }) {
      if (!isAuthenticated) return new AuthenticationError("Forbidden");
      return userInfo;
    }
  },

  TaggingRelationshipTarget: {
    __resolveType: obj => obj.label
  },

  Mutation: {
    createPerson: (obj, args, vars) => createPerson(args),
    createTag: (obj, args, vars) => createTag(args),
    applyTagging: (obj, args, vars) => applyTagging(args),
    setTagParent: async (obj, { parentName, tagName }, vars) => {
      await setTagParent({ parentName, tagName });
      return { tagName, parentName };
    },
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
