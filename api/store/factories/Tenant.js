export default knex => {
  const queries = {};

  queries.all = () => knex("Tenant");

  queries.insert = async args =>
    (
      await knex("Tenant")
        .insert(args)
        .returning("*")
    )[0];

  return queries;
};
