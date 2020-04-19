import validate from './validators/validateTenant';

export default knex => {
  const queries = {};

  queries.all = () => knex('Tenant');

  queries.byShortId = ({ shortId }) => knex('Tenant').where('shortId', shortId);

  queries.byUserEmail = async ({ email }) => {
    const ids = (await knex('User').where({ email }).select('tenantId')).map(u => u.tenantId);
    return knex('Tenant').whereIn('id', ids);
  };

  queries.insert = async args => {
    const validArgs = await validate.insert(args);
    return (await knex('Tenant').insert(validArgs).returning('*'))[0];
  };

  return queries;
};
