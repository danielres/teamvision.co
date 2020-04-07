export default knex => tenantId => {
  const queries = {};

  queries.all = () => knex('User').where('tenantId', tenantId);

  queries.insert = async args =>
    (
      await knex('User')
        .insert({ tenantId, ...args })
        .returning('*')
    )[0];

  return queries;
};
