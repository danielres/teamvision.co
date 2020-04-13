import validate from './validators/validateTopic';

export default knex => tenantId => {
  const queries = {};

  queries.all = () => knex('Topic').where('tenantId', tenantId);

  queries.insert = async args => {
    const validArgs = await validate.insert(args);
    return (
      await knex('Topic')
        .insert({ tenantId, ...validArgs })
        .returning('*')
    )[0];
  };

  return queries;
};
