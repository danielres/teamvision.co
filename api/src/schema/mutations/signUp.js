import { ValidationError } from 'yup';
import sender from '../../../emails/sender';
import store from '../../../store/store';
import { reportError } from '../../utils';
import ServerError from '../errors/ServerError';

export default async (parent, args) => {
  try {
    const { Tenant } = store;
    const tenant = await Tenant.insert({ name: `Tenant-${Math.random()}` });
    const User = store.User(tenant.id);
    const { email, name } = await User.insert(args);
    await sender.signUpSuccess({ email, name });
    return true;
  } catch (error) {
    if (error instanceof ValidationError) return error;
    reportError(error);
    return new ServerError();
  }
};
