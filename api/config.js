const isTest = process.env.NODE_ENV === 'test';

export default {
  auth: {
    cookie: {
      key1: process.env.AUTH_COOKIE_KEY1,
      key2: process.env.AUTH_COOKIE_KEY2,
      secure: process.env.AUTH_COOKIE_UNSECURE !== 'true',
    },
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 11,
  },

  pg: {
    password: process.env.PG_PASSWORD,
    user: process.env.PG_USER,
    ...(isTest
      ? { database: process.env.PG_DB_TEST, port: process.env.PG_PORT_TEST }
      : { database: process.env.PG_DB, port: process.env.PG_PORT }),
  },
};
