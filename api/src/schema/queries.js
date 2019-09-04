const nanoid = require("nanoid");
const yup = require("yup");

const driver = require("../neo4jDriver");
const { UniqueConstraintError } = require("../errors");

// === PRIVATE:

const genId = () => nanoid(10);

const getRecords = async (query, params) => {
  const session = driver.session();
  const { records } = await session.run(query, params);
  session.close();

  return records.map(r => {
    const { properties, labels } = r.get(0);
    return { ...properties };
  });
};

const getRecord = async (query, params) => {
  const records = await getRecords(query, params);
  return records && records.length === 1 ? records[0] : null;
};

const getRelationships = async (query, params) => {
  const session = driver.session();
  const { records: relationships } = await session.run(query, params);
  session.close();

  return relationships.map(r => {
    const { properties, type } = r.get(0);
    return { ...properties, type };
  });
};

const findTagging = async ({ name, targetLabel, targetKey, targetValue }) => {
  const query = `
    MATCH (n:Tag {name: {name}}) -[tagging:TAGGING]-> (target: ${targetLabel} {${targetKey}: {targetValue} })
    RETURN tagging
  `;
  const taggings = await getRelationships(query, { name, targetValue });
  if (taggings.length > 1)
    console.warn(
      `[findTagging] WARNING: DATA INCONSISTENCY: multiple taggings found, while only 0 or 1 should exist.`
    );

  return taggings[0];
};

// === EXPORTED:

const deleteAllRecords = async () => {
  const session = driver.session();
  await session.run(`MATCH (n) DETACH DELETE n`);
  session.close();
};

const findNodeByLabelAndId = (label, id) => {
  const query = `
    MATCH (n:${label} {id: {id}})
    RETURN n
  `;
  return getRecord(query, { id });
};

const findNodeByLabelAndProperty = (label, key, value) => {
  const query = `
    MATCH (n:${label} {${key}: {value}})
    RETURN n
  `;
  return getRecord(query, { value });
};

const findNodesByLabelAndProperty = (label, key, value) => {
  const query = `
    MATCH (n:${label} {${key}: {value}})
    RETURN n
  `;
  return getRecords(query, { value });
};

const findNodesByLabel = label => {
  const query = `
    MATCH (n:${label})
    RETURN n ORDER BY n.created DESC
  `;
  return getRecords(query, { label });
};

const searchPersons = term => {
  const query = `
    MATCH (p:Person)
    WHERE
      (toLower(p.name) CONTAINS toLower({term}) OR toLower(p.email) CONTAINS toLower({term}))
    RETURN p
  `;
  return getRecords(query, { term });
};

const createPerson = async ({ email, name }) => {
  const params = { email, name, personId: genId() };

  const PersonSchema = yup.object().shape({
    email: yup
      .string()
      .required()
      .email(),
    personId: yup
      .string()
      .required()
      .min(10),
    name: yup
      .string()
      .required()
      .min(3)
  });

  await PersonSchema.validate(params, { abortEarly: false });
  const existing = await findNodesByLabelAndProperty("Person", "email", email);
  if (existing.length)
    throw new UniqueConstraintError("This email is not available.");

  const query = `
  CREATE (person:Person {email: {email}, name: {name}, id: {personId} })
  RETURN person
  `;
  return getRecord(query, params);
};

const createTag = async ({ description = "", name }) => {
  const params = { description, name, tagId: genId() };

  const TagSchema = yup.object().shape({
    description: yup.string(),
    tagId: yup
      .string()
      .required()
      .min(10),
    name: yup
      .string()
      .required()
      .min(2)
  });

  await TagSchema.validate(params, { abortEarly: false });
  const existing = await findNodesByLabelAndProperty("Tag", "name", name);
  if (existing.length)
    throw new UniqueConstraintError("This tag already exists.");

  const query = `CREATE (tag:Tag {description: {description}, name: {name}, id: {tagId} }) RETURN tag`;
  return getRecord(query, params);
};

const searchTags = term => {
  const query = `MATCH (t:Tag) WHERE toLower(t.name) CONTAINS toLower({term}) RETURN t ORDER BY t.name`;
  return getRecords(query, { term });
};

const applyTagging = async ({
  name,
  description = "",
  targetLabel,
  targetKey,
  targetValue
}) => {
  const existing = await findTagging({
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
    taggingId: genId()
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

const createCurrentUserPerson = email => {
  const params = { email, personId: genId() };
  // Use cypher FOREACH hack to only set id for person if it isn't already set
  const query = `
    MERGE (person:Person {email: {email} })
    FOREACH (doThis IN CASE WHEN not(exists(person.id)) THEN [1] ELSE [] END |
      SET person += {id:{personId}, created:timestamp()})
    RETURN person
  `;
  return getRecord(query, params);
};

const updateCurrentUserPersonName = ({ name }, email) => {
  const params = { email, name, personId: genId() };
  // Use cypher FOREACH hack to only set id for person if it isn't already set
  const query = `
    MERGE (person:Person {email: {email} })
    FOREACH (doThis IN CASE WHEN not(exists(person.id)) THEN [1] ELSE [] END |
      SET person += {id:{personId}, created:timestamp()})
    SET person.name = {name}
    RETURN person
  `;
  return getRecord(query, params);
};

module.exports = {
  deleteAllRecords,
  findNodeByLabelAndId,
  findNodeByLabelAndProperty,
  findNodesByLabel,
  searchPersons,
  createPerson,
  searchTags,
  createTag,
  applyTagging,
  createCurrentUserPerson,
  updateCurrentUserPersonName
};
