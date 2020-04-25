import SafeError from './SafeError';

export default class InputValidationError extends SafeError {
  constructor({ originalError }) {
    super();
    this.message = originalError.message;
    this.messages = originalError.errors;
  }
}
