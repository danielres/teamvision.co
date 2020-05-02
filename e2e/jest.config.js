module.exports = {
  verbose: true,

  displayName: {
    color: 'blue',
    name: 'E2E',
  },
  preset: 'jest-puppeteer',
  coveragePathIgnorePatterns: ['node_modules'],
};
