/* eslint-disable global-require */
const isDev = process.env.NODE_ENV === 'development';
const isE2e = process.env.NODE_ENV === 'e2e';
const isTest = process.env.NODE_ENV === 'test';

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.jsx', './src/**/*.tsx', './src/**/*.js', './**/*.html'],
  css: ['./src/**/*.css'],
  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
});

const plugins = [
  require('tailwindcss')('postcss/tailwind.config.js'),
  ...(isDev || isE2e || isTest ? [] : [purgecss]),
  require('autoprefixer'),
];

module.exports = {
  plugins,
};
