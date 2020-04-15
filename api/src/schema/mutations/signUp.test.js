import sender from '../../../emails/sender';
import store from '../../../store/store';
import samples from '../../../store/test/samples';
import isUuid from '../../../test/isUuid';
import { signUp } from '../../../test/queries';

jest.mock('../../../emails/sender'); // Disable sending mails

afterAll(store.close);
beforeAll(store.purge);

const { jane: janeFactory } = samples.SignUpInput;
const jane = janeFactory();

const db = {
  Tenant: { first: () => store.getKnex()('Tenant').first() },
  User: { first: () => store.getKnex()('User').first() },
};

describe('mutation SignUp', () => {
  let data;

  describe('on success', () => {
    beforeAll(async () => {
      sender.signUpSuccess = jest.fn();
      data = (await signUp(jane)).data;
    });

    it('returns true', () => {
      return expect(data.signUp).toEqual(true);
    });

    it('inserts the user in the db with reference to new default tenant', async done => {
      const { email, name } = jane.args;
      const user = await db.User.first();
      expect(user).toMatchObject({ email, name });
      expect(isUuid(user.id)).toBe(true);
      expect(isUuid(user.tenantId)).toBe(true);
      done();
    });

    it('calls sender.signUpSuccess with email + name', () => {
      const { email, name } = jane.args;
      return expect(sender.signUpSuccess).toHaveBeenCalledWith({ email, name });
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
