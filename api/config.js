import validateConfig from '@danielres/validate-config';
import isValidEmail from './src/utils/isValidEmail';

const { env } = process;
const isSensitiveEnv = !['development', 'test', 'e2e'].includes(env.NODE_ENV);

const checks = {
  email: [isValidEmail, String, 'should be a valid email'],
  port: [v => Number.isInteger(v) && v > 0, Number, 'should be a positive integer'],
  seconds: [v => Number.isInteger(v) && v > 0, Number, 'should be a positive integer'],
  secret: [v => typeof v === 'string' && v.length > 30, String, 'should be a string of lenght > 30'],
  saltRoundsInsecure: [v => Number.isInteger(v) && v > 0, Number, 'should be an integer > 10'],
  saltRoundsSecure: [v => Number.isInteger(v) && v > 10, Number, 'should be a positive integer'],
};

const config = {
  api: {
    port: [env.API_PORT, 'port'],
  },

  auth: {
    cookie: {
      key1: [env.API_AUTH_COOKIE_KEY1_SECRET, 'secret'],
      key2: [env.API_AUTH_COOKIE_KEY2_SECRET, 'secret'],
      maxAgeMinutes: [env.API_AUTH_COOKIE_MAX_AGE_MINUTES, 'number'],
      secure: [env.API_AUTH_COOKIE_UNSECURE !== 'true', 'boolean'],
    },

    resetPassword: {
      jwt: {
        expSeconds: [env.API_AUTH_RESET_PASSWORD_JWT_EXP_SECONDS, 'seconds'],
        secret: [env.API_AUTH_RESET_PASSWORD_JWT_SECRET, 'secret'],
      },
    },

    verifyEmail: {
      jwt: {
        expSeconds: [env.API_AUTH_RESET_PASSWORD_JWT_EXP_SECONDS, 'seconds'],
        secret: [env.API_AUTH_RESET_PASSWORD_JWT_SECRET, 'secret'],
      },
    },
  },

  bcrypt: {
    saltRounds: [env.API_BCRYPT_SALT_ROUNDS, isSensitiveEnv ? 'saltRoundsSecure' : 'saltRoundsInsecure'],
  },

  mailer: {
    from: [env.API_MAILER_FROM, 'email'],
    smtp: {
      auth: {
        user: [env.SMTP_AUTH_USER, 'string'],
        pass: [env.SMTP_AUTH_PASSWORD, 'string'],
      },
      host: [env.SMTP_HOST, 'string'],
      port: [env.SMTP_PORT, 'port'],
      secure: [env.SMTP_SECURE !== 'false', 'boolean'],
    },
  },

  pg: {
    database: [env.PG_DB, 'string'],
    password: [env.PG_PASSWORD, 'string'],
    port: [env.PG_PORT, 'port'],
    user: [env.PG_USER, 'string'],
  },

  ui: {
    url: [env.UI_URL, 'string'],
    paths: {
      passwordReset: ['/:tenantShortId/auth/reset?token=:token', 'string'],
      verifyEmail: ['/:tenantShortId/auth/verify?token=:token', 'string'],
    },
  },
};

export default validateConfig(checks)(config);
