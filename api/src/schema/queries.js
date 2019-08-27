const driver = require("../neo4jDriver");
const nanoid = require("nanoid");

// === PRIVATE:

const genId = () => nanoid(10);

const getRecords = async (query, params) => {
  const session = driver.session();
  const { records } = await session.run(query, params);
  session.close();

  if (!records) return null;

  return records.map(r => {
    const { properties, labels } = r.get(0);
    return { ...properties, __label: labels[0] };
  });
};

const getRecord = async (query, params) => {
  const records = await getRecords(query, params);
  return records && records.length === 1 ? records[0] : null;
};

// === EXPORTED:

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
  findNodeByLabelAndId,
  findNodeByLabelAndProperty,
  findNodesByLabel,
  searchPersons,
  createCurrentUserPerson,
  updateCurrentUserPersonName
};
