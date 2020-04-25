import SafeError from './SafeError';

export default class SignInError extends SafeError {
  constructor({ message = 'Invalid email or password' } = {}) {
    super();
    this.message = message;
  }
}
