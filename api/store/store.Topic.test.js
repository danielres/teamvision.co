import { ForeignKeyViolationError, NotNullViolationError, UniqueViolationError } from 'db-errors';
import { sortBy } from 'lodash/fp';
import store from './store';
import { samples } from './test/support';

const {
  tenants: { tenant1, tenant2 },
  topics: { cooking, topic1_1, topic1_2, topic2_1, topic2_2 },
} = samples;

afterAll(store.close);
beforeEach(store.purge);

const { Tenant } = store;

describe(`Topic(tenantId)`, () => {
  describe('constraints', () => {
    it('references a tenant by tenantId', async () => {
      const uuid = '7ec5163c-e4b5-4ba3-84e9-71536407c9bb';
      const Topic = store.Topic(uuid);
      await expect(Topic.insert(cooking)).rejects.toMatchObject({
        constraint: 'topic_tenantid_foreign',
        name: ForeignKeyViolationError.name,
        table: 'Topic',
      });
    });

    it(`has unique name by tenantId`, async () => {
      const { id: tenantId1 } = await Tenant.insert(tenant1);
      const { id: tenantId2 } = await Tenant.insert(tenant2); // eslint-disable-line no-unused-vars
      const Topic1 = store.Topic(tenantId1);
      const Topic2 = store.Topic(tenantId2);

      const name = 'same_name';
      await Topic1.insert({ ...topic1_1, name });

      await expect(Topic2.insert({ ...topic2_1, name })).resolves.not.toThrow();
      await expect(Topic1.insert({ ...topic1_2, name })).rejects.toMatchObject({
        name: UniqueViolationError.name,
        columns: ['name', 'tenantId'],
        constraint: 'topic_name_tenantid_unique',
      });
    });
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
      it(`requires "name"`, async () => {
        const { id: tenantId } = await Tenant.insert(tenant1);
        const Topic = store.Topic(tenantId);

        return Topic.insert({}).catch(e => {
          expect(e.column).toEqual('name');
          expect(e instanceof NotNullViolationError).toEqual(true);
        });
      });

      it(`requires ["name", "tenantId"] to be unique`, async () => {
        const { id: tenantId1 } = await Tenant.insert(tenant1);
        const { id: tenantId2 } = await Tenant.insert(tenant2);

        const Topic1 = store.Topic(tenantId1);
        const Topic2 = store.Topic(tenantId2);

        await Topic1.insert(cooking);
        await Topic2.insert(cooking);

        return Topic1.insert(cooking).catch(e => {
          expect(e.columns).toEqual(['name', 'tenantId']);
          expect(e.constraint).toEqual('topic_name_tenantid_unique');
          expect(e instanceof UniqueViolationError).toEqual(true);
        });
      });
    });
  });
});
