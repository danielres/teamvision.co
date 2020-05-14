#!/usr/bin/env node
/* eslint-disable no-console */

const waitOn = require('wait-on');
const config = require('./config');

if (!config.ui.url) throw new Error('Missing value "config.ui.url"');

const UI_URL = config.ui.url;

console.log(`waiting for UI on ${UI_URL}...`);

waitOn({ resources: [UI_URL] }, error => {
  if (!error) process.exit(0);

  console.error(error);
  process.exit(1);
});
