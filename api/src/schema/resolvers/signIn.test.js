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
      const { tenant } = spy.mock.calls[0][0].SignUp;
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

      beforeAll(async () => {
        jest.resetAllMocks();
        await signUp(SignUpInput.jane());
        tenant = spy.mock.calls[0][0].SignUp.tenant;
      });

      describe('on wrong email', () => {
        it('returns a SignInError', async () => {
          const { errors } = await signIn(SignInInput.jane(tenant.shortId, { email: 'wrong@example.com' }));
          expect(errors[0].name).toEqual(SignInError.name);
        });
      });

      describe('on wrong password', () => {
        it('returns a SignInError', async () => {
          const { errors } = await signIn(SignInInput.jane(tenant.shortId, { password: 'wrong' }));
          expect(errors[0].name).toEqual(SignInError.name);
        });
      });

      describe('on wrong tenantShortId', () => {
        it('returns a SignInError', async () => {
          const anotherTenant = await store.Tenant.insert(samples.Tenant.tenant2);
          const { errors } = await signIn(SignInInput.jane(anotherTenant.shortId));
          expect(errors[0].name).toEqual(SignInError.name);
        });
      });

      describe('on non-existing tenantShortId', () => {
        it('returns a SignInError', async () => {
          const { errors } = await signIn(SignInInput.jane('XQGYJOgnaK'));
          expect(errors[0].name).toEqual(SignInError.name);
        });
      });
    });

    describe('when user never signed up', () => {
      let tenant;

      beforeAll(async () => {
        jest.resetAllMocks();
        tenant = await store.Tenant.insert(samples.Tenant.tenant1);
      });

      it('returns a SignInError', async () => {
        const { errors } = await signIn(SignInInput.jane(tenant.shortId));
        expect(errors[0].name).toEqual(SignInError.name);
      });

      describe('on non-existing tenantShortId', () => {
        it('returns a SignInError', async () => {
          const { errors } = await signIn(SignInInput.jane('XQGYJOgnaK'));
          expect(errors[0].name).toEqual(SignInError.name);
        });
      });
    });
  });
});
