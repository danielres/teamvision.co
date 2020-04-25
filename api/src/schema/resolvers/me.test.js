import { pick } from 'lodash/fp';
import store from '../../../store/store';
import samples from '../../../store/test/samples';
import parseCookie from '../../../test/parseCookie';
import { me, signIn, signUp } from '../../../test/queries';
import testSpy from '../../../test/testSpy';
import TokenAuthenticationError from '../../errors/TokenAuthenticationError';

jest.mock('../../../emails/sender'); // Disable sending mails

afterAll(store.close);
beforeAll(store.purge);

const spy = jest.spyOn(testSpy, 'spy');

const { SignInInput, SignUpInput } = samples;

describe('query Me', () => {
  let dbJane;
  let cookie;

  beforeAll(async () => {
    jest.resetAllMocks();
    await signUp(SignUpInput.jane());
    const spyResult = spy.mock.calls[0][0].SignUp;
    const { tenant } = spyResult;
    dbJane = spyResult.user;
    const jane = SignInInput.jane(tenant.shortId);
    await store.User(null).verifyEmail({ id: dbJane.id });
    const response = await signIn(jane);
    const { session } = parseCookie(response.headers['set-cookie'][0]);
    const sessionSig = parseCookie(response.headers['set-cookie'][1])['session.sig'];
    cookie = `session=${session}==; session.sig=${sessionSig}`;
  });

  describe('with correct session + session.sig cookies', () => {
    it('returns the current user details', async () => {
      const { data } = await me({}, { headers: { Cookie: cookie } });
      const testedFields = ['id', 'email'];
      expect(pick(testedFields, data.me)).toEqual(pick(testedFields, dbJane));
    });

    it('with missing cookies', async () => {
      const { errors } = await me();
      expect(errors[0].name).toEqual(TokenAuthenticationError.name);
    });

    it('with wrong cookies', async () => {
      const { errors } = await me({ headers: { Cookie: 'wrong' } });
      expect(errors[0].name).toEqual(TokenAuthenticationError.name);
    });
  });

  describe('errors', () => {
    describe('on missing cookies', () => {
      it('returns error AuthenticationError', async () => {
        const { errors } = await me();
        expect(errors[0].name).toEqual(TokenAuthenticationError.name);
      });
    });

    describe('on wrong cookies', () => {
      it('returns error AuthenticationError', async () => {
        const { errors } = await me({ headers: { Cookie: 'wrong' } });
        expect(errors[0].name).toEqual(TokenAuthenticationError.name);
      });
    });
  });
});
