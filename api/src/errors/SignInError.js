import testSpy from '../../test/testSpy';
import SafeError from './SafeError';

export default class SignInError extends SafeError {
  // FIXME
  constructor({ message = 'Invalid email or password', internalData } = {}) {
    super();
    testSpy.spy({ SignInError: { internalData } });
    this.message = message;
  }
}
