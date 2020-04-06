import { NotNullViolationError, UniqueViolationError } from "db-errors";
import { sortBy } from "lodash/fp";
import store from "./store";

afterAll(store.close);
beforeEach(store.purge);

const { Tenant } = store;

describe(`Topic(tenantId)`, () => {
  describe(`all()`, () => {
    it(`returns all by "tenantId"`, async done => {
      const { id: tenantId1 } = await Tenant.insert({ name: "tenant1" });
      const { id: tenantId2 } = await Tenant.insert({ name: "tenant2" });

      const Topic1 = store.Topic(tenantId1);
      await Topic1.insert({ name: "topic1-1" });

      const Topic2 = store.Topic(tenantId2);

      await Topic2.insert({ name: "topic2-1" });
      await Topic2.insert({ name: "topic2-2" });

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
      const { id: tenantId } = await Tenant.insert({ name: "tenant" });
      const Topic = store.Topic(tenantId);

      const actual = await Topic.insert({ name: "cooking" });
      expect(actual).toHaveProperty("id");
      expect(actual).toHaveProperty("createdAt");
      expect(actual).toHaveProperty("updatedAt");

      expect(actual.name).toEqual("cooking");
      expect(actual.tenantId).toEqual(tenantId);
      done();
    });

    describe(`validations`, () => {
      it(`requires "name"`, async () => {
        const { id: tenantId } = await Tenant.insert({ name: "tenant" });
        const Topic = store.Topic(tenantId);

        return Topic.insert({}).catch(e => {
          expect(e.column).toEqual("name");
          expect(e instanceof NotNullViolationError).toEqual(true);
        });
      });

      it(`requires ["name", "tenantId"] to be unique`, async () => {
        const { id: tenantId1 } = await Tenant.insert({ name: "tenant1" });
        const { id: tenantId2 } = await Tenant.insert({ name: "tenant2" });

        const Topic1 = store.Topic(tenantId1);
        const Topic2 = store.Topic(tenantId2);

        await Topic1.insert({ name: "cooking" });
        await Topic2.insert({ name: "cooking" });

        return Topic1.insert({ name: "cooking" }).catch(e => {
          expect(e.columns).toEqual(["name", "tenantId"]);
          expect(e.constraint).toEqual("topic_name_tenantid_unique");
          expect(e instanceof UniqueViolationError).toEqual(true);
        });
      });
    });
  });
});
