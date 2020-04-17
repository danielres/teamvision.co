export default class SignInError extends Error {
  constructor({ message = 'Sign in error' } = {}) {
    super();
    this.message = message;
  }
}
