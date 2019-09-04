const yup = require("yup");

const { UniqueConstraintError } = require("../../errors");

const {
  _findNodesByLabelAndProperty,
  _genId,
  _getRecord,
  _getRecords
} = require("./private");

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

const createPerson = async ({ email, name }) => {
  const params = { email, name, personId: _genId() };

  await PersonSchema.validate(params, { abortEarly: false });
  const existing = await _findNodesByLabelAndProperty("Person", "email", email);
  if (existing.length)
    throw new UniqueConstraintError("This email is not available.");

  const query = `
    CREATE (p:Person {email: {email}, name: {name}, id: {personId} })
    RETURN p
  `;
  return _getRecord(query, params);
};

const searchPersons = term => {
  const query = `
    MATCH (p:Person)
    WHERE
      (
        toLower(p.name) CONTAINS toLower({term})
        OR
        toLower(p.email) CONTAINS toLower({term})
      )
    RETURN p
  `;
  return _getRecords(query, { term });
};

module.exports = {
  searchPersons,
  createPerson
};
