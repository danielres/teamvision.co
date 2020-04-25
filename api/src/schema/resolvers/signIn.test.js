import store from '../../../store/store';
import samples from '../../../store/test/samples';
import decodeJwt from '../../../test/decodeJwt';
import parseCookie from '../../../test/parseCookie';
import { signIn, signUp } from '../../../test/queries';
import testSpy from '../../../test/testSpy';
import SignInError from '../../errors/SignInError';
import isUuid from '../../isUuid';

jest.mock('../../../emails/sender'); // Disable sending mails

afterAll(store.close);
beforeAll(store.purge);

const spy = jest.spyOn(testSpy, 'spy');

const { SignInInput, SignUpInput } = samples;

describe('mutation SignIn', () => {
  describe('on success', () => {
    let response;

    beforeAll(async () => {
      jest.resetAllMocks();
      await signUp(SignUpInput.jane());
      const { tenant, user } = spy.mock.calls[0][0].SignUp;
      await store.User(tenant.id).verifyEmail({ id: user.id });
      const jane = SignInInput.jane(tenant.shortId);
      response = await signIn(jane);
    });

    it('returns true', () => {
      expect(response.data.signIn).toEqual(true);
    });

    it('set a session cookie containing the current user id', () => {
      const responseCookie = parseCookie(response.headers['set-cookie'][0]);
      const session = decodeJwt(responseCookie.session);
      expect(isUuid(session.me.id)).toBe(true);
    });
  });

  describe('on error', () => {
    describe('when user previously signed up', () => {
      let tenant;
      let userId;

      beforeAll(async () => {
        jest.resetAllMocks();
        await signUp(SignUpInput.jane());
        tenant = spy.mock.calls[0][0].SignUp.tenant;
        userId = spy.mock.calls[0][0].SignUp.user.id;
      });

      describe('on email not verified', () => {
        it('returns a SignInError', async () => {
          jest.resetAllMocks();
          const { errors } = await signIn(SignInInput.jane(tenant.shortId));
          expect(errors[0].name).toEqual(SignInError.name);
          expect(spy.mock.calls[0][0].SignInError.internalData).toEqual('EMAIL_NOT_VERIFIED');
        });
      });

      describe('on email verified', () => {
        beforeAll(() => store.User(tenant.id).verifyEmail({ id: userId }));

        describe('on wrong email', () => {
          it('returns a SignInError (USER_NOT_FOUND)', async () => {
            jest.resetAllMocks();
            const { errors } = await signIn(SignInInput.jane(tenant.shortId, { email: 'wrong@example.com' }));
            expect(errors[0].name).toEqual(SignInError.name);
            expect(spy.mock.calls[0][0].SignInError.internalData).toEqual('USER_NOT_FOUND');
          });
        });

        describe('on wrong password', () => {
          it('returns a SignInError (PASSWORD_NOT_CORRECT)', async () => {
            jest.resetAllMocks();
            const { errors } = await signIn(SignInInput.jane(tenant.shortId, { password: 'wrong' }));
            expect(errors[0].name).toEqual(SignInError.name);
            expect(spy.mock.calls[0][0].SignInError.internalData).toEqual('PASSWORD_NOT_CORRECT');
          });
        });

        describe('on wrong tenantShortId', () => {
          it('returns a SignInError (USER_NOT_FOUND)', async () => {
            jest.resetAllMocks();
            const anotherTenant = await store.Tenant.insert(samples.Tenant.tenant2);
            const { errors } = await signIn(SignInInput.jane(anotherTenant.shortId));
            expect(errors[0].name).toEqual(SignInError.name);
            expect(spy.mock.calls[0][0].SignInError.internalData).toEqual('USER_NOT_FOUND');
          });
        });

        describe('on non-existing tenantShortId', () => {
          it('returns a SignInError (TENANT_NOT_FOUND)', async () => {
            jest.resetAllMocks();
            const { errors } = await signIn(SignInInput.jane('XQGYJOgnaK'));
            expect(errors[0].name).toEqual(SignInError.name);
            expect(spy.mock.calls[0][0].SignInError.internalData).toEqual('TENANT_NOT_FOUND');
          });
        });
      });
    });

    describe('when user never signed up', () => {
      let tenant;

      beforeAll(async () => {
        tenant = await store.Tenant.insert(samples.Tenant.tenant1);
      });

      it('returns a SignInError (USER_NOT_FOUND)', async () => {
        jest.resetAllMocks();
        const { errors } = await signIn(SignInInput.jane(tenant.shortId));
        expect(errors[0].name).toEqual(SignInError.name);
        expect(spy.mock.calls[0][0].SignInError.internalData).toEqual('USER_NOT_FOUND');
      });

      describe('on non-existing tenantShortId', () => {
        it('returns a SignInError (TENANT_NOT_FOUND)', async () => {
          jest.resetAllMocks();
          const { errors } = await signIn(SignInInput.jane('XQGYJOgnaK'));
          expect(errors[0].name).toEqual(SignInError.name);
          expect(spy.mock.calls[0][0].SignInError.internalData).toEqual('TENANT_NOT_FOUND');
        });
      });
    });
  });
});
