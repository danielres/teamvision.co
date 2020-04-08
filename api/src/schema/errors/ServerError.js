export default class ServerError extends Error {
  constructor({ message = 'Oops. Something went wrong. Please try again later.' } = {}) {
    super();
    this.message = message;
  }
}
