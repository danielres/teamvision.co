if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const dev = {
  UI_PORT: 3000,
  API_PORT: 3010,
  MAILCATCHER_UI_PORT: 3020,
  SMTP_PORT: 3021,
  PG_ADMINER_PORT: 3030,
  PG_PORT: 3031,

  API_AUTH_COOKIE_KEY1_SECRET: 'secret-hgvkgvsdjbad9876svdhkasq',
  API_AUTH_COOKIE_KEY2_SECRET: 'secret-870oh3beucgTTIFCKJuihoew',
  API_AUTH_RESET_PASSWORD_JWT_SECRET: 'secret-Uiceb2DPKFqn24ddiadnjSRE',
  API_AUTH_VERIFY_EMAIL_JWT_SECRET: 'secret-fkceb2DPKFqn24ddiadnadgr',

  PG_DB: 'tmv',
  PG_PASSWORD: 'tmv',
  PG_USER: 'tmv',

  SMTP_AUTH_PASSWORD: 'password',
  SMTP_AUTH_USER: 'username',
  SMTP_HOST: 'localhost',
  SMTP_SECURE: false,

  API_AUTH_COOKIE_MAX_AGE_MINUTES: 60,
  API_AUTH_COOKIE_UNSECURE: true,
  API_AUTH_RESET_PASSWORD_JWT_EXP_SECONDS: 900,
  API_AUTH_VERIFY_EMAIL_JWT_EXP_SECONDS: 900,
  API_BCRYPT_SALT_ROUNDS: 1, //  to be secure, must be >10 in productio
  API_MAILER_FROM: 'noreply-dev@example.com',
};
dev.API_URL = `http://localhost:${dev.API_PORT}`;
dev.MAILCATCHER_UI_URL = `http://localhost:${dev.MAILCATCHER_UI_PORT}`;
dev.UI_URL = `http://localhost:${dev.UI_PORT}`;

const e2e = {
  ...dev,
  UI_PORT: 4000,
  API_PORT: 4010,
  MAILCATCHER_UI_PORT: 4020,
  SMTP_PORT: 4021,
  PG_ADMINER_PORT: 4030,
  PG_PORT: 4031,
};
e2e.API_URL = `http://localhost:${e2e.API_PORT}`;
e2e.MAILCATCHER_UI_URL = `http://localhost:${e2e.MAILCATCHER_UI_PORT}`;
e2e.UI_URL = `http://localhost:${e2e.UI_PORT}`;

const test = {
  ...dev,
  UI_PORT: 5000,
  API_PORT: 5010,
  MAILCATCHER_UI_PORT: 5020,
  SMTP_PORT: 5021,
  PG_ADMINER_PORT: 5030,
  PG_PORT: 5031,
};
test.API_URL = `http://localhost:${e2e.API_PORT}`;
test.MAILCATCHER_UI_URL = `http://localhost:${test.MAILCATCHER_UI_PORT}`;
test.UI_URL = `http://$localhost:${test.UI_PORT}`;

const getEnv = () => {
  if (process.env.NODE_ENV === 'development') return dev;
  if (process.env.NODE_ENV === 'test') return test;
  if (process.env.NODE_ENV === 'e2e') return e2e;
  throw new Error(`NODE_ENV ${process.env.NODE_ENV} not supported.`);
};

module.exports = getEnv();
