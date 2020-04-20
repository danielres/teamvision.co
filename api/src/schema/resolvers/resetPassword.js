import jwt, { TokenExpiredError } from 'jsonwebtoken';
import config from '../../../config';
import store from '../../../store/store';
import reportError from '../../utils/reportError';

export default async (parent, { password, token }) => {
  try {
    const { id } = jwt.decode(token);
    jwt.verify(token, config.auth.resetPassword.jwt.secret);
    const User = store.User(null);
    await User.updatePassword({ id, password });
    return true;
  } catch (error) {
    if (error instanceof TokenExpiredError) return error;
    reportError(error);
    throw error;
  }
};
