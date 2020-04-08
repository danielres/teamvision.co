const { onUpdateTrigger } = require('./helpers');

exports.up = async knex => {
  return knex.schema
    .createTable('Topic', t => {
      t.uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      t.uuid('tenantId')
        .notNullable()
        .references('id')
        .inTable('Tenant')
        .onDelete('cascade');
      t.string('name', 255).notNullable();
      t.timestamp('createdAt').defaultTo(knex.fn.now());
      t.timestamp('updatedAt');
      t.unique(['name', 'tenantId']);
      t.index(['name', 'tenantId'], 'topic_name_tenant_id_index');
    })
    .then(() => knex.schema.raw(onUpdateTrigger('Topic')));
};

exports.down = knex => knex.schema.dropTable('Topic');
