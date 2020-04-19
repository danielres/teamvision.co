import { sortBy } from 'lodash/fp';
import { ValidationError } from 'yup';
import { verifyPassword } from '../src/utils';
import store from './store';
import samples from './test/samples';
import { constraints } from './test/shared';

const {
  Tenant: { tenant1, tenant2 },
  User: { anne, user1_1, user1_2, user2_1, user2_2 },
} = samples;

afterAll(store.close);
beforeEach(store.purge);

const { Tenant } = store;

describe(`User(tenantId)`, () => {
  describe('constraints', () => {
    const table = 'User';
    constraints.referencesTenantByTenantId({ store, table });
    constraints.hasUniqueColumnByTenantId({ store, table, column: 'name' });
    constraints.hasUniqueColumnByTenantId({ store, table, column: 'email' });
  });

  describe(`all()`, () => {
    it(`returns all by tenantId`, async done => {
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

  describe(`insert()`, () => {
    it(`inserts a user by tenantId`, async done => {
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
        const [dbAnne] = await User.all();
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

  describe('updatePassword()', () => {
    it('hashes and updates the password', async () => {
      const { id: tenantId } = await Tenant.insert(tenant1);
      const User = store.User(tenantId);
      const dbAnne = await User.insert(anne);

      const newPassword = '12345XXXXX';
      await User.updatePassword({ id: dbAnne.id, password: newPassword });
      const [dbAnneUpdated] = await User.all();
      const isCorrectPassword = await verifyPassword(newPassword, dbAnneUpdated.password);

      expect(isCorrectPassword).toEqual(true);
    });

    describe('validations', () => {
      let id;
      let User;

      beforeAll(async () => {
        const { id: tenantId } = await Tenant.insert(tenant2);
        User = store.User(tenantId);
        id = (await User.insert(anne)).id;
      });

      describe('user id', () => {
        it('must be a valid uuid', async () => {
          const password = 'validPassword';
          expect(User.updatePassword({ id: 'WRONG', password })).rejects.toMatchObject({
            errors: ['User id is not in correct format'],
            name: ValidationError.name,
            message: 'User id is not in correct format',
          });
        });
      });

      describe('password', () => {
        it('must be at least 6 chars', async () => {
          const password = 'BAD';
          expect(User.updatePassword({ id, password })).rejects.toMatchObject({
            errors: ['password must be at least 6 characters'],
            name: ValidationError.name,
            message: 'password must be at least 6 characters',
          });
        });
      });
    });
  });
});
