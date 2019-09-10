const deleteAllRecords = require("./deleteAllRecords");
const {
  findNodeByLabelAndId,
  findNodeByLabelAndProperty,
  findNodesByLabel
} = require("./nodes");
const { searchPersons, createPerson } = require("./persons");
const { searchTags, createTag } = require("./tags");
const { applyTagging, setTagParent } = require("./taggings");
const getTagTreeData = require("./getTagTreeData");
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
  setTagParent,
  // tagTreeData
  getTagTreeData,
  // currentUser
  createCurrentUserPerson,
  updateCurrentUserPersonName
};
