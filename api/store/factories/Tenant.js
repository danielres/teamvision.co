import tenantValidator from '../validators/tenantValidator';

export default knex => {
  const queries = {};

  queries.all = () => knex('Tenant');

  queries.insert = async args => {
    await tenantValidator.insert.validate(args, { abortEarly: false });
    return (await knex('Tenant').insert(args).returning('*'))[0];
  };

  return queries;
};
