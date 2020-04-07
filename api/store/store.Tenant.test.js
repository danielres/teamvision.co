import { NotNullViolationError, UniqueViolationError } from "db-errors";
import store from "./store";
import { samples } from "./test/support";

const {
  tenants: { tenant1, tenant2 }
} = samples;

afterAll(store.close);
beforeEach(store.purge);

const { Tenant } = store;

describe(`Tenant`, () => {
  describe(`all()`, () => {
    it("returns all", async done => {
      await Tenant.insert(tenant1);
      await Tenant.insert(tenant2);
      const actual = await Tenant.all();
      expect(actual.map(t => t.name).sort()).toEqual(["tenant1", "tenant2"]);
      done();
    });
  });

  describe(`insert()`, () => {
    it(`inserts a tenant`, async done => {
      const actual = await Tenant.insert(tenant1);

      expect(actual).toHaveProperty("id");
      expect(actual).toHaveProperty("createdAt");
      expect(actual).toHaveProperty("updatedAt");

      expect(actual.name).toEqual("tenant1");
      done();
    });

    describe(`validations`, () => {
      it(`requires "name"`, async () => {
        return Tenant.insert({}).catch(e => {
          expect(e.column).toEqual("name");
          expect(e instanceof NotNullViolationError).toEqual(true);
        });
      });

      it(`requires "name" to be unique`, async () => {
        await Tenant.insert({ name: "Acme" });

        return Tenant.insert({ name: "Acme" }).catch(e => {
          expect(e.columns).toEqual(["name"]);
          expect(e.constraint).toEqual("tenant_name_unique");
          expect(e instanceof UniqueViolationError).toEqual(true);
        });
      });
    });
  });
});
