import { wrapError } from "db-errors";
import Knex from "knex";
import Tenant from "./factories/Tenant";
import knexfile from "./knexfile";

let cached;

const getKnex = () =>
  (cached = cached
    ? cached
    : new Knex(knexfile).on("query-error", e => {
        throw wrapError(e);
      }));

const close = async () => {
  if (!cached) return;
  await cached.destroy();
  cached = undefined;
};

const purge = async () => {
  const knex = getKnex();
  const { rows } = await knex.raw(
    `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'`
  );
  const migrationTable = knexfile.migrations.tableName;
  const models = rows
    .map(r => r.tablename)
    .filter(t => !t.startsWith(migrationTable));
  return Promise.all(models.map(t => knex(t).del()));
};

export default {
  close,
  purge,
  Tenant: Tenant(getKnex())
};