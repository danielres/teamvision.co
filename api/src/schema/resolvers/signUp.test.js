import config from '../../../config';
import sender from '../../../emails/sender';
import store from '../../../store/store';
import samples from '../../../store/test/samples';
import { signUp } from '../../../test/queries';
import testSpy from '../../../test/testSpy';
import isUuid from '../../isUuid';

jest.mock('../../../emails/sender'); // Disable sending mails

afterAll(store.close);
beforeAll(store.purge);

const spy = jest.spyOn(testSpy, 'spy');

const { jane: janeFactory } = samples.SignUpInput;
const jane = janeFactory();

const db = {
  Tenant: { first: () => store.getKnex()('Tenant').first() },
  User: { first: () => store.getKnex()('User').first() },
};

describe('mutation SignUp', () => {
  let data;
  let senderArgs;
  let dbJane;

  describe('on success', () => {
    beforeAll(async () => {
      sender.verifyEmail = jest.fn();
      data = (await signUp(jane)).data;
      const spyResult = spy.mock.calls[0][0].SignUp;
      dbJane = spyResult.user;
      [[senderArgs]] = sender.verifyEmail.mock.calls;
    });

    it('returns true', () => {
      return expect(data.signUp).toEqual(true);
    });

    it('inserts the user in the db with reference to new default tenant', async done => {
      const { email, name } = jane.args;
      expect(dbJane).toMatchObject({ email, name });
      expect(isUuid(dbJane.id)).toBe(true);
      expect(isUuid(dbJane.tenantId)).toBe(true);
      done();
    });

    describe('sender.verifyEmail', () => {
      it('is called with email + expiresIn + name + tenantShortId + token', async () => {
        expect(Object.keys(senderArgs)).toEqual(['email', 'expiresIn', 'name', 'tenantShortId', 'token']);
      });

      it(`receives the user's email`, () => {
        expect(senderArgs.email).toEqual(jane.args.email);
      });

      it(`receives correct expiresIn`, () => {
        expect(senderArgs.expiresIn).toEqual(config.auth.verifyEmail.jwt.expSeconds);
      });

      it(`receives token with user id`, () => {
        const decoded = JSON.parse(atob(senderArgs.token.split('.')[1]));
        expect(decoded.id).toEqual(dbJane.id);
      });
    });

    it('creates a default tenant for the user', async () => {
      const user = await db.User.first();
      const tenant = await db.Tenant.first();
      return expect(user.tenantId).toEqual(tenant.id);
    });
  });

  describe('errors', () => {
    describe('on invalid email', () => {
      const variables = janeFactory({ email: 'faulty@' });

      it('returns an informative error', async () => {
        const { errors } = await signUp(variables);
        return expect(errors[0].message).toEqual('email must be a valid email');
      });
    });

    describe('on invalid name', () => {
      const variables = janeFactory({ name: 'a' });

      it('returns an informative error', async () => {
        const { errors } = await signUp(variables);
        return expect(errors[0].message).toEqual('name must be at least 3 characters');
      });
    });
  });
});
