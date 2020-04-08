const config = require('../config').default;

const {
  pg: { database, user, password, port },
} = config;

module.exports = {
  client: 'postgresql',
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: `${__dirname}/migrations`,
  },
  connection: {
    database,
    user,
    password,
    port,
  },
};
