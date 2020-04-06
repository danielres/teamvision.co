const { onUpdateTrigger } = require("./helpers");

exports.up = async knex => {
  return knex.schema
    .createTable("Tenant", t => {
      t.uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      t.string("name", 255)
        .notNullable()
        .index()
        .unique();
      t.timestamp("createdAt").defaultTo(knex.fn.now());
      t.timestamp("updatedAt");
    })
    .then(() => knex.schema.raw(onUpdateTrigger("Tenant")));
};

exports.down = knex => knex.schema.dropTable("Tenant");
