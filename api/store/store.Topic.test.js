import { sortBy } from 'lodash/fp';
import { ValidationError } from 'yup';
import store from './store';
import samples from './test/samples';
import { constraints } from './test/shared';

const {
  Tenant: { tenant1, tenant2 },
  Topic: { cooking, topic1_1, topic1_2, topic2_1, topic2_2 },
} = samples;

afterAll(store.close);
beforeEach(store.purge);

const { Tenant } = store;

describe(`Topic(tenantId)`, () => {
  describe('constraints', () => {
    const table = 'Topic';
    constraints.referencesTenantByTenantId({ store, table });
    constraints.hasUniqueColumnByTenantId({ store, table, column: 'name' });
  });

  describe(`all()`, () => {
    it(`returns all by "tenantId"`, async done => {
      const { id: tenantId1 } = await Tenant.insert(tenant1);
      const { id: tenantId2 } = await Tenant.insert(tenant2);

      const Topic1 = store.Topic(tenantId1);
      await Topic1.insert(topic1_1);
      await Topic1.insert(topic1_2);

      const Topic2 = store.Topic(tenantId2);

      await Topic2.insert(topic2_1);
      await Topic2.insert(topic2_2);

      const actual = await Topic2.all();

      expect(sortBy('name', actual).map(t => t.name)).toEqual(['topic2-1', 'topic2-2']);

      expect(actual.map(t => t.tenantId)).toEqual([tenantId2, tenantId2]);

      done();
    });
  });

  describe(`insert()`, () => {
    it(`inserts a topic with correct "tenantId"`, async done => {
      const { id: tenantId } = await Tenant.insert(tenant1);
      const Topic = store.Topic(tenantId);

      const actual = await Topic.insert(cooking);
      expect(actual).toHaveProperty('id');
      expect(actual).toHaveProperty('createdAt');
      expect(actual).toHaveProperty('updatedAt');

      expect(actual.name).toEqual(cooking.name);
      expect(actual.tenantId).toEqual(tenantId);
      done();
    });

    describe(`validations`, () => {
      it(`requires name`, async () => {
        const { id: tenantId } = await Tenant.insert(tenant1);
        const Topic = store.Topic(tenantId);

        return expect(Topic.insert({ ...cooking, name: undefined })).rejects.toMatchObject({
          errors: ['name is a required field'],
          name: ValidationError.name,
          message: 'name is a required field',
        });
      });

      describe('name', () => {
        it('must be at least 2 chars', async () => {
          const { id: tenantId } = await Tenant.insert(tenant1);
          const Topic = store.Topic(tenantId);

          return expect(Topic.insert({ ...cooking, name: 'a' })).rejects.toMatchObject({
            errors: ['name must be at least 2 characters'],
            name: ValidationError.name,
            message: 'name must be at least 2 characters',
          });
        });
      });
    });
  });
});
