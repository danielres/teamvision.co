import { UniqueViolationError } from 'db-errors';
import { ValidationError } from 'yup';
import store from './store';
import samples from './test/samples';

const {
  Tenant: { tenant1, tenant2, tenant3 },
  User: { anne, john },
} = samples;

afterAll(store.close);
beforeEach(store.purge);

const { Tenant } = store;

describe(`Tenant`, () => {
  describe('constraints', () => {
    it(`has unique name`, async () => {
      await Tenant.insert({ name: 'Acme' });

      await expect(Tenant.insert({ name: 'Acme' })).rejects.toMatchObject({
        name: UniqueViolationError.name,
        columns: ['name'],
        constraint: 'tenant_name_unique',
      });
    });

    it(`has unique shortId`, async () => {
      const { shortId } = await Tenant.insert({ name: 'Acme' });
      await expect(Tenant.insert({ name: 'Acme2', shortId })).rejects.toMatchObject({
        name: UniqueViolationError.name,
        columns: ['shortId'],
        constraint: 'tenant_shortid_unique',
      });
    });
  });

  describe(`all()`, () => {
    it(`returns all`, async done => {
      await Tenant.insert(tenant1);
      await Tenant.insert(tenant2);
      const actual = await Tenant.all();
      expect(actual.map(t => t.name).sort()).toEqual(['tenant1', 'tenant2']);
      done();
    });
  });

  describe(`byUserEmail()`, () => {
    it('returns all tenants for a user email', async () => {
      const t1 = await Tenant.insert(tenant1);
      const t2 = await Tenant.insert(tenant2);
      const t3 = await Tenant.insert(tenant3);
      await store.User(t1.id).insert(anne);
      await store.User(t2.id).insert(anne);
      await store.User(t1.id).insert(john);
      await store.User(t3.id).insert(john);

      const actual1 = await Tenant.byUserEmail({ email: anne.email });
      expect(actual1).toEqual([t1, t2]);

      const actual2 = await Tenant.byUserEmail({ email: john.email });
      expect(actual2).toEqual([t1, t3]);
    });
  });

  describe(`insert()`, () => {
    it(`inserts a tenant`, async done => {
      const actual = await Tenant.insert(tenant1);

      expect(actual).toHaveProperty('id');
      expect(actual).toHaveProperty('createdAt');
      expect(actual).toHaveProperty('updatedAt');

      expect(actual.name).toEqual('tenant1');
      done();
    });

    describe(`validations`, () => {
      it(`requires "name"`, async () => {
        return expect(Tenant.insert({ ...tenant1, name: undefined })).rejects.toMatchObject({
          errors: ['name is a required field'],
          name: ValidationError.name,
          message: 'name is a required field',
        });
      });

      describe('name', () => {
        it('must be at least 3 chars', async () => {
          return expect(Tenant.insert({ ...tenant1, name: '12' })).rejects.toMatchObject({
            errors: ['name must be at least 3 characters'],
            name: ValidationError.name,
            message: 'name must be at least 3 characters',
          });
        });
      });

      describe('shortId', () => {
        it('must be at least 2 chars', async () => {
          return expect(Tenant.insert({ ...tenant1, shortId: '12' })).rejects.toMatchObject({
            errors: ['shortId must be at least 3 characters'],
            name: ValidationError.name,
            message: 'shortId must be at least 3 characters',
          });
        });
      });
    });
  });
});