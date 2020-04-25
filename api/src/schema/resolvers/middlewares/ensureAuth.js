import { get } from 'lodash/fp';
import TokenAuthenticationError from '../../../errors/TokenAuthenticationError';

export default resolver => (parent, args, context, info) => {
  const id = get('req.session.me.id', context);
  if (!id) throw new TokenAuthenticationError();
  return resolver(parent, args, context, info);
};
