import jwt from 'jsonwebtoken';
import shortid from 'shortid';
import { ValidationError } from 'yup';
import config from '../../../config';
import sender from '../../../emails/sender';
import store from '../../../store/store';
import testSpy from '../../../test/testSpy';
import reportError from '../../utils/reportError';
import ServerError from '../errors/ServerError';

export default async (parent, { args }) => {
  try {
    const { Tenant } = store;
    const tenant = await Tenant.insert({ name: `Tenant-${Math.random()}`, shortId: shortid.generate() });
    const User = store.User(tenant.id);
    const user = await User.insert(args);
    testSpy.spy({ SignUp: { tenant, user } });
    const { email, name } = user;

    const { expSeconds: expiresIn, secret } = config.auth.verifyEmail.jwt;
    const token = jwt.sign({ id: user.id }, secret, { expiresIn });
    await sender.verifyEmail({ email, expiresIn, name, token });

    return true;
  } catch (error) {
    if (error instanceof ValidationError) return error;
    reportError(error);
    return new ServerError();
  }
};
