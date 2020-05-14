const isDev = process.env.NODE_ENV === 'dev';

module.exports = {
  logger: isDev ? console.log : () => {}, // eslint-disable-line no-console
  smtp: {
    port: parseInt(process.env.SMTP_PORT, 10),
  },
  mailcatcher: {
    ui: {
      url: process.env.MAILCATCHER_UI_URL,
    },
  },
};
