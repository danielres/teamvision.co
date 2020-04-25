import SafeError from './SafeError';

export default class TokenExpiredError extends SafeError {
  constructor({ message = 'Authentication expired' } = {}) {
    super();
    this.message = message;
  }
}
