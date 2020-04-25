import jwt, { TokenExpiredError as JwtTokenExpiredError } from 'jsonwebtoken';
import config from '../../../config';
import store from '../../../store/store';
import TokenExpiredError from '../../errors/TokenExpiredError';

export default async (parent, { password, token }) => {
  try {
    const { id } = jwt.decode(token);
    jwt.verify(token, config.auth.resetPassword.jwt.secret);
    const User = store.User(null);
    await User.updatePassword({ id, password });
    return true;
  } catch (error) {
    if (error instanceof JwtTokenExpiredError) throw new TokenExpiredError();
    throw error;
  }
};
