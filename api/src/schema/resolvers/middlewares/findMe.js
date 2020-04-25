import { get } from 'lodash/fp';
import store from '../../../../store/store';

export default resolver => async (parent, args, context, info) => {
  const id = get('req.session.me.id', context);
  const User = store.User(null);
  const [me] = await User.byId({ id });
  return resolver(parent, args, { ...context, me }, info);
};
