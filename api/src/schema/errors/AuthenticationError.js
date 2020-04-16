export default class AuthenticationError extends Error {
  constructor({ message = 'Authentication failed.' } = {}) {
    super();
    this.message = message;
  }
}
