import store from '../../../store/store';
import { reportError, verifyPassword } from '../../utils';
import ServerError from '../errors/ServerError';
import SignInError from './SignInError';

export default async (parent, { args }, { req }) => {
  try {
    const { email, password, tenantShortId } = args;

    const [dbTenant] = await store.Tenant.byShortId({ shortId: tenantShortId });
    if (!dbTenant) return new SignInError();

    const User = store.User(dbTenant.id);
    const [dbUser] = await User.byEmail({ email });
    if (!dbUser) return new SignInError();

    const isCorrectPassword = await verifyPassword(password, dbUser.password);
    if (!isCorrectPassword) return new SignInError();

    req.session.me = { id: dbUser.id };
    return true;
  } catch (error) {
    reportError(error);
    return new ServerError();
  }
};
