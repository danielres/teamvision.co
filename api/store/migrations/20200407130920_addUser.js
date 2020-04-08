const { onUpdateTrigger } = require('./helpers');

exports.up = async knex => {
  return knex.schema
    .createTable('User', t => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.uuid('tenantId').notNullable().references('id').inTable('Tenant').onDelete('cascade');
      t.string('email', 255).notNullable();
      t.string('name', 255).notNullable();
      t.string('password', 255).notNullable();
      t.timestamp('createdAt').defaultTo(knex.fn.now());
      t.timestamp('updatedAt');
      t.unique(['name', 'tenantId']);
      t.unique(['email', 'tenantId']);
    })
    .then(() => knex.schema.raw(onUpdateTrigger('User')));
};

exports.down = knex => knex.schema.dropTable('User');
