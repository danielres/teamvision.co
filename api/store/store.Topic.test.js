import { NotNullViolationError, UniqueViolationError } from "db-errors";
import { sortBy } from "lodash/fp";
import store from "./store";
import { samples } from "./test/support";

const {
  tenants: { tenant1, tenant2 },
  topics: { cooking, topic1_1, topic1_2, topic2_1, topic2_2 }
} = samples;

afterAll(store.close);
beforeEach(store.purge);

const { Tenant } = store;

describe(`Topic(tenantId)`, () => {
  describe(`all()`, () => {
    it(`returns all by "tenantId"`, async done => {
      const { id: tenantId1 } = await Tenant.insert(tenant1);
      const { id: tenantId2 } = await Tenant.insert(tenant2);

      const Topic1 = store.Topic(tenantId1);
      await Topic1.insert(topic1_1);

      const Topic2 = store.Topic(tenantId2);

      await Topic2.insert(topic2_1);
      await Topic2.insert(topic2_2);

      const actual = await Topic2.all();

      expect(sortBy("name", actual).map(t => t.name)).toEqual([
        "topic2-1",
        "topic2-2"
      ]);

      expect(actual.map(t => t.tenantId)).toEqual([tenantId2, tenantId2]);

      done();
    });
  });

  describe(`insert()`, () => {
    it(`inserts a topic with correct "tenantId"`, async done => {
      const { id: tenantId } = await Tenant.insert(tenant1);
      const Topic = store.Topic(tenantId);

      const actual = await Topic.insert(cooking);
      expect(actual).toHaveProperty("id");
      expect(actual).toHaveProperty("createdAt");
      expect(actual).toHaveProperty("updatedAt");

      expect(actual.name).toEqual(cooking.name);
      expect(actual.tenantId).toEqual(tenantId);
      done();
    });

    describe(`validations`, () => {
      it(`requires "name"`, async () => {
        const { id: tenantId } = await Tenant.insert(tenant1);
        const Topic = store.Topic(tenantId);

        return Topic.insert({}).catch(e => {
          expect(e.column).toEqual("name");
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
          expect(e.columns).toEqual(["name", "tenantId"]);
          expect(e.constraint).toEqual("topic_name_tenantid_unique");
          expect(e instanceof UniqueViolationError).toEqual(true);
        });
      });
    });
  });
});
