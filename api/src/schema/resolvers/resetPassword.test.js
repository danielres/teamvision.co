/* eslint-disable no-return-assign */
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import lolex from 'lolex';
import config from '../../../config';
import store from '../../../store/store';
import { resetPassword } from '../../../test/queries';

const { expSeconds: expiresIn, secret } = config.auth.resetPassword.jwt;

const updatePasswordMock = jest.fn();
store.User = () => ({
  updatePassword: updatePasswordMock,
});

const userId = 'USER_ID';
const password = '1234567';

beforeEach(() => jest.resetAllMocks);

describe('mutation resetPassword(_, { password, token })', () => {
  describe('on success', () => {
    beforeEach(async () => {
      const token = jwt.sign({ id: userId }, secret, { expiresIn });
      await resetPassword({ password, token });
    });

    it('resolves user id and calls User.updatePassword({ id, password }) ', async () => {
      expect(updatePasswordMock).toHaveBeenCalledWith({ id: userId, password });
    });
  });

  describe('errors', () => {
    describe('on expired token', () => {
      let clock;
      afterEach(() => (clock = clock.uninstall()));
      beforeEach(() => (clock = lolex.install()));

      it(`responds with ${TokenExpiredError.name}`, async () => {
        const token = jwt.sign({ id: userId }, secret, { expiresIn });
        clock.tick(expiresIn * 1000 + 1000);

        const { errors } = await resetPassword({ password, token });
        expect(errors[0].extensions.exception.name).toEqual(TokenExpiredError.name);
      });
    });
  });
});
