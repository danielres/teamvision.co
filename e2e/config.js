module.exports = {
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number(process.env.SLOW_MO),

  mailcatcher: {
    ui: {
      url: process.env.MAILCATCHER_UI_URL,
    },
  },

  ui: {
    url: process.env.UI_URL,
  },
};
