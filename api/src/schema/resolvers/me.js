import { get } from 'lodash/fp';
import store from '../../../store/store';
import AuthenticationError from '../errors/AuthenticationError';

export default async (parent, args, { req }) => {
  const id = get('session.me.id', req);
  if (!id) return new AuthenticationError();
  // FIXME: don't access knex directly
  const me = await store.getKnex()('User').where({ id }).first();
  if (!me) return new AuthenticationError();
  return me;
};
