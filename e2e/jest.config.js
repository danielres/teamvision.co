const config = require('./config');

const SECOND = 1000;
const MINUTE = 60 * SECOND;

module.exports = {
  verbose: true,
  testTimeout: config.headless ? SECOND * 3 : MINUTE,
  setupFilesAfterEnv: ['expect-puppeteer'],

  displayName: {
    color: 'blue',
    name: 'E2E',
  },
  preset: 'jest-puppeteer',
  coveragePathIgnorePatterns: ['node_modules'],
};
