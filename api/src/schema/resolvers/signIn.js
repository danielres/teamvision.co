import store from '../../../store/store';
import SignInError from '../../errors/SignInError';
import verifyPassword from '../../utils/verifyPassword';

export default async (parent, { args }, { req }) => {
  const { email, password, tenantShortId } = args;

  const [dbTenant] = await store.Tenant.byShortId({ shortId: tenantShortId });
  if (!dbTenant) throw new SignInError();

  const User = store.User(dbTenant.id);
  const [dbUser] = await User.byEmail({ email });
  if (!dbUser) throw new SignInError();

  const isCorrectPassword = await verifyPassword(password, dbUser.password);
  if (!isCorrectPassword) throw new SignInError();

  req.session.me = { id: dbUser.id };
  return true;
};
