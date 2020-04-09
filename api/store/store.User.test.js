import { UniqueViolationError } from 'db-errors';
import { sortBy } from 'lodash/fp';
import { ValidationError } from 'yup';
import { verifyPassword } from '../src/utils';
import store from './store';
import { samples } from './test/support';

const {
  tenants: { tenant1, tenant2 },
  users: { anne, user1_1, user1_2, user2_1, user2_2 },
} = samples;

afterAll(store.close);
beforeEach(store.purge);

const { Tenant } = store;

describe(`User(tenantId)`, () => {
  describe(`all()`, () => {
    it(`returns all by "tenantId"`, async done => {
      const { id: tenantId1 } = await Tenant.insert(tenant1);
      const { id: tenantId2 } = await Tenant.insert(tenant2);
      const User1 = store.User(tenantId1);
      const User2 = store.User(tenantId2);
      await User1.insert(user1_1);
      await User1.insert(user1_2);
      await User2.insert(user2_1);
      await User2.insert(user2_2);

      const actual = await User2.all();

      expect(sortBy('name', actual).map(t => t.name)).toEqual([user2_1.name, user2_2.name]);

      expect(actual.map(t => t.tenantId)).toEqual([tenantId2, tenantId2]);
      done();
    });
  });

  describe('constraints', () => {
    it(`requires [name, tenantId] to be unique`, async () => {
      const { id: tenantId1 } = await Tenant.insert(tenant1);
      const { id: tenantId2 } = await Tenant.insert(tenant2); // eslint-disable-line no-unused-vars
      const User1 = store.User(tenantId1);
      const User2 = store.User(tenantId2);

      const name = 'same_name';
      await User1.insert({ ...user1_1, name });

      await expect(User2.insert({ ...user2_1, name })).resolves.not.toThrow();
      await expect(User1.insert({ ...user1_2, name })).rejects.toMatchObject({
        name: UniqueViolationError.name,
        columns: ['name', 'tenantId'],
        constraint: 'user_name_tenantid_unique',
      });
    });

    it(`requires [email, tenantId] to be unique`, async () => {
      const { id: tenantId } = await Tenant.insert(tenant1);
      const { id: tenantId2 } = await Tenant.insert(tenant2); // eslint-disable-line no-unused-vars
      const User1 = store.User(tenantId);
      const User2 = store.User(tenantId2);

      const email = 'same_email@example.com';
      await User1.insert({ ...user1_1, email });

      await expect(User2.insert({ ...user2_1, email })).resolves.not.toThrow();
      await expect(User1.insert({ ...user1_2, email })).rejects.toMatchObject({
        name: UniqueViolationError.name,
        columns: ['email', 'tenantId'],
        constraint: 'user_email_tenantid_unique',
      });
    });
  });

  describe(`insert()`, () => {
    it(`inserts a user with correct "tenantId"`, async done => {
      const { id: tenantId } = await Tenant.insert(tenant1);
      const User = store.User(tenantId);

      const actual = await User.insert(anne);
      expect(Object.keys(actual)).toEqual(['id', 'tenantId', 'email', 'name', 'password', 'createdAt', 'updatedAt']);
      expect(actual.name).toEqual(anne.name);
      expect(actual.tenantId).toEqual(tenantId);
      done();
    });

    describe('password', () => {
      it('is hashed', async done => {
        const { id: tenantId } = await Tenant.insert(tenant1);
        const User = store.User(tenantId);

        await User.insert(anne);
        const dbAnne = (await User.all())[0];
        const isCorrectPassword = await verifyPassword(anne.password, dbAnne.password);
        expect(isCorrectPassword).toBe(true);
        done();
      });
    });

    describe(`validations`, () => {
      it(`requires email + name + password`, async () => {
        const { id: tenantId } = await Tenant.insert(tenant1);
        const User = store.User(tenantId);

        return expect(User.insert({})).rejects.toMatchObject({
          errors: ['name is a required field', 'email is a required field', 'password is a required field'],
          name: ValidationError.name,
          message: '3 errors occurred',
        });
      });

      describe('email', () => {
        it('must be a valid email', async () => {
          const { id: tenantId } = await Tenant.insert(tenant1);
          const User = store.User(tenantId);

          return expect(User.insert({ ...anne, email: 'faultyemail' })).rejects.toMatchObject({
            errors: ['email must be a valid email'],
            name: ValidationError.name,
            message: 'email must be a valid email',
          });
        });
      });

      describe('name', () => {
        it('must be at least 3 chars', async () => {
          const { id: tenantId } = await Tenant.insert(tenant1);
          const User = store.User(tenantId);

          return expect(User.insert({ ...anne, name: 'ab' })).rejects.toMatchObject({
            errors: ['name must be at least 3 characters'],
            name: ValidationError.name,
            message: 'name must be at least 3 characters',
          });
        });
      });

      describe('password', () => {
        it('must be at least 6 chars', async () => {
          const { id: tenantId } = await Tenant.insert(tenant1);
          const User = store.User(tenantId);

          return expect(User.insert({ ...anne, password: '12345' })).rejects.toMatchObject({
            errors: ['password must be at least 6 characters'],
            name: ValidationError.name,
            message: 'password must be at least 6 characters',
          });
        });
      });
    });
  });
});
