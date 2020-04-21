import validate from './validators/validateUser';
import hashPassword from '../../src/utils/hashPassword';

export default knex => tenantId => {
  const queries = {};

  queries.all = () => knex('User').where('tenantId', tenantId);

  queries.byEmail = ({ email }) => knex('User').where('tenantId', tenantId).where('email', email);

  queries.insert = async args => {
    const { password, ...rest } = await validate.insert(args);

    const hash = await hashPassword(password);
    return (
      await knex('User')
        .insert({ tenantId, password: hash, ...rest })
        .returning('*')
    )[0];
  };

  queries.updatePassword = async args => {
    const { id, password } = await validate.updatePassword(args);
    const hash = await hashPassword(password);
    return knex('User').where({ id }).update({ password: hash });
  };

  queries.verifyEmail = async args => {
    const { id } = await validate.verifyEmail(args);
    const now = new Date();
    return knex('User').where({ id }).update({ emailVerifiedAt: now });
  };

  return queries;
};
