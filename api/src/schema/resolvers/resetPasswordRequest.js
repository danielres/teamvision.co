import jwt from 'jsonwebtoken';
import config from '../../../config';
import sender from '../../../emails/sender';
import store from '../../../store/store';
import reportError from '../../utils/reportError';
import validate from './validators/validateResetPasswordRequest';

const { Tenant } = store;

export default async (parent, args) => {
  const { email, tenantShortId: shortId } = await validate(args);

  try {
    const [tenant] = await Tenant.byShortId({ shortId });

    if (!tenant) {
      const altShortIds = (await Tenant.byUserEmail({ email })).map(t => t.shortId);
      if (altShortIds.length > 0)
        sender.resetPasswordRequestFailureAltTenants({ email, shortIds: altShortIds, shortId });
      return true;
    }

    const User = store.User(tenant.id);
    const [user] = await User.byEmail({ email });

    if (!user) return true;

    const { expSeconds: expiresIn, secret } = config.auth.resetPassword.jwt;
    const token = jwt.sign({ id: user.id }, secret, { expiresIn });
    await sender.resetPasswordRequestSuccess({ email, expiresIn, token });

    return true;
  } catch (error) {
    reportError(error);
    return false;
  }
};
