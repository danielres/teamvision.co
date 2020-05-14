if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const { BASE_PORT, NODE_ENV } = process.env;

const environments = {
  dev: 3000,
  e2e: 4000,
  test: 5000,
};

if (!Object.keys(environments).includes(NODE_ENV)) throw new Error(`Environment ${NODE_ENV} not recognized.`);

const basePort = BASE_PORT ? Number(BASE_PORT) : environments[NODE_ENV];

const env = {
  UI_PORT: basePort,
  API_PORT: basePort + 10,
  MAILCATCHER_UI_PORT: basePort + 20,
  SMTP_PORT: basePort + 21,
  PG_ADMINER_PORT: basePort + 30,
  PG_PORT: basePort + 31,

  API_AUTH_COOKIE_KEY1_SECRET: 'secret-hgvkgvsdjbad9876svdhkasq',
  API_AUTH_COOKIE_KEY2_SECRET: 'secret-870oh3beucgTTIFCKJuihoew',
  API_AUTH_RESET_PASSWORD_JWT_SECRET: 'secret-Uiceb2DPKFqn24ddiadnjSRE',
  API_AUTH_VERIFY_EMAIL_JWT_SECRET: 'secret-fkceb2DPKFqn24ddiadnadgr',

  PG_DB: `tmv_${NODE_ENV}`,
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

env.API_URL = `http://localhost:${env.API_PORT}`;
env.MAILCATCHER_UI_URL = `http://localhost:${env.MAILCATCHER_UI_PORT}`;
env.UI_URL = `http://localhost:${env.UI_PORT}`;

module.exports = env;
