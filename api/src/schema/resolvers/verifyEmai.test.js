/* eslint-disable no-return-assign */
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import lolex from 'lolex';
import config from '../../../config';
import store from '../../../store/store';
import { verifyEmail } from '../../../test/queries';

const { expSeconds: expiresIn, secret } = config.auth.verifyEmail.jwt;

const verifyEmailMock = jest.fn();

store.User = () => ({
  verifyEmail: verifyEmailMock,
});

const userId = 'USER_ID';

beforeEach(() => jest.resetAllMocks);

describe('mutation verifyEmail(_, { token })', () => {
  describe('on success', () => {
    beforeEach(async () => {
      const token = jwt.sign({ id: userId }, secret, { expiresIn });
      await verifyEmail({ token });
    });

    it('resolves user id and calls User.verifyEmail({ id }) ', async () => {
      expect(verifyEmailMock).toHaveBeenCalledWith({ id: userId });
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

        const { errors } = await verifyEmail({ token });
        expect(errors[0].extensions.exception.name).toEqual(TokenExpiredError.name);
      });
    });
  });
});
