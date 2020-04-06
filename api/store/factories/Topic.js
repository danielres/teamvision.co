export default knex => tenantId => {
  const queries = {};

  queries.all = () => knex("Topic").where("tenantId", tenantId);

  queries.insert = async args =>
    (
      await knex("Topic")
        .insert({ tenantId, ...args })
        .returning("*")
    )[0];

  return queries;
};
