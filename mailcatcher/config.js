const portfinder = require('portfinder-sync');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  mailcatcher: {
    logger: isDev ? console.log : () => {}, // eslint-disable-line no-console
    smtp: {
      port: isTest ? portfinder.getPort(2510) : parseInt(process.env.MAILCATCHER_SMTP_PORT, 10) || 2500,
    },
    ui: {
      port: parseInt(process.env.MAILCATCHER_UI_PORT, 10) || 2600,
    },
  },
};
