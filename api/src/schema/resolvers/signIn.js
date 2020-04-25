import store from '../../../store/store';
import SignInError from '../../errors/SignInError';
import verifyPassword from '../../utils/verifyPassword';

export default async (parent, { args }, { req }) => {
  const { email, password, tenantShortId } = args;

  const [dbTenant] = await store.Tenant.byShortId({ shortId: tenantShortId });
  if (!dbTenant) throw new SignInError({ internalData: 'TENANT_NOT_FOUND' });

  const User = store.User(dbTenant.id);
  const [dbUser] = await User.byEmail({ email });
  if (!dbUser) throw new SignInError({ internalData: 'USER_NOT_FOUND' });

  const { emailVerifiedAt } = dbUser;
  if (!emailVerifiedAt) throw new SignInError({ internalData: 'EMAIL_NOT_VERIFIED' });

  const isCorrectPassword = await verifyPassword(password, dbUser.password);
  if (!isCorrectPassword) throw new SignInError({ internalData: 'PASSWORD_NOT_CORRECT' });

  req.session.me = { id: dbUser.id };
  return true;
};
