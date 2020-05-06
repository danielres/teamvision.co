import { boolean, number, object, string } from 'yup';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const config = {
  api: {
    port: isTest ? process.env.API_PORT_TEST : process.env.API_PORT,
  },

  auth: {
    cookie: {
      key1: process.env.AUTH_COOKIE_KEY1,
      key2: process.env.AUTH_COOKIE_KEY2,
      maxAgeMinutes: process.env.AUTH_COOKIE_MAX_AGE_MINUTES,
      secure: process.env.AUTH_COOKIE_UNSECURE !== 'true',
    },

    resetPassword: {
      jwt: {
        expSeconds: parseInt(process.env.AUTH_RESET_PASSWORD_JWT_EXP_SECONDS, 10) || 15 * 60,
        secret: process.env.AUTH_RESET_PASSWORD_JWT_SECRET,
      },
    },

    verifyEmail: {
      jwt: {
        expSeconds: parseInt(process.env.AUTH_RESET_PASSWORD_JWT_EXP_SECONDS, 10) || 15 * 60,
        secret: process.env.AUTH_RESET_PASSWORD_JWT_SECRET,
      },
    },
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 11,
  },

  mailer: {
    from: process.env.MAILER_FROM,
    smtp: {
      auth: {
        user: process.env.MAILER_SMTP_AUTH_USER,
        pass: process.env.MAILER_SMTP_AUTH_PASSWORD,
      },
      host: process.env.MAILER_SMTP_HOST,
      port: parseInt(process.env.MAILER_SMTP_PORT, 10),
      secure: process.env.MAILER_SMTP_SECURE !== 'false',
    },
  },

  pg: {
    password: process.env.PG_PASSWORD,
    user: process.env.PG_USER,
    ...(isTest
      ? { database: process.env.PG_DB_TEST, port: process.env.PG_PORT_TEST }
      : { database: process.env.PG_DB, port: process.env.PG_PORT }),
  },

  ui: {
    host: isTest ? process.env.UI_HOST_TEST : process.env.UI_HOST,
    paths: {
      passwordReset: process.env.UI_PATH_PASSWORD_RESET,
      verifyEmail: process.env.UI_PATH_VERIFY_EMAIL,
    },
  },
};

const validator = object().shape({
  api: object().shape({
    port: number().required(),
  }),

  auth: object().shape({
    cookie: object().shape({
      key1: string().min(20).required(),
      key2: string().min(20).required(),
      maxAgeMinutes: number().integer().positive().required(),
      secure: boolean().required(),
    }),

    resetPassword: object().shape({
      jwt: object().shape({
        expSeconds: number().integer().positive().required(),
        secret: string().min(20).required(),
      }),
    }),

    verifyEmail: object().shape({
      jwt: object().shape({
        expSeconds: number().integer().positive().required(),
        secret: string().min(20).required(),
      }),
    }),
  }),

  bcrypt: object().shape({
    saltRounds: number().integer().positive().required(),
  }),

  mailer: object().shape({
    from: string().email().required(),
    smtp: object().shape({
      auth: object().shape({
        user: string().required(),
        pass: string().required(),
      }),
      host: string().required(),
      port: number().required(),
      secure: boolean().required(),
    }),
  }),

  pg: object().shape({
    password: string()
      .min(isTest || isDev ? 3 : 20)
      .required(),
    user: string().min(3).required(),
  }),

  ui: object().shape({
    host: isTest || isDev ? string().required() : string().url().required(),
    paths: object().shape({
      passwordReset: string().required(),
      verifyEmail: string().required(),
    }),
  }),
});

validator.validate(config, { abortEarly: false });

export default config;
