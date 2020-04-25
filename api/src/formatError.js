import UnknownError from './errors/UnknownError';
import reportError from './utils/reportError';

export default e => {
  const { isSafeError, ...rest } = e.extensions.exception;
  if (isSafeError) return { ...e, ...rest };
  reportError({ path: e.path, ...rest, extensions: undefined });
  throw new UnknownError();
};
