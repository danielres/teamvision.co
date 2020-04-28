import config from '../../../config';
import sender from '../../../emails/sender';
import store from '../../../store/store';
import samples from '../../../store/test/samples';
import { resetPasswordRequest, signUp } from '../../../test/queries';
import testSpy from '../../../test/testSpy';

jest.mock('../../../emails/sender'); // Disable sending mails

afterAll(store.close);
beforeEach(async () => {
  await store.purge();
  jest.resetAllMocks();
});

const spy = jest.spyOn(testSpy, 'spy');

describe('mutation ResetPasswordRequest(_, { email, tenantShortId })', () => {
  describe('on success', () => {
    let jane;
    let tenant;
    let response;
    let senderArgs;

    beforeAll(async () => {
      await signUp(samples.SignUpInput.jane());
      tenant = spy.mock.calls[0][0].SignUp.tenant;
      jane = spy.mock.calls[0][0].SignUp.user;
      response = await resetPasswordRequest({ email: jane.email, tenantShortId: tenant.shortId });
      [[senderArgs]] = sender.resetPasswordRequestSuccess.mock.calls;
    });

    it('returns true', async () => {
      expect(response.data.resetPasswordRequest).toEqual(true);
    });

    describe('sender.resetPasswordRequestSuccess', () => {
      it('is called with email + expiresIn + tenantShortId + token', async () => {
        expect(Object.keys(senderArgs)).toEqual(['email', 'expiresIn', 'tenantShortId', 'token']);
      });

      it(`receives the user's email`, () => {
        expect(senderArgs.email).toEqual(jane.email);
      });

      it(`receives correct expiresIn`, () => {
        expect(senderArgs.expiresIn).toEqual(config.auth.resetPassword.jwt.expSeconds);
      });

      it(`receives token with user id`, () => {
        const decoded = JSON.parse(atob(senderArgs.token.split('.')[1]));
        expect(decoded.id).toEqual(jane.id);
      });
    });
  });

  describe('errors', () => {
    describe('on tenant not found', () => {
      let jane;
      let tenant;
      let response;
      let senderArgs;

      beforeAll(async () => {
        await signUp(samples.SignUpInput.jane());
        tenant = spy.mock.calls[0][0].SignUp.tenant;
        jane = spy.mock.calls[0][0].SignUp.user;
        response = await resetPasswordRequest({ email: jane.email, tenantShortId: 'WRONG_SHORTID' });
        [[senderArgs]] = sender.resetPasswordRequestFailureAltTenants.mock.calls;
      });

      it('returns true', async () => {
        expect(response.data.resetPasswordRequest).toEqual(true);
      });

      describe('sender.resetPasswordRequestFailureAltTenants', () => {
        it('is called with email + shortId + shortIds', async () => {
          expect(Object.keys(senderArgs)).toEqual(['email', 'shortIds', 'shortId']);
        });

        it(`receives the user's email`, () => {
          expect(senderArgs.email).toEqual(jane.email);
        });

        it(`receives the wrong shortId`, () => {
          expect(senderArgs.shortId).toEqual('WRONG_SHORTID');
        });

        it(`receives correct shortIds suggestions`, () => {
          expect(senderArgs.shortIds).toEqual([tenant.shortId]);
        });
      });
    });

    describe('on email not found', () => {
      let response;

      beforeAll(async () => {
        jest.resetAllMocks();
        await signUp(samples.SignUpInput.jane());
        const { tenant } = spy.mock.calls[0][0].SignUp;
        response = await resetPasswordRequest({ email: 'FAULTY@example.com', tenantShortId: tenant.shortId });
      });

      it('just returns true', async () => {
        expect(response.data.resetPasswordRequest).toEqual(true);
        expect(sender.resetPasswordRequestSuccess).not.toHaveBeenCalled();
        expect(sender.resetPasswordRequestFailureAltTenants).not.toHaveBeenCalled();
      });
    });
  });
});
