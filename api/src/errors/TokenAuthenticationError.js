import SafeError from './SafeError';

export default class TokenAuthenticationError extends SafeError {
  constructor({ message = 'Authentication failed' } = {}) {
    super();
    this.message = message;
  }
}
