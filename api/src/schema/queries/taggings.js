const nanoid = require("nanoid");
const yup = require("yup");

const driver = require("../../neo4jDriver");
const { UniqueConstraintError } = require("../../errors");

const {
  _findNodesByLabelAndProperty,
  _genId,
  _getRelationships
} = require("./private");

const { createTag, searchTags } = require("./tags");

const _detachFromParent = async ({ tagName }) => {
  const session = driver.session();
  const query = `
    MATCH (:Tag) -[rel:TAGGING]-> (tgt:Tag) WHERE LOWER(tgt.name) = LOWER( {tagName} )
    DELETE rel
    RETURN tgt
  `;
  return session.run(query, { tagName });
};

const _findTagging = async ({
  name,
  on = "",
  targetLabel,
  targetKey,
  targetValue
}) => {
  const query = `
    MATCH (n:Tag {name: {name}}) -[tagging:TAGGING {on: {on}}]-> (target: ${targetLabel} {${targetKey}: {targetValue} })
    RETURN tagging
  `;
  const taggings = await _getRelationships(query, { name, on, targetValue });
  if (taggings.length > 1)
    console.warn(
      `[findTagging] WARNING: DATA INCONSISTENCY: multiple taggings found on "${on}", while only 0 or 1 should exist.`
    );

  return taggings[0];
};

const applyTagging = async ({
  name,
  description = "",
  on = "",
  targetLabel = "Tag",
  targetKey = "name",
  targetValue
}) => {
  const existing = await _findTagging({
    name,
    on,
    targetLabel,
    targetKey,
    targetValue
  });

  if (existing)
    throw new UniqueConstraintError(
      "A tag can be applied only once per target."
    );

  const session = driver.session();

  const params = {
    name: name.toLowerCase(),
    description,
    on,
    targetLabel,
    targetKey,
    targetValue: targetValue.toLowerCase(),
    taggingId: _genId()
  };

  const query = `
    MATCH (tag:Tag) WHERE LOWER(tag.name) = LOWER( {name} )
    MATCH (target: ${targetLabel}) WHERE LOWER(target.${targetKey}) = LOWER( {targetValue} )
    CREATE (tag)-[tagging:TAGGING {id: {taggingId}, description: {description}, on: {on}}]->(target)
    RETURN tagging, tag, target
  `;

  const { records } = await session.run(query, params);

  const { properties: tagging } = records[0].get(0);
  const { properties: tag } = records[0].get(1);
  const { properties: target } = records[0].get(2);

  session.close();
  return { ...tagging, tag, target: { label: targetLabel, ...target } };
};

const setTagOn = async ({ tagName, on, targetType, targetId }) => {
  const existingTag = (await searchTags(tagName))[0];
  if (!existingTag) await createTag({ name: tagName });

  const tagging = await applyTagging({
    name: tagName,
    on,
    targetLabel: targetType,
    targetKey: "id",
    targetValue: targetId
  });

  return tagging;
};

const setTagParent = async ({ parentName, tagName }) => {
  await _detachFromParent({ tagName });
  if (!parentName) return;
  return applyTagging({
    name: parentName,
    targetValue: tagName
  });
};

module.exports = {
  applyTagging,
  setTagOn,
  setTagParent
};
