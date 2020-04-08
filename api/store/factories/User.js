import { hashPassword } from '../../src/utils';
import userValidator from '../validators/userValidator';

export default knex => tenantId => {
  const queries = {};

  queries.all = () => knex('User').where('tenantId', tenantId);

  queries.insert = async ({ password, ...args }) => {
    await userValidator.insert.validate({ password, ...args }, { abortEarly: false });
    const hash = await hashPassword(password);

    return (
      await knex('User')
        .insert({ tenantId, password: hash, ...args })
        .returning('*')
    )[0];
  };

  return queries;
};
