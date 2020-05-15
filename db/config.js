const validateConfig = require('@danielres/validate-config').default;

const { env } = process;

const checks = {
  port: [v => Number.isInteger(v) && v > 0, Number, 'should be a positive integer'],
};

const config = {
  pg: {
    database: [env.PG_DB, 'string'],
    password: [env.PG_PASSWORD, 'string'],
    port: [env.PG_PORT, 'port'],
    user: [env.PG_USER, 'string'],
  },
};

module.exports = validateConfig(checks)(config);
