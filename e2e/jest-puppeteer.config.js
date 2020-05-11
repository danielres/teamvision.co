const config = require('./config');

const getSlowMoValue = () => {
  if (config.slowMo) return config.slowMo;
  if (config.headless) return 0;
  return 5;
};

module.exports = {
  launch: {
    headless: config.headless,
    slowMo: getSlowMoValue(),
    // dumpio: true,
  },
  browser: 'chromium',
  browserContext: 'default',
};
