import sender from '../../../emails/sender';
import store from '../../../store/store';
import { GraphqlClient } from '../../../test/graphlClient';
import isUuid from '../../../test/isUuid';
import queries from '../../../test/queries';

afterAll(store.close);

const { mutate } = GraphqlClient();

const args = {
  email: 'jane@example.com',
  name: 'Jane',
  password: 'ertyuiopkjhgfdfhjk',
};

let data;

beforeAll(async () => {
  jest.resetAllMocks();
  await store.purge();
});

describe('mutation SignUp', () => {
  describe('on success', () => {
    beforeAll(async () => {
      sender.signUpSuccess = jest.fn();
      data = (await mutate({ query: queries.SIGN_UP, variables: { args } })).data;
    });

    it('returns true', () => {
      return expect(data.signUp).toEqual(true);
    });

    it('inserts the user in the db', async done => {
      const [user] = await store.getKnex()('User');
      expect(user).toMatchObject({ email: args.email, name: args.name });
      expect(isUuid(user.id)).toBe(true);
      expect(isUuid(user.tenantId)).toBe(true);
      done();
    });

    it('calls sender.signUpSuccess with email + name', () => {
      return expect(sender.signUpSuccess).toHaveBeenCalledWith({ email: args.email, name: args.name });
    });

    it('creates a default tenant for the user', async () => {
      const [user] = await store.getKnex()('User');
      const [tenant] = await store.getKnex()('Tenant');
      return expect(user.tenantId).toEqual(tenant.id);
    });
  });

  describe('errors', () => {
    describe('on invalid email', () => {
      it('returns an informative error', async () => {
        const { errors } = await mutate({ query: queries.SIGN_UP, variables: { args: { ...args, email: 'faulty@' } } });
        return expect(errors[0].message).toEqual('email must be a valid email');
      });
    });

    describe('on invalid name', () => {
      it('returns an informative error', async () => {
        const { errors } = await mutate({ query: queries.SIGN_UP, variables: { args: { ...args, name: 'a' } } });
        return expect(errors[0].message).toEqual('name must be at least 3 characters');
      });
    });
  });
});
