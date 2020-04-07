import { NotNullViolationError, UniqueViolationError } from 'db-errors';
import { sortBy } from 'lodash/fp';
import store from './store';
import { samples } from './test/support';

const {
  tenants: { tenant1, tenant2 },
  users: { anne, john, user1_1, user1_2, user2_1, user2_2 },
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
      await User1.insert(user1_1);

      const User2 = store.User(tenantId2);

      await User2.insert(user2_1);
      await User2.insert(user2_2);

      const actual = await User2.all();

      expect(sortBy('name', actual).map(t => t.name)).toEqual([user2_1.name, user2_2.name]);

      expect(actual.map(t => t.tenantId)).toEqual([tenantId2, tenantId2]);
      done();
    });
  });

  describe(`insert()`, () => {
    it(`inserts a user with correct "tenantId"`, async done => {
      const { id: tenantId } = await Tenant.insert(tenant1);
      const User = store.User(tenantId);

      const actual = await User.insert(anne);
      expect(actual).toHaveProperty('id');
      expect(actual).toHaveProperty('createdAt');
      expect(actual).toHaveProperty('updatedAt');

      expect(actual.name).toEqual(anne.name);
      expect(actual.tenantId).toEqual(tenantId);
      done();
    });

    describe(`validations`, () => {
      it(`requires "name"`, async () => {
        const { id: tenantId } = await Tenant.insert(tenant1);
        const User = store.User(tenantId);

        return User.insert({ ...anne, name: undefined }).catch(e => {
          expect(e.column).toEqual('name');
          expect(e instanceof NotNullViolationError).toEqual(true);
        });
      });

      it(`requires "email"`, async () => {
        const { id: tenantId } = await Tenant.insert(tenant1);
        const User = store.User(tenantId);

        return User.insert({ ...anne, email: undefined }).catch(e => {
          expect(e.column).toEqual('email');
          expect(e instanceof NotNullViolationError).toEqual(true);
        });
      });

      it(`requires ["name", "tenantId"] to be unique`, async () => {
        const { id: tenantId1 } = await Tenant.insert(tenant1);
        const { id: tenantId2 } = await Tenant.insert(tenant2);

        const User1 = store.User(tenantId1);
        const User2 = store.User(tenantId2);

        await User1.insert({ ...user1_1, name: 'same' });
        await User2.insert({ ...user1_1, name: 'same' });

        return User1.insert({ ...user1_1, name: 'same' }).catch(e => {
          expect(e.columns).toEqual(['name', 'tenantId']);
          expect(e.constraint).toEqual('user_name_tenantid_unique');
          expect(e instanceof UniqueViolationError).toEqual(true);
        });
      });

      it(`requires ["email", "tenantId"] to be unique`, async () => {
        const { id: tenantId1 } = await Tenant.insert(tenant1);
        const { id: tenantId2 } = await Tenant.insert(tenant2);

        const User1 = store.User(tenantId1);
        const User2 = store.User(tenantId2);

        await User1.insert({ ...user1_1, email: 'same@example.com' });
        await User2.insert({ ...user1_1, email: 'same@example.com' });

        return User1.insert({ ...user2_1, email: 'same@example.com' }).catch(e => {
          expect(e.columns).toEqual(['email', 'tenantId']);
          expect(e.constraint).toEqual('user_email_tenantid_unique');
          expect(e instanceof UniqueViolationError).toEqual(true);
        });
      });
    });
  });
});
