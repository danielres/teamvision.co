import { UniqueViolationError } from 'db-errors';
import { ValidationError } from 'yup';
import store from './store';
import { samples } from './test/support';

const {
  tenants: { tenant1, tenant2 },
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
        return expect(Tenant.insert({ tenant1, name: undefined })).rejects.toMatchObject({
          errors: ['name is a required field'],
          name: ValidationError.name,
          message: 'name is a required field',
        });
      });

      describe('name', () => {
        it('must be at least 3 chars', async () => {
          return expect(Tenant.insert({ tenant1, name: '12' })).rejects.toMatchObject({
            errors: ['name must be at least 3 characters'],
            name: ValidationError.name,
            message: 'name must be at least 3 characters',
          });
        });
      });
    });
  });
});
