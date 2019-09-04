const nanoid = require("nanoid");
const yup = require("yup");

const driver = require("../../neo4jDriver");
const { UniqueConstraintError } = require("../../errors");

const { _genId, _getRelationships } = require("./private");

const _findTagging = async ({ name, targetLabel, targetKey, targetValue }) => {
  const query = `
    MATCH (n:Tag {name: {name}}) -[tagging:TAGGING]-> (target: ${targetLabel} {${targetKey}: {targetValue} })
    RETURN tagging
  `;
  const taggings = await _getRelationships(query, { name, targetValue });
  if (taggings.length > 1)
    console.warn(
      `[findTagging] WARNING: DATA INCONSISTENCY: multiple taggings found, while only 0 or 1 should exist.`
    );

  return taggings[0];
};

const applyTagging = async ({
  name,
  description = "",
  targetLabel,
  targetKey,
  targetValue
}) => {
  const existing = await _findTagging({
    name,
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
    name,
    description,
    targetLabel,
    targetKey,
    targetValue,
    taggingId: _genId()
  };

  const query = `
    MATCH (tag:Tag {name: {name} })
    MATCH (target: ${targetLabel} {${targetKey}: {targetValue}})
    CREATE (tag)-[tagging:TAGGING {id: {taggingId}, description: {description}}]->(target)
    RETURN tagging, tag, target
  `;

  const { records } = await session.run(query, params);

  const { properties: tagging } = records[0].get(0);
  const { properties: tag } = records[0].get(1);
  const { properties: target } = records[0].get(2);

  session.close();
  return { ...tagging, tag, target: { label: targetLabel, ...target } };
};

module.exports = {
  applyTagging
};
