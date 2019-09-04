const deleteAllRecords = require("./deleteAllRecords");
const {
  findNodeByLabelAndId,
  findNodeByLabelAndProperty,
  findNodesByLabel
} = require("./nodes");
const { searchPersons, createPerson } = require("./persons");
const { searchTags, createTag } = require("./tags");
const { applyTagging } = require("./taggings");
const {
  createCurrentUserPerson,
  updateCurrentUserPersonName
} = require("./currentUser");

module.exports = {
  deleteAllRecords,
  // nodes
  findNodeByLabelAndId,
  findNodeByLabelAndProperty,
  findNodesByLabel,
  // persons
  searchPersons,
  createPerson,
  // tags
  searchTags,
  createTag,
  // taggings
  applyTagging,
  // currentUser
  createCurrentUserPerson,
  updateCurrentUserPersonName
};
