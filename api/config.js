import { boolean, number, object, string } from 'yup';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const config = {
  auth: {
    cookie: {
      key1: process.env.AUTH_COOKIE_KEY1,
      key2: process.env.AUTH_COOKIE_KEY2,
      maxAgeMinutes: process.env.AUTH_COOKIE_MAX_AGE_MINUTES,
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

const validator = object().shape({
  auth: object().shape({
    cookie: object().shape({
      key1: string().min(20).required(),
      key2: string().min(20).required(),
      maxAgeMinutes: number().integer().positive().required(),
      secure: boolean().required(),
    }),
  }),

  bcrypt: object().shape({
    saltRounds: number().integer().positive().required(),
  }),

  pg: object().shape({
    password: string()
      .min(isTest || isDev ? 3 : 20)
      .required(),
    user: string().min(3).required(),
  }),
});

validator.validate(config, { abortEarly: false });

export default config;
