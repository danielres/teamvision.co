import testSpy from '../../test/testSpy';
import SafeError from './SafeError';

export default class SignInError extends SafeError {
  constructor({ message = 'Invalid email or password', internalData = 'AAA' } = {}) {
    super();
    testSpy.spy({ SignInError: { internalData } });
    this.message = message;
  }
}
